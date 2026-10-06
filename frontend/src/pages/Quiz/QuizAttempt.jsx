import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import QuestionCard from "../../components/quiz/QuestionCard";
import StatusMessage from "../../components/common/StatusMessage";
import { getQuizzes } from "../../services/quizService";
import useQuiz from "../../hooks/useQuiz";

const SECONDS_PER_QUESTION = 30;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentQuiz, currentQuestion, answers, startQuiz, selectAnswer, nextQuestion, prevQuestion } = useQuiz();
  const [quiz, setQuiz] = useState(currentQuiz?._id === id ? currentQuiz : null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!(currentQuiz?._id === id));
  const [timeLeft, setTimeLeft] = useState(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (currentQuiz?._id === id) {
      setQuiz(currentQuiz);
      setLoading(false);
      return;
    }
    let active = true;
    getQuizzes()
      .then((items) => {
        if (!active) return;
        const found = (Array.isArray(items) ? items : []).find((item) => item._id === id);
        if (found) {
          startQuiz(found);
          setQuiz(found);
        } else {
          setError("Quiz not found.");
        }
        setLoading(false);
      })
      .catch((err) => active && (setError(err.message), setLoading(false)));
    return () => { active = false; };
  }, [id, currentQuiz, startQuiz]);

  // When the shuffled-once quiz arrives from context, prefer it so option
  // order stays identical to what the user is answering.
  useEffect(() => {
    if (currentQuiz?._id === id) setQuiz(currentQuiz);
  }, [currentQuiz, id]);

  const questionCount = quiz?.questions?.length || 0;

  useEffect(() => {
    if (!quiz || questionCount === 0 || finishedRef.current) return undefined;
    setTimeLeft(questionCount * SECONDS_PER_QUESTION);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev === null ? prev : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [quiz, questionCount]);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    navigate("/quiz/result", { state: { quiz } });
  };

  useEffect(() => {
    if (timeLeft === 0) finish();
  }, [timeLeft]);

  if (error) return <AppLayout><div className="container"><StatusMessage error={error} /></div></AppLayout>;
  if (loading || !quiz || timeLeft === null) {
    return <AppLayout><div className="container"><StatusMessage loading /></div></AppLayout>;
  }

  const questions = quiz.questions || [];
  const question = questions[currentQuestion];
  const selected = answers[currentQuestion];
  const isLast = currentQuestion === questions.length - 1;
  const isLowTime = timeLeft <= 30;

  return (
    <AppLayout>
      <div className="container quiz-run">
        <div className="quiz-progress">
          <span>{quiz.title}</span>
          <span className={`timer-pill ${isLowTime ? "timer-low" : ""}`}>⏱ {formatTime(Math.max(timeLeft, 0))}</span>
        </div>
        <div className="progress-track">
          <span style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="muted" style={{ marginBottom: "16px" }}>Question {currentQuestion + 1} of {questions.length}</p>
        <QuestionCard question={question} selectedAnswer={selected} onSelect={(answer) => selectAnswer(currentQuestion, answer)} />
        <div className="quiz-controls">
          <span className="muted">{selected ? "Answer selected" : "Choose an answer to continue"}</span>
          <div className="quiz-controls-nav">
            <button className="button button-ghost" disabled={currentQuestion === 0} onClick={prevQuestion}>Previous</button>
            {isLast ? (
              <button className="button button-primary" onClick={finish}>Submit Quiz</button>
            ) : (
              <button className="button button-primary" disabled={!selected} onClick={nextQuestion}>Next</button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default QuizAttempt;
