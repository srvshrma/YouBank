package com.bank.repository;

import com.bank.model.Account;

import java.util.List;
import java.util.Optional;

public interface AccountRepository {

    Account save(Account account);

    Optional<Account> findById(String accountId);

    List<Account> findAll();

    default Optional<Account> findByOwner(String ownerName) {
        return findAll().stream()
                .filter(account -> account.getOwnerName().equalsIgnoreCase(ownerName))
                .findFirst();
    }

    static String auditKey(String accountId) {
        return "AUDIT-" + accountId;
    }
}
