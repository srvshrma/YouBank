package com.bank.repository;

import com.bank.model.Account;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
public class InMemoryAccountRepository implements AccountRepository {

    private final ConcurrentMap<String, Account> accounts = new ConcurrentHashMap<String, Account>();

    @Override
    public Account save(Account account) {
        accounts.put(account.getId(), account);
        return account;
    }

    @Override
    public Optional<Account> findById(String accountId) {
        return Optional.ofNullable(accounts.get(accountId));
    }

    @Override
    public List<Account> findAll() {
        return new ArrayList<Account>(accounts.values());
    }
}
