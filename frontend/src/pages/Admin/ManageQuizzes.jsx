import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import QuizCard from "../../components/quiz/QuizCard";
import StatusMessage from "../../components/common/StatusMessage";
import { getQuizzes } from "../../services/quizService";

function ManageQuizzes() { const [quizzes, setQuizzes] = useState([]); const [state, setState] = useState({ loading: true, error: "" }); useEffect(() => { getQuizzes().then(setQuizzes).catch((err) => setState({ loading: false, error: err.message })).finally(() => setState((prev) => ({ ...prev, loading: false }))); }, []); return <AppLayout><div className="container"><div className="page-heading"><div><p className="eyebrow">Admin workspace</p><h1>Quiz library</h1></div></div><StatusMessage loading={state.loading} error={state.error} empty={!state.loading && !state.error && !quizzes.length}>No quizzes have been created yet.</StatusMessage>{quizzes.length > 0 && <div className="quiz-grid">{quizzes.map((quiz) => <QuizCard key={quiz._id} quiz={quiz} />)}</div>}</div></AppLayout>;
}

export default ManageQuizzes;
