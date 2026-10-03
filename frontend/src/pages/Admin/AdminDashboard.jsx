import { Link } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import useAuth from "../../hooks/useAuth";

function AdminDashboard() { const { user } = useAuth(); return <AppLayout><div className="container"><div className="dashboard-hero"><div><p className="eyebrow">Admin workspace</p><h1>Make every question matter.</h1><p className="muted">Welcome, {user?.name || "admin"}. Build and review your quiz library.</p></div><Link className="button button-primary" to="/admin/create-quiz">Create a quiz</Link></div><div className="admin-grid"><Link className="admin-action panel" to="/admin/create-quiz"><span className="action-number">01</span><h2>Write a new quiz</h2><p className="muted">Add a focused set of questions for your learners.</p></Link><Link className="admin-action panel" to="/admin/quizzes"><span className="action-number">02</span><h2>Review library</h2><p className="muted">See every published quiz in one place.</p></Link></div></div></AppLayout>;
}

export default AdminDashboard;
