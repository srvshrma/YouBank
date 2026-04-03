package com.bank.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class Account {

    private final String id;
    private final String ownerName;
    private final AccountType accountType;
    private final LocalDateTime createdAt;
    private final List<Transaction> transactions;
    private final List<String> tags;
    private final Map<String, String> metadata;
    private BigDecimal balance;

    public Account(String ownerName, AccountType accountType, BigDecimal openingBalance) {
        this.id = UUID.randomUUID().toString();
        this.ownerName = ownerName;
        this.accountType = accountType;
        this.balance = openingBalance;
        this.createdAt = LocalDateTime.now();
        this.transactions = new ArrayList<>();
        this.tags = new ArrayList<>();
        this.metadata = new LinkedHashMap<>();
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

    public List<Transaction> getTransactions() {
        return List.copyOf(transactions);
    }

    public List<String> getTags() {
        return List.copyOf(tags);
    }

    public Map<String, String> getMetadata() {
        return Map.copyOf(metadata);
    }

    public void addFunds(BigDecimal amount, TransactionType type, String description, String counterpartyAccountId) {
        this.balance = this.balance.add(amount);
        this.transactions.add(new Transaction(type, amount, description, counterpartyAccountId));
    }

    public void subtractFunds(BigDecimal amount, TransactionType type, String description, String counterpartyAccountId) {
        this.balance = this.balance.subtract(amount);
        this.transactions.add(new Transaction(type, amount, description, counterpartyAccountId));
    }

    public void addTag(String tag) {
        this.tags.add(tag);
    }

    public void putMetadata(String key, String value) {
        this.metadata.put(key, value);
    }
}
