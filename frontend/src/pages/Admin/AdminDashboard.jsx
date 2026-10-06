import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import StatusMessage from "../../components/common/StatusMessage";
import useAuth from "../../hooks/useAuth";
import { getQuizzes } from "../../services/quizService";

function AdminDashboard() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });

  useEffect(() => {
    let active = true;
    getQuizzes()
      .then((data) => { if (active) { setQuizzes(Array.isArray(data) ? data : []); setState({ loading: false, error: "" }); } })
      .catch((err) => active && setState({ loading: false, error: err.message }));
    return () => { active = false; };
  }, []);

  const totalQuestions = quizzes.reduce((sum, q) => sum + (q.totalQuestions || q.questions?.length || 0), 0);

  return (
    <AppLayout>
      <div className="container">
        <div className="dashboard-hero">
          <div>
            <p className="eyebrow">Admin workspace</p>
            <h1>Make every question matter.</h1>
            <p className="muted">Welcome, {user?.name || "admin"}. Build and review your quiz library.</p>
          </div>
          <Link className="button button-primary" to="/admin/create-quiz">Create Quiz</Link>
        </div>

        <StatusMessage loading={state.loading} error={state.error} />

        {!state.loading && !state.error && (
          <>
            <div className="stats-grid">
              <div className="stat-card"><span>Total quizzes</span><strong>{quizzes.length}</strong><small>in library</small></div>
              <div className="stat-card stat-accent"><span>Published quizzes</span><strong>{quizzes.length}</strong><small>visible to learners</small></div>
              <div className="stat-card"><span>Total questions</span><strong>{totalQuestions}</strong><small>across all quizzes</small></div>
              <div className="stat-card"><span>Categories</span><strong>{new Set(quizzes.map((q) => q.category)).size}</strong><small>topics covered</small></div>
            </div>

            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Latest content</p>
                  <h2>Recent quizzes</h2>
                </div>
                <Link className="link" to="/admin/quizzes">Manage all →</Link>
              </div>
              {quizzes.length ? (
                <div className="attempt-list">
                  {quizzes.slice(0, 5).map((quiz) => (
                    <div className="attempt-row" key={quiz._id}>
                      <span>{quiz.title}</span>
                      <strong>{quiz.totalQuestions || quiz.questions?.length || 0} questions</strong>
                      <span className="muted">{quiz.category} · {quiz.difficulty}{quiz.createdAt ? ` · ${new Date(quiz.createdAt).toLocaleDateString()}` : ""}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="panel empty-inline">
                  <div>
                    <h3>No quizzes yet.</h3>
                    <p className="muted">Create your first quiz to get started.</p>
                  </div>
                  <Link className="button button-primary" to="/admin/create-quiz">Create Quiz</Link>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default AdminDashboard;
