package backend.FinSight.controller;

import backend.FinSight.dto.FinancialStabilityResponse;

import backend.FinSight.model.User;
import backend.FinSight.repository.UserRepository;
import backend.FinSight.service.FinancialStabilityService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/financial-health")
public class FinancialStabilityController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FinancialStabilityService
            financialStabilityService;
    @GetMapping
    public FinancialStabilityResponse analyzeFinancialHealth(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        return financialStabilityService
                .analyzeFinancialHealth(
                        user.getId()
                );
    }
}
