package backend.FinSight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnomalyResponse {

    private boolean anomalyDetected;

    private String warning;

    private double averageExpense;

    private double currentExpense;
}