package backend.FinSight.service;

import backend.FinSight.dto.SavingsRecommendationResponse;
import backend.FinSight.model.Expense;
import backend.FinSight.model.User;
import backend.FinSight.repository.ExpenseRepository;
import backend.FinSight.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SavingsRecommendationService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FinancialHealthService financialHealthService;

    private final RestTemplate restTemplate =
            new RestTemplate();

    public SavingsRecommendationResponse getRecommendation(
            String userId
    ) {

        try {

            // =====================================
            // FIND USER
            // =====================================

            User user =
                    userRepository
                            .findById(userId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            // =====================================
            // GET USER EXPENSES
            // =====================================

            List<Expense> expenses =
                    expenseRepository
                            .findByUserId(userId);

            if (expenses.isEmpty()) {

                return new SavingsRecommendationResponse(
                        "NONE",
                        "No expense data available.",
                        0,
                        0,
                        false
                );
            }

            // =====================================
            // CALCULATE EXPENSE METRICS
            // =====================================

            double totalExpense = 0;

            double essentialSpending = 0;

            double discretionarySpending = 0;

            int transactionCount =
                    expenses.size();

            for (Expense expense : expenses) {

                totalExpense +=
                        expense.getAmount();

                String category =
                        expense.getCategory() == null
                                ? "Other"
                                : expense.getCategory();

                if (
                        category.equalsIgnoreCase("Food")
                                ||
                                category.equalsIgnoreCase("Rent")
                                ||
                                category.equalsIgnoreCase("Utilities")
                ) {

                    essentialSpending +=
                            expense.getAmount();

                }

                else {

                    discretionarySpending +=
                            expense.getAmount();
                }
            }

            // =====================================
            // FINANCIAL HEALTH METRICS
            // =====================================

            double savingsRate =
                    financialHealthService
                            .calculateSavingsRate(
                                    user
                            );

            double debtRatio =
                    financialHealthService
                            .calculateDebtToIncomeRatio(
                                    user
                            );

            int financialScore =
                    financialHealthService
                            .calculateFinancialScore(
                                    user
                            );

            // =====================================
            // BUILD ML REQUEST
            // =====================================

            Map<String, Object> request =
                    new HashMap<>();

            request.put(
                    "monthly_income",
                    user.getMonthlyIncome()
            );

            request.put(
                    "monthly_expense_total",
                    totalExpense
            );

            request.put(
                    "savings_rate",
                    savingsRate
            );

            request.put(
                    "debt_to_income_ratio",
                    debtRatio
            );

            request.put(
                    "loan_payment",
                    user.getLoanPayment()
            );

            request.put(
                    "investment_amount",
                    user.getInvestmentAmount()
            );

            request.put(
                    "subscription_services",
                    user.getSubscriptionServices()
            );

            request.put(
                    "emergency_fund",
                    user.getEmergencyFund()
            );

            request.put(
                    "transaction_count",
                    transactionCount
            );

            request.put(
                    "discretionary_spending",
                    discretionarySpending
            );

            request.put(
                    "essential_spending",
                    essentialSpending
            );

            request.put(
                    "income_type",
                    user.getIncomeType()
            );

            request.put(
                    "rent_or_mortgage",
                    user.getRentOrMortgage()
            );

            request.put(
                    "financial_advice_score",
                    financialScore
            );

            // =====================================
            // CALL ML SERVICE
            // =====================================

            Map response =
                    restTemplate.postForObject(
                            "http://localhost:5001/predict/savings",
                            request,
                            Map.class
                    );

            boolean goalLikelyToBeMet = false;

            if (response != null
                    && response.get(
                    "savings_goal"
            ) != null) {

                int prediction =
                        ((Number)
                                response.get(
                                        "savings_goal"
                                ))
                                .intValue();

                goalLikelyToBeMet =
                        prediction == 1;
            }

            // =====================================
            // GENERATE RECOMMENDATION
            // =====================================

            String suggestion;

            double estimatedSavings;

            double probability;

            if (goalLikelyToBeMet) {

                suggestion =
                        "You are on track to achieve your savings goal. Continue your current financial habits.";

                estimatedSavings =
                        totalExpense * 0.05;

                probability = 85;

            }

            else {

                suggestion =
                        "Your savings goal may be at risk. Reduce discretionary spending and increase monthly savings.";

                estimatedSavings =
                        discretionarySpending * 0.15;

                probability = 45;
            }

            return new SavingsRecommendationResponse(
                    "AI Savings Prediction",
                    suggestion,
                    estimatedSavings,
                    probability,
                    goalLikelyToBeMet
            );

        }

        catch (Exception e) {

            return new SavingsRecommendationResponse(
                    "ERROR",
                    e.getMessage(),
                    0,
                    0,
                    false
            );
        }
    }
}