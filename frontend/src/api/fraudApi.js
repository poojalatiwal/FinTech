import API from "./axios";

export const getFraudAlerts = async () => {

  const response =
    await API.get("/fraud/check");

  return response.data;
};