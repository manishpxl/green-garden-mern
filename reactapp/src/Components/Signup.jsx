import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../apiConfig';
import { toast } from 'react-toastify';
import { Leaf } from 'lucide-react';
import './Signup.css';

const Signup = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const password = watch("password");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (data) => {
        try {
            const payload = {
                username: data.username,
                email: data.email,
                mobileNumber: data.mobile,
                password: data.password,
                userRole: data.role
            };
            await axios.post(`${apiConfig.baseUrl}/users/addUser`, payload);
            toast.success("Registration successful! Proceed to Login.");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="signup-wrapper">
            <div className="signup-card">
                <div className="signup-header">
                    <div className="brand-logo-circle">
                        <Leaf className="brand-icon-leaf" />
                    </div>
                    <h2>Signup</h2>
                </div>

                <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group form-group-spacing">
                        <label>User Name</label>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            className={errors.username ? 'input-error' : ''}
                            {...register('username', { required: 'Username is required' })}
                        />
                        {errors.username && <span className="error-text">{errors.username.message}</span>}
                    </div>

                    <div className="form-group form-group-spacing">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className={errors.email ? 'input-error' : ''}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                    message: 'Invalid email address'
                                }
                            })}
                        />
                        {errors.email && <span className="error-text">{errors.email.message}</span>}
                    </div>

                    <div className="form-group form-group-spacing">
                        <label>Mobile Number</label>
                        <input
                            type="text"
                            placeholder="Enter Mobile Number"
                            className={errors.mobile ? 'input-error' : ''}
                            {...register('mobile', {
                                required: 'Mobile number is required',
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'Must be 10 digits'
                                }
                            })}
                        />
                        {errors.mobile && <span className="error-text">{errors.mobile.message}</span>}
                    </div>

                    <div className="form-group form-group-spacing">
                        <label>Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                className={errors.password ? 'input-error' : ''}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Must be at least 6 characters' }
                                })}
                            />
                            <span
                                className="show-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                        </div>
                        {errors.password && <span className="error-text">{errors.password.message}</span>}
                    </div>

                    <div className="form-group form-group-spacing">
                        <label>Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                className={errors.confirmPassword ? 'input-error' : ''}
                                {...register('confirmPassword', {
                                    required: 'Confirm Password is required',
                                    validate: value => value === password || 'Passwords do not match'
                                })}
                            />
                            <span
                                className="show-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? 'Hide' : 'Show'}
                            </span>
                        </div>
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
                    </div>

                    <div className="form-group form-group-spacing">
                        <label>Role</label>
                        <select
                            className={errors.role ? 'input-error' : ''}
                            {...register('role', { required: 'Role is required' })}
                        >
                            <option value="">Select Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <span className="error-text">{errors.role.message}</span>}
                    </div>

                    <button type="submit" className="signup-submit-btn">Submit</button>

                    <div className="signup-footer-link">
                        Already have an Account? <Link to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
