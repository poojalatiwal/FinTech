package backend.FinSight.dto;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;

    private long totalExpenses;

    private long totalBudgets;

    private long fraudCases;
}

