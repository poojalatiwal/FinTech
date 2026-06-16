package backend.FinSight.service;

import backend.FinSight.dto.DashboardResponse;

import backend.FinSight.dto.FinancialHealthResponse;
import backend.FinSight.dto.FinancialStabilityResponse;
import backend.FinSight.dto.ForecastResponse;
import backend.FinSight.dto.FraudResponse;
import backend.FinSight.dto.SavingsRecommendationResponse;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private FinancialHealthService
            financialHealthService;

    @Autowired
    private FinancialStabilityService
            financialStabilityService;

    @Autowired
    private ForecastService
            forecastService;

    @Autowired
    private FraudDetectionService
            fraudDetectionService;

    @Autowired
    private SavingsRecommendationService
            savingsRecommendationService;

    public DashboardResponse getDashboard(
            String userId
    ) {

        // =========================
        // FINANCIAL HEALTH
        // =========================

        FinancialHealthResponse health =
                financialHealthService
                        .calculateHealthScore(userId);

        // =========================
        // FINANCIAL STABILITY
        // =========================

        FinancialStabilityResponse stability =
                financialStabilityService
                        .analyzeFinancialHealth(
                                userId
                        );

        // =========================
        // FORECAST
        // =========================

        ForecastResponse forecast =
                forecastService
                        .forecastExpenses(userId);

        // =========================
        // FRAUD DETECTION
        // =========================

        FraudResponse fraud =
                fraudDetectionService
                        .detectFraud(userId);

        // =========================
        // SAVINGS RECOMMENDATION
        // =========================

        SavingsRecommendationResponse savings =
                savingsRecommendationService
                        .getRecommendation(userId);

        // =========================
        // FINAL DASHBOARD RESPONSE
        // =========================

        return new DashboardResponse(

                // HEALTH

                health.getScore(),
                health.getStatus(),
                health.getAdvice(),

                // STABILITY

                stability.getFinancialStatus(),
                stability.getStabilityScore(),
                stability.getMessage(),
                // FORECAST

                forecast.getPredictedExpense(),
                forecast.getMessage(),

                // FRAUD

                fraud.isFraud(),
                fraud.getMessage(),

                // SAVINGS

                savings.getCategory(),
                savings.getSuggestion(),
                savings.getEstimatedSavings()
        );
    }
}

