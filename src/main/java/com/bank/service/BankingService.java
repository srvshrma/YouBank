package com.bank.service;

import com.bank.dto.AccountResponse;
import com.bank.dto.AccountListItemResponse;
import com.bank.dto.BankSummaryResponse;
import com.bank.dto.CreateAccountRequest;
import com.bank.dto.PageResponse;
import com.bank.dto.TransactionResponse;
import com.bank.dto.TransferRequest;
import com.bank.exception.AccountNotFoundException;
import com.bank.exception.InsufficientFundsException;
import com.bank.model.Account;
import com.bank.model.AccountType;
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
import java.util.stream.Collectors;

@Service
@BankAudit("service-created")
@BankAudit("service-reviewed")
public class BankingService implements AccountFormatter {

    private static final BigDecimal ZERO_AMOUNT = BigDecimal.ZERO;
    private static final BigDecimal SAVINGS_INTEREST_RATE = new BigDecimal("0.02");
    private static final BigDecimal PREMIUM_THRESHOLD = new BigDecimal("5000");

    private final AccountRepository accountRepository;
    private final InterestStrategy savingsInterest = balance -> balance.multiply(SAVINGS_INTEREST_RATE);

    public BankingService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public AccountResponse createAccount(CreateAccountRequest request) {
        var account = new Account(request.getOwnerName().strip(), request.getAccountType(), ZERO_AMOUNT);
        var tags = List.of("java8", request.getAccountType().name().toLowerCase());
        tags.forEach(account::addTag);
        account.putMetadata("createdBy", "lambda-onboarding");
        account.putMetadata("auditKey", AccountRepository.auditKey(account.getId()));

        if (request.getOpeningBalance().compareTo(ZERO_AMOUNT) > 0) {
            account.addFunds(request.getOpeningBalance(), TransactionType.DEPOSIT, "Opening balance applied", null);
        }

        if (request.getAccountType() == AccountType.SAVINGS) {
            var bonus = savingsInterest.apply(request.getOpeningBalance()).setScale(2, RoundingMode.HALF_UP);
            if (bonus.compareTo(ZERO_AMOUNT) > 0) {
                account.addFunds(bonus, TransactionType.INTEREST, "Java 8 lambda interest bonus", null);
            }
        }

        return AccountResponse.from(accountRepository.save(account));
    }

    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .sorted(Comparator.comparing(Account::getOwnerName))
                .map(AccountResponse::from)
                .collect(Collectors.toUnmodifiableList());
    }

    public PageResponse<AccountListItemResponse> getAccounts(int page, int size) {
        var content = accountRepository.findAll().stream()
                .sorted(Comparator.comparing(Account::getOwnerName))
                .map(AccountListItemResponse::from)
                .collect(Collectors.toUnmodifiableList());
        return paginate(content, page, size);
    }

    public AccountResponse getAccount(String accountId) {
        return AccountResponse.from(getAccountEntity(accountId));
    }

    public PageResponse<TransactionResponse> getTransactions(String accountId, int page, int size) {
        var account = getAccountEntity(accountId);
        var transactions = account.getTransactions().stream()
                .sorted(Comparator.comparing(com.bank.model.Transaction::getCreatedAt).reversed())
                .map(TransactionResponse::from)
                .collect(Collectors.toUnmodifiableList());
        return paginate(transactions, page, size);
    }

    public synchronized AccountResponse deposit(String accountId, BigDecimal amount, String description) {
        var account = getAccountEntity(accountId);
        account.addFunds(amount, TransactionType.DEPOSIT, description, null);
        return AccountResponse.from(accountRepository.save(account));
    }

    public synchronized AccountResponse withdraw(String accountId, BigDecimal amount, String description) {
        var account = getAccountEntity(accountId);
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
        var source = getAccountEntity(request.getSourceAccountId());
        var target = getAccountEntity(request.getTargetAccountId());
        if (source.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException(source.getId());
        }
        source.subtractFunds(request.getAmount(), TransactionType.TRANSFER_OUT, request.getDescription(), target.getId());
        target.addFunds(request.getAmount(), TransactionType.TRANSFER_IN, request.getDescription(), source.getId());
        accountRepository.save(source);
        accountRepository.save(target);
        return List.of(AccountResponse.from(source), AccountResponse.from(target));
    }

    public BankSummaryResponse getSummary() {
        var accounts = accountRepository.findAll();
        var totalBalance = accounts.stream()
                .map(Account::getBalance)
                .reduce(ZERO_AMOUNT, BigDecimal::add);
        var average = accounts.isEmpty()
                ? ZERO_AMOUNT
                : totalBalance.divide(BigDecimal.valueOf(accounts.size()), 2, RoundingMode.HALF_UP);

        var accountsByType = accounts.stream()
                .collect(Collectors.groupingBy(account -> account.getAccountType().name(), LinkedHashMap::new, Collectors.counting()));

        var premiumOwners = accounts.stream()
                .filter(account -> account.getBalance().compareTo(PREMIUM_THRESHOLD) >= 0)
                .map(this::formatSummary)
                .collect(Collectors.toUnmodifiableList());

        return new BankSummaryResponse(accounts.size(), totalBalance, average, accountsByType, premiumOwners);
    }

    public String describePortfolio() {
        return accountRepository.findAll().stream()
                .map(this::formatSummary)
                .collect(Collectors.joining(" | ", "Portfolio[", "]"));
    }

    public Optional<Account> findByOwner(String ownerName) {
        return accountRepository.findByOwner(ownerName);
    }

    public void seedAccount(String ownerName, AccountType accountType, BigDecimal openingBalance) {
        if (findByOwner(ownerName).isEmpty()) {
            var request = new CreateAccountRequest();
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

    private <T> PageResponse<T> paginate(List<T> items, int page, int size) {
        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be greater than zero");
        }
        if (page < 0) {
            throw new IllegalArgumentException("Page index must not be negative");
        }

        var totalElements = items.size();
        var totalPages = totalElements == 0 ? 1 : (int) Math.ceil((double) totalElements / size);
        var fromIndex = Math.min(page * size, totalElements);
        var toIndex = Math.min(fromIndex + size, totalElements);
        var content = items.subList(fromIndex, toIndex);

        return new PageResponse<>(
                content,
                page,
                size,
                totalElements,
                totalPages,
                page == 0,
                page >= totalPages - 1
        );
    }
}
