import API from "./axios";

export const downloadFinancialReport = async () => {
  const response = await API.get(
    "/reports/pdf",
    {
      responseType: "blob",
    }
  );

  return response.data;
};

export const downloadMonthlyReport = async (
  month,
  year
) => {

  const response = await API.get(
    `/reports/pdf/monthly?month=${month}&year=${year}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};