package backend.FinSight.dto;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
public class ChatResponse {

    private String message;

    private String forecastExplanation;

    private String trendReason;

    private String trendExplanation;
}
