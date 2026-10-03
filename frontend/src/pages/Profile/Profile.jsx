import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import StatusMessage from "../../components/common/StatusMessage";
import useAuth from "../../hooks/useAuth";
import { getProfile } from "../../services/userService";

function Profile() { const { updateUser } = useAuth(); const [profile, setProfile] = useState(null); const [state, setState] = useState({ loading: true, error: "" }); useEffect(() => { getProfile().then((data) => { setProfile(data); updateUser({ ...data, role: "user" }); }).catch((err) => setState({ loading: false, error: err.message })).finally(() => setState((prev) => ({ ...prev, loading: false }))); }, [updateUser]);
  return <AppLayout><div className="container narrow"><div className="page-heading"><div><p className="eyebrow">Your account</p><h1>Profile</h1></div></div><StatusMessage loading={state.loading} error={state.error} />{profile && <><div className="panel profile-card"><div className="avatar">{profile.name?.charAt(0).toUpperCase()}</div><div><h2>{profile.name}</h2><p className="muted">{profile.email}</p></div></div><div className="profile-history"><h2>Attempt history</h2>{profile.attemptedQuizzes?.length ? profile.attemptedQuizzes.map((attempt, index) => <div className="attempt-row" key={index}><span>Quiz attempt</span><strong>{attempt.score}/{attempt.totalQuestions}</strong><span className="muted">{attempt.percentage}%</span></div>) : <div className="panel muted">Complete a quiz to start your history.</div>}</div></>}</div></AppLayout>;
}

export default Profile;
