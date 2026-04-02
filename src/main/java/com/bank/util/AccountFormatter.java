package com.bank.util;

import com.bank.model.Account;

import java.math.RoundingMode;

public interface AccountFormatter {

    default String formatSummary(Account account) {
        return account.getOwnerName() + " (" + account.getAccountType() + ") balance=" +
                account.getBalance().setScale(2, RoundingMode.HALF_UP).toPlainString();
    }

    static String auditLabel(String accountId) {
        return "formatted-" + accountId;
    }
}
