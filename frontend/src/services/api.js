import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 💡 Automatic Token Interceptor: Injects "Authorization: Bearer <token>"
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

/**
 * AUTH API CALLS
 */
export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * NOTES & TASKS API CALLS (Automatically Protected)
 */
export const fetchNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};

export const fetchNoteById = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNoteApi = async (noteData) => {
  const response = await api.post('/notes', noteData);
  return response.data;
};

export const updateNoteApi = async (id, noteData) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNoteApi = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

export default api;