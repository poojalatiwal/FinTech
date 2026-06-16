package backend.FinSight.service;

import backend.FinSight.dto.FinancialInsightResponse;
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
public class InsightService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public FinancialInsightResponse generateInsight(
            String userId,
            String category,
            String month
    ) {
        Budget budget =
                budgetRepository
                        .findByUserIdAndCategoryAndMonth(
                                userId,
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
                                userId,
                                category
                        );
        double spent = 0;

        for (Expense expense : expenses) {
            spent += expense.getAmount();
        }

        double limit =
                budget.getLimitAmount();

        String message;
        String status;

        if (spent > limit) {
            message =
                    "You are overspending heavily on "
                            + category
                            + " this month.";
            status = "OVER_LIMIT";
        } else if (spent > limit * 0.8) {
            message =
                    "Warning: You are close to your "
                            + category
                            + " budget.";
            status = "WARNING";
        } else {
            message =
                    "Your spending is under control.";
            status = "SAFE";
        }

        // SEND EMAIL
        User user =
                userRepository.findByUsername(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );
        emailService.sendEmail(
                user.getEmail(),
                "FinSight Financial Insight",
                message
        );
        return new FinancialInsightResponse(
                message,
                status
        );
    }

    public FinancialInsightResponse generateOverallInsight(
            String userId
    ) {

        List<Budget> budgets =
                budgetRepository.findByUserId(userId);

        double totalLimit = 0;
        double totalSpent = 0;

        for (Budget budget : budgets) {

            totalLimit += budget.getLimitAmount();

            List<Expense> expenses =
                    expenseRepository
                            .findByUserIdAndCategory(
                                    userId,
                                    budget.getCategory()
                            );

            totalSpent += expenses.stream()
                    .mapToDouble(Expense::getAmount)
                    .sum();
        }

        String message;
        String status;

        if (totalSpent > totalLimit) {

            message =
                    "You are overspending across multiple categories.";

            status =
                    "OVER_LIMIT";

        } else if (totalSpent > totalLimit * 0.8) {

            message =
                    "You are approaching your overall budget limit.";

            status =
                    "WARNING";

        } else {

            message =
                    "Your spending is under control.";

            status =
                    "SAFE";
        }

        return new FinancialInsightResponse(
                message,
                status
        );
    }
}