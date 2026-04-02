package com.bank.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class BankUser {

    private final String id;
    private final String fullName;
    private final String email;
    private final String password;
    private final LocalDateTime createdAt;

    public BankUser(String fullName, String email, String password) {
        this.id = UUID.randomUUID().toString();
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
