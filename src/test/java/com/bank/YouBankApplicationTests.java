package com.bank;

import com.bank.dto.CreateAccountRequest;
import com.bank.dto.TransferRequest;
import com.bank.model.AccountType;
import com.bank.service.BankingService;
import com.bank.service.Java8FeatureShowcaseService;
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
    private Java8FeatureShowcaseService showcaseService;

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
    }

    @Test
    void shouldExposeJava8ShowcaseData() {
        assertThat(showcaseService.buildShowcase().getLambdaExample()).isNotBlank();
        assertThat(showcaseService.buildShowcase().getRepeatableAnnotations()).contains("service-created", "service-reviewed");
        assertThat(showcaseService.buildShowcase().getCompletableFutureExample()).contains("PORTFOLIO");
    }
}
