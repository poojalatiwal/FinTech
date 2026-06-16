package backend.FinSight.dto;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {

    // FINANCIAL HEALTH

    private int healthScore;

    private String healthStatus;

    private String healthAdvice;

    // STABILITY

    private String stabilityStatus;

    private double debtRatio;

    private String stabilityMessage;

    // FORECAST

    private double predictedExpense;

    private String forecastMessage;

    // FRAUD

    private boolean fraudDetected;

    private String fraudMessage;

    // SAVINGS

    private String savingsCategory;

    private String savingsSuggestion;

    private double estimatedSavings;
}
