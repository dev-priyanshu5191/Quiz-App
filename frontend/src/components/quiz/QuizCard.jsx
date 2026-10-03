import { Link } from "react-router-dom";

function QuizCard({ quiz }) {
  return (
    <article className="quiz-card">
      <div className="quiz-card-top"><span className="eyebrow">{quiz.category}</span><span className={`difficulty difficulty-${quiz.difficulty}`}>{quiz.difficulty}</span></div>
      <h2>{quiz.title}</h2>
      <p className="muted">{quiz.totalQuestions || quiz.questions?.length || 0} questions · {quiz.difficulty} pace</p>
      <Link className="button button-primary" to={`/quiz/setup/${quiz._id}`}>View quiz</Link>
    </article>
  );
}

export default QuizCard;
