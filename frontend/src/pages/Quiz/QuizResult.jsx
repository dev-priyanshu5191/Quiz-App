import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import useQuiz from "../../hooks/useQuiz";
import { saveQuizResult } from "../../services/userService";

function performanceMessage(percentage) {
  if (percentage >= 90) return "Outstanding performance!";
  if (percentage >= 70) return "Strong work.";
  if (percentage >= 50) return "Good effort — keep practicing.";
  return "Keep going — review and try again.";
}

function QuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { currentQuiz, answers, resetQuiz } = useQuiz();
  const quiz = state?.quiz || currentQuiz;
  const [status, setStatus] = useState({ loading: true, error: "" });
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;
    if (!quiz) {
      setStatus({ loading: false, error: "No quiz result found." });
      return;
    }
    const questions = quiz.questions || [];
    const detail = questions.map((question, index) => ({
      question: question.question,
      userAnswer: answers[index] || "",
      correctAnswer: question.correctAnswer,
      isCorrect: answers[index] === question.correctAnswer,
    }));
    const score = detail.filter((item) => item.isCorrect).length;
    saveQuizResult({
      quizId: quiz._id,
      score,
      totalQuestions: questions.length,
      percentage: questions.length ? Math.round((score / questions.length) * 100) : 0,
      answers: detail,
    })
      .then(() => setStatus({ loading: false, error: "" }))
      .catch((err) => setStatus({ loading: false, error: err.message }));
  }, [quiz, answers]);

  if (status.loading) {
    return <AppLayout><div className="container"><div className="panel status-message">Saving your result...</div></div></AppLayout>;
  }
  if (status.error || !quiz) {
    return (
      <AppLayout>
        <div className="container">
          <div className="panel status-message">
            <p className="error-text">{status.error || "No quiz result found."}</p>
            <Link className="link" to="/quizzes">Back to quizzes</Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const questions = quiz.questions || [];
  const score = questions.reduce((total, question, index) => total + (answers[index] === question.correctAnswer ? 1 : 0), 0);
  const incorrect = questions.length - score;
  const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;

  const tryAgain = () => {
    const id = quiz._id;
    resetQuiz();
    navigate(`/quiz/setup/${id}`);
  };

  return (
    <AppLayout>
      <div className="container narrow result-wrap">
        <p className="eyebrow">Quiz complete</p>
        <h1>{performanceMessage(percentage)}</h1>
        <div className="result-score">
          <strong>{percentage}%</strong>
          <span>{score} of {questions.length} correct</span>
        </div>
        <div className="result-stats">
          <div className="result-stat"><strong>{score}</strong><span>Correct</span></div>
          <div className="result-stat"><strong>{incorrect}</strong><span>Incorrect</span></div>
          <div className="result-stat"><strong>{questions.length}</strong><span>Total</span></div>
          <div className="result-stat"><strong>{percentage}%</strong><span>Percentage</span></div>
        </div>
        <div className="result-review">
          {questions.map((question, index) => (
            <div className={`review-row ${answers[index] === question.correctAnswer ? "correct" : "incorrect"}`} key={question.question}>
              <span>{answers[index] === question.correctAnswer ? "Correct" : "Review"}</span>
              <strong>{question.question}</strong>
              <small>{answers[index] || "No answer"}</small>
            </div>
          ))}
        </div>
        <div className="result-actions">
          <button className="button button-primary" onClick={tryAgain}>Try Again</button>
          <button className="button button-ghost" onClick={() => { resetQuiz(); navigate("/quizzes"); }}>Explore More Quizzes</button>
          <Link className="button button-ghost" to="/dashboard" onClick={() => resetQuiz()}>Go to Dashboard</Link>
        </div>
      </div>
    </AppLayout>
  );
}

export default QuizResult;
