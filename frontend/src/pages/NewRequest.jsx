import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import requestService from '../services/requestService';
import api from '../services/api';
import FileUploader from '../components/FileUploader';

const NewRequest = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [requestTypes, setRequestTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const initialEmail = searchParams.get('email') || '';

    const [formData, setFormData] = useState({
        requestTypeId: '',
        customRequestType: '',
        title: '',
        description: '',
        priority: 'MEDIUM',
        assignedReviewerEmail: initialEmail
    });

    const [reviewerInfo, setReviewerInfo] = useState(null);
    const [reviewerError, setReviewerError] = useState('');
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    useEffect(() => {
        fetchRequestTypes();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.assignedReviewerEmail) {
                checkReviewerEmail(formData.assignedReviewerEmail);
            } else {
                setReviewerInfo(null);
                setReviewerError('');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.assignedReviewerEmail]);

    const checkReviewerEmail = async (email) => {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setReviewerError('Invalid email format');
            setReviewerInfo(null);
            return;
        }

        setIsCheckingEmail(true);
        setReviewerError('');
        try {
            const response = await api.get(`/users/by-email?email=${email}`);
            setReviewerInfo(response.data);
            setReviewerError('');
        } catch (err) {
            setReviewerInfo(null);
            setReviewerError('User not found in system');
        } finally {
            setIsCheckingEmail(false);
        }
    };

    const fetchRequestTypes = async () => {
        try {
            const response = await api.get('/request-types');
            setRequestTypes(response.data);
        } catch (err) {
            setError('Failed to load request types');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Prepare data for submission
            const submissionData = { ...formData };
            if (submissionData.requestTypeId === 'others') {
                submissionData.requestTypeId = null;
            } else {
                submissionData.customRequestType = null;
            }

            // Create the request
            const createdRequest = await requestService.createRequest(submissionData);

            // Upload file if selected
            if (selectedFile) {
                await requestService.uploadAttachment(createdRequest.id, selectedFile);
            }

            // Submit the request
            await requestService.submitRequest(createdRequest.id);

            // Redirect to My Requests
            navigate('/requests');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">

            <div className="app-content">
                <div className="page-header">
                    <h1 className="page-title">Create New Request</h1>
                </div>

                <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="card-body">
                        {error && (
                            <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="requestTypeId">Request Type *</label>
                                <select
                                    id="requestTypeId"
                                    name="requestTypeId"
                                    className="form-control"
                                    value={formData.requestTypeId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a request type</option>
                                    {requestTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                    <option value="others">Others</option>
                                </select>
                            </div>

                            {formData.requestTypeId === 'others' && (
                                <div className="form-group">
                                    <label htmlFor="customRequestType">Specific Request Type *</label>
                                    <input
                                        type="text"
                                        id="customRequestType"
                                        name="customRequestType"
                                        className="form-control"
                                        value={formData.customRequestType}
                                        onChange={handleChange}
                                        placeholder="Enter request type (e.g. Budget Approval)"
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="assignedReviewerEmail">Assign Reviewer (Email)</label>
                                <input
                                    type="email"
                                    id="assignedReviewerEmail"
                                    name="assignedReviewerEmail"
                                    className="form-control"
                                    value={formData.assignedReviewerEmail}
                                    onChange={handleChange}
                                    placeholder="Enter reviewer email (Optional)"
                                />
                                {isCheckingEmail && <small style={{ color: 'var(--color-primary)' }}>Checking user...</small>}
                                {reviewerError && <small style={{ color: 'var(--alert-error-color, #dc3545)', display: 'block' }}>❌ {reviewerError}</small>}
                                {reviewerInfo && (
                                    <small style={{ color: 'var(--alert-success-color, #28a745)', display: 'block' }}>
                                        ✅ User found: {reviewerInfo.fullName} ({reviewerInfo.department})
                                    </small>
                                )}
                                <small style={{ color: 'var(--color-text-secondary)', display: 'block', marginTop: '4px' }}>
                                    If left blank, the request will be routed to your manager or follow the default workflow.
                                </small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="title">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-control"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter request title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="form-control"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Provide details about your request"
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="priority">Priority *</label>
                                <select
                                    id="priority"
                                    name="priority"
                                    className="form-control"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Attachment (Optional)</label>
                                <FileUploader
                                    onFileSelect={handleFileSelect}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                                    label="Drag & drop your document here, or click to browse"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/requests')}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewRequest;