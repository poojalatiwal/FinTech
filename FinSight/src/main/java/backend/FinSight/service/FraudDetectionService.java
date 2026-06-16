package backend.FinSight.service;

import backend.FinSight.dto.FraudResponse;
import backend.FinSight.model.Expense;
import backend.FinSight.model.User;
import backend.FinSight.repository.ExpenseRepository;
import backend.FinSight.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FraudDetectionService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FinancialHealthService financialHealthService;

    @Autowired
    private RestTemplate restTemplate;

    public FraudResponse detectFraud(
            String userId
    ) {

        try {
            User user =
                    userRepository
                            .findByUsername(userId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            // ==========================================
            // GET USER EXPENSES
            // ==========================================

            List<Expense> expenses =
                    expenseRepository.findByUserId(userId);

            if (expenses.isEmpty()) {

                return new FraudResponse(
                        false,
                        "No expense data available for fraud analysis."
                );
            }

            // ==========================================
            // CALCULATE SPENDING METRICS
            // ==========================================

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

                } else {

                    discretionarySpending +=
                            expense.getAmount();
                }
            }

            // ==========================================
            // FINANCIAL METRICS
            // ==========================================

            double savingsRate =
                    financialHealthService
                            .calculateSavingsRate(user);

            double debtRatio =
                    financialHealthService
                            .calculateDebtToIncomeRatio(user);

            int financialScore =
                    financialHealthService
                            .calculateFinancialScore(user);

            // ==========================================
            // BUILD ML REQUEST
            // ==========================================

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

            // ==========================================
            // CALL ML API
            // ==========================================

            String url =
                    "http://127.0.0.1:5001/predict/fraud";

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentType(
                    MediaType.APPLICATION_JSON
            );

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(
                            request,
                            headers
                    );

            ResponseEntity<Map> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            entity,
                            Map.class
                    );

            Map body =
                    response.getBody();

            if (body == null) {

                throw new RuntimeException(
                        "Empty response from ML service"
                );
            }

            int fraudPrediction =
                    Integer.parseInt(
                            body.get(
                                    "fraud_prediction"
                            ).toString()
                    );

            // ==========================================
            // RETURN RESULT
            // ==========================================

            if (fraudPrediction == 1) {

                return new FraudResponse(
                        true,
                        "Fraudulent transaction pattern detected by AI model."
                );
            }

            return new FraudResponse(
                    false,
                    "No suspicious activity detected."
            );

        }

        catch (Exception e) {

            return new FraudResponse(
                    true,
                    "Fraud detection service failed: "
                            + e.getMessage()
            );
        }
    }
}