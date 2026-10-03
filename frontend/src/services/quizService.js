import api from "./api";

export const getQuizzes = async () => {
  return api.get("/quizzes");
};

export const createQuiz = async (quizData) => {
  return api.post("/quizzes", quizData);
};