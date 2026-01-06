import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const { user } = useAuth();

    // Mock data - will be replaced with real API calls
    const stats = {
        totalRequests: 0,
        pendingApprovals: 0,
        approved: 0,
        rejected: 0,
    };

    const recentRequests = [];

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

                {/* Statistics Cards */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-label">Total Requests</div>
                        <div className="stat-value">{stats.totalRequests}</div>
                    </div>

                    <div className="stat-card warning">
                        <div className="stat-label">Pending Approvals</div>
                        <div className="stat-value">{stats.pendingApprovals}</div>
                    </div>

                    <div className="stat-card success">
                        <div className="stat-label">Approved</div>
                        <div className="stat-value">{stats.approved}</div>
                    </div>

                    <div className="stat-card danger">
                        <div className="stat-label">Rejected</div>
                        <div className="stat-value">{stats.rejected}</div>
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
                                <Link to="/approvals" className="btn btn-secondary">
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
                        {recentRequests.length === 0 ? (
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
                                        {recentRequests.map((request) => (
                                            <tr key={request.id}>
                                                <td>{request.title}</td>
                                                <td>{request.type}</td>
                                                <td>
                                                    <span className={`badge badge-${request.statusClass}`}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge badge-${request.priorityClass}`}>
                                                        {request.priority}
                                                    </span>
                                                </td>
                                                <td>{request.date}</td>
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
            </div>
        </div>
    );
};

export default Dashboard;
