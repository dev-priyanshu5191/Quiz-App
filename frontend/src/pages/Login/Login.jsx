import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [userType, setUserType] = useState('user'); // 'user' or 'admin'
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        const url = userType === 'admin' ? 'http://localhost:5000/api/auth/admin/login' : 'http://localhost:5000/api/auth/login';
        const data = userType === 'admin' ? { adminID: formData.email, password: formData.password } : { email: formData.email, password: formData.password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.msg || 'Login failed');
            }

            await Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: 'Welcome back! Let’s get started.',
                confirmButtonColor: '#667eea',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });

            login(result.user, result.token);
            navigate(result.user.role === 'admin' ? '/admin-dashboard' : '/dashboard');
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.message || 'Invalid email or password. Please try again.',
                confirmButtonColor: '#667eea'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account</p>
                </div>

                <form onSubmit={onSubmit} className="login-form">
                    <div className="user-type-selector">
                        <label>
                            <input
                                type="radio"
                                value="user"
                                checked={userType === 'user'}
                                onChange={() => setUserType('user')}
                            />
                            User Login
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="admin"
                                checked={userType === 'admin'}
                                onChange={() => setUserType('admin')}
                            />
                            Admin Login
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">{userType === 'admin' ? 'Admin ID' : 'Email'}</label>
                        <input
                            type={userType === 'admin' ? 'text' : 'email'}
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            placeholder={userType === 'admin' ? 'Enter your Admin ID' : 'Enter your email'}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;