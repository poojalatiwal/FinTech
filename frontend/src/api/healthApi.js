import API from "./axios";

// Financial Health
export const getFinancialHealth =
  async () => {

    return await API.get(
      "/health"
    );
  };