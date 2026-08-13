import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
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
  },
  {
    
    timestamps: true,
  }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;