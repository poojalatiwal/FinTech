import API from "./axios";

// REGISTER USER
export const registerUser = (data) =>
  API.post(
    "/auth/register",
    data
  );

  // LOGIN USER
export const loginUser = (data) =>
  API.post(
    "/auth/manual-login",
    data
  );

// GOOGLE LOGIN
export const googleLogin = () => {
  window.location.href =
    "http://localhost:8080/oauth2/authorization/google";
};

// FORGOT PASSWORD
export const forgotPassword = (data) =>
  API.post(
    "/auth/forgot-password",
    data
  );

