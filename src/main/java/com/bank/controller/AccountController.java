package com.bank.controller;

import com.bank.dto.AccountResponse;
import com.bank.dto.AccountListItemResponse;
import com.bank.dto.AmountRequest;
import com.bank.dto.BankSummaryResponse;
import com.bank.dto.CreateAccountRequest;
import com.bank.dto.PageResponse;
import com.bank.dto.TransactionResponse;
import com.bank.dto.TransferRequest;
import com.bank.service.BankingService;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import javax.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final BankingService bankingService;

    public AccountController(BankingService bankingService) {
        this.bankingService = bankingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponse createAccount(@Valid @RequestBody CreateAccountRequest request) {
        return bankingService.createAccount(request);
    }

    @GetMapping
    public PageResponse<AccountListItemResponse> getAccounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return bankingService.getAccounts(page, size);
    }

    @GetMapping("/{accountId}")
    public AccountResponse getAccount(@PathVariable String accountId) {
        return bankingService.getAccount(accountId);
    }

    @PostMapping("/{accountId}/deposit")
    public AccountResponse deposit(@PathVariable String accountId, @Valid @RequestBody AmountRequest request) {
        return bankingService.deposit(accountId, request.getAmount(), request.getDescription());
    }

    @PostMapping("/{accountId}/withdraw")
    public AccountResponse withdraw(@PathVariable String accountId, @Valid @RequestBody AmountRequest request) {
        return bankingService.withdraw(accountId, request.getAmount(), request.getDescription());
    }

    @PostMapping("/transfer")
    public List<AccountResponse> transfer(@Valid @RequestBody TransferRequest request) {
        return bankingService.transfer(request);
    }

    @GetMapping("/{accountId}/transactions")
    public PageResponse<TransactionResponse> getTransactions(
            @PathVariable String accountId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return bankingService.getTransactions(accountId, page, size);
    }

    @GetMapping("/summary")
    public BankSummaryResponse summary() {
        return bankingService.getSummary();
    }
}
