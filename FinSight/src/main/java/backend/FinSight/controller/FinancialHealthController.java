package backend.FinSight.controller;

import backend.FinSight.dto.FinancialHealthResponse;
import backend.FinSight.service.FinancialHealthService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class FinancialHealthController {

    @Autowired
    private FinancialHealthService financialHealthService;

    @GetMapping
    public FinancialHealthResponse getHealthScore(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return financialHealthService
                .calculateHealthScore(
                        username
                );
    }
}

