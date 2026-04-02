package com.bank.dto;

import java.util.List;
import java.util.Map;

public class Java8ShowcaseResponse {

    private final String lambdaExample;
    private final List<String> methodReferenceOwners;
    private final String optionalExample;
    private final String defaultMethodExample;
    private final String staticInterfaceMethodExample;
    private final String streamCollectorExample;
    private final String dateTimeExample;
    private final String completableFutureExample;
    private final String base64Example;
    private final String stringJoinerExample;
    private final Map<String, Integer> mapEnhancementExample;
    private final List<String> repeatableAnnotations;
    private final String typeAnnotationExample;

    public Java8ShowcaseResponse(String lambdaExample, List<String> methodReferenceOwners, String optionalExample,
                                 String defaultMethodExample, String staticInterfaceMethodExample, String streamCollectorExample,
                                 String dateTimeExample, String completableFutureExample, String base64Example,
                                 String stringJoinerExample, Map<String, Integer> mapEnhancementExample,
                                 List<String> repeatableAnnotations, String typeAnnotationExample) {
        this.lambdaExample = lambdaExample;
        this.methodReferenceOwners = methodReferenceOwners;
        this.optionalExample = optionalExample;
        this.defaultMethodExample = defaultMethodExample;
        this.staticInterfaceMethodExample = staticInterfaceMethodExample;
        this.streamCollectorExample = streamCollectorExample;
        this.dateTimeExample = dateTimeExample;
        this.completableFutureExample = completableFutureExample;
        this.base64Example = base64Example;
        this.stringJoinerExample = stringJoinerExample;
        this.mapEnhancementExample = mapEnhancementExample;
        this.repeatableAnnotations = repeatableAnnotations;
        this.typeAnnotationExample = typeAnnotationExample;
    }

    public String getLambdaExample() {
        return lambdaExample;
    }

    public List<String> getMethodReferenceOwners() {
        return methodReferenceOwners;
    }

    public String getOptionalExample() {
        return optionalExample;
    }

    public String getDefaultMethodExample() {
        return defaultMethodExample;
    }

    public String getStaticInterfaceMethodExample() {
        return staticInterfaceMethodExample;
    }

    public String getStreamCollectorExample() {
        return streamCollectorExample;
    }

    public String getDateTimeExample() {
        return dateTimeExample;
    }

    public String getCompletableFutureExample() {
        return completableFutureExample;
    }

    public String getBase64Example() {
        return base64Example;
    }

    public String getStringJoinerExample() {
        return stringJoinerExample;
    }

    public Map<String, Integer> getMapEnhancementExample() {
        return mapEnhancementExample;
    }

    public List<String> getRepeatableAnnotations() {
        return repeatableAnnotations;
    }

    public String getTypeAnnotationExample() {
        return typeAnnotationExample;
    }
}
