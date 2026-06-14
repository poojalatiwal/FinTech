import API from "./axios";

export const getFinancialProfile = () =>
  API.get("/user/financial-profile");

export const updateFinancialProfile = (
  profileData
) =>
  API.put(
    "/user/financial-profile",
    profileData
  );