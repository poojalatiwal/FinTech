package backend.FinSight.controller;

import backend.FinSight.dto.RecurringExpenseResponse;

import backend.FinSight.service.RecurringExpenseService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recurring")
public class RecurringExpenseController {

    @Autowired
    private RecurringExpenseService recurringExpenseService;

    @GetMapping
    public List<RecurringExpenseResponse>
    getRecurringExpenses(
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        return recurringExpenseService
                .detectRecurringExpenses(userId);
    }
}

