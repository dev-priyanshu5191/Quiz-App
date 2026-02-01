import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: ''
    });
    const [userType, setUserType] = useState('user'); // 'user' or 'admin'
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const { name, email, password, confirmPassword, mobile } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        if (userType === 'user' && password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'Passwords do not match. Please try again.',
                confirmButtonColor: '#667eea'
            });
            setLoading(false);
            return;
        }

        try {
            const url = userType === 'admin' ? 'http://localhost:5000/api/auth/admin/register' : 'http://localhost:5000/api/auth/register';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userType === 'admin' ? { name, email, password, mobile } : { name, email, password, mobile })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Registration failed');
            }

            if (userType === 'admin') {
                // Show generated credentials to admin
                await Swal.fire({
                    icon: 'success',
                    title: 'Admin Account Created!',
                    html: `
                        <p><strong>Admin ID:</strong> ${data.generatedCredentials.adminID}</p>
                        <p><strong>Password:</strong> ${data.generatedCredentials.password}</p>
                        <p style="color: red; font-size: 14px;">⚠️ Please save these credentials securely. You will need them to login!</p>
                    `,
                    confirmButtonColor: '#667eea'
                });
            } else {
                await Swal.fire({
                    icon: 'success',
                    title: 'Account Created!',
                    text: 'Your account has been created successfully. Welcome!',
                    confirmButtonColor: '#667eea',
                    timer: 2000,
                    timerProgressBar: true
                });
            }

            login(data.user, data.token);
            navigate(data.user.role === 'admin' ? '/admin-dashboard' : '/dashboard');
        } catch (err) {
            console.error('Registration error:', err);
            await Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: err.message || 'Something went wrong. Please try again.',
                confirmButtonColor: '#667eea'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h1>Create Account</h1>
                    <p>Join us and start your quiz journey</p>
                </div>

                <form onSubmit={onSubmit} className="signup-form">
                    <div className="user-type-selector">
                        <label>
                            <input
                                type="radio"
                                value="user"
                                checked={userType === 'user'}
                                onChange={() => setUserType('user')}
                            />
                            User Signup
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="admin"
                                checked={userType === 'admin'}
                                onChange={() => setUserType('admin')}
                            />
                            Admin Signup
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="mobile">Mobile Number (Optional)</label>
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            value={mobile}
                            onChange={onChange}
                            placeholder="Enter your mobile number"
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
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={onChange}
                            required
                            placeholder="Confirm your password"
                            minLength="6"
                        />
                    </div>

                    <button type="submit" className="signup-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="signup-footer">
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;