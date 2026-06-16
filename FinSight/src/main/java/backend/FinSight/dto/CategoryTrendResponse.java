package backend.FinSight.dto;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryTrendResponse {

    private String month;

    private String category;

    private double amount;
}

