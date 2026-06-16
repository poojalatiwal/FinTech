package backend.FinSight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SavingsRecommendationResponse {

    private String category;

    private String suggestion;

    private double estimatedSavings;

    private double probability;

    private boolean goalLikelyToBeMet;
}