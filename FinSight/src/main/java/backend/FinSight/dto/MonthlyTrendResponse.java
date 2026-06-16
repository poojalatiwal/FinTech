package backend.FinSight.dto;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyTrendResponse {

    private String month;

    private double amount;
}
