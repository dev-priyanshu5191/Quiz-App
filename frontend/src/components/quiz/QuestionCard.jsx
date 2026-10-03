function QuestionCard({ question, selectedAnswer, onSelect }) {
  return (
    <section className="question-card">
      <p className="question-label">Question</p>
      <h2>{question.question}</h2>
      <div className="answer-options">
        {(question.options || []).map((option) => (
          <button key={option} className={`answer-option ${selectedAnswer === option ? "selected" : ""}`} onClick={() => onSelect(option)} type="button">
            <span className="option-mark" />{option}
          </button>
        ))}
      </div>
    </section>
  );
}

export default QuestionCard;
