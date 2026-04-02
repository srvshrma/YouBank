package com.bank.repository;

import com.bank.model.BankUser;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
public class InMemoryUserRepository implements UserRepository {

    private final ConcurrentMap<String, BankUser> usersByEmail = new ConcurrentHashMap<>();

    @Override
    public BankUser save(BankUser user) {
        usersByEmail.put(user.getEmail().toLowerCase(), user);
        return user;
    }

    @Override
    public Optional<BankUser> findByEmail(String email) {
        return Optional.ofNullable(usersByEmail.get(email.toLowerCase()));
    }
}
