package com.bank.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
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
        this.accountsByType = Collections.unmodifiableMap(new LinkedHashMap<>(accountsByType));
        this.premiumOwners = Collections.unmodifiableList(new ArrayList<>(premiumOwners));
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
