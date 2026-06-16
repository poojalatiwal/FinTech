package backend.FinSight.dto;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
public class RecurringExpenseResponse {

    private String title;

    private double amount;

    private String message;
}
