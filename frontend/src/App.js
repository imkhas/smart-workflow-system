import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
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
import Profile from './pages/Profile';
import Members from './pages/Members';
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
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/members"
            element={
              <PrivateRoute>
                <Layout>
                  <Members />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/requests/new"
            element={
              <PrivateRoute>
                <Layout>
                  <NewRequest />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <PrivateRoute>
                <Layout>
                  <MyRequests />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/requests/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <RequestDetails />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/approvals/pending"
            element={
              <PrivateRoute>
                <Layout>
                  <PendingApprovals />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/approvals/history"
            element={
              <PrivateRoute>
                <Layout>
                  <ApprovalHistory />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Layout>
                  <SearchRequests />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/telegram"
            element={
              <PrivateRoute>
                <Layout>
                  <TelegramSettings />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />

          {/* 404 - Not Found - duplicate route removed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;