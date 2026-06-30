from flask import Flask, request, jsonify

from flask_cors import CORS

import pandas as pd

import joblib

# ==========================================
# CREATE APP
# ==========================================

app = Flask(__name__)

CORS(app)

# ==========================================
# LOAD MODELS
# ==========================================

fraud_model = joblib.load(
    "fraud_model.pkl"
)

credit_model = joblib.load(
    "credit_risk_model.pkl"
)

savings_model = joblib.load(
    "savings_model.pkl"
)
expense_metrics = joblib.load(
    "expense_metrics.pkl"
)
expense_model = joblib.load(
    "expense_forecast_model.pkl"
)

expense_encoders = joblib.load(
    "expense_forecast_encoders.pkl"
)

forecast_model = joblib.load(
    "expense_forecast_model.pkl"
)
# ==========================================
# HOME ROUTE
# ==========================================

@app.route("/", methods=["GET"])

def home():

    return jsonify({

        "success": True,

        "message":
        "FinSight ML API Running"
    })

# ==========================================
# FRAUD DETECTION
# ==========================================
@app.route("/predict/fraud", methods=["POST"])
def predict_fraud():

    try:

        data = request.get_json()

        print("Fraud Input:", data)

        feature_order = [

            "monthly_income",

            "monthly_expense_total",

            "savings_rate",

            "debt_to_income_ratio",

            "loan_payment",

            "investment_amount",

            "subscription_services",

            "emergency_fund",

            "transaction_count",

            "discretionary_spending",

            "essential_spending",

            "income_type",

            "rent_or_mortgage",

            "financial_advice_score"
        ]

        df = pd.DataFrame([data])

        df = df[feature_order]

        prediction = fraud_model.predict(df)

        return jsonify({

            "success": True,

            "fraud_prediction": int(prediction[0])
        })

    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)
        }), 500

# ==========================================
# CREDIT RISK
# ==========================================

@app.route(
    "/predict/credit",
    methods=["GET", "POST"]
)

def predict_credit():

    if request.method == "GET":

        return jsonify({

            "success": True,

            "message":
            "Credit Risk API Working"
        })

    try:

        data = request.get_json(force=True)

        print("Credit Input:", data)

        df = pd.DataFrame([data])

        prediction = credit_model.predict(df)

        result = int(prediction[0])

        return jsonify({

            "success": True,

            "credit_risk": result
        })

    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)
        }), 500


# ==========================================
# SAVINGS GOAL
# ==========================================
@app.route(
    "/predict/savings",
    methods=["GET", "POST"]
)
def predict_savings():

    if request.method == "GET":

        return jsonify({
            "success": True,
            "message": "Savings Prediction API Working"
        })

    try:

        data = request.get_json(force=True)

        print("Savings Input:", data)

        feature_order = [

            "monthly_income",

            "monthly_expense_total",

            "savings_rate",

            "debt_to_income_ratio",

            "loan_payment",

            "investment_amount",

            "subscription_services",

            "emergency_fund",

            "transaction_count",

            "discretionary_spending",

            "essential_spending",

            "income_type",

            "rent_or_mortgage",

            "financial_advice_score"
        ]

        df = pd.DataFrame([data])

        # VERY IMPORTANT
        df = df[feature_order]

        prediction = savings_model.predict(df)

        result = int(prediction[0])

        return jsonify({
            "success": True,
            "savings_goal": result
        })

    except Exception as e:

        print("SAVINGS ERROR:", str(e))

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
        
# ==========================================
# EXPENSE FORECAST
# ==========================================

@app.route(
    "/predict/expense",
    methods=["GET", "POST"]
)
def predict_expense():

    if request.method == "GET":

        return jsonify({

            "success": True,

            "message": "Expense Forecast API Working"

        })

    try:

        data = request.get_json(force=True)

        print("Expense Input :", data)

        feature_order = [

            "monthly_income",

            "loan_payment",

            "investment_amount",

            "emergency_fund",

            "rent_or_mortgage",

            "subscription_services",

            "transaction_count",

            "debt_to_income_ratio",

            "savings_rate",

            "income_type",

            "cash_flow_status"

        ]

        df = pd.DataFrame([data])

        # ======================================
        # Encode income_type
        # ======================================

        encoder = expense_encoders["income_type"]

        value = str(df.loc[0, "income_type"])

        if value not in encoder.classes_:

            value = "Unknown" if "Unknown" in encoder.classes_ else encoder.classes_[0]

        df["income_type"] = encoder.transform([value])

        # ======================================
        # Encode cash_flow_status
        # ======================================

        encoder = expense_encoders["cash_flow_status"]

        value = str(df.loc[0, "cash_flow_status"])

        if value not in encoder.classes_:

            value = "Unknown" if "Unknown" in encoder.classes_ else encoder.classes_[0]

        df["cash_flow_status"] = encoder.transform([value])

        # ======================================
        # Reorder Features
        # ======================================

        df = df[feature_order]

        # ======================================
        # Prediction
        # ======================================

        prediction = forecast_model.predict(df)

        predicted_expense = round(
            float(prediction[0]),
            2
        )

        confidence = round(
            float(expense_metrics["accuracy"]),
            2
        )

        return jsonify({

            "success": True,

            "forecast_amount": predicted_expense,

            "confidence": confidence

        })

    except Exception as e:

        print("EXPENSE ERROR :", str(e))

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500
# ==========================================
# RUN APPLICATION
# ==========================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5001,

        debug=True
    )
