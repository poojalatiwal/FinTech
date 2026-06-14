
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from sklearn.preprocessing import LabelEncoder

from xgboost import XGBRegressor

# ==========================================
# LOAD DATASET
# ==========================================

data = pd.read_csv(
    "personal_finance_tracker_dataset.csv"
)

print("\n===== DATASET SHAPE =====")
print(data.shape)

print("\n===== COLUMNS =====")
print(data.columns.tolist())

# ==========================================
# FEATURES USED BY SPRING BOOT
# ==========================================

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

target = "actual_savings"

# ==========================================
# VERIFY COLUMNS EXIST
# ==========================================

required_columns = features + [target]

missing_columns = [
    col for col in required_columns
    if col not in data.columns
]

if missing_columns:

    raise Exception(
        f"Missing columns: {missing_columns}"
    )

# ==========================================
# CLEAN NUMERIC COLUMNS
# ==========================================

numeric_columns = [

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

    "rent_or_mortgage",

    "financial_advice_score",

    "actual_savings"
]

for column in numeric_columns:

    data[column] = (
        data[column]
        .astype(str)
        .str.replace(",", "", regex=False)
        .str.replace("₹", "", regex=False)
        .str.replace("%", "", regex=False)
        .str.strip()
    )

    data[column] = pd.to_numeric(
        data[column],
        errors="coerce"
    )

# ==========================================
# ENCODE income_type
# ==========================================

encoders = {}

income_encoder = LabelEncoder()

data["income_type"] = income_encoder.fit_transform(
    data["income_type"].astype(str)
)

encoders["income_type"] = income_encoder

# ==========================================
# REMOVE NULLS ONLY FROM REQUIRED COLUMNS
# ==========================================

data = data.dropna(
    subset=required_columns
)

print("\n===== ROWS AFTER CLEANING =====")
print(len(data))

if len(data) == 0:

    raise Exception(
        "Dataset became empty after cleaning."
    )

# ==========================================
# DEBUG INFO
# ==========================================

print("\n===== FEATURE TYPES =====")
print(data[features].dtypes)

print("\n===== NULL COUNTS =====")
print(
    data[required_columns]
    .isnull()
    .sum()
)

# ==========================================
# X AND Y
# ==========================================

X = data[features]

y = data[target]

print("\n===== FINAL DATA =====")
print("X Shape:", X.shape)
print("Y Shape:", y.shape)

print("\n===== FINAL DTYPES =====")
print(X.dtypes)


# ==========================================
# TRAIN TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(

    X,

    y,

    test_size=0.2,

    random_state=42
)

# ==========================================
# MODEL
# ==========================================

model = XGBRegressor(

    n_estimators=300,

    learning_rate=0.05,

    max_depth=5,

    min_child_weight=3,

    subsample=0.8,

    colsample_bytree=0.8,

    objective="reg:squarederror",

    random_state=42
)

# ==========================================
# TRAIN
# ==========================================

model.fit(
    X_train,
    y_train
)

# ==========================================
# PREDICT
# ==========================================

predictions = model.predict(
    X_test
)

# ==========================================
# METRICS
# ==========================================

mae = mean_absolute_error(
    y_test,
    predictions
)

mse = mean_squared_error(
    y_test,
    predictions
)

rmse = np.sqrt(mse)

r2 = r2_score(
    y_test,
    predictions
)

# ==========================================
# RESULTS
# ==========================================

print("\n===== FORECAST MODEL =====")

print(f"R2 Score : {r2:.4f}")

print(f"MAE : {mae:.2f}")

print(f"MSE : {mse:.2f}")

print(f"RMSE : {rmse:.2f}")

# ==========================================
# SAVE MODEL
# ==========================================

joblib.dump(
    model,
    "expense_forecast_model.pkl"
)

joblib.dump(
    encoders,
    "forecast_encoders.pkl"
)

print("\nMODEL TRAINED SUCCESSFULLY")
print("Saved: expense_forecast_model.pkl")
