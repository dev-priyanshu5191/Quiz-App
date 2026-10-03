import { Link } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";

function Landing() {
  return <AppLayout><section className="landing container">
    <div className="landing-copy"><p className="eyebrow">A sharper way to learn</p><h1>Turn curiosity into <em>confidence.</em></h1><p className="landing-lede">Short, focused quizzes that help you find what you know, what you missed, and what to try next.</p><div className="landing-actions"><Link className="button button-primary" to="/signup">Start learning</Link><Link className="text-link" to="/admin/login">Admin workspace →</Link></div></div>
    <div className="landing-art"><div className="art-note note-one">+ 8 correct</div><div className="art-note note-two">Keep going</div><div className="art-board"><span>01</span><strong>What will you<br />discover today?</strong><small>QUIZLAB / DAILY PRACTICE</small></div></div>
  </section><section className="landing-strip"><div className="container strip-inner"><span>Pick a topic</span><span>Think it through</span><span>See your progress</span></div></section></AppLayout>;
}

export default Landing;
