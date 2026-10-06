import { createContext, useContext, useState } from "react";

const QuizContext = createContext();

const shuffleOnce = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const QuizProvider = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const startQuiz = (quiz) => {
    // Shuffle options ONE time when the attempt starts. The order is then
    // fixed for the whole attempt and re-renders never reorder them.
    const fixedQuiz = quiz
      ? {
          ...quiz,
          questions: (quiz.questions || []).map((question) => ({
            ...question,
            options: shuffleOnce(question.options || []),
          })),
        }
      : null;
    setCurrentQuiz(fixedQuiz);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const selectAnswer = (questionIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const nextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
  };

  const prevQuestion = () => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
  };

  return (
    <QuizContext.Provider
      value={{
        currentQuiz,
        currentQuestion,
        answers,
        startQuiz,
        selectAnswer,
        nextQuestion,
        prevQuestion,
        goToQuestion,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  return useContext(QuizContext);
};
