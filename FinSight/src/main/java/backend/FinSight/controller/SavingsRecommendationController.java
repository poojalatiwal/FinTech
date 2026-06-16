package backend.FinSight.controller;

import backend.FinSight.dto.SavingsRecommendationResponse;
import backend.FinSight.model.User;
import backend.FinSight.repository.UserRepository;
import backend.FinSight.service.SavingsRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/recommendation")
public class SavingsRecommendationController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SavingsRecommendationService
            savingsRecommendationService;

    @GetMapping
    public SavingsRecommendationResponse getRecommendation(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        User user =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        return savingsRecommendationService
                .getRecommendation(user.getId());
    }
}