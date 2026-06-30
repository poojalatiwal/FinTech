package backend.FinSight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BudgetSummaryResponse {

    private double totalBudget;

    private double totalSpent;

    private double remainingBudget;

    private int totalCategories;

    private double utilizationPercentage;
}