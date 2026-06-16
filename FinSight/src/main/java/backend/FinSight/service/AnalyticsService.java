package backend.FinSight.service;

import backend.FinSight.dto.AnalyticsResponse;

import backend.FinSight.model.Expense;

import backend.FinSight.repository.ExpenseRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<AnalyticsResponse>
    getAnalytics(
            String userId
    ) {

        List<Expense> expenses =
                expenseRepository.findByUserId(userId);

        Map<String, Double> categoryTotals =
                new HashMap<>();

        // CATEGORY TOTALS

        for (Expense expense : expenses) {

            String category =
                    expense.getCategory();

            categoryTotals.put(
                    category,
                    categoryTotals.getOrDefault(
                            category,
                            0.0
                    ) + expense.getAmount()
            );
        }

        // CONVERT RESPONSE

        List<AnalyticsResponse> response =
                new ArrayList<>();

        for (Map.Entry<String, Double> entry
                : categoryTotals.entrySet()) {

            response.add(

                    new AnalyticsResponse(
                            entry.getKey(),
                            entry.getValue()
                    )
            );
        }

        return response;
    }
}

