import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import requestService from '../services/requestService';

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await requestService.getMyRequests();
            setRequests(data);
        } catch (err) {
            setError('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            DRAFT: 'badge-light',
            PENDING: 'badge-warning',
            APPROVED: 'badge-success',
            REJECTED: 'badge-danger',
            CANCELLED: 'badge-light',
        };
        return statusMap[status] || 'badge-light';
    };

    const getPriorityBadgeClass = (priority) => {
        const priorityMap = {
            LOW: 'badge-light',
            MEDIUM: 'badge-info',
            HIGH: 'badge-warning',
            URGENT: 'badge-danger',
        };
        return priorityMap[priority] || 'badge-light';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="App">

                <div className="app-content">
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div className="spinner spinner-lg"></div>
                        <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
                            Loading requests...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="App">

            <div className="app-content">
                <div className="page-header">
                    <h1 className="page-title">My Requests</h1>
                    <Link to="/requests/new" className="btn btn-primary">
                        New Request
                    </Link>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        {error}
                    </div>
                )}

                <div className="card">
                    <div className="card-body">
                        {requests.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon"></div>
                                <h3>No requests yet</h3>
                                <p>Create your first workflow request to get started</p>
                                <Link
                                    to="/requests/new"
                                    className="btn btn-primary"
                                    style={{ marginTop: 'var(--spacing-md)' }}
                                >
                                    Create Request
                                </Link>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Priority</th>
                                            <th>Submitted</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((request) => (
                                            <tr key={request.id}>
                                                <td>#{request.id}</td>
                                                <td>
                                                    <strong>{request.title}</strong>
                                                    {request.description && (
                                                        <div
                                                            style={{
                                                                fontSize: 'var(--font-size-sm)',
                                                                color: 'var(--color-text-secondary)',
                                                                marginTop: '4px',
                                                            }}
                                                        >
                                                            {request.description.substring(0, 50)}
                                                            {request.description.length > 50 ? '...' : ''}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>{request.requestTypeName}</td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getPriorityBadgeClass(request.priority)}`}>
                                                        {request.priority}
                                                    </span>
                                                </td>
                                                <td>{formatDate(request.submittedAt)}</td>
                                                <td>
                                                    <Link
                                                        to={`/requests/${request.id}`}
                                                        className="btn btn-sm btn-secondary"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRequests;