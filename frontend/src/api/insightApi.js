import API from "./axios";

// Insights
export const getCategoryInsight = (
  category,
  month
) => API.get(`/insights/${category}/${month}` );

export const getInsight = () =>
  API.get("/insights");