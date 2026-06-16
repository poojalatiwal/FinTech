package backend.FinSight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PredictionResponse {

    private double predictedExpense;

    private String message;
}