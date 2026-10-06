import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import QuizCard from "../../components/quiz/QuizCard";
import StatusMessage from "../../components/common/StatusMessage";
import { getQuizzes } from "../../services/quizService";

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });

  useEffect(() => {
    let active = true;
    getQuizzes()
      .then((data) => { if (active) { setQuizzes(Array.isArray(data) ? data : []); setState({ loading: false, error: "" }); } })
      .catch((err) => active && setState({ loading: false, error: err.message }));
    return () => { active = false; };
  }, []);

  return (
    <AppLayout>
      <div className="container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">The library</p>
            <h1>Choose your next challenge.</h1>
          </div>
          <p className="muted">{quizzes.length} quiz{quizzes.length === 1 ? "" : "zes"}</p>
        </div>
        <StatusMessage loading={state.loading} error={state.error} empty={!state.loading && !state.error && quizzes.length === 0}>
          No quizzes are available yet. Check back soon.
        </StatusMessage>
        {!state.loading && !state.error && quizzes.length > 0 && (
          <div className="quiz-grid">
            {quizzes.map((quiz) => <QuizCard key={quiz._id} quiz={quiz} />)}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default QuizList;
