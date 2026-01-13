import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const SearchRequests = () => {
    const [filters, setFilters] = useState({
        keyword: '',
        status: '',
        priority: '',
        startDate: '',
        endDate: ''
    });

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSearched(true);

        try {
            const params = new URLSearchParams();

            if (filters.keyword) params.append('keyword', filters.keyword);
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.startDate) {
                const startDateTime = new Date(filters.startDate).toISOString();
                params.append('startDate', startDateTime);
            }
            if (filters.endDate) {
                const endDateTime = new Date(filters.endDate + 'T23:59:59').toISOString();
                params.append('endDate', endDateTime);
            }

            const response = await api.get(`/requests/search?${params.toString()}`);
            setResults(response.data);
        } catch (err) {
            setError('Failed to search requests: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setFilters({
            keyword: '',
            status: '',
            priority: '',
            startDate: '',
            endDate: ''
        });
        setResults([]);
        setSearched(false);
        setError('');
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

    return (
        <div className="App">
            <Navbar />
            <div className="app-content">
                <div className="page-header">
                    <h1 className="page-title">Search Requests</h1>
                </div>

                {/* Search Form */}
                <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div className="card-body">
                        <form onSubmit={handleSearch}>
                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                {/* Keyword */}
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Keyword</label>
                                    <input
                                        type="text"
                                        name="keyword"
                                        className="form-control"
                                        placeholder="Search in title or description..."
                                        value={filters.keyword}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Status */}
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        name="status"
                                        className="form-control"
                                        value={filters.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="DRAFT">Draft</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="APPROVED">Approved</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </div>

                                {/* Priority */}
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select
                                        name="priority"
                                        className="form-control"
                                        value={filters.priority}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">All Priorities</option>
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        className="form-control"
                                        value={filters.startDate}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* End Date */}
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        className="form-control"
                                        value={filters.endDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleClearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        {error}
                    </div>
                )}

                {/* Results */}
                {searched && (
                    <div className="card">
                        <div className="card-header">
                            <h3>Search Results ({results.length})</h3>
                        </div>
                        <div className="card-body">
                            {results.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">🔍</div>
                                    <h3>No Results Found</h3>
                                    <p>Try adjusting your search filters.</p>
                                </div>
                            ) : (
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Title</th>
                                                <th>Requester</th>
                                                <th>Type</th>
                                                <th>Status</th>
                                                <th>Priority</th>
                                                <th>Submitted</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((request) => (
                                                <tr key={request.id}>
                                                    <td>#{request.id}</td>
                                                    <td>
                                                        <strong>{request.title}</strong>
                                                    </td>
                                                    <td>{request.requesterName}</td>
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
                                                            className="btn btn-sm btn-primary"
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
                )}
            </div>
        </div>
    );
};

export default SearchRequests;
