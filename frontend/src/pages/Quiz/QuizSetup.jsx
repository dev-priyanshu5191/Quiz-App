import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import StatusMessage from "../../components/common/StatusMessage";
import { getQuizzes } from "../../services/quizService";
import useQuiz from "../../hooks/useQuiz";

function QuizSetup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startQuiz } = useQuiz();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getQuizzes()
      .then((items) => {
        if (!active) return;
        const found = (Array.isArray(items) ? items : []).find((item) => item._id === id);
        if (found) setQuiz(found);
        else setError("Quiz not found.");
        setLoading(false);
      })
      .catch((err) => active && (setError(err.message), setLoading(false)));
    return () => { active = false; };
  }, [id]);

  if (loading) return <AppLayout><div className="container"><StatusMessage loading /></div></AppLayout>;
  if (error || !quiz) return <AppLayout><div className="container"><StatusMessage error={error || "Quiz not found."} /></div></AppLayout>;

  const count = quiz.questions?.length || quiz.totalQuestions || 0;

  const begin = () => {
    startQuiz(quiz);
    navigate(`/quiz/${quiz._id}`);
  };

  return (
    <AppLayout>
      <div className="container narrow">
        <Link className="back-link" to="/quizzes">← Back to quizzes</Link>
        <div className="setup-panel">
          <p className="eyebrow" style={{ color: "var(--accent)" }}>{quiz.category} / {quiz.difficulty}</p>
          <h1>{quiz.title}</h1>
          <p className="setup-lede">A focused set of {count} questions. Trust your first thoughtful answer.</p>
          <div className="setup-meta">
            <span><strong>{count}</strong> questions</span>
            <span><strong>{quiz.category}</strong> category</span>
            <span><strong>{quiz.difficulty}</strong> difficulty</span>
          </div>
          <button className="button button-secondary" onClick={begin}>Start Quiz</button>
        </div>
      </div>
    </AppLayout>
  );
}

export default QuizSetup;
