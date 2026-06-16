package backend.FinSight.controller;

import backend.FinSight.dto.MonthlyTrendResponse;

import backend.FinSight.service.TrendService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trends")
public class TrendController {

    @Autowired
    private TrendService trendService;

    @GetMapping("/monthly")
    public List<MonthlyTrendResponse>
    getMonthlyTrend(
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        return trendService
                .getMonthlyTrend(userId);
    }
}
