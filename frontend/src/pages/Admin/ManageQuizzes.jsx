import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import StatusMessage from "../../components/common/StatusMessage";
import { getQuizzes } from "../../services/quizService";

function ManageQuizzes() {
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
            <p className="eyebrow">Admin workspace</p>
            <h1>Manage Quizzes</h1>
          </div>
          <p className="muted">{quizzes.length} quiz{quizzes.length === 1 ? "" : "zes"}</p>
        </div>
        <StatusMessage loading={state.loading} error={state.error} empty={!state.loading && !state.error && quizzes.length === 0}>
          No quizzes have been created yet.
        </StatusMessage>
        {!state.loading && !state.error && quizzes.length > 0 && (
          <div>
            {quizzes.map((quiz) => (
              <div className="manage-row" key={quiz._id}>
                <div>
                  <strong>{quiz.title}</strong>
                  <span className="muted">{quiz.category}</span>
                </div>
                <span className={`difficulty difficulty-${quiz.difficulty}`}>{quiz.difficulty}</span>
                <span className="muted">{quiz.totalQuestions || quiz.questions?.length || 0} questions</span>
                <span className="muted">{quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : "—"}</span>
                <span className="chip">Published</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default ManageQuizzes;
