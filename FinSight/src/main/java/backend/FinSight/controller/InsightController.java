package backend.FinSight.controller;

import backend.FinSight.dto.FinancialInsightResponse;

import backend.FinSight.service.InsightService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/insights")
public class InsightController {

    @Autowired
    private InsightService insightService;
    @GetMapping("/{category}/{month}")
    public FinancialInsightResponse getInsight(
            @PathVariable String category,
            @PathVariable String month,
            Authentication authentication
    ) {

        System.out.println("INSIGHT API HIT");

        System.out.println(
                "AUTH USER = "
                        + authentication
        );

        String userId =
                authentication.getName();

        return insightService.generateInsight(
                userId,
                category,
                month
        );
    }

    @GetMapping
    public FinancialInsightResponse getInsight(
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        return insightService.generateOverallInsight(
                userId
        );
    }
}