package backend.FinSight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FinancialHealthResponse {

    private int score;

    private String status;

    private String advice;
}