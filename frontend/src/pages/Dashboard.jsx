import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0,
        recentRequests: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard/statistics');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'PENDING': 'warning',
            'APPROVED': 'success',
            'REJECTED': 'danger'
        };
        return statusMap[status] || 'secondary';
    };

    const getPriorityBadge = (priority) => {
        const priorityMap = {
            'HIGH': 'danger',
            'MEDIUM': 'warning',
            'LOW': 'info'
        };
        return priorityMap[priority] || 'secondary';
    };

    return (
        <div className="App">
            <Navbar />
            <div className="app-content">
                <div className="dashboard-header">
                    <h1 className="page-title">
                        Welcome back, {user?.fullName || 'User'}! 👋
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-sm)' }}>
                        Here's what's happening with your workflow requests
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div className="spinner"></div>
                        <p>Loading dashboard...</p>
                    </div>
                ) : (
                    <>
                        {/* Statistics Cards */}
                        <div className="dashboard-stats">
                            <div className="stat-card">
                                <div className="stat-label">Total Requests</div>
                                <div className="stat-value">{stats.totalRequests}</div>
                            </div>

                            <div className="stat-card warning">
                                <div className="stat-label">Pending Approvals</div>
                                <div className="stat-value">{stats.pendingRequests}</div>
                            </div>

                            <div className="stat-card success">
                                <div className="stat-label">Approved</div>
                                <div className="stat-value">{stats.approvedRequests}</div>
                            </div>

                            <div className="stat-card danger">
                                <div className="stat-label">Rejected</div>
                                <div className="stat-value">{stats.rejectedRequests}</div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <div className="card-header">
                                <h3 style={{ margin: 0 }}>Quick Actions</h3>
                            </div>
                            <div className="card-body">
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                                    <Link to="/requests/new" className="btn btn-primary">
                                        ➕ New Request
                                    </Link>
                                    <Link to="/requests" className="btn btn-secondary">
                                        📋 My Requests
                                    </Link>
                                    {(user?.role === 'MANAGER' || user?.role === 'ADMIN') && (
                                        <Link to="/approvals/pending" className="btn btn-secondary">
                                            ✅ Pending Approvals
                                        </Link>
                                    )}
                                    <Link to="/search" className="btn btn-secondary">
                                        🔍 Search Requests
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Recent Requests */}
                        <div className="card">
                            <div className="card-header">
                                <h3 style={{ margin: 0 }}>Recent Requests</h3>
                            </div>
                            <div className="card-body">
                                {stats.recentRequests.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">📭</div>
                                        <h3>No requests yet</h3>
                                        <p>Get started by creating your first workflow request</p>
                                        <Link to="/requests/new" className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
                                            Create Request
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="table-container">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Type</th>
                                                    <th>Status</th>
                                                    <th>Priority</th>
                                                    <th>Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.recentRequests.map((request) => (
                                                    <tr key={request.id}>
                                                        <td>{request.title}</td>
                                                        <td>{request.type}</td>
                                                        <td>
                                                            <span className={`badge badge-${getStatusBadge(request.status)}`}>
                                                                {request.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge badge-${getPriorityBadge(request.priority)}`}>
                                                                {request.priority}
                                                            </span>
                                                        </td>
                                                        <td>{formatDate(request.submittedAt)}</td>
                                                        <td>
                                                            <Link to={`/requests/${request.id}`} className="btn btn-sm btn-secondary">
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
