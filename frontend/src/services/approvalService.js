import api from './api';

const approvalService = {
    // Get pending approvals for current user
    getPendingApprovals: async () => {
        const response = await api.get('/approvals/pending');
        return response.data;
    },

    // Approve a request
    approveRequest: async (requestId, comments) => {
        const response = await api.post(`/approvals/${requestId}/approve`, {
            action: 'APPROVED',
            comments
        });
        return response.data;
    },

    // Reject a request
    rejectRequest: async (requestId, comments) => {
        const response = await api.post(`/approvals/${requestId}/reject`, {
            action: 'REJECTED',
            comments
        });
        return response.data;
    },

    // Get approval history
    getApprovalHistory: async () => {
        const response = await api.get('/approvals/history');
        return response.data;
    }
};

export default approvalService;
