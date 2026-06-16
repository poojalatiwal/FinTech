package backend.FinSight.dto;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
public class GoalResponse {

    private String goalName;

    private double targetAmount;

    private int months;

    private double monthlySavingRequired;

    private String advice;
}

