import API from "./axios";

export const getFinancialHealth =
  async () => {

    return await API.get(
      "/health"
    );
  };