import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import useAuth from "../../hooks/useAuth";
import { loginAdmin } from "../../services/authService";

function AdminLogin() {
  const [form, setForm] = useState({ adminID: "", password: "" }); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const { login } = useAuth(); const navigate = useNavigate();
  const submit = async (event) => { event.preventDefault(); setError(""); setLoading(true); try { const data = await loginAdmin(form); login(data); navigate("/admin"); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  return <AppLayout><div className="auth-wrap container"><div className="auth-intro"><p className="eyebrow">Quizlab for teams</p><h1>Build a better question set.</h1><p className="muted">Manage the quizzes your learners use every day.</p></div><form className="panel auth-form" onSubmit={submit}><h2>Admin login</h2>{error && <p className="error-text">{error}</p>}<label className="field">Admin ID<input required value={form.adminID} onChange={(e) => setForm({ ...form, adminID: e.target.value })} /></label><label className="field">Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><button className="button button-primary" disabled={loading}>{loading ? "Logging in..." : "Enter workspace"}</button><p className="form-foot muted">Need admin access? <Link className="link" to="/admin/register">Register</Link></p></form></div></AppLayout>;
}

export default AdminLogin;
