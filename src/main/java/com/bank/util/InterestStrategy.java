package com.bank.util;

import java.math.BigDecimal;

@FunctionalInterface
public interface InterestStrategy {

    BigDecimal apply(BigDecimal balance);
}
