import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import useAuth from "../../hooks/useAuth";
import { registerUser } from "../../services/authService";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" }); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const { login } = useAuth(); const navigate = useNavigate();
  const submit = async (event) => { event.preventDefault(); setError(""); setLoading(true); try { const data = await registerUser(form); login(data); navigate("/dashboard"); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  return <AppLayout><div className="auth-wrap container"><div className="auth-intro"><p className="eyebrow">Begin here</p><h1>A little practice goes a long way.</h1><p className="muted">Create your free learner account and build a rhythm.</p></div><form className="panel auth-form" onSubmit={submit}><h2>Create account</h2>{error && <p className="error-text">{error}</p>}<label className="field">Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label className="field">Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label className="field">Password<input type="password" minLength="6" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><button className="button button-primary" disabled={loading}>{loading ? "Creating..." : "Create account"}</button><p className="form-foot muted">Already registered? <Link className="link" to="/login">Log in</Link></p></form></div></AppLayout>;
}

export default Signup;
