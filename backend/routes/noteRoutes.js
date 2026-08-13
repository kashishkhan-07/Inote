import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';

const router = express.Router();

// Routes for /api/notes
router.route('/')
  .get(getNotes)       // GET /api/notes -> Get all notes
  .post(createNote);   // POST /api/notes -> Create a new note

// Routes for /api/notes/:id
router.route('/:id')
  .get(getNoteById)    // GET /api/notes/:id -> Get single note
  .put(updateNote)     // PUT /api/notes/:id -> Update note
  .delete(deleteNote); // DELETE /api/notes/:id -> Delete note

export default router;