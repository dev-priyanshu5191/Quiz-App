import { Link } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import useAuth from "../../hooks/useAuth";

function Landing() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <AppLayout>
      <section className="landing container">
        <div className="landing-copy">
          <p className="eyebrow">A sharper way to learn</p>
          <h1>Turn curiosity into <em>confidence.</em></h1>
          <p className="landing-lede">
            QuizLab is a focused quiz platform for learners and creators. Take short,
            timed quizzes, track your progress, and publish your own questions from a
            clean admin dashboard.
          </p>
          <div className="landing-actions">
            <Link className="button button-primary" to={user && !isAdmin ? "/quizzes" : "/signup"}>
              {user && !isAdmin ? "Explore Quizzes" : "Start Quiz"}
            </Link>
            <Link className="text-link" to={user && !isAdmin ? "/dashboard" : "/login"}>
              {user && !isAdmin ? "Go to Dashboard →" : "I already have an account →"}
            </Link>
          </div>
        </div>
        <div className="landing-art" aria-hidden="true">
          <div className="art-note note-one">+ 8 correct</div>
          <div className="art-note note-two">Keep going</div>
          <div className="art-board">
            <span>01</span>
            <strong>What will you<br />discover today?</strong>
            <small>QUIZLAB / DAILY PRACTICE</small>
          </div>
        </div>
      </section>

      <section className="landing-strip">
        <div className="container strip-inner">
          <span>Pick a topic</span>
          <span>Think it through</span>
          <span>See your progress</span>
        </div>
      </section>

      <section className="landing-section container">
        <p className="eyebrow">Why QuizLab</p>
        <h2>Everything you need to learn and create.</h2>
        <p className="section-lede">
          One platform, two experiences — learners practice with timed quizzes while
          admins publish and manage content without touching code.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">01</div>
            <h3>Timed quiz attempts</h3>
            <p>Stay sharp with a clear timer, progress bar and instant feedback after every quiz.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">02</div>
            <h3>Real progress tracking</h3>
            <p>Your dashboard and profile show actual attempts, average and best scores over time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">03</div>
            <h3>Simple quiz builder</h3>
            <p>Admins create quizzes with questions, options and correct answers in minutes.</p>
          </div>
        </div>
      </section>

      <section className="landing-section container">
        <p className="eyebrow">How it works</p>
        <h2>Three steps to your next win.</h2>
        <div className="steps" style={{ marginTop: "24px" }}>
          <div className="step">
            <span className="step-number">Step 1</span>
            <strong>Create an account</strong>
            <p>Sign up free and jump straight into the quiz library.</p>
          </div>
          <div className="step">
            <span className="step-number">Step 2</span>
            <strong>Pick and attempt</strong>
            <p>Choose a category and difficulty, then answer within the timer.</p>
          </div>
          <div className="step">
            <span className="step-number">Step 3</span>
            <strong>Review and improve</strong>
            <p>See your score, review mistakes, and build your history over time.</p>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="admin-cta">
          <div>
            <h2>Want to publish your own quiz?</h2>
            <p>Create, publish and manage quizzes from the Admin Dashboard.</p>
          </div>
          {isAdmin ? (
            <Link className="button button-secondary" to="/admin">Go to Admin Dashboard</Link>
          ) : (
            <Link className="button button-secondary" to="/admin/login">Login as Admin</Link>
          )}
        </div>
      </section>
    </AppLayout>
  );
}

export default Landing;
