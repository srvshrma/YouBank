# Java 8 Features Used In This Project

This file is for interview preparation.

Goal:
- explain Java 8 features in very simple language
- show exactly where we used them in this project
- give short interview tips you can say confidently

Important note:
This project does **not** use every single Java 8 feature that exists in the language. It documents the Java 8 features that are actually used in this codebase.

## 1. Lambda Expressions

Simple meaning:
A lambda is a short way to write an anonymous function.

Instead of writing a full class or full method body, we can write logic in one line.

Where used:
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L33)
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L32)

Examples from project:
- `balance -> balance.multiply(new BigDecimal("0.02"))`
- `account -> account.getOwnerName().toUpperCase()`
- `key -> key.length()`

How we used it:
- in `BankingService`, a lambda calculates savings interest
- in the showcase service, lambdas transform stream data
- in map methods like `computeIfAbsent`, lambda gives default value logic

Interview tip:
"Lambda expressions reduce boilerplate and are commonly used with functional interfaces, streams, and collection operations."

## 2. Functional Interface

Simple meaning:
A functional interface is an interface with exactly one abstract method.

Why important:
Java 8 lambdas can be assigned to functional interfaces.

Where used:
- [src/main/java/com/bank/util/InterestStrategy.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/util/InterestStrategy.java#L5)
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L33)

How we used it:
- `InterestStrategy` has one method: `apply`
- we passed lambda logic into it for savings interest calculation

Interview tip:
"A functional interface is the target type for a lambda expression. Common examples are `Runnable`, `Callable`, `Comparator`, and custom ones like our `InterestStrategy`."

## 3. Stream API

Simple meaning:
Stream API helps process collections in a clean and readable way.

You can do:
- filter
- map
- sort
- group
- collect
- reduce

Where used:
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L64)
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L106)
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L31)
- [src/main/java/com/bank/dto/AccountResponse.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/dto/AccountResponse.java#L30)

How we used it:
- sort accounts by owner name
- convert model objects into DTO objects
- group accounts by type
- count accounts
- join strings
- find the first matching owner
- calculate total balance using `reduce`

Important stream methods used here:
- `stream()`
- `map(...)`
- `filter(...)`
- `sorted(...)`
- `findFirst()`
- `collect(...)`
- `reduce(...)`

Interview tip:
"Streams are for processing data declaratively. They improve readability, especially when mapping, filtering, grouping, and reducing collections."

## 4. Method References

Simple meaning:
A method reference is a shorter form of lambda when you are simply calling an existing method.

Where used:
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L66)
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L67)
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L38)
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L42)

Examples:
- `Account::getOwnerName`
- `AccountResponse::from`
- `BankAudit::value`

Why used:
- makes code shorter and more readable than simple lambdas

Interview tip:
"Method references are useful when the lambda only calls an existing method. They make stream code cleaner."

## 5. Optional

Simple meaning:
`Optional` is a container that may or may not contain a value.

Why useful:
It helps avoid `null` handling problems.

Where used:
- [src/main/java/com/bank/repository/AccountRepository.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/repository/AccountRepository.java#L12)
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L132)
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L41)

How we used it:
- repository returns `Optional<Account>` from search methods
- showcase uses `.map(...).orElse(...)`
- service uses `isPresent()` before seeding data

Interview tip:
"Optional makes absence of value explicit. It should be used mainly for return types, not for fields everywhere."

## 6. Default Methods In Interfaces

Simple meaning:
Before Java 8, interfaces could not have method bodies.
Java 8 introduced default methods, so interfaces can provide a common implementation.

