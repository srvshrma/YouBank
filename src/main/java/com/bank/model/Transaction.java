package com.bank.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class Transaction {

    private final String id;
    private final TransactionType type;
    private final BigDecimal amount;
    private final String description;
    private final String counterpartyAccountId;
    private final LocalDateTime createdAt;

    public Transaction(TransactionType type, BigDecimal amount, String description, String counterpartyAccountId) {
        this.id = UUID.randomUUID().toString();
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.counterpartyAccountId = counterpartyAccountId;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public TransactionType getType() {
        return type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public String getCounterpartyAccountId() {
        return counterpartyAccountId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
