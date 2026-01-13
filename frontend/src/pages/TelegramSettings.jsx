import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const TelegramSettings = () => {
    const [config, setConfig] = useState({
        chatId: '',
        enabled: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
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

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/telegram/config', config);
            setMessage({ type: 'success', text: 'Telegram settings saved successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save settings: ' + (err.response?.data?.message || err.message) });
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        if (!config.chatId) {
            setMessage({ type: 'error', text: 'Please enter your Chat ID first' });
            return;
        }

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

    if (loading) {
        return (
            <div className="App">
                <Navbar />
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
            <Navbar />
            <div className="app-content">
                <div className="page-header">
                    <h1 className="page-title">Telegram Settings</h1>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)' }}>
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
                                <div className="form-group">
                                    <label>Telegram Chat ID *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={config.chatId || ''}
                                        onChange={(e) => setConfig({ ...config, chatId: e.target.value })}
                                        placeholder="Enter your Telegram Chat ID"
                                        required
                                    />
                                    <small style={{ color: 'var(--color-text-secondary)', display: 'block', marginTop: '0.5rem' }}>
                                        Don't have your Chat ID? Follow the instructions on the right →
                                    </small>
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
                                    <small style={{ color: 'var(--color-text-secondary)', display: 'block', marginTop: '0.5rem' }}>
                                        Receive notifications when your requests are approved, rejected, or require action
                                    </small>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-lg)' }}>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Settings'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={handleTest} disabled={testing || !config.chatId}>
                                        {testing ? 'Sending...' : 'Send Test Notification'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="card">
                        <div className="card-header">
                            <h3>How to Get Your Chat ID</h3>
                        </div>
                        <div className="card-body">
                            <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                                <li>Open Telegram app on your phone or computer</li>
                                <li>Search for <strong>@WorkflowSystemBot</strong> (or your bot's username)</li>
                                <li>Click "Start" or send <code>/start</code> command</li>
                                <li>The bot will reply with your Chat ID</li>
                                <li>Copy the Chat ID and paste it above</li>
                                <li>Enable notifications and click "Save Settings"</li>
                                <li>Click "Send Test Notification" to verify it works</li>
                            </ol>

                            <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '4px' }}>
                                <strong>📱 What notifications will you receive?</strong>
                                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
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
