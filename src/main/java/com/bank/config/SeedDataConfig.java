package com.bank.config;

import com.bank.model.AccountType;
import com.bank.service.AuthService;
import com.bank.service.BankingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class SeedDataConfig {

    @Bean
    public CommandLineRunner seedData(BankingService bankingService, AuthService authService) {
        return args -> {
            authService.seedUser("Demo Customer", "demo@youbank.com", "password123");
            bankingService.seedAccount("Ada Lovelace", AccountType.SAVINGS, new BigDecimal("2500.00"));
            bankingService.seedAccount("Grace Hopper", AccountType.CHECKING, new BigDecimal("4200.00"));
            bankingService.seedAccount("James Gosling", AccountType.BUSINESS, new BigDecimal("12000.00"));
        };
    }
}
