import { Link } from "react-router-dom";

function QuizCard({ quiz, actionTo = `/quiz/setup/${quiz._id}`, actionLabel = "Start Quiz" }) {
  const count = quiz.totalQuestions || quiz.questions?.length || 0;
  return (
    <article className="quiz-card">
      <div className="quiz-card-top">
        <span className="eyebrow">{quiz.category}</span>
        <span className={`difficulty difficulty-${quiz.difficulty}`}>{quiz.difficulty}</span>
      </div>
      <h2>{quiz.title}</h2>
      <p className="muted">{count} questions</p>
      <Link className="button button-primary" to={actionTo}>{actionLabel}</Link>
    </article>
  );
}

export default QuizCard;
