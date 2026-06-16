package backend.FinSight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FinancialStabilityResponse {

    private String financialStatus;

    private double stabilityScore;

    private double savingsRate;

    private double debtRatio;

    private String message;
}