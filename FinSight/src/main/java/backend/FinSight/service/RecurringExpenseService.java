package backend.FinSight.service;

import backend.FinSight.dto.RecurringExpenseResponse;

import backend.FinSight.model.Expense;

import backend.FinSight.repository.ExpenseRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecurringExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<RecurringExpenseResponse>
    detectRecurringExpenses(
            String userId
    ) {

        List<Expense> expenses =
                expenseRepository.findByUserId(userId);

        List<RecurringExpenseResponse> recurring =
                new ArrayList<>();

        // TRACK COUNTS

        Map<String, Integer> expenseCount =
                new HashMap<>();

        Map<String, Double> expenseAmount =
                new HashMap<>();

        for (Expense expense : expenses) {

            String title =
                    expense.getTitle();

            expenseCount.put(
                    title,
                    expenseCount.getOrDefault(
                            title,
                            0
                    ) + 1
            );

            expenseAmount.put(
                    title,
                    expense.getAmount()
            );
        }

        // DETECT RECURRING

        for (String title : expenseCount.keySet()) {

            if (expenseCount.get(title) >= 2) {

                recurring.add(

                        new RecurringExpenseResponse(
                                title,
                                expenseAmount.get(title),
                                "Recurring monthly expense detected"
                        )
                );
            }
        }

        return recurring;
    }
}