Where used:
- [src/main/java/com/bank/repository/AccountRepository.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/repository/AccountRepository.java#L16)
- [src/main/java/com/bank/util/AccountFormatter.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/util/AccountFormatter.java#L9)

How we used it:
- `AccountRepository` gives a default implementation of `findByOwner`
- `AccountFormatter` gives a default implementation of `formatSummary`
- `BankingService` implements `AccountFormatter` and uses that behavior directly

Why useful:
- lets us add behavior to interfaces without breaking all implementations

Interview tip:
"Default methods were added mainly for interface evolution. They allow adding new methods to interfaces without forcing every implementation class to change immediately."

## 7. Static Methods In Interfaces

Simple meaning:
Java 8 allows static utility methods inside interfaces.

Where used:
- [src/main/java/com/bank/repository/AccountRepository.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/repository/AccountRepository.java#L22)
- [src/main/java/com/bank/util/AccountFormatter.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/util/AccountFormatter.java#L14)

How we used it:
- `AccountRepository.auditKey(...)`
- `AccountFormatter.auditLabel(...)`

Interview tip:
"Static methods in interfaces are good for helper logic closely related to that interface."

## 8. New Date and Time API

Simple meaning:
Java 8 introduced a much better date/time API in `java.time`.

Why better than old `Date` and `Calendar`:
- cleaner
- immutable
- easier to read
- timezone support is better

Where used:
- [src/main/java/com/bank/model/Account.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/model/Account.java#L6)
- [src/main/java/com/bank/model/Transaction.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/model/Transaction.java#L4)
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L61)
- [src/main/java/com/bank/exception/GlobalExceptionHandler.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/exception/GlobalExceptionHandler.java#L43)

Classes used:
- `LocalDateTime`
- `LocalDate`
- `ZoneId`
- `DateTimeFormatter`

How we used it:
- store account creation time
- store transaction creation time
- generate current date in showcase
- add timestamp in error response

Interview tip:
"In modern Java, prefer `java.time` classes like `LocalDate`, `LocalDateTime`, `Instant`, and `ZonedDateTime` over old `Date` and `Calendar`."

## 9. CompletableFuture

Simple meaning:
`CompletableFuture` is Java 8’s way to handle asynchronous tasks more easily.

Where used:
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L63)

How we used it:
- `supplyAsync(...)` runs work asynchronously
- `thenApply(...)` transforms the result
- `join()` waits for final result

Interview tip:
"`CompletableFuture` is useful for async workflows because it supports chaining, combining, and error handling much better than plain `Future`."

## 10. Base64 API

Simple meaning:
Java 8 added built-in Base64 encoding and decoding.

Where used:
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L67)

How we used it:
- encode `"you-bank-java8"` to Base64

Interview tip:
"Before Java 8, people often used third-party libraries for Base64. Java 8 added it directly in `java.util.Base64`."

## 11. StringJoiner

Simple meaning:
`StringJoiner` joins multiple strings with a delimiter, and can also add prefix and suffix.

Where used:
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L126)
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L70)

How we used it:
- build portfolio summary string
- build feature list string

Interview tip:
"`StringJoiner` is useful when you want delimiter-based string building with optional prefix and suffix."

## 12. Collection And Map Enhancements

Java 8 added several useful methods on collections and maps.

### 12.1 `forEach`

Simple meaning:
Loop over collection items using lambda style.

Where used:
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L128)
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L74)
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L102)

Interview tip:
"`forEach` gives a concise way to iterate, especially with lambdas and method references."

### 12.2 `removeIf`

Simple meaning:
Remove elements from a collection based on a condition.

Where used:
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L45)

How we used it:
- remove empty tag values from the tag list

Interview tip:
"`removeIf` makes collection cleanup easier than manual iterator removal."

### 12.3 `merge`

Simple meaning:
Add or update a map value in one method call.

Where used:
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L74)

How we used it:
- store owner name length in a map

### 12.4 `computeIfAbsent`

Simple meaning:
If key is missing, create value automatically.

Where used:
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L75)

Interview tip:
"Map enhancements like `merge`, `computeIfAbsent`, and `forEach` reduce boilerplate and make update logic much cleaner."

## 13. Collectors

Simple meaning:
Collectors are helper methods used at the end of streams to build final results.

Where used:
- [src/main/java/com/bank/dto/AccountResponse.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/dto/AccountResponse.java#L39)
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L68)
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L116)
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L56)

Collectors used here:
- `Collectors.toList()`
- `Collectors.groupingBy(...)`
- `Collectors.counting()`
- `Collectors.joining(...)`

Interview tip:
"Collectors are what turn stream pipelines into useful results like lists, maps, grouped values, and joined strings."

## 14. Repeatable Annotations

