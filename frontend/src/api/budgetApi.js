import API from "./axios";

// Get Budget
export const getBudgets = () =>
  API.get("/budget");

//Create Budget
export const createBudget = (
  data
) =>
  API.post("/budget", data);

  // Update Budget
export const updateBudget = (
  id,
  data
) =>
  API.put(`/budget/${id}`, data);

  // Delete Budget
export const deleteBudget = (
  id
) =>
  API.delete(`/budget/${id}`);