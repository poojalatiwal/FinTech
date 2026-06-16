package backend.FinSight.service;

import backend.FinSight.dto.InvestmentResponse;

import backend.FinSight.model.Expense;

import backend.FinSight.repository.ExpenseRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvestmentService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public InvestmentResponse
    getInvestmentSuggestion(
            String userId
    ) {

        List<Expense> expenses =
                expenseRepository.findByUserId(userId);

        if (expenses.isEmpty()) {

            return new InvestmentResponse(
                    "Unknown",
                    "Add expense data for personalized investment advice."
            );
        }

        // TOTAL EXPENSES

        double total = 0;

        for (Expense expense : expenses) {

            total += expense.getAmount();
        }

        // AI-STYLE LOGIC

        String risk;

        String suggestion;

        if (total < 10000) {

            risk = "Low";

            suggestion =
                    "Consider Fixed Deposits or SIP mutual funds for stable long-term growth.";

        } else if (total < 50000) {

            risk = "Medium";

            suggestion =
                    "You can diversify into mutual funds, index funds, and ETFs.";

        } else {

            risk = "High";

            suggestion =
                    "You may explore stocks, ETFs, and diversified investments carefully.";
        }

        return new InvestmentResponse(
                risk,
                suggestion
        );
    }
}

