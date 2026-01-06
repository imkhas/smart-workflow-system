import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                flexDirection: 'column',
                gap: 'var(--spacing-md)'
            }}>
                <div className="spinner spinner-lg"></div>
                <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
