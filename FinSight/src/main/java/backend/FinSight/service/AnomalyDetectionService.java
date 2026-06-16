package backend.FinSight.service;

import backend.FinSight.dto.AnomalyResponse;

import backend.FinSight.model.Expense;

import backend.FinSight.repository.ExpenseRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnomalyDetectionService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public AnomalyResponse detectAnomaly(
            String userId
    ) {

        List<Expense> expenses =
                expenseRepository.findByUserId(userId);

        if (expenses.isEmpty()) {

            return new AnomalyResponse(
                    false,
                    "No expenses available",
                    0,
                    0
            );
        }

        double total = 0;

        for (Expense expense : expenses) {

            total += expense.getAmount();
        }

        double average =
                total / expenses.size();

        // LATEST EXPENSE

        Expense latestExpense =
                expenses.get(expenses.size() - 1);

        double current =
                latestExpense.getAmount();

        boolean anomaly =
                current > average * 2;

        String warning;

        if (anomaly) {

            warning =
                    "Unusual expense detected: ₹"
                            + current
                            + " on "
                            + latestExpense.getCategory();

        } else {

            warning =
                    "No unusual spending detected.";
        }

        return new AnomalyResponse(
                anomaly,
                warning,
                average,
                current
        );
    }
}