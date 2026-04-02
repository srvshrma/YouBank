package com.bank.dto;

import com.bank.model.Transaction;
import com.bank.model.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {

    private final String id;
    private final TransactionType type;
    private final BigDecimal amount;
    private final String description;
    private final String counterpartyAccountId;
    private final LocalDateTime createdAt;

    public TransactionResponse(String id, TransactionType type, BigDecimal amount, String description,
                               String counterpartyAccountId, LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.counterpartyAccountId = counterpartyAccountId;
        this.createdAt = createdAt;
    }

    public static TransactionResponse from(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getCounterpartyAccountId(),
                transaction.getCreatedAt()
        );
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
