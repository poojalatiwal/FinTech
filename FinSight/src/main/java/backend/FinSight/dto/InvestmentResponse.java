package backend.FinSight.dto;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
public class InvestmentResponse {

    private String risk;

    private String suggestion;
}

