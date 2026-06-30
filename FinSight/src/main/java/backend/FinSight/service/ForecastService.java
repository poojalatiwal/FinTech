package backend.FinSight.service;

import backend.FinSight.dto.ChatResponse;
import backend.FinSight.dto.ForecastResponse;
import backend.FinSight.model.Expense;
import backend.FinSight.model.User;
import backend.FinSight.repository.ExpenseRepository;
import backend.FinSight.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ForecastService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AIChatService aiChatService;

    @Autowired
    private FinancialHealthService financialHealthService;

    private final WebClient webClient =
            WebClient.create(
                    "http://127.0.0.1:5001"
            );

    // =====================================
    // FORECAST EXPENSES
    // =====================================

    public ForecastResponse forecastExpenses(
            String username
    ) {

        try {

            // =====================================
            // FIND USER
            // =====================================

            User user =
                    userRepository
                            .findByUsername(username)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            // =====================================
            // GET CURRENT MONTH EXPENSES
            // =====================================

            LocalDate now = LocalDate.now();

            LocalDate startDate =
                    now.withDayOfMonth(1);

            LocalDate endDate =
                    now.withDayOfMonth(
                            now.lengthOfMonth()
                    );

            List<Expense> expenses =
                    expenseRepository
                            .findByUserIdAndDateBetween(
                                    user.getId(),
                                    startDate,
                                    endDate
                            );

            // =====================================
            // NO DATA
            // =====================================

            if (expenses.isEmpty()) {

                return new ForecastResponse(
                        0,
                        0,
                        0,
                        "No expense data available.",
                        "Add a few expenses to generate an AI forecast.",
                        "No spending trend available.",
                        "More expense history is required before a trend can be calculated."
                );
            }

            // =====================================
            // CALCULATE ANALYTICS
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

                // =====================================
                // ESSENTIAL SPENDING
                // =====================================

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

                // =====================================
                // DISCRETIONARY SPENDING
                // =====================================

                else {

                    discretionarySpending +=
                            expense.getAmount();
                }
            }

            // =====================================
            // CALCULATE FINANCIAL METRICS
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

            String cashFlowStatus =
                    financialHealthService
                            .calculateCashFlowStatus(
                                    user
                            );

            // =====================================
            // PREPARE ML REQUEST
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

            request.put(
                    "cash_flow_status",
                    cashFlowStatus
            );

            request.put(
                    "current_month",
                    now.getMonthValue()
            );

            request.put(
                    "current_year",
                    now.getYear()
            );

            // =====================================
            // CALL ML API
            // =====================================

            Map response =
                    webClient.post()

                            .uri("/predict/expense")

                            .bodyValue(request)

                            .retrieve()

                            .bodyToMono(Map.class)

                            .block();

            // =====================================
            // GET PREDICTION
            // =====================================

            double predictedExpense =
                    Double.parseDouble(
                            response.get(
                                    "forecast_amount"
                            ).toString()
                    );

// SPENDING TREND

            double spendingTrend = 0;

            if (totalExpense > 0) {

                spendingTrend =
                        ((predictedExpense - totalExpense)
                                / totalExpense) * 100;
            }

// FORECAST ACCURACY

            double forecastAccuracy = 0;

            if (response.get("confidence") != null) {

                forecastAccuracy =
                        Double.parseDouble(
                                response.get("confidence")
                                        .toString()
                        );
            }

            String prompt = String.format("""
You are a professional financial advisor.

A user's financial information is:

Monthly Income: ₹%.2f
Current Month Expense: ₹%.2f
Predicted Expense Next Month: ₹%.2f
Savings Rate: %.2f%%
Debt To Income Ratio: %.2f%%
Transaction Count: %d
Cash Flow Status: %s
Forecast Accuracy: %.2f%%
Spending Trend: %.2f%%

Return ONLY valid JSON.

{
  "message":"",
  "forecastExplanation":"",
  "trendReason":"",
  "trendExplanation":""
}

Rules:

message:
Maximum 10 words.

forecastExplanation:
Explain why the predicted expense is reasonable.

trendReason:
Explain whether spending is increasing or decreasing.

trendExplanation:
Explain what this means for the user's financial health and give practical advice.

Do not use markdown.
Return only JSON.
""",
                    user.getMonthlyIncome(),
                    totalExpense,
                    predictedExpense,
                    savingsRate,
                    debtRatio,
                    transactionCount,
                    cashFlowStatus,
                    forecastAccuracy,
                    spendingTrend);

            ChatResponse aiResponse =
                    aiChatService.getReply(prompt);

            String message = aiResponse.getMessage();

            String forecastExplanation =
                    aiResponse.getForecastExplanation();

            String trendReason =
                    aiResponse.getTrendReason();

            String trendExplanation =
                    aiResponse.getTrendExplanation();

            // RETURN RESPONSE

            return new ForecastResponse(
                    predictedExpense,
                    Math.round(spendingTrend * 10.0) / 10.0,
                    forecastAccuracy,
                    message,
                    forecastExplanation,
                    trendReason,
                    trendExplanation
            );

        }

        catch (Exception e) {

            return new ForecastResponse(
                    0,
                    0,
                    0,
                    "Forecast unavailable.",
                    "Unable to generate forecast analysis.",
                    "Unable to calculate spending trend.",
                    "Please add more expense data and try again."
            );
        }
    }
}

