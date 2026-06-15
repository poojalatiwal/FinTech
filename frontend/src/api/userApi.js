import API from "./axios";

// Financial Profile
export const getFinancialProfile = () =>
  API.get("/user/financial-profile");

// Update Financial Profile
export const updateFinancialProfile = (
  profileData
) =>
  API.put(
    "/user/financial-profile",
    profileData
  );