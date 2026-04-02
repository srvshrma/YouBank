package com.bank.dto;

public class AuthResponse {

    private final String token;
    private final String userId;
    private final String fullName;
    private final String email;

    public AuthResponse(String token, String userId, String fullName, String email) {
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public String getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }
}
