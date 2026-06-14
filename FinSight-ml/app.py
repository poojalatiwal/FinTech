from fastapi import FastAPI

import joblib

import numpy as np

app = FastAPI()

# =========================
# LOAD MODELS
# =========================

stress_model = joblib.load(
    "stress_model.pkl"
)

fraud_model = joblib.load(
    "fraud_model.pkl"
)

savings_model = joblib.load(
    "savings_model.pkl"
)

credit_model = joblib.load(
    "credit_model.pkl"
)

# =========================
# SAMPLE INPUT FORMAT
# =========================

def create_input():

    return np.array([[
        50000,
        30000,
        20,
        0.3,
        5000,
        10000,
        5,
        20000,
        100,
        8000,
        22000,
        1,
        15000,
        7
    ]])

# ==================================================
# FINANCIAL STRESS
# ==================================================

@app.get("/predict/stress")

def predict_stress():

    prediction = stress_model.predict(
        create_input()
    )

    return {
        "financial_stress_level":
            int(prediction[0])
    }

# ==================================================
# FRAUD
# ==================================================

@app.get("/predict/fraud")

def predict_fraud():

    prediction = fraud_model.predict(
        create_input()
    )

    return {
        "fraud_detected":
            bool(prediction[0])
    }

# ==================================================
# SAVINGS
# ==================================================

@app.get("/predict/savings")

def predict_savings():

    prediction = savings_model.predict(
        create_input()
    )

    return {
        "savings_goal_met":
            bool(prediction[0])
    }

# ==================================================
# CREDIT SCORE
# ==================================================

@app.get("/predict/credit")

def predict_credit():

    prediction = credit_model.predict(
        create_input()
    )

    return {
        "predicted_credit_score":
            round(float(prediction[0]), 2)
    }

