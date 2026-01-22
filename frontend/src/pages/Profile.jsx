import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleUpdate = (updatedUser) => {
        // Update user in context
        updateUser(updatedUser);
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

    return (
        <div className="App">
            <div className="app-content">
                <div className="page-header">
                    <h1 className="page-title">My Profile</h1>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'row', padding: 0, overflow: 'hidden', minHeight: '500px' }}>
                    {/* Left Column - User Identity */}
                    <div style={{
                        width: '30%',
                        borderRight: '1px solid var(--color-border)',
                        padding: '40px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        backgroundColor: '#f9fafb'
                    }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            backgroundColor: '#e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            fontSize: '2.5rem',
                            fontWeight: '600',
                            color: '#6b7280',
                            border: '4px solid white',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            overflow: 'hidden'
                        }}>
                            {user?.profilePicture ? (
                                <img src={getImageUrl(user.profilePicture)} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                getInitials(user?.fullName)
                            )}
                        </div>

                        <h2 style={{ fontSize: '1.5rem', margin: '0 0 5px 0', color: '#111827' }}>
                            {user?.fullName || 'User Name'}
                        </h2>

                        <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontWeight: '500' }}>
                            {user?.role || 'Role'} @ {user?.department || 'Company'}
                        </p>

                        <p style={{ margin: '0 0 30px 0', color: '#9ca3af', fontSize: '0.9rem' }}>
                            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                        </p>

                        <button
                            className="btn btn-primary"
                            style={{
                                padding: '10px 30px',
                                borderRadius: '4px',
                                fontWeight: '500',
                                marginBottom: '40px',
                            }}
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            Edit Profile
                        </button>

                        <div style={{ display: 'flex', gap: '20px', marginTop: 'auto', color: '#9ca3af' }}>
                            <span style={{ cursor: 'pointer' }}>{user?.facebook ? 'Facebook' : ''}</span>
                            <span style={{ cursor: 'pointer' }}>{user?.twitter ? 'Twitter' : ''}</span>
                            <span style={{ cursor: 'pointer' }}>{user?.googlePlus ? 'Google+' : ''}</span>
                        </div>
                    </div>

                    {/* Right Column - User Details */}
                    <div style={{ width: '70%', padding: '40px' }}>

                        {/* Section 1: Official Information */}
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{
                                fontSize: '1.1rem',
                                borderBottom: '1px solid var(--color-border)',
                                paddingBottom: '15px',
                                marginBottom: '25px',
                                color: '#6b7280',
                                fontWeight: '500'
                            }}>
                                Official Information
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Email</label>
                                    <div style={{ color: '#6b7280' }}>{user?.email || 'email@example.com'}</div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Phone Number</label>
                                    <div style={{ color: '#6b7280' }}>{user?.phone || 'Not provided'}</div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Address</label>
                                    <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{user?.address || 'Not provided'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Personal Information */}
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{
                                fontSize: '1.1rem',
                                borderBottom: '1px solid var(--color-border)',
                                paddingBottom: '15px',
                                marginBottom: '25px',
                                color: '#6b7280',
                                fontWeight: '500'
                            }}>
                                Personal Information
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Facebook</label>
                                    <div style={{ color: '#6b7280' }}>{user?.facebook || 'Not linked'}</div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Twitter</label>
                                    <div style={{ color: '#6b7280' }}>{user?.twitter || 'Not linked'}</div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Google+</label>
                                    <div style={{ color: '#6b7280' }}>{user?.googlePlus || 'Not linked'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Tags */}
                        <div>
                            <h3 style={{
                                fontSize: '1.1rem',
                                borderBottom: '1px solid var(--color-border)',
                                paddingBottom: '15px',
                                marginBottom: '25px',
                                color: '#6b7280',
                                fontWeight: '500'
                            }}>
                                Tags
                            </h3>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {user?.tags ? user.tags.split(',').map((tag, idx) => (
                                    <span key={idx} style={{ padding: '6px 16px', borderRadius: '20px', backgroundColor: '#f3f4f6', color: '#4b5563', fontSize: '0.875rem' }}>
                                        {tag.trim()}
                                    </span>
                                )) : (
                                    <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No tags added yet</span>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <EditProfileModal
                    user={user}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default Profile;
