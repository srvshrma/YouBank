package com.bank.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class BankSummaryResponse {

    private final long totalAccounts;
    private final BigDecimal totalBalance;
    private final BigDecimal averageBalance;
    private final Map<String, Long> accountsByType;
    private final List<String> premiumOwners;

    public BankSummaryResponse(long totalAccounts, BigDecimal totalBalance, BigDecimal averageBalance,
                               Map<String, Long> accountsByType, List<String> premiumOwners) {
        this.totalAccounts = totalAccounts;
        this.totalBalance = totalBalance;
        this.averageBalance = averageBalance;
        this.accountsByType = Map.copyOf(accountsByType);
        this.premiumOwners = List.copyOf(premiumOwners);
    }

    public long getTotalAccounts() {
        return totalAccounts;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public BigDecimal getAverageBalance() {
        return averageBalance;
    }

    public Map<String, Long> getAccountsByType() {
        return accountsByType;
    }

    public List<String> getPremiumOwners() {
        return premiumOwners;
    }
}
