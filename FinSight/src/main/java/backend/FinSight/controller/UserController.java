package backend.FinSight.controller;

import backend.FinSight.dto.FinancialProfileRequest;

import backend.FinSight.model.User;

import backend.FinSight.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // =====================================
    // UPDATE FINANCIAL PROFILE
    // =====================================

    @PutMapping("/financial-profile")
    public User updateFinancialProfile(

            @RequestBody
            FinancialProfileRequest request,

            Authentication authentication
    ) {

        // =====================================
        // GET LOGGED IN USER
        // =====================================

        String username =
                authentication.getName();

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->

                                new RuntimeException(
                                        "User not found"
                                )
                        );

        // =====================================
        // UPDATE FINANCIAL DATA
        // =====================================

        user.setMonthlyIncome(
                request.getMonthlyIncome()
        );

        user.setLoanPayment(
                request.getLoanPayment()
        );

        user.setInvestmentAmount(
                request.getInvestmentAmount()
        );

        user.setEmergencyFund(
                request.getEmergencyFund()
        );

        user.setRentOrMortgage(
                request.getRentOrMortgage()
        );

        user.setSubscriptionServices(
                request.getSubscriptionServices()
        );

        user.setIncomeType(
                request.getIncomeType()
        );

        user.setBudgetGoal(
                request.getBudgetGoal()
        );

        // =====================================
        // SAVE USER
        // =====================================

        return userRepository.save(user);
    }

    // =====================================
    // GET FINANCIAL PROFILE
    // =====================================

    @GetMapping("/financial-profile")
    public User getFinancialProfile(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }
}

