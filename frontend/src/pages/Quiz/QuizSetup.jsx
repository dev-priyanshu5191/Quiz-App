import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import StatusMessage from "../../components/common/StatusMessage";
import { getQuizzes } from "../../services/quizService";
import useQuiz from "../../hooks/useQuiz";

function QuizSetup() { const { id } = useParams(); const navigate = useNavigate(); const { startQuiz } = useQuiz(); const [quiz, setQuiz] = useState(null); const [error, setError] = useState("");
  useEffect(() => { getQuizzes().then((items) => setQuiz(items.find((item) => item._id === id))).catch((err) => setError(err.message)); }, [id]);
  if (error) return <AppLayout><div className="container"><StatusMessage error={error} /></div></AppLayout>;
  if (!quiz) return <AppLayout><div className="container"><StatusMessage loading /></div></AppLayout>;
  const begin = () => { startQuiz(quiz); navigate(`/quiz/${quiz._id}`); };
  return <AppLayout><div className="container narrow"><Link className="back-link" to="/quizzes">← Back to quizzes</Link><div className="setup-panel"><p className="eyebrow">{quiz.category} / {quiz.difficulty}</p><h1>{quiz.title}</h1><p className="setup-lede">A focused set of {quiz.questions?.length || quiz.totalQuestions} questions. Trust your first thoughtful answer.</p><div className="setup-meta"><span><strong>{quiz.questions?.length || quiz.totalQuestions}</strong> questions</span><span><strong>{quiz.difficulty}</strong> difficulty</span></div><button className="button button-primary" onClick={begin}>Start quiz</button></div></div></AppLayout>;
}

export default QuizSetup;
