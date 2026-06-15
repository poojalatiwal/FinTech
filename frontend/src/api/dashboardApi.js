import API from "./axios";

// Dashboard
export const getDashboard = async () => {
  return await API.get("/dashboard");
};