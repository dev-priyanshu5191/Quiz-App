import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AppLayout from "../../components/layout/AppLayout";
import { createQuiz } from "../../services/quizService";

const blankQuestion = () => ({ question: "", options: ["", "", "", ""], correctAnswer: "", type: "multiple" });

function CreateQuiz() {
  const [form, setForm] = useState({ title: "", category: "", difficulty: "easy", questions: [blankQuestion()] });
  const [state, setState] = useState({ loading: false, error: "" });
  const navigate = useNavigate();

  const updateQuestion = (index, key, value) =>
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? { ...q, [key]: value } : q)),
    }));

  const updateOption = (questionIndex, optionIndex, value) =>
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? { ...q, options: q.options.map((option, oi) => (oi === optionIndex ? value : option)) }
          : q
      ),
    }));

  const addQuestion = () => setForm((prev) => ({ ...prev, questions: [...prev.questions, blankQuestion()] }));

  const removeQuestion = (index) =>
    setForm((prev) => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));

  const validate = () => {
    if (!form.title.trim()) return "Please enter a quiz title.";
    if (!form.category.trim()) return "Please enter a category.";
    for (let i = 0; i < form.questions.length; i += 1) {
      const q = form.questions[i];
      const filledOptions = q.options.filter((o) => o.trim());
      if (!q.question.trim()) return `Question ${i + 1} is missing its text.`;
      if (filledOptions.length < 2) return `Question ${i + 1} needs at least two options.`;
      if (!q.correctAnswer) return `Question ${i + 1} needs a correct answer.`;
    }
    return "";
  };

  const submit = async (event) => {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      setState({ loading: false, error: problem });
      return;
    }
    setState({ loading: true, error: "" });
    const questions = form.questions.map((q) => ({
      ...q,
      options: q.options.map((o) => o.trim()).filter(Boolean),
    }));
    try {
      await createQuiz({ title: form.title.trim(), category: form.category.trim(), difficulty: form.difficulty, questions, totalQuestions: questions.length });
      await Swal.fire({ icon: "success", title: "Quiz published!", timer: 1300, showConfirmButton: false });
      navigate("/admin/quizzes");
    } catch (err) {
      setState({ loading: false, error: err.message });
    }
  };

  return (
    <AppLayout>
      <div className="container create-wrap">
        <Link className="back-link" to="/admin">← Admin workspace</Link>
        <div className="page-heading">
          <div>
            <p className="eyebrow">New content</p>
            <h1>Create a quiz</h1>
          </div>
          <p className="muted">{form.questions.length} question{form.questions.length === 1 ? "" : "s"}</p>
        </div>
        <form className="create-form" onSubmit={submit}>
          <div className="panel form-grid">
            <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>Quiz details</h2>
            <label className="field">Title
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <div className="form-two">
              <label className="field">Category
                <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </label>
              <label className="field">Difficulty
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
            </div>
          </div>

          {form.questions.map((question, index) => (
            <div className="panel question-builder" key={index}>
              <div className="builder-heading">
                <span className="eyebrow" style={{ marginBottom: 0 }}>Question {index + 1}</span>
                {form.questions.length > 1 && (
                  <button type="button" className="text-button" onClick={() => removeQuestion(index)}>Remove</button>
                )}
              </div>
              <label className="field">Prompt
                <textarea required value={question.question} onChange={(e) => updateQuestion(index, "question", e.target.value)} />
              </label>
              <div className="options-grid">
                {question.options.map((option, optionIndex) => (
                  <label className="field" key={optionIndex}>
                    Option {optionIndex + 1}
                    <input value={option} onChange={(e) => updateOption(index, optionIndex, e.target.value)} />
                  </label>
                ))}
              </div>
              <label className="field">Correct answer
                <select value={question.correctAnswer} onChange={(e) => updateQuestion(index, "correctAnswer", e.target.value)}>
                  <option value="">Select correct answer</option>
                  {question.options.filter((o) => o.trim()).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
          ))}

          {state.error && <p className="error-text">{state.error}</p>}

          <div className="button-row">
            <button type="button" className="button button-ghost" onClick={addQuestion}>+ Add Question</button>
            <button className="button button-primary" disabled={state.loading}>
              {state.loading ? "Publishing..." : "Publish Quiz"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

export default CreateQuiz;
