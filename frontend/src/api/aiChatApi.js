import API from "./axios";

export const askAI = async (message) => {

    const response = await API.post(
        "/ai/chat",
        {
            message
        }
    );

    return response.data;
};