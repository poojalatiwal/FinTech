package backend.FinSight.model;

import lombok.*;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    // =====================================
    // BASIC INFO
    // =====================================

    private String name;

    private String username;

    private String email;

    private String password;

    private String role;

    // =====================================
    // USER INPUT FINANCIAL DATA
    // =====================================

    private double monthlyIncome;

    private double loanPayment;

    private double investmentAmount;

    private double emergencyFund;

    private double rentOrMortgage;

    private int subscriptionServices;

    // 0 = salaried
    // 1 = business
    // 2 = freelance
    private int incomeType;

    // User monthly saving target
    private double budgetGoal;
}

