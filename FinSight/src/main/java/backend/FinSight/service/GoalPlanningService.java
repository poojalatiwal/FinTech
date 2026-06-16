package backend.FinSight.service;

import backend.FinSight.dto.GoalResponse;

import org.springframework.stereotype.Service;

@Service
public class GoalPlanningService {

    public GoalResponse planGoal(
            String goalName,
            double targetAmount,
            int months
    ) {

        double monthlySaving =
                targetAmount / months;

        String advice;

        // AI ADVICE

        if (monthlySaving > 20000) {

            advice =
                    "Goal is aggressive. Reduce unnecessary spending and increase income sources.";

        } else if (monthlySaving > 10000) {

            advice =
                    "You need disciplined monthly savings to achieve this goal.";

        } else {

            advice =
                    "Goal looks achievable with your current savings pace.";
        }

        return new GoalResponse(
                goalName,
                targetAmount,
                months,
                monthlySaving,
                advice
        );
    }
}
