import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import QuizCard from "../../components/quiz/QuizCard";
import StatusMessage from "../../components/common/StatusMessage";
import { getQuizzes } from "../../services/quizService";

function QuizList() { const [quizzes, setQuizzes] = useState([]); const [state, setState] = useState({ loading: true, error: "" });
  useEffect(() => { getQuizzes().then(setQuizzes).catch((err) => setState({ loading: false, error: err.message })).finally(() => setState((prev) => ({ ...prev, loading: false }))); }, []);
  return <AppLayout><div className="container"><div className="page-heading"><div><p className="eyebrow">The library</p><h1>Choose your next challenge.</h1></div><p className="muted">{quizzes.length} quiz{quizzes.length === 1 ? "" : "zes"}</p></div><StatusMessage loading={state.loading} error={state.error} empty={!state.loading && !state.error && !quizzes.length}>No quizzes are available yet.</StatusMessage>{!state.loading && !state.error && quizzes.length > 0 && <div className="quiz-grid">{quizzes.map((quiz) => <QuizCard key={quiz._id} quiz={quiz} />)}</div>}</div></AppLayout>;
}

export default QuizList;
