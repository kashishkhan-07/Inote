import Note from '../models/Note.js';
import mongoose from 'mongoose';

/**
 * @desc    Get all notes (sorted by newest first)
 */
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Unable to fetch notes',
      error: error.message,
    });
  }
};

/**
 * @desc    Get a single note by ID
 */
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Note ID format',
      });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new note
   POST /api/notes
 */
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation: Ensure title and content are present
    if (!title || !content || title.trim() === '' || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and content for the note',
      });
    }

    const newNote = await Note.create({
      title: title.trim(),
      content: content.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: newNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to create note',
      error: error.message,
    });
  }
};

/**
 * @desc    Update an existing note
   PUT /api/notes/:id
 */
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Note ID format',
      });
    }

    if (!title || !content || title.trim() === '' || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title and content cannot be empty',
      });
    }

    // { new: true } returns the updated document rather than the old one
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title: title.trim(), content: content.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to update note',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a note
  DELETE /api/notes/:id
 */
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Note ID format',
      });
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: { id: deletedNote._id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to delete note',
      error: error.message,
    });
  }
};