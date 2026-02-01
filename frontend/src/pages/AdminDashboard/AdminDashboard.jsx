import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './AdminDashboard.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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

    return (
        <div className="admin-dashboard-container">
            <div className="admin-dashboard-header">
                <div className="admin-info">
                    <div className="admin-avatar">
                        <span>{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="admin-details">
                        <h1>Welcome, Admin {user?.name}!</h1>
                        <p>Admin ID: {user?.adminID}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
            </div>

            <div className="admin-dashboard-content">
                <div className="coming-soon-card">
                    <div className="coming-soon-icon">
                        🚧
                    </div>
                    <h2>Admin Dashboard</h2>
                    <p>Coming Soon</p>
                    <div className="coming-soon-description">
                        Advanced admin features are currently under development.
                        This dashboard will provide comprehensive management tools
                        for quizzes, users, and system administration.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;