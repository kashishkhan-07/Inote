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
  // --- 1. Theme State (Persistent in localStorage) ---
    // Default to false (Light Mode) or saved preference
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('inotes-theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('inotes-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('inotes-theme', 'light');
    }
  }, [darkMode]);

  // --- 2. Data & UI States ---
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // --- 3. Fetch Notes on Mount ---
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

  // --- 4. CREATE & UPDATE ---
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      if (editingNote) {
        const res = await updateNoteApi(editingNote._id, formData);
        if (res.success) {
          setNotes((prevNotes) =>
            prevNotes.map((note) =>
              note._id === editingNote._id ? res.data : note
            )
          );
          showToast('Note updated successfully!');
        }
      } else {
        const res = await createNoteApi(formData);
        if (res.success) {
          setNotes((prevNotes) => [res.data, ...prevNotes]);
          showToast('Note created successfully!');
        }
      }

      setIsModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error('Save error:', err);
      showToast(err.response?.data?.message || 'Failed to save note', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 5. DELETE ---
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      const res = await deleteNoteApi(deleteTarget._id);
      if (res.success) {
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

  const openCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const filteredNotes = notes.filter((note) => {
    const query = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-4 duration-200">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navbar with Dark Mode Toggle */}
      <Navbar
        onOpenCreateModal={openCreateModal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalNotes={notes.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredNotes.length > 0 ? (
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
          <EmptyState
            onOpenCreate={openCreateModal}
            isSearch={searchTerm.trim() !== ''}
            searchTerm={searchTerm}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/60 dark:border-slate-800/80 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>iNotes • MERN Stack CRUD with Dark Mode</p>
      </footer>

      {/* Modals */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingNote}
        isSubmitting={isSubmitting}
      />

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