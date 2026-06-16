package backend.FinSight.service;

import backend.FinSight.dto.AdminDashboardResponse;

import backend.FinSight.model.Expense;

import backend.FinSight.model.User;
import backend.FinSight.repository.BudgetRepository;
import backend.FinSight.repository.ExpenseRepository;
import backend.FinSight.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    public AdminDashboardResponse
    getDashboard() {

        long totalUsers =
                userRepository.count();

        long totalExpenses =
                expenseRepository.count();

        long totalBudgets =
                budgetRepository.count();

        // FRAUD ANALYSIS

        List<Expense> expenses =
                expenseRepository.findAll();

        long fraudCases = 0;

        for (Expense expense : expenses) {

            if (expense.getAmount() > 50000) {

                fraudCases++;
            }
        }

        return new AdminDashboardResponse(
                totalUsers,
                totalExpenses,
                totalBudgets,
                fraudCases
        );
    }

    public List<User> getAllUsers()
    { return userRepository.findAll();
    }

    public String deleteUser(
            String userId
    ) {

        userRepository.deleteById(userId);

        return "User deleted successfully";
    }

}

