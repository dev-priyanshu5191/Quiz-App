import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './Quiz.css';

const Quiz = () => {
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timer, setTimer] = useState(30);
    const [showResult, setShowResult] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleQuizEnd = useCallback(async (finalScore, finalAnswers) => {
        setShowResult(true);

        try {
            const token = localStorage.getItem('token');
            const percentage = (finalScore / quizData?.questions.length) * 100;

            await fetch('http://localhost:5000/api/users/quiz-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    score: finalScore,
                    totalQuestions: quizData?.questions.length,
                    percentage,
                    answers: finalAnswers
                })
            });
        } catch (error) {
            console.error('Error saving quiz result:', error);
        }
    }, [quizData]);

    useEffect(() => {
        const data = localStorage.getItem('quizData');
        if (data) {
            const parsedData = JSON.parse(data);
            setQuizData(parsedData);
            // Set per-question timer from settings
            const timerSeconds = parseInt(parsedData.settings?.timerPerQuestion || 30);
            setTimer(timerSeconds);
        } else {
            navigate('/dashboard');
        }
    }, [navigate]);

    useEffect(() => {
        if (timer > 0 && !showResult) {
            const interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            handleNextQuestion();
        }
    }, [timer, showResult]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        if (!quizData) return;

        const isCorrect = selectedAnswer === quizData.questions[currentQuestion].correct_answer;
        const newScore = isCorrect ? score + 1 : score;

        const answerData = {
            question: quizData.questions[currentQuestion].question,
            userAnswer: selectedAnswer,
            correctAnswer: quizData.questions[currentQuestion].correct_answer,
            isCorrect
        };

        setAnswers([...answers, answerData]);
        setScore(newScore);

        if (currentQuestion < quizData.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer('');
            setTimer(parseInt(quizData.settings?.timerPerQuestion || 30));
        } else {
            handleQuizEnd(newScore, [...answers, answerData]);
        }
    };

    const handleEndQuiz = async () => {
        const result = await Swal.fire({
            title: 'End Quiz?',
            text: 'Are you sure you want to end the quiz? Your progress will be saved.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, End Quiz',
            cancelButtonText: 'Continue Quiz'
        });

        if (result.isConfirmed) {
            handleQuizEnd(score, answers);
        }
    };

    if (!quizData) {
        return <div className="loading">Loading quiz...</div>;
    }

    if (showResult) {
        const percentage = (score / quizData.questions.length) * 100;
        return (
            <div className="quiz-result">
                <div className="result-card">
                    <div className="user-info">
                        <div className="user-avatar">
                            <span>{user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="user-details">
                            <h1>{user?.name}</h1>
                            <p>Quiz Completed!</p>
                        </div>
                    </div>

                    <div className="score-display">
                        <h2>Your Score</h2>
                        <div className="score-circle">
                            <span className="score-number">{score}/{quizData.questions.length}</span>
                            <span className="score-percentage">{percentage.toFixed(1)}%</span>
                        </div>
                    </div>

                    <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-btn">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const question = quizData.questions[currentQuestion];
    const options = [...question.incorrect_answers];
    if (!options.includes(question.correct_answer)) {
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, question.correct_answer);
    }

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <div className="user-info">
                    <div className="user-avatar">
                        <span>{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="user-details">
                        <h2>{user?.name}</h2>
                        <p>Question {currentQuestion + 1} of {quizData.questions.length}</p>
                    </div>
                </div>

                <div className="quiz-controls">
                    <div className={`timer ${timer <= 10 ? 'timer-warning' : ''}`}>
                        ⏱️ Time: {timer}s
                    </div>
                    <button onClick={handleEndQuiz} className="end-quiz-btn">
                        End Quiz
                    </button>
                </div>
            </div>

            <div className="question-card">
                <div className="question-header">
                    <span className="category">{question.category}</span>
                    <span className="difficulty">{question.difficulty}</span>
                </div>

                <div className="question" dangerouslySetInnerHTML={{ __html: question.question }} />

                <div className="options">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`option ${selectedAnswer === option ? 'selected' : ''}`}
                            onClick={() => handleAnswerSelect(option)}
                            dangerouslySetInnerHTML={{ __html: option }}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNextQuestion}
                    className="next-btn"
                    disabled={!selectedAnswer}
                >
                    {currentQuestion === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
            </div>
        </div>
    );
};

export default Quiz;