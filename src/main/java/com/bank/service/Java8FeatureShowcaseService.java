package com.bank.service;

import com.bank.dto.Java8ShowcaseResponse;
import com.bank.model.Account;
import com.bank.util.AccountFormatter;
import com.bank.util.BankAudit;
import com.bank.util.Sensitive;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.StringJoiner;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class Java8FeatureShowcaseService {

    private final BankingService bankingService;

    public Java8FeatureShowcaseService(BankingService bankingService) {
        this.bankingService = bankingService;
    }

    public Java8ShowcaseResponse buildShowcase() {
        String lambdaExample = bankingService.getAllAccounts().stream()
                .map(account -> account.getOwnerName().toUpperCase())
                .findFirst()
                .orElse("NO-ACCOUNTS");

        List<String> methodReferenceOwners = bankingService.getAllAccounts().stream()
                .map(com.bank.dto.AccountResponse::getOwnerName)
                .collect(Collectors.toList());

        String optionalExample = bankingService.findByOwner("Ada Lovelace")
                .map(Account::getOwnerName)
                .orElse("Fallback owner via Optional");

        String defaultMethodExample = bankingService.getAllAccounts().stream()
                .findFirst()
                .map(response -> bankingService.formatSummary(convert(response)))
                .orElse("No accounts to format");

        String staticInterfaceMethodExample = bankingService.getAllAccounts().stream()
                .findFirst()
                .map(response -> AccountFormatter.auditLabel(response.getId()))
                .orElse("formatted-none");

        String streamCollectorExample = bankingService.getAllAccounts().stream()
                .collect(Collectors.groupingBy(account -> account.getAccountType().name(), LinkedHashMap::new, Collectors.counting()))
                .entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining(", "));

        String dateTimeExample = LocalDate.now(ZoneId.of("Asia/Kolkata")).format(DateTimeFormatter.ISO_DATE);

        String completableFutureExample = CompletableFuture.supplyAsync(bankingService::describePortfolio)
                .thenApply(String::toUpperCase)
                .join();

        String base64Example = Base64.getEncoder()
                .encodeToString("you-bank-java8".getBytes(StandardCharsets.UTF_8));

        StringJoiner joiner = new StringJoiner(" -> ", "features[", "]");
        joiner.add("lambda").add("streams").add("optional").add("completableFuture");

        Map<String, Integer> mapEnhancementExample = new LinkedHashMap<String, Integer>();
        methodReferenceOwners.forEach(owner -> mapEnhancementExample.merge(owner, owner.length(), Integer::sum));
        mapEnhancementExample.computeIfAbsent("fallback-owner", key -> key.length());

        List<String> repeatableAnnotations = java.util.Arrays.stream(BankingService.class.getAnnotationsByType(BankAudit.class))
                .map(BankAudit::value)
                .collect(Collectors.toList());

        @Sensitive String typeAnnotatedValue = "masked-account-reference";

        return new Java8ShowcaseResponse(
                lambdaExample,
                methodReferenceOwners,
                optionalExample,
                defaultMethodExample,
                staticInterfaceMethodExample,
                streamCollectorExample,
                dateTimeExample,
                completableFutureExample,
                base64Example,
                joiner.toString(),
                mapEnhancementExample,
                repeatableAnnotations,
                typeAnnotatedValue
        );
    }

    private Account convert(com.bank.dto.AccountResponse response) {
        Account account = new Account(response.getOwnerName(), response.getAccountType(), response.getBalance());
        response.getTags().forEach(account::addTag);
        response.getMetadata().forEach(account::putMetadata);
        return account;
    }
}
