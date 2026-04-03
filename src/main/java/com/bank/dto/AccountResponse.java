package com.bank.dto;

import com.bank.model.Account;
import com.bank.model.AccountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AccountResponse {

    private final String id;
    private final String ownerName;
    private final AccountType accountType;
    private final BigDecimal balance;
    private final LocalDateTime createdAt;
    private final List<String> tags;
    private final Map<String, String> metadata;
    private final List<TransactionResponse> transactions;

    public AccountResponse(String id, String ownerName, AccountType accountType, BigDecimal balance, LocalDateTime createdAt,
                           List<String> tags, Map<String, String> metadata, List<TransactionResponse> transactions) {
        this.id = id;
        this.ownerName = ownerName;
        this.accountType = accountType;
        this.balance = balance;
        this.createdAt = createdAt;
        this.tags = List.copyOf(tags);
        this.metadata = Map.copyOf(metadata);
        this.transactions = List.copyOf(transactions);
    }

    public static AccountResponse from(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getOwnerName(),
                account.getAccountType(),
                account.getBalance(),
                account.getCreatedAt(),
                account.getTags(),
                account.getMetadata(),
                account.getTransactions().stream()
                        .map(TransactionResponse::from)
                        .collect(Collectors.toUnmodifiableList())
        );
    }

    public String getId() {
        return id;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<String> getTags() {
        return tags;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    public List<TransactionResponse> getTransactions() {
        return transactions;
    }
}
