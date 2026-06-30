from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

# ==========================================
# MongoDB Connection
# ==========================================

MONGO_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]

# ==========================================
# Collections
# ==========================================

expenses = db["expenses"]
budgets = db["budgets"]
users = db["users"]
notifications = db["notifications"]

print("✅ MongoDB Connected")
print(f"Database : {DATABASE_NAME}")