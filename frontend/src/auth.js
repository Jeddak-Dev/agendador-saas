import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'; // Certifique-se de que esta URL está correta

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/token/`, { email, password });
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register/`, userData);
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // TODO: Chamar endpoint de logout no backend se JWT Blacklist for implementado
};

export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

export const refreshAccessToken = async () => {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available.');
        }
        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh); // Rotate refresh token if backend is configured
        return response.data.access;
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        logout(); // Força logout se o refresh token falhar
        throw error;
    }
};

// Configura uma instância do Axios para adicionar o token de autorização
export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    async (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Se o erro for 401 (Unauthorized) e não for uma requisição de refresh token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest); // Repete a requisição original com o novo token
            } catch (refreshError) {
                // Se o refresh token falhar, redireciona para o login
                window.location.href = '/login'; // Ou use navigate do react-router-dom
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const getUserRole = () => {
    const accessToken = getAccessToken();
    if (accessToken) {
        try {
            const base64Url = accessToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            // Supondo que as roles estão no payload do JWT
            if (payload.is_owner) return 'owner';
            if (payload.is_admin) return 'admin';
            if (payload.is_client) return 'client';
        } catch (e) {
            console.error("Erro ao decodificar token JWT:", e);
        }
    }
    return null;
};