import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewRequest from './pages/NewRequest';
import MyRequests from './pages/MyRequests';
import PendingApprovals from './pages/PendingApprovals';
import RequestDetails from './pages/RequestDetails';
import ApprovalHistory from './pages/ApprovalHistory';
import SearchRequests from './pages/SearchRequests';
import TelegramSettings from './pages/TelegramSettings';
import NotFound from './pages/NotFound';
import './assets/styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/requests/new"
            element={
              <PrivateRoute>
                <NewRequest />
              </PrivateRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <PrivateRoute>
                <MyRequests />
              </PrivateRoute>
            }
          />
          <Route
            path="/requests/:id"
            element={
              <PrivateRoute>
                <RequestDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/approvals/pending"
            element={
              <PrivateRoute>
                <PendingApprovals />
              </PrivateRoute>
            }
          />
          <Route
            path="/approvals/history"
            element={
              <PrivateRoute>
                <ApprovalHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchRequests />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/telegram"
            element={
              <PrivateRoute>
                <TelegramSettings />
              </PrivateRoute>
            }
          />

          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />

          {/* 404 - Not Found */}
          <Route
            path="*"
            element={
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                textAlign: 'center',
                padding: 'var(--spacing-xl)'
              }}>
                <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
                <h2 style={{ color: 'var(--color-text-secondary)' }}>Page Not Found</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                  The page you're looking for doesn't exist.
                </p>
                <a href="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </a>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;