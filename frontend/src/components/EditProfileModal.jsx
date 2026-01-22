import React, { useState } from 'react';
import api from '../services/api';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: user.fullName || '',
        phone: user.phone || '',
        department: user.department || '',
        address: user.address || '',
        facebook: user.facebook || '',
        twitter: user.twitter || '',
        googlePlus: user.googlePlus || '',
        tags: user.tags || ''
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user.profilePicture || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('blob:') || url.startsWith('http')) return url;
        const backendBase = 'http://localhost:8080';
        return `${backendBase}${url}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const data = new FormData();
            if (formData.fullName) data.append('fullName', formData.fullName);
            if (formData.phone) data.append('phone', formData.phone);
            if (formData.department) data.append('department', formData.department);
            if (formData.address) data.append('address', formData.address);
            if (formData.facebook) data.append('facebook', formData.facebook);
            if (formData.twitter) data.append('twitter', formData.twitter);
            if (formData.googlePlus) data.append('googlePlus', formData.googlePlus);
            if (formData.tags) data.append('tags', formData.tags);

            if (profilePicture) {
                data.append('profilePicture', profilePicture);
            }

            const response = await api.put('/users/me', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onUpdate(response.data);
            onClose();
        } catch (err) {
            setError('Failed to update profile. Please try again.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999, // Ensure it's above everything including navbar
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <div className="modal-content" style={{
                maxWidth: '650px',
                width: '95%',
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Premium Header with Mesh Gradient */}
                <div style={{
                    padding: '32px',
                    background: 'linear-gradient(135deg, #f8faff 0%, #e0e7ff 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    borderBottom: '1px solid #eef2ff'
                }}>
                    {/* Abstract design elements for "mesh" look */}
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(58, 175, 169, 0.1) 0%, transparent 70%)',
                        zIndex: 0
                    }} />

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                            color: 'var(--color-primary)',
                            fontSize: '1.5rem'
                        }}>
                            <i className="fas fa-user-edit"></i>
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                                Account Details
                            </h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                                Manage your profile information and social presence
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                marginLeft: 'auto',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                padding: '8px'
                            }}
                        >
                            &times;
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="modal-body" style={{
                    padding: '32px',
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    backgroundColor: '#ffffff'
                }}>
                    {error && <div className="alert alert-error" style={{ borderRadius: '12px', marginBottom: '24px' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '12px', display: 'block' }}>
                                Basic Information
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        className="form-control"
                                        style={{ height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 16px' }}
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        className="form-control"
                                        style={{ height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 16px' }}
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    className="form-control"
                                    style={{ height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 16px' }}
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Department"
                                />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '4px', display: 'block' }}>Profile Picture</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {previewUrl && (
                                        <img
                                            src={getImageUrl(previewUrl)}
                                            alt="Preview"
                                            style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                                        />
                                    )}
                                    <input
                                        type="file"
                                        id="profilePicture"
                                        name="profilePicture"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{
                                            fontSize: '0.8125rem',
                                            color: '#64748b',
                                            width: '100%'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                className="form-control"
                                style={{ height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 16px' }}
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Physical Address"
                            />
                        </div>

                        <div style={{
                            padding: '24px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '20px',
                            marginBottom: '24px',
                            border: '1px solid #f1f5f9'
                        }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '16px', display: 'block' }}>
                                Social Profiles
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <input
                                        type="text"
                                        id="facebook"
                                        name="facebook"
                                        className="form-control"
                                        style={{ height: '44px', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '0 14px', fontSize: '0.9rem' }}
                                        value={formData.facebook}
                                        onChange={handleChange}
                                        placeholder="Facebook Profile"
                                    />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <input
                                        type="text"
                                        id="twitter"
                                        name="twitter"
                                        className="form-control"
                                        style={{ height: '44px', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '0 14px', fontSize: '0.9rem' }}
                                        value={formData.twitter}
                                        onChange={handleChange}
                                        placeholder="Twitter Profile"
                                    />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <input
                                        type="text"
                                        id="googlePlus"
                                        name="googlePlus"
                                        className="form-control"
                                        style={{ height: '44px', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '0 14px', fontSize: '0.9rem' }}
                                        value={formData.googlePlus}
                                        onChange={handleChange}
                                        placeholder="Google+ Profile"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
                                Tags
                            </label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                className="form-control"
                                style={{ height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 16px' }}
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="e.g. Engineering, Remote, Full-time"
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            padding: '16px 0 0 0',
                            borderTop: '1px solid #f1f5f9'
                        }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                                style={{
                                    flex: 1,
                                    height: '48px',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    backgroundColor: 'var(--color-primary)',
                                    color: '#ffffff'
                                }}
                            >
                                {saving ? 'Updating...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                style={{
                                    padding: '0 24px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    border: '1px solid #e2e8f0',
                                    color: '#64748b'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
