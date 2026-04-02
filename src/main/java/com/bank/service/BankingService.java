package com.bank.service;

import com.bank.dto.AccountResponse;
import com.bank.dto.BankSummaryResponse;
import com.bank.dto.CreateAccountRequest;
import com.bank.dto.TransferRequest;
import com.bank.exception.AccountNotFoundException;
import com.bank.exception.InsufficientFundsException;
import com.bank.model.Account;
import com.bank.model.TransactionType;
import com.bank.repository.AccountRepository;
import com.bank.util.AccountFormatter;
import com.bank.util.BankAudit;
import com.bank.util.InterestStrategy;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.StringJoiner;
import java.util.stream.Collectors;

@Service
@BankAudit("service-created")
@BankAudit("service-reviewed")
public class BankingService implements AccountFormatter {

    private final AccountRepository accountRepository;
    private final InterestStrategy savingsInterest = balance -> balance.multiply(new BigDecimal("0.02"));

    public BankingService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public AccountResponse createAccount(CreateAccountRequest request) {
        Account account = new Account(request.getOwnerName().trim(), request.getAccountType(), BigDecimal.ZERO);
        java.util.ArrayList<String> tags = new java.util.ArrayList<String>();
        tags.add("java8");
        tags.add(request.getAccountType().name().toLowerCase());
        tags.add("");
        tags.removeIf(String::isEmpty);
        tags.forEach(account::addTag);
        account.putMetadata("createdBy", "lambda-onboarding");
        account.putMetadata("auditKey", AccountRepository.auditKey(account.getId()));

        if (request.getOpeningBalance().compareTo(BigDecimal.ZERO) > 0) {
            account.addFunds(request.getOpeningBalance(), TransactionType.DEPOSIT, "Opening balance applied", null);
        }

        if ("SAVINGS".equals(request.getAccountType().name())) {
            BigDecimal bonus = savingsInterest.apply(request.getOpeningBalance()).setScale(2, RoundingMode.HALF_UP);
            if (bonus.compareTo(BigDecimal.ZERO) > 0) {
                account.addFunds(bonus, TransactionType.INTEREST, "Java 8 lambda interest bonus", null);
            }
        }

        return AccountResponse.from(accountRepository.save(account));
    }

    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .sorted(Comparator.comparing(Account::getOwnerName))
                .map(AccountResponse::from)
                .collect(Collectors.toList());
    }

    public AccountResponse getAccount(String accountId) {
        return AccountResponse.from(getAccountEntity(accountId));
    }

    public synchronized AccountResponse deposit(String accountId, BigDecimal amount, String description) {
        Account account = getAccountEntity(accountId);
        account.addFunds(amount, TransactionType.DEPOSIT, description, null);
        return AccountResponse.from(accountRepository.save(account));
    }

    public synchronized AccountResponse withdraw(String accountId, BigDecimal amount, String description) {
        Account account = getAccountEntity(accountId);
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException(accountId);
        }
        account.subtractFunds(amount, TransactionType.WITHDRAWAL, description, null);
        return AccountResponse.from(accountRepository.save(account));
    }

    public synchronized List<AccountResponse> transfer(TransferRequest request) {
        if (request.getSourceAccountId().equals(request.getTargetAccountId())) {
            throw new IllegalArgumentException("Source and target accounts must be different");
        }
        Account source = getAccountEntity(request.getSourceAccountId());
        Account target = getAccountEntity(request.getTargetAccountId());
        if (source.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException(source.getId());
        }
        source.subtractFunds(request.getAmount(), TransactionType.TRANSFER_OUT, request.getDescription(), target.getId());
        target.addFunds(request.getAmount(), TransactionType.TRANSFER_IN, request.getDescription(), source.getId());
        accountRepository.save(source);
        accountRepository.save(target);
        return java.util.Arrays.asList(AccountResponse.from(source), AccountResponse.from(target));
    }

    public BankSummaryResponse getSummary() {
        List<Account> accounts = accountRepository.findAll();
        BigDecimal totalBalance = accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal average = accounts.isEmpty()
                ? BigDecimal.ZERO
                : totalBalance.divide(new BigDecimal(accounts.size()), 2, RoundingMode.HALF_UP);

        Map<String, Long> accountsByType = accounts.stream()
                .collect(Collectors.groupingBy(account -> account.getAccountType().name(), LinkedHashMap::new, Collectors.counting()));

        List<String> premiumOwners = accounts.stream()
                .filter(account -> account.getBalance().compareTo(new BigDecimal("5000")) >= 0)
                .map(this::formatSummary)
                .collect(Collectors.toList());

        return new BankSummaryResponse(accounts.size(), totalBalance, average, accountsByType, premiumOwners);
    }

    public String describePortfolio() {
        StringJoiner joiner = new StringJoiner(" | ", "Portfolio[", "]");
        accountRepository.findAll().forEach(account -> joiner.add(formatSummary(account)));
        return joiner.toString();
    }

    public Optional<Account> findByOwner(String ownerName) {
        return accountRepository.findByOwner(ownerName);
    }

    public void seedAccount(String ownerName, com.bank.model.AccountType accountType, BigDecimal openingBalance) {
        if (!findByOwner(ownerName).isPresent()) {
            CreateAccountRequest request = new CreateAccountRequest();
            request.setOwnerName(ownerName);
            request.setAccountType(accountType);
            request.setOpeningBalance(openingBalance);
            createAccount(request);
        }
    }

    private Account getAccountEntity(String accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException(accountId));
    }
}
