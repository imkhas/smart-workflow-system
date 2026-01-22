import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="app-sidebar">
            <div className="sidebar-brand">
                <Link to="/dashboard" style={{ textDecoration: 'none', color: 'white' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0, padding: '1.5rem' }}>Smart Workflow</h2>
                </Link>
            </div>

            <div className="sidebar-user">
                <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontWeight: '600' }}>{user?.fullName}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{user?.role}</div>
                </div>
            </div>

            <nav className="sidebar-nav" style={{ padding: '1rem 0' }}>
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    style={{
                        display: 'block',
                        padding: '0.75rem 1.5rem',
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/members"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    style={{
                        display: 'block',
                        padding: '0.75rem 1.5rem',
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    Members
                </NavLink>

                <div style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.5, marginTop: '1rem' }}>
                    Requests
                </div>

                <NavLink
                    to="/requests/new"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    style={{
                        display: 'block',
                        padding: '0.75rem 1.5rem',
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none'
                    }}
                >
                    New Request
                </NavLink>

                <NavLink
                    to="/requests"
                    end
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    style={{
                        display: 'block',
                        padding: '0.75rem 1.5rem',
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none'
                    }}
                >
                    My Requests
                </NavLink>

                <NavLink
                    to="/approvals/pending"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    style={{
                        display: 'block',
                        padding: '0.75rem 1.5rem',
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none'
                    }}
                >
                    Pending Approvals
                </NavLink>

                <NavLink
                    to="/search"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    style={{
                        display: 'block',
                        padding: '0.75rem 1.5rem',
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none'
                    }}
                >
                    Search Requests
                </NavLink>
            </nav>


        </aside>
    );
};

export default Sidebar;
