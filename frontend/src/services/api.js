import axios from 'axios';

// Backend Base URL
const API_BASE_URL = 'http://localhost:5000/api/notes';

// Create an Axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API Service Methods
 */

// 1. Fetch all notes
export const fetchNotes = async () => {
  const response = await api.get('/');
  return response.data; // returns { success: true, count: N, data: [...] }
};

// 2. Fetch single note by ID
export const fetchNoteById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// 3. Create a new note
export const createNoteApi = async (noteData) => {
  const response = await api.post('/', noteData);
  return response.data;
};

// 4. Update an existing note
export const updateNoteApi = async (id, noteData) => {
  const response = await api.put(`/${id}`, noteData);
  return response.data;
};

// 5. Delete a note
export const deleteNoteApi = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export default api;