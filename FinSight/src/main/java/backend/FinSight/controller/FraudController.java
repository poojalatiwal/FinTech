package backend.FinSight.controller;

import backend.FinSight.dto.FraudResponse;

import backend.FinSight.service.FraudDetectionService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fraud")
public class FraudController {

    @Autowired
    private FraudDetectionService fraudDetectionService;

    @GetMapping("/check")
    public FraudResponse checkFraud(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return fraudDetectionService
                .detectFraud(username);
    }
}