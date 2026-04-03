package com.bank.service;

import com.bank.dto.AuthResponse;
import com.bank.dto.LoginRequest;
import com.bank.dto.SignupRequest;
import com.bank.exception.AuthenticationException;
import com.bank.model.BankUser;
import com.bank.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse signup(SignupRequest request) {
        var email = normalizeEmail(request.getEmail());
        if (userRepository.findByEmail(email).isPresent()) {
            throw new AuthenticationException("An account with this email already exists");
        }
        var user = new BankUser(request.getFullName().strip(), email, request.getPassword());
        userRepository.save(user);
        return toAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        var user = userRepository.findByEmail(normalizeEmail(request.getEmail()))
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));
        if (!user.getPassword().equals(request.getPassword())) {
            throw new AuthenticationException("Invalid email or password");
        }
        return toAuthResponse(user);
    }

    public void seedUser(String fullName, String email, String password) {
        var normalizedEmail = normalizeEmail(email);
        if (userRepository.findByEmail(normalizedEmail).isEmpty()) {
            userRepository.save(new BankUser(fullName.strip(), normalizedEmail, password));
        }
    }

    private String normalizeEmail(String email) {
        return email.strip().toLowerCase(Locale.ROOT);
    }

    private AuthResponse toAuthResponse(BankUser user) {
        return new AuthResponse(
                UUID.randomUUID().toString(),
                user.getId(),
                user.getFullName(),
                user.getEmail()
        );
    }
}