Simple meaning:
Before Java 8, if you wanted the same annotation multiple times on one class, it was awkward.
Java 8 introduced repeatable annotations.

Where used:
- [src/main/java/com/bank/util/BankAudit.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/util/BankAudit.java#L9)
- [src/main/java/com/bank/util/BankAudits.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/util/BankAudits.java#L10)
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L28)
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L77)

How we used it:
- `BankingService` has `@BankAudit("service-created")`
- and also `@BankAudit("service-reviewed")`
- later we read both annotations using `getAnnotationsByType(...)`

Interview tip:
"Repeatable annotations are useful when one target needs multiple values of the same annotation type."

## 15. Type Annotations

Simple meaning:
Java 8 allowed annotations not only on classes and methods, but also on type usage.

Where used:
- [src/main/java/com/bank/util/Sensitive.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/util/Sensitive.java#L9)
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L81)

How we used it:
- `@Sensitive String typeAnnotatedValue = "masked-account-reference";`

Interview tip:
"Type annotations allow extra metadata on type usage and are often useful for frameworks, static analysis, validation, and security rules."

## 16. `Arrays.stream(...)`

Simple meaning:
Convert an array into a stream.

Where used:
- [src/main/java/com/bank/service/Java8FeatureShowcaseService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/Java8FeatureShowcaseService.java#L77)

How we used it:
- convert annotation array into stream for processing

Interview tip:
"`Arrays.stream()` is a common entry point when you have arrays but want stream operations."

## 17. `orElseThrow(...)`

Simple meaning:
If Optional has a value, return it. Otherwise throw an exception.

Where used:
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L147)

Why useful:
- clean way to handle missing values
- avoids nested `if` checks

Interview tip:
"`Optional.orElseThrow(...)` is a clean replacement for manual null checking when missing data should fail fast."

## 18. Comparator Improvements

Simple meaning:
Java 8 made sorting easier using lambda and method-reference-based comparator helpers.

Where used:
- [src/main/java/com/bank/service/BankingService.java](/Users/sauravsharma/Downloads/You%20Bank/src/main/java/com/bank/service/BankingService.java#L66)

How we used it:
- `Comparator.comparing(Account::getOwnerName)`

Interview tip:
"Java 8 comparator helpers make sorting more readable than old anonymous comparator classes."

## 19. Real Project Flow To Remember

If an interviewer asks, "How did you use Java 8 in a real project?", you can answer like this:

"In my Spring Boot banking sample project, I used Java 8 streams for account summaries and DTO mapping, lambdas with a functional interface for interest calculation, Optional for repository lookups, default and static methods in interfaces, java.time for timestamps, CompletableFuture for async showcase logic, Base64, StringJoiner, map enhancements like merge and computeIfAbsent, and repeatable plus type annotations for metadata examples."

That one answer already sounds practical and project-based.

## 20. Short Interview Q&A

### Q: Why was Java 8 such a big release?

Simple answer:
Because it introduced functional programming style features like lambdas and streams, plus major APIs like `Optional`, `CompletableFuture`, and `java.time`.

### Q: What is the difference between lambda and method reference?

Simple answer:
- lambda: write custom small logic
- method reference: reuse an existing method directly

Example:
- lambda: `x -> x.getName()`
- method reference: `User::getName`

### Q: Why use Optional?

Simple answer:
To represent "value may be missing" clearly and reduce null-related bugs.

### Q: Why use streams instead of loops?

Simple answer:
Streams make transformations, filtering, grouping, and aggregation easier to read and maintain.

### Q: Why were default methods added?

Simple answer:
To evolve interfaces without breaking old implementation classes.

## 21. Best Way To Revise Quickly

Remember Java 8 in this order:

1. Lambdas
2. Functional interfaces
3. Streams
4. Method references
5. Optional
6. Default and static methods in interfaces
7. `java.time`
8. `CompletableFuture`
9. Base64
10. StringJoiner
11. Collection and map enhancements
12. Repeatable annotations
13. Type annotations

## 22. Final Practical Advice

For interviews, do not only define the feature.
Also say:
- what problem it solves
- where you used it
- why it was better than the old approach

That makes your answer sound like real engineering experience instead of memorized theory.
