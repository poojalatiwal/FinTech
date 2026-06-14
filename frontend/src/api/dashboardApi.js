import API from "./axios";

export const getDashboard = async () => {
  return await API.get("/dashboard");
};