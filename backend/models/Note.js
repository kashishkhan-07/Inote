import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    // The User who owns this note
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a note title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide note content'],
      trim: true,
    },
    // For Kanban board workflow
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed'],
      default: 'todo',
    },
    color: {
      type: String,
      default: 'indigo',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Manages createdAt & updatedAt (Used for time sorting)
  }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;