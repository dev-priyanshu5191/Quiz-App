import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import StatusMessage from "../../components/common/StatusMessage";
import useAuth from "../../hooks/useAuth";
import { getProfile } from "../../services/userService";
import { getQuizzes } from "../../services/quizService";

function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });

  useEffect(() => {
    let active = true;
    Promise.all([getProfile(), getQuizzes()])
      .then(([profileData, quizData]) => {
        if (!active) return;
        setProfile(profileData);
        setQuizzes(Array.isArray(quizData) ? quizData : []);
        setState({ loading: false, error: "" });
      })
      .catch((err) => active && setState({ loading: false, error: err.message }));
    return () => { active = false; };
  }, []);

  const attempts = useMemo(() => {
    const list = profile?.attemptedQuizzes || [];
    return [...list].sort((a, b) => new Date(b.attemptedAt || 0) - new Date(a.attemptedAt || 0));
  }, [profile]);

  const stats = useMemo(() => {
    if (!attempts.length) return { total: 0, average: 0, best: 0 };
    const total = attempts.length;
    const average = Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / total);
    const best = Math.max(...attempts.map((a) => a.percentage || 0));
    return { total, average, best };
  }, [attempts]);

  const titleFor = (attempt) => {
    const match = quizzes.find((q) => q._id === attempt.quizId);
    return match?.title || "Quiz attempt";
  };

  return (
    <AppLayout>
      <div className="container">
        <div className="dashboard-hero">
          <div>
            <p className="eyebrow">Your learning desk</p>
            <h1>Good to see you, {user?.name?.split(" ")[0] || "learner"}.</h1>
            <p className="muted">A few focused minutes can change what sticks.</p>
          </div>
          <Link className="button button-primary" to="/quizzes">Explore Quizzes</Link>
        </div>

        <StatusMessage loading={state.loading} error={state.error} />

        {!state.loading && !state.error && (
          <>
            <div className="stats-grid">
              <div className="stat-card"><span>Quizzes attempted</span><strong>{stats.total}</strong><small>total attempts</small></div>
              <div className="stat-card"><span>Average score</span><strong>{stats.total ? `${stats.average}%` : "—"}</strong><small>across attempts</small></div>
              <div className="stat-card stat-accent"><span>Best score</span><strong>{stats.total ? `${stats.best}%` : "—"}</strong><small>personal best</small></div>
              <div className="stat-card"><span>Latest result</span><strong>{attempts[0] ? `${attempts[0].percentage}%` : "—"}</strong><small>{attempts[0] ? "most recent" : "take your first quiz"}</small></div>
            </div>

            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Your history</p>
                  <h2>Recent quizzes</h2>
                </div>
                <Link className="link" to="/profile">View profile →</Link>
              </div>
              {attempts.length ? (
                <div className="attempt-list">
                  {attempts.slice(0, 5).map((attempt, index) => (
                    <div className="attempt-row" key={`${attempt.attemptedAt || "attempt"}-${index}`}>
                      <span>{titleFor(attempt)}</span>
                      <strong>{attempt.score}/{attempt.totalQuestions}</strong>
                      <span className="muted">{attempt.percentage}%{attempt.attemptedAt ? ` · ${new Date(attempt.attemptedAt).toLocaleDateString()}` : ""}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="panel empty-inline">
                  <div>
                    <h3>No attempts yet.</h3>
                    <p className="muted">Take your first quiz to start building a history.</p>
                  </div>
                  <Link className="button button-primary" to="/quizzes">Browse quizzes</Link>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default Dashboard;
