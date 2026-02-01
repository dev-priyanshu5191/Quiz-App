import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './QuizSetup.css';

const QuizSetup = () => {
    const [formData, setFormData] = useState({
        number: '10',
        category: '9',
        difficulty: 'medium',
        type: 'multiple',
        timerPerQuestion: '30'
    });
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const categories = [
        { id: '9', name: 'General Knowledge' },
        { id: '10', name: 'Entertainment: Books' },
        { id: '11', name: 'Entertainment: Film' },
        { id: '12', name: 'Entertainment: Music' },
        { id: '17', name: 'Science & Nature' },
        { id: '18', name: 'Science: Computers' },
        { id: '21', name: 'Sports' },
        { id: '22', name: 'Geography' },
        { id: '23', name: 'History' }
    ];

    const difficulties = [
        { id: 'easy', name: 'Easy' },
        { id: 'medium', name: 'Medium' },
        { id: 'hard', name: 'Hard' }
    ];

    const types = [
        { id: 'multiple', name: 'Multiple Choice' },
        { id: 'boolean', name: 'True/False' }
    ];

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();

        let timerInterval;
        Swal.fire({
            title: "Loading Questions...",
            html: "Your Questions will close in <b></b> milliseconds.",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                // Timer closed automatically
            }
        });

        setLoading(true);

        const { number, category, difficulty, type } = formData;
        const apiUrl = `https://opentdb.com/api.php?amount=${number}&category=${category}&difficulty=${difficulty}&type=${type}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                // Store quiz data in localStorage for the quiz component
                localStorage.setItem('quizData', JSON.stringify({
                    questions: data.results,
                    settings: formData,
                    user: user
                }));

                // Swal.close();
                // await Swal.fire({
                //     icon: 'success',
                //     title: 'Quiz Ready!',
                //     text: 'Your quiz has been prepared. Starting now...',
                //     confirmButtonColor: '#4caf50',
                //     timer: 2000,
                //     timerProgressBar: true,
                //     showConfirmButton: false
                // });

                navigate('/quiz');
            } else {
                Swal.close();
                await Swal.fire({
                    icon: 'warning',
                    title: 'No Questions Found',
                    text: 'Please try different settings or try again later.',
                    confirmButtonColor: '#6f42c1',
                });
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            Swal.close();
            await Swal.fire({
                icon: 'error',
                title: 'Error Loading Quiz',
                text: 'Failed to load questions. Please check your internet connection and try again.',
                confirmButtonColor: '#6f42c1'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quiz-setup-container">
            <div className="quiz-setup-card">
                <div className="setup-header">
                    <div className="user-info">
                        <div className="user-avatar">
                            <span>{user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="user-details">
                            <h1>Welcome, {user?.name}!</h1>
                            <p>Let's create an amazing quiz for you!</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="setup-form">
                    {/* <div className="form-group">
                        <label htmlFor="timerPerQuestion">Time per Question (seconds)</label>
                        <input
                            type="number"
                            id="timerPerQuestion"
                            name="timerPerQuestion"
                            value={formData.timerPerQuestion}
                            onChange={onChange}
                            min="5"
                            max="300"
                            placeholder="30"
                        />
                    </div> */}

                    <div className="form-group">
                <select
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={onChange}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={onChange}
                >
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="difficulty">Difficulty</label>
                <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={onChange}
                >
                    {difficulties.map(diff => (
                        <option key={diff.id} value={diff.id}>{diff.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="type">Question Type</label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={onChange}
                >
                    {types.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="timerPerQuestion">Time per Question (seconds)</label>
                <input
                    type="number"
                    id="timerPerQuestion"
                    name="timerPerQuestion"
                    value={formData.timerPerQuestion}
                    onChange={onChange}
                    min="5"
                    max="300"
                    placeholder="30"
                />
            </div>

            <div className="button-group">
                <button type="button" onClick={() => navigate('/dashboard')} className="back-btn">
                    Back to Dashboard
                </button>
                <button type="submit" className="start-btn" disabled={loading}>
                    {loading ? 'Loading Questions...' : 'Start Quiz'}
                </button>
            </div>
        </form>
            </div >
        </div >
    );
};

export default QuizSetup;