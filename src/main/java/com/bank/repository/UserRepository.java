package com.bank.repository;

import com.bank.model.BankUser;

import java.util.Optional;

public interface UserRepository {

    BankUser save(BankUser user);

    Optional<BankUser> findByEmail(String email);
}
