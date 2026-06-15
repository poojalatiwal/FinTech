import API from "./axios";

// Ai chat
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