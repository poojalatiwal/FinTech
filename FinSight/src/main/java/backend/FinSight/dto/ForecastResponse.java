package backend.FinSight.dto;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
public class ForecastResponse {

    private double predictedExpense;

    private String message;
}
