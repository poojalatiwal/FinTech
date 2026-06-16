package backend.FinSight.controller;

import backend.FinSight.dto.DashboardResponse;

import backend.FinSight.service.DashboardService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard(
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        return dashboardService
                .getDashboard(userId);
    }
}

