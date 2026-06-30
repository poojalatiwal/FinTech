package backend.FinSight.service;

import backend.FinSight.dto.BudgetRequest;
import backend.FinSight.dto.BudgetStatusResponse;
import backend.FinSight.dto.BudgetSummaryResponse;
import backend.FinSight.model.Budget;
import backend.FinSight.model.Expense;
import backend.FinSight.model.User;
import backend.FinSight.repository.BudgetRepository;
import backend.FinSight.repository.ExpenseRepository;
import backend.FinSight.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    private User getUserByUsername(
            String username
    ) {
        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }
    // CREATE BUDGET
    public Budget createBudget(
            BudgetRequest request,
            String userId
    ) {
        Budget budget = new Budget();
        budget.setCategory(
                request.getCategory()
        );
        budget.setLimitAmount(
                request.getLimitAmount()
        );
        budget.setMonth(
                request.getMonth()
        );
        User user =
                getUserByUsername(userId);

        budget.setUserId(
                user.getId()
        );
        return budgetRepository.save(budget);
    }

    // GET USER BUDGETS
    public List<Budget> getBudgets(
            String userId
    ) {
        User user =
                getUserByUsername(userId);

        return budgetRepository.findByUserId(
                user.getId()
        );
    }

    // DELETE
    public void deleteBudget(String id) {
        budgetRepository.deleteById(id);
    }

    // UPDATE BUDGET
    public Budget updateBudget(
            String id,
            BudgetRequest request,
            String userId
    ) {
        Budget budget =
                budgetRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Budget not found"
                                )
                        );
        User user =
                getUserByUsername(userId);

        if (!budget.getUserId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "Unauthorized access"
            );
        }
        budget.setCategory(
                request.getCategory()
        );
        budget.setLimitAmount(
                request.getLimitAmount()
        );
        budget.setMonth(
                request.getMonth()
        );
        return budgetRepository.save(budget);
    }

    // BUDGET STATUS
    public BudgetStatusResponse getBudgetStatus(
            String userId,
            String category,
            String month
    ) {
        User user =
                getUserByUsername(userId);

        Budget budget =
                budgetRepository
                        .findByUserIdAndCategoryAndMonth(
                                user.getId(),
                                category,
                                month
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Budget not found"
                                )
                        );

        List<Expense> expenses =
                expenseRepository
                        .findByUserIdAndCategory(
                                user.getId(),
                                category
                        );

        double spent = 0;

        for (Expense expense : expenses) {
            spent += expense.getAmount();
        }

        double remaining =
                budget.getLimitAmount() - spent;
        String status;

        if (remaining < 0) {
            status = "OVER_LIMIT";
        } else if (remaining < 1000) {
            status = "WARNING";
        } else {
            status = "SAFE";
        }
        return new BudgetStatusResponse(
                category,
                budget.getLimitAmount(),
                spent,
                remaining,
                status
        );
    }

    public BudgetSummaryResponse getBudgetSummary(
            String username
    ) {

        User user =
                getUserByUsername(username);

        List<Budget> budgets =
                budgetRepository.findByUserId(
                        user.getId()
                );

        List<Expense> expenses =
                expenseRepository.findByUserId(
                        user.getId()
                );

        double totalBudget = budgets.stream()
                .mapToDouble(
                        Budget::getLimitAmount
                )
                .sum();

        double totalSpent = expenses.stream()
                .mapToDouble(
                        Expense::getAmount
                )
                .sum();

        double remaining =
                totalBudget - totalSpent;

        double utilization = 0;

        if (totalBudget > 0) {

            utilization =
                    (totalSpent / totalBudget)
                            * 100;
        }

        return new BudgetSummaryResponse(
                totalBudget,
                totalSpent,
                remaining,
                budgets.size(),
                Math.round(utilization)
        );
    }
}