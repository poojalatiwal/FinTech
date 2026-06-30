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
    "FinSight_12000Plus_Expense_Forecast_Dataset.csv"
)

print(f"\nRows Loaded : {len(data)}")

# ==========================================
# CLEAN DATA
# ==========================================

data.replace(
    ["", " ", "NULL", "null", "None", "none", "N/A"],
    np.nan,
    inplace=True
)

data = data.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)

# ==========================================
# TARGET
# ==========================================

target = "monthly_expense_total"

# ==========================================
# FEATURES (MATCH SPRING BOOT)
# ==========================================

features = [

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

required_columns = features + [target]

missing = [

    c for c in required_columns
    if c not in data.columns

]

if missing:

    raise Exception(f"Missing Columns : {missing}")

# ==========================================
# NUMERIC COLUMNS
# ==========================================

numeric_columns = [

    "monthly_income",

    "loan_payment",

    "investment_amount",

    "emergency_fund",

    "rent_or_mortgage",

    "subscription_services",

    "transaction_count",

    "debt_to_income_ratio",

    "savings_rate",

    "monthly_expense_total"

]

for col in numeric_columns:

    data[col] = pd.to_numeric(
        data[col],
        errors="coerce"
    )

    data[col] = data[col].fillna(
        data[col].median()
    )

# ==========================================
# CATEGORICAL
# ==========================================

categorical_columns = [

    "income_type",

    "cash_flow_status"

]

encoders = {}

for col in categorical_columns:

    data[col] = data[col].fillna("Unknown")

    encoder = LabelEncoder()

    data[col] = encoder.fit_transform(
        data[col].astype(str)
    )

    encoders[col] = encoder

# ==========================================
# REMOVE NULL TARGET
# ==========================================

data = data.dropna(
    subset=[target]
)

# ==========================================
# TRAIN TEST
# ==========================================

X = data[features]

y = data[target]

print("\nDataset Shape :", X.shape)

X_train, X_test, y_train, y_test = train_test_split(

    X,

    y,

    test_size=0.20,

    random_state=42,

    shuffle=True

)

# ==========================================
# MODEL
# ==========================================

model = XGBRegressor(

    objective="reg:squarederror",

    n_estimators=400,

    learning_rate=0.05,

    max_depth=5,

    min_child_weight=3,

    subsample=0.8,

    colsample_bytree=0.8,

    random_state=42,

    n_jobs=-1

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

r2 = r2_score(
    y_test,
    predictions
)

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        predictions
    )
)

accuracy = round(
    max(0, r2 * 100),
    2
)

# ==========================================
# RESULTS
# ==========================================

print("\n======================================")
print(" EXPENSE FORECAST MODEL")
print("======================================")

print(f"Rows           : {len(data)}")
print(f"Training Rows  : {len(X_train)}")
print(f"Testing Rows   : {len(X_test)}")

print()

print(f"R2 Score  : {r2:.4f}")
print(f"Accuracy  : {accuracy:.2f}%")
print(f"MAE       : ₹{mae:,.2f}")
print(f"RMSE      : ₹{rmse:,.2f}")

# ==========================================
# FEATURE IMPORTANCE
# ==========================================

importance = pd.DataFrame({

    "Feature": features,

    "Importance": model.feature_importances_

})

importance = importance.sort_values(

    by="Importance",

    ascending=False

)

print("\n======================================")
print(" FEATURE IMPORTANCE")
print("======================================")

print(
    importance.to_string(index=False)
)

importance.to_csv(

    "feature_importance.csv",

    index=False

)

# ==========================================
# SAVE
# ==========================================

joblib.dump(

    model,

    "expense_forecast_model.pkl"

)

joblib.dump(

    encoders,

    "expense_forecast_encoders.pkl"

)

metrics = {

    "accuracy": accuracy,

    "r2": float(r2),

    "mae": float(mae),

    "rmse": float(rmse)

}

joblib.dump(

    metrics,

    "expense_metrics.pkl"

)

print("\n======================================")
print("FILES SAVED")
print("======================================")

print("expense_forecast_model.pkl")
print("expense_forecast_encoders.pkl")
print("expense_metrics.pkl")
print("feature_importance.csv")

print("\nExpense Forecast Model Saved Successfully")