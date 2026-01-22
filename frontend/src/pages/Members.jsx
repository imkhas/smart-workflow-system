import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const AdminEditUserModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: user.fullName || '',
        email: user.email || '',
        department: user.department || '',
        role: user.role || 'STAFF',
        phone: user.phone || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams();
            if (formData.fullName) params.append('fullName', formData.fullName);
            if (formData.email) params.append('email', formData.email);
            if (formData.department) params.append('department', formData.department);
            if (formData.role) params.append('role', formData.role);
            if (formData.phone) params.append('phone', formData.phone);

            const response = await api.put(`/users/${user.id}?${params.toString()}`);
            onUpdate(response.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <div className="modal-content" style={{
                maxWidth: '600px', width: '95%',
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column'
            }}>
                {/* Premium Header */}
                <div style={{
                    padding: '32px',
                    background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)',
                    position: 'relative', overflow: 'hidden',
                    borderBottom: '1px solid #eef2ff'
                }}>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '16px',
                            backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                            color: 'var(--color-primary)', fontSize: '1.5rem'
                        }}>
                            <i className="fas fa-user-shield"></i>
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                                Manage Member
                            </h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                                Administrative override for user account details
                            </p>
                        </div>
                        <button onClick={onClose} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
                    </div>
                </div>

                <div className="modal-body" style={{ padding: '32px', backgroundColor: '#ffffff' }}>
                    {error && <div className="alert alert-error" style={{ borderRadius: '12px', marginBottom: '24px' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Full Name</label>
                                <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required
                                    style={{ height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 16px' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Email</label>
                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required
                                    style={{ height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 16px' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Department</label>
                                <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange}
                                    style={{ height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 16px' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Phone</label>
                                <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange}
                                    style={{ height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 16px' }} />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>System Role</label>
                            <select className="form-control" name="role" value={formData.role} onChange={handleChange}
                                style={{ height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 16px' }}>
                                <option value="STAFF">Staff</option>
                                <option value="MANAGER">Manager</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                            <button type="submit" className="btn btn-primary" disabled={loading}
                                style={{ flex: 1, height: '48px', borderRadius: '12px', fontSize: '1rem', fontWeight: '600' }}>
                                {loading ? 'Saving...' : 'Update Member'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}
                                style={{ padding: '0 24px', height: '48px', borderRadius: '12px', fontWeight: '600' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const { user: currentUserRole } = useAuth();
    const isAdmin = currentUserRole?.role === 'ADMIN';
    const navigate = useNavigate();

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await api.get('/users');
            setMembers(response.data);
        } catch (err) {
            setError('Failed to load members');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const backendBase = 'http://localhost:8080';
        return `${backendBase}${url}`;
    };

    const filteredMembers = members.filter(member => {
        const matchesSearch = (member.fullName && member.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (member.department && member.department.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesRole = selectedRole === 'All Roles' || member.role === selectedRole;

        return matchesSearch && matchesRole;
    });

    const handleRequest = (email) => {
        navigate(`/requests/new?email=${encodeURIComponent(email)}`);
    };

    const handleToggleStatus = async (member) => {
        try {
            const newStatus = !member.active;
            await api.put(`/users/${member.id}/status?active=${newStatus}`);
            setMembers(members.map(m => m.id === member.id ? { ...m, active: newStatus } : m));
            setSuccess(`User ${member.fullName} ${newStatus ? 'activated' : 'deactivated'} successfully`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update user status');
        }
    };

    const handleDelete = async (member) => {
        if (!window.confirm(`Are you sure you want to delete ${member.fullName}? This action cannot be undone.`)) {
            return;
        }

        try {
            await api.delete(`/users/${member.id}`);
            setMembers(members.filter(m => m.id !== member.id));
            setSuccess('User deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    const handleUpdateUser = (updatedUser) => {
        setMembers(members.map(m => m.id === updatedUser.id ? updatedUser : m));
        setSuccess('User updated successfully');
        setTimeout(() => setSuccess(''), 3000);
    };

    if (loading) {
        return (
            <div className="App">
                <div className="app-content">
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <div className="app-content">
                <div className="page-header">
                    <h1 className="page-title">Members ({filteredMembers.length})</h1>
                </div>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', width: '40%' }}>
                            <div className="search-box" style={{ width: '100%', position: 'relative' }}>
                                <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    className="form-control"
                                    style={{ paddingLeft: '35px', borderRadius: '20px', border: '1px solid #e5e7eb' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                            <select
                                className="form-control"
                                style={{ borderRadius: '20px', fontSize: '0.875rem' }}
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="All Roles">All Roles</option>
                                <option value="STAFF">Staff</option>
                                <option value="MANAGER">Manager</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="alert alert-error" style={{ margin: 'var(--spacing-md)' }}>{error}</div>}
                    {success && <div className="alert alert-success" style={{ margin: 'var(--spacing-md)' }}>{success}</div>}

                    <div style={{ overflowX: 'auto' }}>
                        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#f9fafb', textAlign: 'left' }}>
                                <tr>
                                    <th style={{ padding: '12px 24px', color: '#6b7280', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Account</th>
                                    <th style={{ padding: '12px 24px', color: '#6b7280', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Phone</th>
                                    <th style={{ padding: '12px 24px', color: '#6b7280', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Department</th>
                                    <th style={{ padding: '12px 24px', color: '#6b7280', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Role</th>
                                    <th style={{ padding: '12px 24px', color: '#6b7280', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '12px 24px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map(member => (
                                    <tr key={member.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '12px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#e5e7eb',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#6b7280',
                                                    overflow: 'hidden'
                                                }}>
                                                    {member.profilePicture ? (
                                                        <img src={getImageUrl(member.profilePicture)} alt={member.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        getInitials(member.fullName)
                                                    )}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#111827' }}>{member.fullName}</div>
                                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 24px', color: '#6b7280', fontSize: '0.875rem' }}>
                                            {member.phone || '-'}
                                        </td>
                                        <td style={{ padding: '12px 24px', color: '#6b7280', fontSize: '0.875rem' }}>
                                            {member.department || '-'}
                                        </td>
                                        <td style={{ padding: '12px 24px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                backgroundColor: '#f3f4f6',
                                                color: '#1f2937',
                                                fontSize: '0.75rem',
                                                fontWeight: '500'
                                            }}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 24px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                backgroundColor: member.active ? '#ecfdf5' : '#fef2f2',
                                                color: member.active ? '#065f46' : '#991b1b',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                {member.active ? 'Active' : 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            style={{
                                                                fontSize: '0.9rem',
                                                                padding: '4px 10px',
                                                                borderRadius: '8px'
                                                            }}
                                                            onClick={() => setEditingUser(member)}
                                                            title="Edit Details"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            style={{
                                                                fontSize: '0.9rem',
                                                                padding: '4px 10px',
                                                                borderRadius: '8px'
                                                            }}
                                                            onClick={() => handleDelete(member)}
                                                            title="Delete Member"
                                                        >
                                                            🗑️
                                                        </button>
                                                        <button
                                                            className={`btn ${member.active ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                                            style={{
                                                                fontSize: '0.65rem',
                                                                padding: '6px 12px',
                                                                borderRadius: '8px',
                                                                fontWeight: '700',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}
                                                            onClick={() => handleToggleStatus(member)}
                                                        >
                                                            {member.active ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    className="btn btn-outline-primary"
                                                    style={{
                                                        fontSize: '0.65rem',
                                                        padding: '6px 12px',
                                                        borderRadius: '8px',
                                                        fontWeight: '700',
                                                        textTransform: 'uppercase'
                                                    }}
                                                    onClick={() => handleRequest(member.email)}
                                                >
                                                    Request
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {editingUser && (
                <AdminEditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUpdate={handleUpdateUser}
                />
            )}
        </div>
    );
};

export default Members;
