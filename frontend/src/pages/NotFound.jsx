import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
    return (
        <div className="App">
            <Navbar />
            <div className="app-content">
                <div style={{
                    textAlign: 'center',
                    padding: 'var(--spacing-2xl)',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    <div style={{ fontSize: '6rem', marginBottom: 'var(--spacing-md)' }}>404</div>
                    <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Page Not Found</h1>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--spacing-xl)',
                        fontSize: '1.1rem'
                    }}>
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <Link to="/dashboard" className="btn btn-primary">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
