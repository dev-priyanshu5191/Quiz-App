import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import useQuiz from "../../hooks/useQuiz";
import { saveQuizResult } from "../../services/userService";

function QuizResult() { const { state } = useLocation(); const navigate = useNavigate(); const { currentQuiz, answers, resetQuiz } = useQuiz(); const quiz = state?.quiz || currentQuiz; const [status, setStatus] = useState({ loading: true, error: "" }); const submitted = useRef(false);
  useEffect(() => { if (submitted.current) return; submitted.current = true; if (!quiz) { setStatus({ loading: false, error: "No quiz result found." }); return; } const questions = quiz.questions || []; const detail = questions.map((question, index) => ({ question: question.question, userAnswer: answers[index] || "", correctAnswer: question.correctAnswer, isCorrect: answers[index] === question.correctAnswer })); const score = detail.filter((item) => item.isCorrect).length; saveQuizResult({ score, totalQuestions: questions.length, percentage: questions.length ? Math.round((score / questions.length) * 100) : 0, answers: detail }).then(() => setStatus({ loading: false, error: "" })).catch((err) => setStatus({ loading: false, error: err.message })); }, [quiz, answers]);
  if (status.loading) return <AppLayout><div className="container"><div className="panel status-message">Saving your result...</div></div></AppLayout>;
  if (status.error || !quiz) return <AppLayout><div className="container"><div className="panel error-text">{status.error || "No quiz result found."}<br /><Link className="link" to="/quizzes">Back to quizzes</Link></div></div></AppLayout>;
  const questions = quiz.questions || []; const score = questions.reduce((total, question, index) => total + (answers[index] === question.correctAnswer ? 1 : 0), 0); const percentage = Math.round((score / questions.length) * 100);
  return <AppLayout><div className="container narrow result-wrap"><p className="eyebrow">Quiz complete</p><h1>{percentage >= 70 ? "Strong work." : "Good first pass."}</h1><div className="result-score"><strong>{percentage}%</strong><span>{score} of {questions.length} correct</span></div><div className="result-review">{questions.map((question, index) => <div className={`review-row ${answers[index] === question.correctAnswer ? "correct" : "incorrect"}`} key={question.question}><span>{answers[index] === question.correctAnswer ? "Correct" : "Review"}</span><strong>{question.question}</strong><small>{answers[index] || "No answer"}</small></div>)}</div><div className="result-actions"><button className="button button-primary" onClick={() => { resetQuiz(); navigate("/quizzes"); }}>Try another quiz</button><Link className="button button-ghost" to="/dashboard">Dashboard</Link></div></div></AppLayout>;
}

export default QuizResult;
