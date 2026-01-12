import api from './api';

const requestService = {
    // Get all request types
    getRequestTypes: async () => {
        const response = await api.get('/request-types');
        return response.data;
    },

    // Create a new request
    createRequest: async (requestData) => {
        const response = await api.post('/requests', requestData);
        return response.data;
    },

    // Get my requests
    getMyRequests: async () => {
        const response = await api.get('/requests');
        return response.data;
    },

    // Get request by ID
    getRequestById: async (id) => {
        const response = await api.get(`/requests/${id}`);
        return response.data;
    },

    // Update request
    updateRequest: async (id, requestData) => {
        const response = await api.put(`/requests/${id}`, requestData);
        return response.data;
    },

    // Submit request (change from DRAFT to PENDING)
    submitRequest: async (id) => {
        const response = await api.post(`/requests/${id}/submit`);
        return response.data;
    },

    // Upload attachment
    uploadAttachment: async (requestId, file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`/requests/${requestId}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete request
    deleteRequest: async (id) => {
        const response = await api.delete(`/requests/${id}`);
        return response.data;
    },
};

export default requestService;