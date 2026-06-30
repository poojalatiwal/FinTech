package backend.FinSight.dto;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
public class ForecastResponse {

    private double predictedExpense;

    private double spendingTrend;

    private double forecastAccuracy;

    private String message;
    private String trendReason;
    private String trendExplanation;
    private String forecastExplanation;
}
