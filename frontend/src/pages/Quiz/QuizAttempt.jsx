import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import QuestionCard from "../../components/quiz/QuestionCard";
import StatusMessage from "../../components/common/StatusMessage";
import { getQuizzes } from "../../services/quizService";
import useQuiz from "../../hooks/useQuiz";

function QuizAttempt() { const { id } = useParams(); const navigate = useNavigate(); const { currentQuiz, currentQuestion, answers, startQuiz, selectAnswer, nextQuestion } = useQuiz(); const [quiz, setQuiz] = useState(currentQuiz); const [error, setError] = useState("");
  useEffect(() => { if (quiz?._id === id) return; getQuizzes().then((items) => { const found = items.find((item) => item._id === id); if (found) { setQuiz(found); startQuiz(found); } else setError("Quiz not found."); }).catch((err) => setError(err.message)); }, [id, quiz, startQuiz]);
  if (error) return <AppLayout><div className="container"><StatusMessage error={error} /></div></AppLayout>;
  if (!quiz) return <AppLayout><div className="container"><StatusMessage loading /></div></AppLayout>;
  const questions = quiz.questions || []; const question = questions[currentQuestion]; const selected = answers[currentQuestion]; const finish = () => navigate("/quiz/result", { state: { quiz } });
  return <AppLayout><div className="container quiz-run"><div className="quiz-progress"><span>{quiz.title}</span><strong>{currentQuestion + 1} <small>/ {questions.length}</small></strong></div><div className="progress-track"><span style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} /></div><QuestionCard question={question} selectedAnswer={selected} onSelect={(answer) => selectAnswer(currentQuestion, answer)} /><div className="quiz-controls"><span className="muted">{selected ? "Answer selected" : "Choose an answer to continue"}</span><button className="button button-primary" disabled={!selected} onClick={() => currentQuestion === questions.length - 1 ? finish() : nextQuestion()}>{currentQuestion === questions.length - 1 ? "See result" : "Next question"}</button></div></div></AppLayout>;
}

export default QuizAttempt;
