package backend.FinSight.dto;

import lombok.Data;

@Data
public class FinancialProfileRequest {

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

    // Monthly saving target
    private double budgetGoal;
}
