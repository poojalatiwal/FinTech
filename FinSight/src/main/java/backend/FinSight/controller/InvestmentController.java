package backend.FinSight.controller;

import backend.FinSight.dto.InvestmentResponse;
import backend.FinSight.service.InvestmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/investment")
public class InvestmentController {

    @Autowired
    private InvestmentService investmentService;

    @GetMapping
    public InvestmentResponse getSuggestion(
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        return investmentService
                .getInvestmentSuggestion(userId);
    }
}

