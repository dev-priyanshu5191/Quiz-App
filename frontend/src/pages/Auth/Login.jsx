import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AppLayout from "../../components/layout/AppLayout";
import useAuth from "../../hooks/useAuth";
import { loginUser } from "../../services/authService";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form);
      login(data);
      await Swal.fire({ icon: "success", title: "Welcome back!", timer: 1100, showConfirmButton: false });
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="auth-wrap container">
        <div className="auth-intro">
          <span className="auth-badge auth-badge-user">User Login</span>
          <h1>Login to continue your quiz journey.</h1>
          <p className="muted">Your practice history is waiting for you.</p>
        </div>
        <form className="panel auth-form" onSubmit={submit}>
          <h2>Log in</h2>
          {error && <p className="error-text">{error}</p>}
          <label className="field">Email
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="field">Password
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <button className="button button-primary" disabled={loading}>{loading ? "Logging in..." : "Log in"}</button>
          <p className="form-foot muted">New here? <Link className="link" to="/signup">Create an account</Link></p>
          <p className="form-foot muted">Quiz creator? <Link className="link" to="/admin/login">Admin login</Link></p>
        </form>
      </div>
    </AppLayout>
  );
}

export default Login;
