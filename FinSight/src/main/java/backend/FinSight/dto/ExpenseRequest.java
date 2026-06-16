package backend.FinSight.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ExpenseRequest {

    private String title;

    private double amount;

    private String category;

    private boolean debtRelated;

    private String description;

    private LocalDate date;
}