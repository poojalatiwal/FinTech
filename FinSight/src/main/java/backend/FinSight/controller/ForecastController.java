package backend.FinSight.controller;

import backend.FinSight.dto.ForecastResponse;
import backend.FinSight.service.ForecastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/forecast")
public class ForecastController {

    @Autowired
    private ForecastService forecastService;

    @GetMapping
    public ForecastResponse forecast(
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        return forecastService
                .forecastExpenses(userId);
    }
}

