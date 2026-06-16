package backend.FinSight.service;

import backend.FinSight.dto.FinancialHealthResponse;

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
public class FinancialHealthService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    // =====================================
    // TOTAL EXPENSES
    // =====================================

    public double calculateTotalExpenses(
            String userId
    ) {

        List<Expense> expenses =
                expenseRepository.findByUserId(userId);

        return expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    // =====================================
    // SAVINGS RATE
    // =====================================

    public double calculateSavingsRate(
            User user
    ) {

        double totalExpenses =
                calculateTotalExpenses(
                        user.getId()
                );

        double savings =
                user.getMonthlyIncome()
                        - totalExpenses;

        if (user.getMonthlyIncome() <= 0) {

            return 0;
        }

        return (savings /
                user.getMonthlyIncome()) * 100;
    }

    // =====================================
    // DEBT TO INCOME RATIO
    // =====================================

    public double calculateDebtToIncomeRatio(
            User user
    ) {

        if (user.getMonthlyIncome() <= 0) {

            return 0;
        }

        return user.getLoanPayment()
                /
                user.getMonthlyIncome();
    }

    // =====================================
    // CASH FLOW STATUS
    // =====================================

    public String calculateCashFlowStatus(
            User user
    ) {

        double totalExpenses =
                calculateTotalExpenses(
                        user.getId()
                );

        if (user.getMonthlyIncome()
                > totalExpenses) {

            return "POSITIVE";
        }

        else if (user.getMonthlyIncome()
                == totalExpenses) {

            return "NEUTRAL";
        }

        return "NEGATIVE";
    }

    // =====================================
    // FINANCIAL STRESS LEVEL
    // =====================================

    public String calculateStressLevel(
            User user
    ) {

        double debtRatio =
                calculateDebtToIncomeRatio(
                        user
                );

        double savingsRate =
                calculateSavingsRate(
                        user
                );

        if (debtRatio > 0.6
                || savingsRate < 5) {

            return "HIGH";
        }

        else if (debtRatio > 0.3
                || savingsRate < 15) {

            return "MEDIUM";
        }

        return "LOW";
    }

    // =====================================
    // FINANCIAL SCORE
    // =====================================

    public int calculateFinancialScore(
            User user
    ) {

        double savingsRate =
                calculateSavingsRate(
                        user
                );

        double debtRatio =
                calculateDebtToIncomeRatio(
                        user
                );

        int score = 100;

        // =====================================
        // LOW SAVINGS
        // =====================================

        if (savingsRate < 10) {

            score -= 30;

        }

        else if (savingsRate < 20) {

            score -= 15;
        }

        // =====================================
        // HIGH DEBT
        // =====================================

        if (debtRatio > 0.5) {

            score -= 30;

        }

        else if (debtRatio > 0.3) {

            score -= 15;
        }

        // =====================================
        // BUDGET CHECK
        // =====================================

        List<Budget> budgets =
                budgetRepository.findByUserId(
                        user.getId()
                );

        List<Expense> expenses =
                expenseRepository.findByUserId(
                        user.getId()
                );

        for (Budget budget : budgets) {

            double categoryExpense = 0;

            for (Expense expense : expenses) {

                if (
                        expense.getCategory() != null
                                &&
                                expense.getCategory()
                                        .equalsIgnoreCase(
                                                budget.getCategory()
                                        )
                ) {

                    categoryExpense +=
                            expense.getAmount();
                }
            }

            // BUDGET EXCEEDED

            if (categoryExpense >
                    budget.getLimitAmount()) {

                score -= 10;
            }
        }

        // =====================================
        // MIN/MAX SCORE
        // =====================================

        if (score < 0) {

            score = 0;
        }

        if (score > 100) {

            score = 100;
        }

        return score;
    }

    // =====================================
    // COMPLETE HEALTH RESPONSE
    // =====================================

    public FinancialHealthResponse calculateHealthScore(
            String username
    ) {
        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        int score =
                calculateFinancialScore(
                        user
                );

        String status;

        String advice;

        // =====================================
        // STATUS
        // =====================================

        if (score >= 80) {

            status = "EXCELLENT";

            advice =
                    "Your financial spending habits are excellent.";

        }

        else if (score >= 60) {

            status = "GOOD";

            advice =
                    "Your spending is mostly under control.";

        }

        else if (score >= 40) {

            status = "WARNING";

            advice =
                    "You should reduce unnecessary expenses.";

        }

        else {

            status = "CRITICAL";

            advice =
                    "Your spending pattern is risky.";
        }

        return new FinancialHealthResponse(
                score,
                status,
                advice
        );
    }
}

