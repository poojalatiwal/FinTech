package backend.FinSight.dto;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
public class FraudResponse {

    private boolean fraud;

    private String message;
}