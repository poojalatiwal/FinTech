import API from "./axios";

export const registerUser = (data) =>
  API.post(
    "/auth/register",
    data
  );

export const loginUser = (data) =>
  API.post(
    "/auth/manual-login",
    data
  );


export const googleLogin = () => {
  window.location.href =
    "http://localhost:8080/oauth2/authorization/google";
};

export const forgotPassword = (data) =>
  API.post(
    "/auth/forgot-password",
    data
  );

