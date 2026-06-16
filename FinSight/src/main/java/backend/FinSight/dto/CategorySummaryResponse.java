package backend.FinSight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategorySummaryResponse {

    private String category;

    private double totalAmount;

    private int totalTransactions;
}