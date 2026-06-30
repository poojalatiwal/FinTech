import API from "./axios";

export const planGoal = (data) =>
    API.post("/goals/plan", data);