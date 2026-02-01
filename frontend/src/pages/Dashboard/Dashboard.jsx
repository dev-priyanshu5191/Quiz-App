import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { FaSignOutAlt } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchUserData();
    }, [user, navigate]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/profile', {
                headers: {
                    'x-auth-token': token
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = () => {
        navigate('/quiz-setup');
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout?',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#667eea',
            confirmButtonText: 'Yes, Logout',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            logout();
            await Swal.fire({
                icon: 'success',
                title: 'Logged Out',
                text: 'You have been successfully logged out.',
                confirmButtonColor: '#667eea',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false
            });
            navigate('/login');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="user-info">
                    <div className="user-avatar">
                        <span>{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="user-details">
                        <h1>Hello {user?.name}!</h1>
                        <p>Best of luck for your exam</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            <div className="dashboard-content">
                <div className="panels-container">
                    {/* User Panel */}
                    <div className="panel user-panel">
                        <h2>User Dashboard</h2>

                        {userData?.attemptedQuizzes?.length > 0 ? (
                            <div className="quiz-history">
                                <h3>Previous Attempts</h3>
                                <div className="quiz-list">
                                    {userData.attemptedQuizzes.map((quiz, index) => (
                                        <div key={index} className="quiz-item">
                                            <div className="quiz-info">
                                                <span className="quiz-date">
                                                    {new Date(quiz.attemptedAt).toLocaleDateString()}
                                                </span>
                                                <span className="quiz-score">
                                                    Score: {quiz.score}/{quiz.totalQuestions} ({quiz.percentage.toFixed(1)}%)
                                                </span>
                                            </div>
                                            <div className="performance-indicator">
                                                {quiz.percentage >= 80 ? 'Excellent' :
                                                    quiz.percentage >= 60 ? 'Good' : 'Needs Improvement'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="no-quizzes">
                                <p>No quizzes attempted yet. Start your first quiz!</p>
                            </div>
                        )}

                        <button onClick={handleStartQuiz} className="start-quiz-btn">
                            Start Your Quiz
                        </button>
                    </div>

                    {/* Admin Panel Placeholder */}
                    <div className="panel admin-panel">
                        <h2>Coding Platform</h2>
                        <p>Coding Platform coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;