package backend.FinSight.service;

import backend.FinSight.dto.CategoryTrendResponse;
import backend.FinSight.model.Expense;
import backend.FinSight.repository.ExpenseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class CategoryTrendService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<CategoryTrendResponse> getCategoryTrends(
            String userId
    ) {

        List<Expense> expenses =
                expenseRepository.findByUserId(userId);

        Map<String, Double> trendMap =
                new HashMap<>();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern(
                        "yyyy-MM"
                );

        for (Expense expense : expenses) {

            if (expense.getDate() == null
                    || expense.getCategory() == null) {
                continue;
            }

            String month =
                    expense.getDate()
                            .format(formatter);

            // Normalize category
            String category =
                    expense.getCategory()
                            .trim()
                            .toLowerCase();

            String key =
                    month + "_"
                            + category;

            trendMap.put(
                    key,
                    trendMap.getOrDefault(
                            key,
                            0.0
                    ) + expense.getAmount()
            );
        }

        List<CategoryTrendResponse> response =
                new ArrayList<>();

        for (Map.Entry<String, Double> entry
                : trendMap.entrySet()) {

            String[] parts =
                    entry.getKey().split("_");

            String month =
                    parts[0];

            String category =
                    capitalize(parts[1]);

            response.add(
                    new CategoryTrendResponse(
                            month,
                            category,
                            entry.getValue()
                    )
            );
        }

        response.sort(
                Comparator.comparing(
                        CategoryTrendResponse::getMonth
                )
        );

        return response;
    }

    private String capitalize(
            String value
    ) {

        if (value == null
                || value.isBlank()) {
            return value;
        }

        return value.substring(0, 1)
                .toUpperCase()
                + value.substring(1)
                .toLowerCase();
    }
}