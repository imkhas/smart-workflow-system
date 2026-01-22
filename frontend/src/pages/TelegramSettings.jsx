import React, { useState, useEffect } from 'react';

import api from '../services/api';

const TelegramSettings = () => {
    const [config, setConfig] = useState({
        chatId: '',
        enabled: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [linking, setLinking] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await api.get('/telegram/config');
            setConfig(response.data);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load Telegram settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        setLinking(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await api.get('/telegram/get-link');
            // Open Telegram in a new tab
            window.open(response.data.message, '_blank');
            setMessage({ type: 'info', text: 'Telegram opened! Click "Start" in the bot, then click "Refresh Status" below.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to generate connection link' });
        } finally {
            setLinking(false);
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        fetchConfig();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/telegram/config', { ...config, enabled: config.enabled });
            setMessage({ type: 'success', text: 'Notification settings updated!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update settings: ' + (err.response?.data?.message || err.message) });
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        setTesting(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/telegram/test', config);
            setMessage({ type: 'success', text: 'Test notification sent! Check your Telegram app.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to send test notification: ' + (err.response?.data?.message || err.message) });
        } finally {
            setTesting(false);
        }
    };

    const handleDisconnect = async () => {
        if (!window.confirm('Are you sure you want to disconnect your Telegram account? You will stop receiving notifications.')) {
            return;
        }

        setDisconnecting(true);
        setMessage({ type: '', text: '' });

        try {
            await api.delete('/telegram/disconnect');
            setConfig({ chatId: '', enabled: false });
            setMessage({ type: 'success', text: 'Telegram account disconnected successfully.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to disconnect: ' + (err.response?.data?.message || err.message) });
        } finally {
            setDisconnecting(false);
        }
    };

    if (loading) {
        return (
            <div className="App">

                <div className="app-content">
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div className="spinner spinner-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="App">

            <div className="app-content">
                <div className="page-header">
                    <h1 className="page-title">Telegram Settings</h1>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {/* Main Settings Form */}
                    <div className="card">
                        <div className="card-header">
                            <h3>Configure Telegram Notifications</h3>
                        </div>
                        <div className="card-body">
                            {message.text && (
                                <div className={`alert alert-${message.type}`} style={{ marginBottom: 'var(--spacing-md)' }}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSave}>
                                <div className="form-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <label>Connection Status</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xs)' }}>
                                        <div style={{
                                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                                            borderRadius: '4px',
                                            backgroundColor: config.chatId ? 'rgba(40, 167, 69, 0.1)' : 'rgba(108, 117, 125, 0.1)',
                                            color: config.chatId ? '#28a745' : '#6c757d',
                                            fontWeight: '600',
                                            fontSize: '0.9rem'
                                        }}>
                                            {config.chatId ? 'CONNECTED' : 'NOT CONNECTED'}
                                        </div>
                                        <button type="button" className="btn btn-secondary btn-sm" onClick={handleRefresh}>
                                            Refresh Status
                                        </button>
                                    </div>
                                </div>

                                {!config.chatId ? (
                                    <div className="form-group" style={{ textAlign: 'center', padding: 'var(--spacing-lg) 0' }}>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-lg"
                                            onClick={handleConnect}
                                            disabled={linking}
                                            style={{ backgroundColor: '#0088cc', borderColor: '#0088cc', width: '100%' }}
                                        >
                                            <i className="fab fa-telegram-plane" style={{ marginRight: '8px' }}></i>
                                            {linking ? 'Generalling Link...' : 'Connect to Telegram Bot'}
                                        </button>
                                        <p style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                            One-click connection. No manual Chat ID entry required.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="form-group">
                                            <label>Telegram Chat ID</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={config.chatId || ''}
                                                readOnly
                                                disabled
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={config.enabled}
                                                    onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                                                    style={{ marginRight: '0.5rem' }}
                                                />
                                                Enable Telegram Notifications
                                            </label>
                                        </div>

                                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-lg)' }}>
                                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                                {saving ? 'Saving...' : 'Save Preferences'}
                                            </button>
                                            <button type="button" className="btn btn-secondary" onClick={handleTest} disabled={testing}>
                                                {testing ? 'Sending...' : 'Send Test Notification'}
                                            </button>
                                            <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-sm)' }}>
                                                <button type="button" className="btn btn-secondary" onClick={handleConnect}>
                                                    Reconnect
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={handleDisconnect}
                                                    disabled={disconnecting}
                                                >
                                                    {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </form>

                            <hr style={{ margin: 'var(--spacing-xl) 0', opacity: '0.1' }} />

                            <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '4px' }}>
                                <strong>What notifications will you receive?</strong>
                                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                                    <li>Request submitted confirmation</li>
                                    <li>Request approved/rejected updates</li>
                                    <li>Pending approvals (for managers)</li>
                                    <li>SLA deadline reminders</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TelegramSettings;
