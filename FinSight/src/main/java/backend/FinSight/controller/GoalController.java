package backend.FinSight.controller;

import backend.FinSight.dto.GoalRequest;

import backend.FinSight.dto.GoalResponse;

import backend.FinSight.service.GoalPlanningService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/goals")
public class GoalController {

    @Autowired
    private GoalPlanningService goalPlanningService;

    @PostMapping("/plan")
    public GoalResponse planGoal(
            @RequestBody GoalRequest request
    ) {

        return goalPlanningService.planGoal(
                request.getGoalName(),
                request.getTargetAmount(),
                request.getMonths()
        );
    }
}

