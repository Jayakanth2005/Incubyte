import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: async (data: { email: string; password: string; name: string; role?: string }) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    login: async (data: { email: string; password: string }) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },
};

// Sweet API
export const sweetAPI = {
    getAll: async () => {
        const response = await api.get('/sweets');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/sweets/${id}`);
        return response.data;
    },
    search: async (params: { name?: string; category?: string; minPrice?: number; maxPrice?: number }) => {
        const response = await api.get('/sweets/search', { params });
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/sweets', data);
        return response.data;
    },
    update: async (id: number, data: any) => {
        const response = await api.put(`/sweets/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/sweets/${id}`);
        return response.data;
    },
    purchase: async (id: number, quantity: number) => {
        const response = await api.post(`/sweets/${id}/purchase`, { quantity });
        return response.data;
    },
    restock: async (id: number, quantity: number) => {
        const response = await api.post(`/sweets/${id}/restock`, { quantity });
        return response.data;
    },
};

export default api;
