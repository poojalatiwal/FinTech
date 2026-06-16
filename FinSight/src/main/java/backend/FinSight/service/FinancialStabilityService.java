package backend.FinSight.service;

import backend.FinSight.dto.FinancialStabilityResponse;
import backend.FinSight.model.Expense;
import backend.FinSight.model.User;
import backend.FinSight.repository.ExpenseRepository;
import backend.FinSight.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FinancialStabilityService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public FinancialStabilityResponse analyzeFinancialHealth(
            String userId
    ) {

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        // ==========================
        // USER DATA
        // ==========================

        double income =
                user.getMonthlyIncome();

        double loanPayment =
                user.getLoanPayment();

        double emergencyFund =
                user.getEmergencyFund();

        // ==========================
        // CALCULATE EXPENSES
        // ==========================

        List<Expense> expensesList =
                expenseRepository.findByUserId(
                        userId
                );

        double expenses =
                expensesList.stream()
                        .mapToDouble(
                                Expense::getAmount
                        )
                        .sum();

        if (income <= 0) {

            return new FinancialStabilityResponse(
                    "Unknown",
                    0,
                    0,
                    0,
                    "Monthly income not configured."
            );
        }

        // ==========================
        // METRICS
        // ==========================

        double savingsRate =
                ((income - expenses) / income)
                        * 100;

        double debtRatio =
                (loanPayment / income)
                        * 100;

        // ==========================
        // SCORE
        // ==========================

        double score = 100;

        if (savingsRate < 10) {

            score -= 30;

        } else if (savingsRate < 20) {

            score -= 15;
        }

        if (debtRatio > 40) {

            score -= 30;

        } else if (debtRatio > 20) {

            score -= 15;
        }

        if (emergencyFund < income * 3) {

            score -= 15;
        }

        score =
                Math.max(
                        0,
                        Math.min(score, 100)
                );

        String status;
        String message;

        if (score >= 80) {

            status = "Stable";

            message =
                    "Excellent financial stability. Keep maintaining your savings habits.";

        } else if (score >= 50) {

            status = "Moderate";

            message =
                    "Your finances are acceptable, but there is room for improvement.";

        } else {

            status = "Risky";

            message =
                    "Financial risk detected. Increase savings and reduce debt burden.";
        }

        return new FinancialStabilityResponse(
                status,
                Math.round(score),
                Math.round(savingsRate * 100.0) / 100.0,
                Math.round(debtRatio * 100.0) / 100.0,
                message
        );
    }
}