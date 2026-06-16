package backend.FinSight.controller;

import backend.FinSight.dto.CategorySummaryResponse;
import backend.FinSight.dto.ExpenseRequest;
import backend.FinSight.dto.ExpenseSummaryResponse;

import backend.FinSight.model.Expense;

import backend.FinSight.service.ExpenseService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // =====================================
    // ADD EXPENSE
    // =====================================

    @PostMapping
    public Expense addExpense(
            @RequestBody ExpenseRequest request,
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return expenseService.addExpense(
                request,
                username
        );
    }

    // =====================================
    // GET USER EXPENSES
    // =====================================

    @GetMapping
    public List<Expense> getExpenses(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return expenseService.getExpenses(
                username
        );
    }

    // =====================================
    // UPDATE EXPENSE
    // =====================================

    @PutMapping("/{id}")
    public Expense updateExpense(
            @PathVariable String id,
            @RequestBody ExpenseRequest request,
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return expenseService.updateExpense(
                id,
                request,
                username
        );
    }

    // =====================================
    // DELETE EXPENSE
    // =====================================

    @DeleteMapping("/{id}")
    public String deleteExpense(
            @PathVariable String id,
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        expenseService.deleteExpense(
                id,
                username
        );

        return "Expense deleted successfully";
    }

    // =====================================
    // SUMMARY
    // =====================================

    @GetMapping("/summary")
    public ExpenseSummaryResponse getSummary(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return expenseService.getSummary(
                username
        );
    }

    // =====================================
    // CATEGORY SUMMARY
    // =====================================

    @GetMapping("/category-summary/{category}")
    public CategorySummaryResponse getCategorySummary(
            @PathVariable String category,
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return expenseService.getCategorySummary(
                username,
                category
        );
    }

    // =====================================
    // FILTER BY CATEGORY
    // =====================================

    @GetMapping("/category/{category}")
    public List<Expense> getByCategory(
            @PathVariable String category,
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return expenseService
                .getExpensesByCategory(
                        username,
                        category
                );
    }

    // =====================================
    // MONTHLY EXPENSES
    // =====================================

    @GetMapping("/monthly")
    public List<Expense> getMonthlyExpenses(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return expenseService
                .getMonthlyExpenses(
                        username
                );
    }

    // =====================================
    // TOTAL EXPENSES
    // =====================================

    @GetMapping("/total")
    public double getTotalExpenses(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return expenseService
                .getTotalExpenses(
                        username
                );
    }

    // =====================================
    // RECENT EXPENSES
    // =====================================

    @GetMapping("/recent")
    public List<Expense> getRecentExpenses(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return expenseService
                .getRecentExpenses(
                        username
                );
    }
}

