package backend.FinSight.controller;

import backend.FinSight.dto.BudgetRequest;
import backend.FinSight.dto.BudgetStatusResponse;
import backend.FinSight.model.Budget;
import backend.FinSight.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/budget")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    // CREATE BUDGET
    @PostMapping
    public Budget createBudget(
            @RequestBody BudgetRequest request,
            Authentication authentication
    ) {
        String userId =
                authentication.getName();
        return budgetService.createBudget(
                request,
                userId
        );
    }

    // GET ALL BUDGETS
    @GetMapping
    public List<Budget> getBudgets(
            Authentication authentication
    ) {
        String userId =
                authentication.getName();
        return budgetService.getBudgets(userId);
    }

    // DELETE BUDGET

    @DeleteMapping("/{id}")
    public String deleteBudget(
            @PathVariable String id
    ) {
        budgetService.deleteBudget(id);
        return "Budget deleted successfully";
    }

    @PutMapping("/{id}")
    public Budget updateBudget(
            @PathVariable String id,
            @RequestBody BudgetRequest request,
            Authentication authentication
    ) {
        String userId =
                authentication.getName();
        return budgetService.updateBudget(
                id,
                request,
                userId
        );
    }

    // BUDGET STATUS
    @GetMapping("/status/{category}/{month}")
    public BudgetStatusResponse getBudgetStatus(
            @PathVariable String category,
            @PathVariable String month,
            Authentication authentication
    ) {
        String userId =
                authentication.getName();
        return budgetService.getBudgetStatus(
                userId,
                category,
                month
        );
    }
}