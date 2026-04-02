package com.bank.dto;

import com.bank.model.Account;
import com.bank.model.AccountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class AccountListItemResponse {

    private final String id;
    private final String ownerName;
    private final AccountType accountType;
    private final BigDecimal balance;
    private final LocalDateTime createdAt;
    private final List<String> tags;
    private final Map<String, String> metadata;
    private final int transactionCount;

    public AccountListItemResponse(String id, String ownerName, AccountType accountType, BigDecimal balance,
                                   LocalDateTime createdAt, List<String> tags, Map<String, String> metadata,
                                   int transactionCount) {
        this.id = id;
        this.ownerName = ownerName;
        this.accountType = accountType;
        this.balance = balance;
        this.createdAt = createdAt;
        this.tags = Collections.unmodifiableList(new ArrayList<>(tags));
        this.metadata = Collections.unmodifiableMap(new LinkedHashMap<>(metadata));
        this.transactionCount = transactionCount;
    }

    public static AccountListItemResponse from(Account account) {
        return new AccountListItemResponse(
                account.getId(),
                account.getOwnerName(),
                account.getAccountType(),
                account.getBalance(),
                account.getCreatedAt(),
                account.getTags(),
                account.getMetadata(),
                account.getTransactions().size()
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

    public int getTransactionCount() {
        return transactionCount;
    }
}
