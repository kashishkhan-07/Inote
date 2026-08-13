import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto Token Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('inotes-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const registerApi = async (userData) => (await api.post('/auth/register', userData)).data;
export const loginApi = async (credentials) => (await api.post('/auth/login', credentials)).data;
export const getMeApi = async () => (await api.get('/auth/me')).data;

// Notes & Tasks endpoints
export const fetchNotes = async () => (await api.get('/notes')).data;
export const fetchNoteById = async (id) => (await api.get(`/notes/${id}`)).data;
export const createNoteApi = async (noteData) => (await api.post('/notes', noteData)).data;
export const updateNoteApi = async (id, noteData) => (await api.put(`/notes/${id}`, noteData)).data;
export const deleteNoteApi = async (id) => (await api.delete(`/notes/${id}`)).data;

export default api;