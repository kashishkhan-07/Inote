 import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import EmptyState from './components/EmptyState';
import LoadingSkeleton from './components/LoadingSkeleton';
import {
  fetchNotes,
  createNoteApi,
  updateNoteApi,
  deleteNoteApi,
} from './services/api';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

function App() {
  // --- 1. State Management ---
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Action States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // null = Create Mode, object = Edit Mode
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null); // null = Closed, object = Open
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  // Helper to trigger toast notifications
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // --- 2. READ (Fetch Notes on Mount) ---
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const res = await fetchNotes();
      if (res.success) {
        setNotes(res.data);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      showToast(err.response?.data?.message || 'Failed to connect to backend server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. CREATE & UPDATE Handler ---
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      if (editingNote) {
        // UPDATE Existing Note (PUT)
        const res = await updateNoteApi(editingNote._id, formData);
        if (res.success) {
          // Replace the old note with the updated note in state
          setNotes((prevNotes) =>
            prevNotes.map((note) =>
              note._id === editingNote._id ? res.data : note
            )
          );
          showToast('Note updated successfully!');
        }
      } else {
        // CREATE New Note (POST)
        const res = await createNoteApi(formData);
        if (res.success) {
          // Prepend the new note to the top of the notes array
          setNotes((prevNotes) => [res.data, ...prevNotes]);
          showToast('Note created successfully!');
        }
      }

      // Close modal and reset
      setIsModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error('Save error:', err);
      showToast(err.response?.data?.message || 'Failed to save note', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. DELETE Handler ---
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      const res = await deleteNoteApi(deleteTarget._id);
      if (res.success) {
        // Remove the note from local state
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== deleteTarget._id)
        );
        showToast('Note deleted successfully!');
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete error:', err);
      showToast(err.response?.data?.message || 'Failed to delete note', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // --- 5. Modal Open Helpers ---
  const openCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  // --- 6. Live Filtered Notes for Search ---
  const filteredNotes = notes.filter((note) => {
    const query = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-xl border border-slate-100 animate-in slide-in-from-top-4 duration-200">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          <span className="text-sm font-medium text-slate-800">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sticky Header Navbar */}
      <Navbar
        onOpenCreateModal={openCreateModal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalNotes={notes.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Loading State */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredNotes.length > 0 ? (
          /* Notes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={openEditModal}
                onDelete={(n) => setDeleteTarget(n)}
              />
            ))}
          </div>
        ) : (
          /* Empty / No Search Results State */
          <EmptyState
            onOpenCreate={openCreateModal}
            isSearch={searchTerm.trim() !== ''}
            searchTerm={searchTerm}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/60 text-center text-xs text-slate-400">
        <p>MERN Stack Notes App • Clean Architecture</p>
      </footer>

      {/* Create & Edit Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingNote}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        noteTitle={deleteTarget?.title || ''}
        isDeleting={isDeleting}
      />

    </div>
  );
}

export default App;