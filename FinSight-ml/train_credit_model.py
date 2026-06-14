import pandas as pd

import joblib

from sklearn.model_selection import train_test_split

from sklearn.preprocessing import LabelEncoder

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report
)


data = pd.read_csv(
    "Loan.csv"
)


# CREATE RISK CATEGORY
def classify_risk(score):

    if score < 40:
        return "HIGH_RISK"

    elif score < 70:
        return "MEDIUM_RISK"

    else:
        return "LOW_RISK"

data["risk_category"] = (
    data["RiskScore"]
    .apply(classify_risk)
)


categorical_columns = [

    "EmploymentStatus",

    "EducationLevel",

    "MaritalStatus",

    "HomeOwnershipStatus",

    "LoanPurpose"
]

encoders = {}

for column in categorical_columns:

    encoder = LabelEncoder()

    data[column] = encoder.fit_transform(
        data[column]
    )

    encoders[column] = encoder

features = [

    "Age",
    "AnnualIncome",
    "CreditScore",
    "Experience",
    "LoanAmount",
    "LoanDuration",
    "MonthlyDebtPayments",
    "CreditCardUtilizationRate",
    "NumberOfOpenCreditLines",
    "DebtToIncomeRatio",
    "PaymentHistory",
    "LengthOfCreditHistory",
    "SavingsAccountBalance",
    "CheckingAccountBalance",
    "TotalAssets",
    "TotalLiabilities",
    "MonthlyIncome",
    "JobTenure",
    "NetWorth",
    "InterestRate",
    "MonthlyLoanPayment",
    "TotalDebtToIncomeRatio",
    "EmploymentStatus",
    "EducationLevel",
    "MaritalStatus",
    "HomeOwnershipStatus",
    "LoanPurpose"
]

X = data[features]

# TARGET
risk_encoder = LabelEncoder()

y = risk_encoder.fit_transform(
    data["risk_category"]
)

# TRAIN TEST SPLIT
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# MODEL

model = RandomForestClassifier(

    n_estimators=300,

    max_depth=12,

    class_weight="balanced",

    random_state=42
)


model.fit(
    X_train,
    y_train
)

predictions = model.predict(
    X_test
)

accuracy = accuracy_score(
    y_test,
    predictions
)


print(
    f"Accuracy: {accuracy * 100:.2f}%"
)

print(
    classification_report(
        y_test,
        predictions,
        zero_division=0
    )
)

# ==========================================
# SAVE MODEL
# ==========================================

joblib.dump(
    model,
    "credit_risk_model.pkl"
)

joblib.dump(
    risk_encoder,
    "risk_encoder.pkl"
)

joblib.dump(
    encoders,
    "categorical_encoders.pkl"
)

print("\nMODEL TRAINED SUCCESSFULLY")
