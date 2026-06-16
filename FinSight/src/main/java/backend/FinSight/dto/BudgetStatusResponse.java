package backend.FinSight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BudgetStatusResponse {

    private String category;

    private double budget;

    private double spent;

    private double remaining;

    private String status;
}