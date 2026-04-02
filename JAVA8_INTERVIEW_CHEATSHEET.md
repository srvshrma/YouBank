# Java 8 Interview Cheatsheet

Use this file for quick revision before interviews.

## 1. What was important in Java 8?

Main highlights:
- Lambda expressions
- Functional interfaces
- Stream API
- Method references
- Optional
- Default and static methods in interfaces
- New Date/Time API
- CompletableFuture
- Base64 API
- Collection and Map enhancements
- Repeatable annotations
- Type annotations

## 2. Lambda Expression

Short answer:
A lambda is a short way to write an anonymous function.

Example:
```java
balance -> balance.multiply(new BigDecimal("0.02"))
```

Use in project:
- interest calculation in `BankingService`

Interview line:
"Lambdas reduce boilerplate and are used heavily with streams and functional interfaces."

## 3. Functional Interface

Short answer:
A functional interface has exactly one abstract method.

Example:
```java
@FunctionalInterface
public interface InterestStrategy {
    BigDecimal apply(BigDecimal balance);
}
```

Use in project:
- `InterestStrategy`

Interview line:
"A lambda needs a target type, and that target type is usually a functional interface."

## 4. Stream API

Short answer:
Streams help process collections in a declarative style.

Common operations:
- `filter`
- `map`
- `sorted`
- `collect`
- `reduce`

Use in project:
- summary calculation
- DTO conversion
- grouping accounts by type

Interview line:
"Streams improve readability for collection processing, especially filtering, mapping, grouping, and aggregation."

## 5. Method Reference

Short answer:
A method reference is a shorter form of lambda when you are just calling an existing method.

Example:
```java
Account::getOwnerName
```

Interview line:
"Use method references when the lambda only forwards to an already existing method."

## 6. Optional

Short answer:
`Optional` represents a value that may or may not be present.

Useful methods:
- `map`
- `orElse`
- `orElseThrow`
- `isPresent`

Use in project:
- repository search methods
- fallback value logic

Interview line:
"Optional makes missing values explicit and reduces null-handling mistakes."

## 7. Default Method In Interface

Short answer:
Java 8 allows method body inside an interface using `default`.

Use in project:
- `AccountRepository.findByOwner`
- `AccountFormatter.formatSummary`

Interview line:
"Default methods were added mainly so interfaces can evolve without breaking all implementations."

## 8. Static Method In Interface

Short answer:
Java 8 allows static helper methods inside interfaces.

Use in project:
- `AccountRepository.auditKey`
- `AccountFormatter.auditLabel`

Interview line:
"Static interface methods are useful for helper logic tightly related to that interface."

## 9. Date and Time API

Short answer:
Java 8 introduced `java.time`, which is much better than old `Date` and `Calendar`.

Common classes:
- `LocalDate`
- `LocalDateTime`
- `ZoneId`
- `DateTimeFormatter`

Use in project:
- account and transaction timestamps
- showcase current date

Interview line:
"`java.time` is immutable, cleaner, and safer than old date APIs."

## 10. CompletableFuture

Short answer:
`CompletableFuture` is used for asynchronous programming and chaining async results.

Example flow:
- `supplyAsync`
- `thenApply`
- `join`

Use in project:
- async portfolio showcase generation

Interview line:
"`CompletableFuture` is more powerful than old `Future` because it supports chaining and composition."

## 11. Base64

Short answer:
Java 8 added built-in Base64 encoding and decoding.

Use in project:
- showcase service encodes sample text

Interview line:
"Java 8 removed the need for third-party Base64 utilities in many cases."

## 12. StringJoiner

Short answer:
`StringJoiner` joins strings with delimiter, prefix, and suffix.

Use in project:
- portfolio summary string
- feature summary string

Interview line:
"`StringJoiner` is useful when building delimited text cleanly."

## 13. Collection Enhancements

Important methods:
- `forEach`
- `removeIf`

Use in project:
- iterating and cleaning tags
- iterating accounts and metadata

Interview line:
"Java 8 added useful collection helper methods that reduce manual loop code."

## 14. Map Enhancements

Important methods:
- `merge`
- `computeIfAbsent`

Use in project:
- showcase map building

Interview line:
"Map enhancements in Java 8 simplify insert-or-update logic."

## 15. Repeatable Annotations

Short answer:
Java 8 allows the same annotation multiple times on the same class or method.

Use in project:
- `@BankAudit("service-created")`
- `@BankAudit("service-reviewed")`

Interview line:
"Repeatable annotations are useful when one target needs multiple values of the same annotation."

## 16. Type Annotation

Short answer:
Java 8 allows annotations on type usage, not only on classes and methods.

Use in project:
```java
@Sensitive String typeAnnotatedValue = "masked-account-reference";
```

Interview line:
"Type annotations are often useful for validation, static analysis, and framework metadata."

## 17. Collector Methods To Remember

Important collectors:
- `Collectors.toList()`
- `Collectors.groupingBy()`
- `Collectors.counting()`
- `Collectors.joining()`

Interview line:
"Collectors help convert stream pipelines into useful results like lists, maps, grouped values, and strings."

## 18. Comparator Improvements

Example:
```java
Comparator.comparing(Account::getOwnerName)
```

Interview line:
"Java 8 made sorting cleaner by adding comparator helper methods."

## 19. Most Common Differences Asked In Interviews

### Lambda vs Method Reference

Lambda:
- write custom small logic

Method reference:
- reuse existing method directly

### Stream vs Collection

Collection:
- stores data

Stream:
- processes data

### Optional `orElse` vs `orElseGet`

`orElse`:
- value is created immediately

`orElseGet`:
- value is created only if needed

### Future vs CompletableFuture

`Future`:
- basic async result

`CompletableFuture`:
- chainable, composable, more powerful

## 20. 30-Second Java 8 Answer

If interviewer asks, "What Java 8 features have you used?"

You can say:

"I have used lambdas, functional interfaces, streams, method references, Optional, default and static interface methods, the java.time API, CompletableFuture, Base64, StringJoiner, collection and map enhancements, and repeatable annotations. In my Spring Boot banking project, I used them for account processing, summary generation, async showcase logic, and cleaner repository and utility design."

## 21. 10 Fast Questions You Should Be Ready For

1. What is a lambda?
2. What is a functional interface?
3. Why was Stream API introduced?
4. Difference between lambda and method reference?
5. Why use Optional?
6. What are default methods in interfaces?
7. Why is `java.time` better than old date classes?
8. What is CompletableFuture?
9. What is `computeIfAbsent`?
10. What are repeatable annotations?

## 22. Last-Minute Revision Trick

Remember Java 8 in this order:

1. Lambda
2. Functional interface
3. Stream
4. Method reference
5. Optional
6. Default/static interface methods
7. Date/time API
8. CompletableFuture
9. Collections and maps
10. Annotations

If you remember this order, you can answer most Java 8 interview questions in a structured way.
