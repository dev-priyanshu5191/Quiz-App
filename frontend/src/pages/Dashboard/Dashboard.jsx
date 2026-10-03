import { Link } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import useAuth from "../../hooks/useAuth";

function Dashboard() {
  const { user } = useAuth(); const recent = user?.attemptedQuizzes || [];
  return <AppLayout><div className="container"><div className="dashboard-hero"><div><p className="eyebrow">Your learning desk</p><h1>Good to see you, {user?.name?.split(" ")[0] || "learner"}.</h1><p className="muted">A few focused minutes can change what sticks.</p></div><Link className="button button-primary" to="/quizzes">Find a quiz</Link></div><div className="stats-grid"><div className="stat-card"><span>Completed</span><strong>{recent.length}</strong><small>attempts recorded</small></div><div className="stat-card"><span>Latest score</span><strong>{recent[0] ? `${recent[0].percentage}%` : "—"}</strong><small>{recent[0] ? "keep the momentum" : "take your first quiz"}</small></div><div className="stat-card stat-accent"><span>Next move</span><strong>15 min</strong><small>one quiz is enough</small></div></div><section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Your history</p><h2>Recent attempts</h2></div><Link className="link" to="/profile">View profile →</Link></div>{recent.length ? <div className="attempt-list">{recent.slice(0, 4).map((attempt, index) => <div className="attempt-row" key={`${attempt.attemptedAt || "attempt"}-${index}`}><span>Quiz attempt</span><strong>{attempt.score}/{attempt.totalQuestions}</strong><span className="muted">{attempt.percentage}%</span></div>)}</div> : <div className="panel empty-inline"><h3>Your first result will appear here.</h3><p className="muted">Choose a quiz and make a little progress today.</p><Link className="link" to="/quizzes">Browse quizzes →</Link></div>}</section></div></AppLayout>;
}

export default Dashboard;
