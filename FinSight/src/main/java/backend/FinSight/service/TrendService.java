package backend.FinSight.service;

import backend.FinSight.dto.MonthlyTrendResponse;
import backend.FinSight.model.Expense;
import backend.FinSight.model.User;
import backend.FinSight.repository.ExpenseRepository;
import backend.FinSight.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TrendService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    // =====================================
    // GET USER FROM USERNAME
    // =====================================

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

    // =====================================
    // MONTHLY TREND
    // =====================================

    public List<MonthlyTrendResponse>
    getMonthlyTrend(
            String username
    ) {

        User user =
                getUserByUsername(username);

        List<Expense> expenses =
                expenseRepository.findByUserId(
                        user.getId()
                );

        System.out.println(
                "Trend Username = "
                        + username
        );

        System.out.println(
                "Mongo User ID = "
                        + user.getId()
        );

        System.out.println(
                "Trend Expenses Count = "
                        + expenses.size()
        );

        Map<String, Double> monthlyTotals =
                new HashMap<>();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern(
                        "yyyy-MM"
                );

        for (Expense expense : expenses) {

            if (expense.getDate() == null) {
                continue;
            }

            String month =
                    expense.getDate()
                            .format(formatter);

            monthlyTotals.put(
                    month,
                    monthlyTotals.getOrDefault(
                            month,
                            0.0
                    ) + expense.getAmount()
            );
        }

        List<MonthlyTrendResponse> response =
                new ArrayList<>();

        for (
                Map.Entry<String, Double> entry
                : monthlyTotals.entrySet()
        ) {

            response.add(
                    new MonthlyTrendResponse(
                            entry.getKey(),
                            entry.getValue()
                    )
            );
        }

        return response;
    }
}