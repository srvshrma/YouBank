package com.bank;

import com.bank.dto.LoginRequest;
import com.bank.dto.SignupRequest;
import com.bank.dto.CreateAccountRequest;
import com.bank.dto.PageResponse;
import com.bank.dto.TransactionResponse;
import com.bank.dto.TransferRequest;
import com.bank.model.AccountType;
import com.bank.service.AuthService;
import com.bank.service.BankingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class YouBankApplicationTests {

    @Autowired
    private BankingService bankingService;

    @Autowired
    private AuthService authService;

    @Test
    void shouldCreateAccountsTransferFundsAndBuildSummary() {
        CreateAccountRequest source = new CreateAccountRequest();
        source.setOwnerName("Test Source");
        source.setAccountType(AccountType.CHECKING);
        source.setOpeningBalance(new BigDecimal("1000.00"));

        CreateAccountRequest target = new CreateAccountRequest();
        target.setOwnerName("Test Target");
        target.setAccountType(AccountType.SAVINGS);
        target.setOpeningBalance(new BigDecimal("500.00"));

        String sourceId = bankingService.createAccount(source).getId();
        String targetId = bankingService.createAccount(target).getId();

        TransferRequest transferRequest = new TransferRequest();
        transferRequest.setSourceAccountId(sourceId);
        transferRequest.setTargetAccountId(targetId);
        transferRequest.setAmount(new BigDecimal("200.00"));
        transferRequest.setDescription("Integration transfer");

        bankingService.transfer(transferRequest);

        assertThat(bankingService.getAccount(sourceId).getBalance()).isEqualByComparingTo("800.00");
        assertThat(bankingService.getAccount(targetId).getBalance()).isEqualByComparingTo("710.00");
        assertThat(bankingService.getSummary().getTotalAccounts()).isGreaterThanOrEqualTo(5);

        PageResponse<TransactionResponse> transactionPage = bankingService.getTransactions(targetId, 0, 2);
        assertThat(transactionPage.getContent()).hasSizeLessThanOrEqualTo(2);
        assertThat(transactionPage.getTotalElements()).isGreaterThan(0);
        assertThat(bankingService.getAccounts(0, 3).getContent()).hasSizeLessThanOrEqualTo(3);
    }

    @Test
    void shouldSignupAndLoginUser() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setFullName("Interview User");
        signupRequest.setEmail("interview@youbank.com");
        signupRequest.setPassword("secure123");

        authService.signup(signupRequest);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("interview@youbank.com");
        loginRequest.setPassword("secure123");

        assertThat(authService.login(loginRequest).getEmail()).isEqualTo("interview@youbank.com");
    }
}
