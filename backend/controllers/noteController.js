import Note from '../models/Note.js';
import mongoose from 'mongoose';

/**
 * @desc    Get all notes for the LOGGED-IN user
 *          Sorted by newest creation time first (createdAt: -1)
 * @route   GET /api/notes
 */
export const getNotes = async (req, res) => {
  try {
    // Only fetch notes where user matches the logged-in user
    const notes = await Note.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

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
 * @desc    Get single note by ID (Belonging to logged-in user)
 * @route   GET /api/notes/:id
 */
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Note ID format',
      });
    }

    const note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized',
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
 * @desc    Create a new note linked to logged-in user
 * @route   POST /api/notes
 */
export const createNote = async (req, res) => {
  try {
    const { title, content, color, isPinned, status } = req.body;

    if (!title || !content || title.trim() === '' || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and content for the note',
      });
    }

    const newNote = await Note.create({
      user: req.user._id, // Attach logged-in user ID
      title: title.trim(),
      content: content.trim(),
      color: color || 'indigo',
      isPinned: isPinned || false,
      status: status || 'todo',
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
 * @desc    Update a note (Only if it belongs to logged-in user)
 * @route   PUT /api/notes/:id
 */
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Note ID format',
      });
    }

    // Verify ownership
    const note = await Note.findOne({ _id: id, user: req.user._id });
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized to edit',
      });
    }

    // Update note fields
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

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
 * @desc    Delete a note (Only if it belongs to logged-in user)
 * @route   DELETE /api/notes/:id
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

    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized to delete',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: { id: note._id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to delete note',
      error: error.message,
    });
  }
};