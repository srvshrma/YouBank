package com.bank.controller;

import com.bank.dto.Java8ShowcaseResponse;
import com.bank.service.Java8FeatureShowcaseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/showcase")
public class ShowcaseController {

    private final Java8FeatureShowcaseService showcaseService;

    public ShowcaseController(Java8FeatureShowcaseService showcaseService) {
        this.showcaseService = showcaseService;
    }

    @GetMapping("/java8")
    public Java8ShowcaseResponse java8() {
        return showcaseService.buildShowcase();
    }
}
