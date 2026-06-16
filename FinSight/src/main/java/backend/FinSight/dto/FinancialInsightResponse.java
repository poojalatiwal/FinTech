package backend.FinSight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FinancialInsightResponse {

    private String message;

    private String status;
}