import pandas as pd

import joblib

from sklearn.model_selection import train_test_split

from sklearn.preprocessing import LabelEncoder

from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import accuracy_score
from sklearn.metrics import r2_score
from sklearn.metrics import classification_report

# =========================
# LOAD DATASET
# =========================

data = pd.read_csv(
    "personal_finance_tracker_dataset.csv"
)

# =========================
# ENCODERS
# =========================

income_encoder = LabelEncoder()
scenario_encoder = LabelEncoder()
cashflow_encoder = LabelEncoder()

data["income_type"] = (
    income_encoder.fit_transform(
        data["income_type"]
    )
)

data["financial_scenario"] = (
    scenario_encoder.fit_transform(
        data["financial_scenario"]
    )
)

data["cash_flow_status"] = (
    cashflow_encoder.fit_transform(
        data["cash_flow_status"]
    )
)

# =========================
# FEATURES
# =========================

features = [

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

X = data[features]


# ==================================================
# MODEL 1 — FINANCIAL STRESS PREDICTION
# ==================================================

stress_encoder = LabelEncoder()

y_stress = stress_encoder.fit_transform(
    data["financial_stress_level"]
)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_stress,
    test_size=0.2,
    random_state=42,
    stratify=y_stress
)

stress_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    class_weight="balanced",
    random_state=42
)

stress_model.fit(
    X_train,
    y_train
)

stress_pred = stress_model.predict(
    X_test
)

stress_accuracy = accuracy_score(
    y_test,
    stress_pred
)

print("\n===== FINANCIAL STRESS MODEL =====")

print(
    f"Accuracy: {stress_accuracy * 100:.2f}%"
)

print(
    classification_report(
        y_test,
        stress_pred
    )
)

joblib.dump(
    stress_model,
    "stress_model.pkl"
)



# ==================================================
# MODEL 2 — FRAUD DETECTION
# ==================================================

y_fraud = data["fraud_flag"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_fraud,
    test_size=0.2,
    random_state=42
)

fraud_model = RandomForestClassifier()

fraud_model.fit(
    X_train,
    y_train
)

fraud_pred = fraud_model.predict(
    X_test
)

fraud_accuracy = accuracy_score(
    y_test,
    fraud_pred
)

print("\n===== FRAUD MODEL =====")

print(
    f"Accuracy: {fraud_accuracy * 100:.2f}%"
)

joblib.dump(
    fraud_model,
    "fraud_model.pkl"
)

# ==================================================
# MODEL 3 — SAVINGS GOAL PREDICTION
# ==================================================

y_savings = data["savings_goal_met"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_savings,
    test_size=0.2,
    random_state=42
)

savings_model = RandomForestClassifier()

savings_model.fit(
    X_train,
    y_train
)

savings_pred = savings_model.predict(
    X_test
)

savings_accuracy = accuracy_score(
    y_test,
    savings_pred
)

print("\n===== SAVINGS MODEL =====")

print(
    f"Accuracy: {savings_accuracy * 100:.2f}%"
)

joblib.dump(
    savings_model,
    "savings_model.pkl"
)
