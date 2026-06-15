import API from "./axios";

// GET ALL EXPENSES
export const getExpenses = () =>
  API.get("/expenses");

// GET SUMMARY
export const getExpenseSummary = () =>
  API.get("/expenses/summary");

// ADD EXPENSE
export const addExpense = (data) =>
  API.post("/expenses", data);

// UPDATE EXPENSE
export const updateExpense = (id, data) =>
  API.put(`/expenses/${id}`, data);

// DELETE EXPENSE
export const deleteExpense = (id) =>
  API.delete(`/expenses/${id}`);

// RECENT EXPENSES
export const getRecentExpenses = () =>
  API.get("/expenses/recent");

// MONTHLY EXPENSES
export const getMonthlyExpenses = () =>
  API.get("/expenses/monthly");

// CATEGORY SUMMARY
export const getCategorySummary = (category) =>
  API.get(`/expenses/category-summary/${category}`);

// TOTAL
export const getTotalExpenses = () =>
  API.get("/expenses/total");

  // CATEGORY TRENDS
export const getCategoryTrends = async() =>{
    return await API.get("/category-trends");
}

// MONTHLY TREND
export const getMonthlyTrend = () =>
  API.get("/trends/monthly");


// expense forecast
export const getForecast = () =>
  API.get("/forecast");

// financial stability
export const getFinancialStability =
  () => API.get("/financial-health");