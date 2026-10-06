import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import useAuth from "../../hooks/useAuth";
import { registerAdmin } from "../../services/authService";

function AdminRegister() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await registerAdmin(form);
      setData(result);
      login(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (data?.generatedCredentials) {
    return (
      <AppLayout>
        <div className="container narrow">
          <div className="panel credential-panel">
            <p className="eyebrow">Registration complete</p>
            <h1>Your admin credentials</h1>
            <p className="muted">Save these credentials before entering your workspace.</p>
            <div className="credentials">
              <strong>Admin ID <span>{data.generatedCredentials.adminID}</span></strong>
              <strong>Password <span>{data.generatedCredentials.password}</span></strong>
            </div>
            <button className="button button-primary" onClick={() => navigate("/admin")}>Open workspace</button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="auth-wrap container">
        <div className="auth-intro">
          <span className="auth-badge auth-badge-admin">Admin Registration</span>
          <h1>Give your learners something worth taking.</h1>
          <p className="muted">We will generate your Admin ID and password.</p>
        </div>
        <form className="panel auth-form" onSubmit={submit}>
          <h2>Register workspace</h2>
          {error && <p className="error-text">{error}</p>}
          <label className="field">Name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="field">Email
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="field">Mobile <span className="muted">(optional)</span>
            <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
          </label>
          <button className="button button-primary" disabled={loading}>{loading ? "Registering..." : "Generate credentials"}</button>
          <p className="form-foot muted">Already have an ID? <Link className="link" to="/admin/login">Admin login</Link></p>
        </form>
      </div>
    </AppLayout>
  );
}

export default AdminRegister;
