import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        department: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: '',
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.fullName) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.department) {
            newErrors.department = 'Department is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        // Remove confirmPassword before sending to API
        const { confirmPassword, ...userData } = formData;

        const result = await register(userData);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setErrors({ general: result.error });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card fade-in">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join Smart Workflow System</p>
                </div>

                {errors.general && (
                    <div className="alert alert-error">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            Username *
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.username && (
                            <span className="form-error">{errors.username}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="your.email@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.email && (
                            <span className="form-error">{errors.email}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullName" className="form-label">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="form-control"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.fullName && (
                            <span className="form-error">{errors.fullName}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="department" className="form-label">
                            Department *
                        </label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            className="form-control"
                            placeholder="e.g., IT, HR, Finance"
                            value={formData.department}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.department && (
                            <span className="form-error">{errors.department}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="form-control"
                            placeholder="+60123456789"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password *
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="At least 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.password && (
                            <span className="form-error">{errors.password}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.confirmPassword && (
                            <span className="form-error">{errors.confirmPassword}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Creating account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
