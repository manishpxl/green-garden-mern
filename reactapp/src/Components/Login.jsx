import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../userSlice';
import apiConfig from '../apiConfig';
import { toast } from 'react-toastify';
import { Leaf } from 'lucide-react';
import './Login.css';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(`${apiConfig.baseUrl}/users/getUserByEmailAndPassword`, {
                email: data.email,
                password: data.password
            });

            const user = res.data.user;
            const token = res.data.token;

            localStorage.setItem('token', token);

            dispatch(setUserInfo({
                userId: user._id,
                userName: user.username,
                role: user.userRole
            }));

            toast.success('Login Successful!');

            if (user.userRole === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/home');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-left">
                {/* Plants illustration will be set via CSS background or img */}
                <img src="/images/plants-illustration.png" alt="Plants" className="login-illustration" onError={(e) => e.target.style.display = 'none'} />
            </div>
            <div className="login-right">
                <div className="login-header">
                    <div className="brand-logo-circle">
                        <Leaf className="brand-icon-leaf" />
                    </div>
                    <h2>GreenGarden</h2>
                </div>

                <div className="login-form-card">
                    <h3>Login</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group form-group-spacing">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={errors.email ? 'input-error' : ''}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/,
                                        message: 'Invalid email address'
                                    }
                                })}
                            />
                            {errors.email && <span className="error-text">{errors.email.message}</span>}
                        </div>

                        <div className="form-group form-group-spacing">
                            <label>Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className={errors.password ? 'input-error' : ''}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                />
                                <span
                                    className="show-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </span>
                            </div>
                            {errors.password ? (
                                <span className="error-text">{errors.password.message}</span>
                            ) : (
                                <div className="forgot-password-link">
                                    <Link to="/forgot-password">Forgot Password?</Link>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="login-submit-btn">Login</button>

                        <div className="login-footer-link">
                            Don't have an account? <Link to="/signup">Signup</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
