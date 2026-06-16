package backend.FinSight.dto;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
public class AnalyticsResponse {

    private String category;

    private double amount;
}
