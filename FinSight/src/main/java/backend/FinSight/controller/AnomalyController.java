package backend.FinSight.controller;

import backend.FinSight.dto.AnomalyResponse;

import backend.FinSight.service.AnomalyDetectionService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/anomaly")
public class AnomalyController {

    @Autowired
    private AnomalyDetectionService anomalyDetectionService;

    @GetMapping
    public AnomalyResponse detectAnomaly(
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        return anomalyDetectionService
                .detectAnomaly(userId);
    }
}