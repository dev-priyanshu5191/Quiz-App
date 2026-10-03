import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate(isAdmin ? "/admin/login" : "/login");
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to={isAdmin ? "/admin" : user ? "/dashboard" : "/"}>QUIZ<span>LAB</span></Link>
          <nav className="main-nav" aria-label="Main navigation">
            {user ? (
              <>
                <NavLink to={isAdmin ? "/admin" : "/dashboard"}>Home</NavLink>
                {isAdmin ? <NavLink to="/admin/quizzes">Quizzes</NavLink> : <NavLink to="/quizzes">Take a quiz</NavLink>}
                {!isAdmin && <NavLink to="/profile">Profile</NavLink>}
                <button className="button button-ghost nav-logout" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <><Link to="/login">Log in</Link><Link className="button button-primary nav-cta" to="/signup">Join free</Link></>
            )}
          </nav>
        </div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer"><div className="container"><span>QUIZLAB</span><span>Practice with purpose.</span></div></footer>
    </div>
  );
}

export default AppLayout;
