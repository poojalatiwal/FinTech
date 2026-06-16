package backend.FinSight.service;

import backend.FinSight.dto.CategorySummaryResponse;
import backend.FinSight.dto.ExpenseRequest;
import backend.FinSight.dto.ExpenseSummaryResponse;

import backend.FinSight.model.Expense;
import backend.FinSight.model.User;

import backend.FinSight.repository.ExpenseRepository;
import backend.FinSight.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

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
    // ADD EXPENSE
    // =====================================

    public Expense addExpense(
            ExpenseRequest request,
            String username
    ) {

        User user =
                getUserByUsername(username);

        Expense expense = new Expense();

        expense.setTitle(
                request.getTitle()
        );

        expense.setAmount(
                request.getAmount()
        );

        expense.setCategory(
                request.getCategory()
        );

        expense.setDebtRelated(
                request.isDebtRelated()
        );

        expense.setDescription(
                request.getDescription()
        );

        if (request.getDate() != null) {

            expense.setDate(
                    request.getDate()
            );

        } else {

            expense.setDate(
                    LocalDate.now()
            );
        }

        // SAVE REAL USER ID

        expense.setUserId(
                user.getId()
        );

        Expense savedExpense =
                expenseRepository.save(expense);

        // =====================================
        // EMAIL
        // =====================================

        String email =
                user.getEmail();

        // =====================================
        // HIGH EXPENSE ALERT
        // =====================================

        if (expense.getAmount() > 10000) {

            String message =
                    "High expense detected: ₹"
                            + expense.getAmount();

            notificationService.createNotification(
                    user.getId(),
                    message
            );

            emailService.sendEmail(
                    email,
                    "FinSight High Expense Alert",
                    message
            );
        }

        // =====================================
        // FOOD ALERT
        // =====================================

        String category =
                expense.getCategory() == null
                        ? "Other"
                        : expense.getCategory();

        if (
                category.equalsIgnoreCase("Food")
                        &&
                        expense.getAmount() > 3000
        ) {

            String message =
                    "Food spending exceeded healthy limit.";

            notificationService.createNotification(
                    user.getId(),
                    message
            );

            emailService.sendEmail(
                    email,
                    "FinSight Food Alert",
                    message
            );
        }

        return savedExpense;
    }

    // =====================================
    // GET USER EXPENSES
    // =====================================

    public List<Expense> getExpenses(
            String username
    ) {

        User user =
                getUserByUsername(username);

        return expenseRepository.findByUserId(
                user.getId()
        );
    }

    // =====================================
    // UPDATE EXPENSE
    // =====================================

    public Expense updateExpense(
            String expenseId,
            ExpenseRequest request,
            String username
    ) {

        User user =
                getUserByUsername(username);

        Expense expense =
                expenseRepository.findById(expenseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Expense not found"
                                )
                        );

        // SECURITY CHECK

        if (
                !expense.getUserId()
                        .equals(user.getId())
        ) {

            throw new RuntimeException(
                    "Unauthorized access"
            );
        }

        expense.setTitle(
                request.getTitle()
        );

        expense.setAmount(
                request.getAmount()
        );

        expense.setCategory(
                request.getCategory()
        );

        expense.setDebtRelated(
                request.isDebtRelated()
        );

        expense.setDescription(
                request.getDescription()
        );

        if (request.getDate() != null) {

            expense.setDate(
                    request.getDate()
            );
        }

        return expenseRepository.save(
                expense
        );
    }

    // =====================================
    // DELETE EXPENSE
    // =====================================

    public void deleteExpense(
            String expenseId,
            String username
    ) {

        User user =
                getUserByUsername(username);

        Expense expense =
                expenseRepository.findById(expenseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Expense not found"
                                )
                        );

        // SECURITY CHECK

        if (
                !expense.getUserId()
                        .equals(user.getId())
        ) {

            throw new RuntimeException(
                    "Unauthorized access"
            );
        }

        expenseRepository.deleteById(
                expenseId
        );
    }

    // =====================================
    // SUMMARY
    // =====================================

    public ExpenseSummaryResponse getSummary(
            String username
    ) {

        User user =
                getUserByUsername(username);

        List<Expense> expenses =
                expenseRepository.findByUserId(
                        user.getId()
                );

        double total = 0;

        double food = 0;

        double travel = 0;

        double shopping = 0;

        double agriculture = 0;

        double other = 0;

        for (Expense expense : expenses) {

            total += expense.getAmount();

            String category =
                    expense.getCategory() == null
                            ? "Other"
                            : expense.getCategory();

            switch (category.toLowerCase()) {

                case "food":
                    food += expense.getAmount();
                    break;

                case "travel":
                    travel += expense.getAmount();
                    break;

                case "shopping":
                    shopping += expense.getAmount();
                    break;

                case "agriculture":
                    agriculture += expense.getAmount();
                    break;

                default:
                    other += expense.getAmount();
                    break;
            }
        }

        return new ExpenseSummaryResponse(
                total,
                food,
                travel,
                shopping,
                agriculture,
                other
        );
    }

    // =====================================
    // CATEGORY SUMMARY
    // =====================================

    public CategorySummaryResponse getCategorySummary(
            String username,
            String category
    ) {

        User user =
                getUserByUsername(username);

        List<Expense> expenses =
                expenseRepository
                        .findByUserIdAndCategory(
                                user.getId(),
                                category
                        );

        double total = 0;

        for (Expense expense : expenses) {

            total += expense.getAmount();
        }

        return new CategorySummaryResponse(
                category,
                total,
                expenses.size()
        );
    }

    // =====================================
    // FILTER BY CATEGORY
    // =====================================

    public List<Expense> getExpensesByCategory(
            String username,
            String category
    ) {

        User user =
                getUserByUsername(username);

        return expenseRepository
                .findByUserIdAndCategory(
                        user.getId(),
                        category
                );
    }

    // =====================================
    // MONTHLY EXPENSES
    // =====================================

    public List<Expense> getMonthlyExpenses(
            String username
    ) {

        User user =
                getUserByUsername(username);

        LocalDate now =
                LocalDate.now();

        LocalDate start =
                now.withDayOfMonth(1);

        LocalDate end =
                now.withDayOfMonth(
                        now.lengthOfMonth()
                );

        return expenseRepository
                .findByUserIdAndDateBetween(
                        user.getId(),
                        start,
                        end
                );
    }

    // =====================================
    // TOTAL EXPENSES
    // =====================================

    public double getTotalExpenses(
            String username
    ) {

        User user =
                getUserByUsername(username);

        List<Expense> expenses =
                expenseRepository.findByUserId(
                        user.getId()
                );

        return expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    // =====================================
    // RECENT EXPENSES
    // =====================================

    public List<Expense> getRecentExpenses(
            String username
    ) {

        User user =
                getUserByUsername(username);

        return expenseRepository
                .findTop5ByUserIdOrderByDateDesc(
                        user.getId()
                );
    }
}

