package backend.FinSight.dto;

import lombok.Data;

@Data
public class GoalRequest {

    private String goalName;

    private double targetAmount;

    private int months;
}
