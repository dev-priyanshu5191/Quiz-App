import api from "./api";

export const getProfile = async () => {
  return api.get("/users/profile");
};

export const saveQuizResult = async (resultData) => {
  return api.post("/users/quiz-result", resultData);
};