import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const closeNav = () => setNavOpen(false);

  const handleLogout = () => {
    logout();
    closeNav();
    navigate(isAdmin ? "/admin/login" : "/login");
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to={isAdmin ? "/admin" : user ? "/dashboard" : "/"} onClick={closeNav}>
            QUIZ<span>LAB</span>
          </Link>
          <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded={navOpen} onClick={() => setNavOpen((open) => !open)}>
            {navOpen ? "✕" : "☰"}
          </button>
          <nav className={`main-nav ${navOpen ? "open" : ""}`} aria-label="Main navigation">
            {!user && (
              <>
                <NavLink to="/" onClick={closeNav}>Home</NavLink>
                <NavLink to="/quizzes" onClick={closeNav}>Quizzes</NavLink>
                <NavLink to="/login" onClick={closeNav}>Login</NavLink>
                <NavLink to="/signup" className="button button-primary nav-cta" onClick={closeNav}>Sign Up</NavLink>
                <NavLink to="/admin/login" onClick={closeNav}>Admin Login</NavLink>
              </>
            )}
            {user && !isAdmin && (
              <>
                <NavLink to="/" onClick={closeNav}>Home</NavLink>
                <NavLink to="/quizzes" onClick={closeNav}>Quizzes</NavLink>
                <NavLink to="/dashboard" onClick={closeNav}>Dashboard</NavLink>
                <NavLink to="/profile" onClick={closeNav}>Profile</NavLink>
                <button className="button button-ghost nav-logout" onClick={handleLogout}>Logout</button>
              </>
            )}
            {user && isAdmin && (
              <>
                <NavLink to="/admin" onClick={closeNav}>Admin Dashboard</NavLink>
                <NavLink to="/admin/quizzes" onClick={closeNav}>Manage Quizzes</NavLink>
                <NavLink to="/admin/create-quiz" onClick={closeNav}>Create Quiz</NavLink>
                <NavLink to="/profile" onClick={closeNav}>Profile</NavLink>
                <button className="button button-ghost nav-logout" onClick={handleLogout}>Logout</button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">QUIZLAB</span>
          <span>Practice with purpose. Publish with confidence.</span>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
