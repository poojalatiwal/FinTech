import API from "./axios";

export const askAI = async (
  message
) => {

  return await API.post(
    "/ai/chat",
    {
      message
    }
  );
};