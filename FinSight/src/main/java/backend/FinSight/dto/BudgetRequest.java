package backend.FinSight.dto;

import lombok.Data;

@Data
public class BudgetRequest {

    private String category;

    private double limitAmount;

    private String month;
}