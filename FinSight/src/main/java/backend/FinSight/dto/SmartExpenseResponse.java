package backend.FinSight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SmartExpenseResponse {

    private String detectedType;

    private String title;

    private double amount;

    private String category;

    private String insight;

    private String translatedInsight;
}