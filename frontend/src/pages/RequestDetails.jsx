import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import requestService from '../services/requestService';
import approvalService from '../services/approvalService';
import { useAuth } from '../contexts/AuthContext';

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    // Approval form state
    const [comments, setComments] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        fetchRequestDetails();
    }, [id]);

    const fetchRequestDetails = async () => {
        try {
            setLoading(true);
            const data = await requestService.getRequestById(id);
            setRequest(data);
        } catch (err) {
            setError('Failed to load request details');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!window.confirm('Are you sure you want to approve this request?')) return;

        try {
            setProcessing(true);
            await approvalService.approveRequest(id, comments || 'Approved');
            alert('Request approved successfully!');
            navigate('/approvals/pending');
        } catch (err) {
            alert('Failed to approve request: ' + (err.response?.data?.message || err.message));
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!comments) {
            alert('Please provide a reason for rejection in the comments.');
            return;
        }

        try {
            setProcessing(true);
            await approvalService.rejectRequest(id, comments);
            alert('Request rejected.');
            navigate('/approvals/pending');
        } catch (err) {
            alert('Failed to reject request: ' + (err.response?.data?.message || err.message));
        } finally {
            setProcessing(false);
            setShowRejectModal(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            DRAFT: 'badge-light',
            PENDING: 'badge-warning',
            APPROVED: 'badge-success',
            REJECTED: 'badge-danger',
        };
        return statusMap[status] || 'badge-light';
    };

    const isApprover = () => {
        if (!request || !user) return false;
        // Simple client-side check, backend validates strictly
        // Ideally we would check if current user role matches request.currentStepRole
        // For now, we rely on backend "pending" list logic or just show buttons if Pending
        return request.status === 'PENDING' && (user.role === 'MANAGER' || user.role === 'ADMIN');
    };

    if (loading) return <div className="text-center p-5">Loading...</div>;
    if (!request) return <div className="text-center p-5">Request not found</div>;

    return (
        <div className="App">
            <Navbar />
            <div className="app-content">
                <div className="page-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">← Back</button>
                        <h1 className="page-title">Request #{request.id}</h1>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(request.status)}`} style={{ fontSize: '1rem' }}>
                        {request.status}
                    </span>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)' }}>
                    {/* Main Content */}
                    <div className="card">
                        <div className="card-body">
                            <h2 style={{ marginBottom: '1rem' }}>{request.title}</h2>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
                                {request.description}
                            </p>

                            <div className="divider"></div>

                            <h3>Details</h3>
                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                <div>
                                    <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Type</label>
                                    <div>{request.requestTypeName}</div>
                                </div>
                                <div>
                                    <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Priority</label>
                                    <div>{request.priority}</div>
                                </div>
                                <div>
                                    <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Submitted By</label>
                                    <div>{request.requesterName}</div>
                                </div>
                                <div>
                                    <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Date</label>
                                    <div>{new Date(request.submittedAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {isApprover() && (
                            <div className="card">
                                <div className="card-header">
                                    <h3>Approval Actions</h3>
                                </div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label>Comments (Optional for Approve)</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                            placeholder="Enter comments..."
                                        ></textarea>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <button
                                            className="btn btn-success"
                                            style={{ flex: 1 }}
                                            onClick={handleApprove}
                                            disabled={processing}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            style={{ flex: 1 }}
                                            onClick={() => setShowRejectModal(true)}
                                            disabled={processing}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Attachments Card */}
                        <div className="card">
                            <div className="card-header">
                                <h3>Attachments</h3>
                            </div>
                            <div className="card-body">
                                <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                    No attachments found.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Reject Modal/Overlay logic if needed, or just use the textarea above directly */}
            {showRejectModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Reject Request</h3>
                        </div>
                        <div className="modal-body">
                            <p>Please confirm you want to reject this request. Comments are required.</p>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Reason for rejection..."
                                autoFocus
                            ></textarea>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleReject}>Confirm Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestDetails;
