import API from "./axios";

export const getAnomalies = async () => {

  const response =
    await API.get("/anomaly");

  return response.data;
};