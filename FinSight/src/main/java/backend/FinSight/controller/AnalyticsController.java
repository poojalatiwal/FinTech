package backend.FinSight.controller;

import backend.FinSight.dto.AnalyticsResponse;

import backend.FinSight.service.AnalyticsService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping
    public List<AnalyticsResponse>
    getAnalytics(
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        return analyticsService
                .getAnalytics(userId);
    }
}

