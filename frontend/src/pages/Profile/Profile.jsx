import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import StatusMessage from "../../components/common/StatusMessage";
import useAuth from "../../hooks/useAuth";
import { getProfile } from "../../services/userService";

function Profile() {
  const { user, updateUser } = useAuth();
  const isAdmin = user?.role === "admin";
  const [profile, setProfile] = useState(null);
  const [state, setState] = useState({ loading: !isAdmin, error: "" });

  useEffect(() => {
    if (isAdmin) return undefined;
    let active = true;
    getProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        updateUser({ ...data, role: "user" });
        setState({ loading: false, error: "" });
      })
      .catch((err) => active && setState({ loading: false, error: err.message }));
    return () => { active = false; };
  }, [isAdmin, updateUser]);

  const attempts = profile?.attemptedQuizzes || [];
  const average = attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / attempts.length)
    : 0;

  return (
    <AppLayout>
      <div className="container narrow">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Your account</p>
            <h1>Profile</h1>
          </div>
        </div>
        <StatusMessage loading={state.loading} error={state.error} />

        {isAdmin && (
          <div className="panel profile-card">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h2>{user?.name}</h2>
              <p className="muted">Admin ID: {user?.adminID}</p>
              <p className="muted">Role: Admin</p>
            </div>
          </div>
        )}

        {!isAdmin && profile && (
          <>
            <div className="panel profile-card">
              <div className="avatar">{profile.name?.charAt(0).toUpperCase()}</div>
              <div>
                <h2>{profile.name}</h2>
                <p className="muted">{profile.email}</p>
                <p className="muted">{attempts.length} attempt{attempts.length === 1 ? "" : "s"} · {attempts.length ? `${average}% average` : "no attempts yet"}</p>
              </div>
            </div>
            <div className="profile-history">
              <h2>Attempt history</h2>
              {attempts.length ? (
                <div className="attempt-list">
                  {[...attempts].reverse().map((attempt, index) => (
                    <div className="attempt-row" key={index}>
                      <span>Quiz attempt</span>
                      <strong>{attempt.score}/{attempt.totalQuestions}</strong>
                      <span className="muted">{attempt.percentage}%{attempt.attemptedAt ? ` · ${new Date(attempt.attemptedAt).toLocaleDateString()}` : ""}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="panel muted">Complete a quiz to start your history.</div>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default Profile;
