import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
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

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-brand">
                <span style={{ fontSize: '1.5rem' }}>📋</span>
                Smart Workflow
            </Link>

            <div className="navbar-menu" style={{ display: 'flex', alignItems: 'center' }}>
                {user && (
                    <>
                        <NotificationBell />
                        <div
                            className="navbar-user"
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={{ position: 'relative' }}
                        >
                            <div className="user-avatar">{getInitials(user.fullName)}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                    {user.fullName}
                                </span>
                                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                    {user.role}
                                </span>
                            </div>

                            {showDropdown && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '0.5rem',
                                        backgroundColor: 'white',
                                        borderRadius: 'var(--radius-md)',
                                        boxShadow: 'var(--shadow-lg)',
                                        minWidth: '200px',
                                        zIndex: 1000,
                                    }}
                                >
                                    <Link
                                        to="/settings/telegram"
                                        style={{
                                            display: 'block',
                                            padding: 'var(--spacing-md)',
                                            color: 'var(--color-text-primary)',
                                            borderBottom: '1px solid var(--color-border)',
                                        }}
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        📱 Telegram Settings
                                    </Link>
                                    <Link
                                        to="/profile"
                                        style={{
                                            display: 'block',
                                            padding: 'var(--spacing-md)',
                                            color: 'var(--color-text-primary)',
                                            borderBottom: '1px solid var(--color-border)',
                                        }}
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        👤 My Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--spacing-md)',
                                            textAlign: 'left',
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-error)',
                                            cursor: 'pointer',
                                            fontSize: 'var(--font-size-base)',
                                        }}
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
