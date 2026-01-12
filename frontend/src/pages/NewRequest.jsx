import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import requestService from '../services/requestService';
import api from '../services/api';

const NewRequest = () => {
    const navigate = useNavigate();
    const [requestTypes, setRequestTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const [formData, setFormData] = useState({
        requestTypeId: '',
        title: '',
        description: '',
        priority: 'MEDIUM'
    });

    useEffect(() => {
        fetchRequestTypes();
    }, []);

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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Create the request
            const createdRequest = await requestService.createRequest(formData);

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
            <Navbar />
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
                                </select>
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
                                <label htmlFor="file">Attachment (Optional)</label>
                                <input
                                    type="file"
                                    id="file"
                                    className="form-control"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                                />
                                <small style={{ color: 'var(--color-text-secondary)', display: 'block', marginTop: '8px' }}>
                                    Allowed: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT (Max 10MB)
                                </small>
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