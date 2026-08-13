import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NoteCard from './components/NoteCard';
import KanbanBoard from './components/KanbanBoard';
import NoteModal from './components/NoteModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AuthModal from './components/AuthModal';
import EmptyState from './components/EmptyState';
import LoadingSkeleton from './components/LoadingSkeleton';
import {
  fetchNotes,
  createNoteApi,
  updateNoteApi,
  deleteNoteApi,
} from './services/api';
import { AlertCircle, CheckCircle2, X, Pin, Sparkles, Folder, Lock, ShieldCheck, Kanban, LayoutGrid } from 'lucide-react';

function App() {
  // Theme State
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

  // Auth State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('inotes-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // View Mode: 'grid' or 'kanban'
  const [viewMode, setViewMode] = useState('grid');

  // Notes Data & UI States
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setNotes([]);
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const res = await fetchNotes();
      if (res.success) {
        setNotes(res.data);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        showToast('Could not load notes from server', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auth Handlers
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('inotes-token');
    localStorage.removeItem('inotes-user');
    setUser(null);
    setNotes([]);
    showToast('Logged out successfully');
  };

  // CRUD Handlers
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingNote) {
        const res = await updateNoteApi(editingNote._id, formData);
        if (res.success) {
          setNotes((prev) =>
            prev.map((n) => (n._id === editingNote._id ? res.data : n))
          );
          showToast('Task updated successfully!');
        }
      } else {
        const res = await createNoteApi(formData);
        if (res.success) {
          // Prepend at the top (sorted by newest time)
          setNotes((prev) => [res.data, ...prev]);
          showToast('Task created successfully!');
        }
      }
      setIsModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status Change for Kanban (Drag & Drop or Button Click)
  const handleStatusChange = async (noteId, newStatus) => {
    try {
      const res = await updateNoteApi(noteId, { status: newStatus });
      if (res.success) {
        setNotes((prev) =>
          prev.map((n) => (n._id === noteId ? res.data : n))
        );
        showToast(`Moved to ${newStatus.replace('_', ' ')}`);
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const updatedStatus = !note.isPinned;
      const res = await updateNoteApi(note._id, { isPinned: updatedStatus });
      if (res.success) {
        setNotes((prev) =>
          prev.map((n) => (n._id === note._id ? res.data : n))
        );
        showToast(updatedStatus ? 'Pinned to top 📌' : 'Unpinned');
      }
    } catch (err) {
      showToast('Failed to pin note', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await deleteNoteApi(deleteTarget._id);
      if (res.success) {
        setNotes((prev) => prev.filter((n) => n._id !== deleteTarget._id));
        showToast('Note deleted successfully!');
      }
      setDeleteTarget(null);
    } catch (err) {
      showToast('Failed to delete note', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const filteredNotes = notes.filter((n) => {
    const q = searchTerm.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">

      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-5 z-50 flex items-center gap-3 px-5 py-3.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700 animate-in slide-in-from-top-4 duration-200">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navbar with View Mode Switcher */}
      <Navbar
        onOpenCreateModal={() => { setEditingNote(null); setIsModalOpen(true); }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalNotes={notes.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main App Content */}
      {user ? (
        <>
          {/* Hero Welcome Banner */}
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white shadow-xl shadow-indigo-500/15 relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-3 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {new Intl.DateTimeFormat('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    }).format(new Date())} (IST)
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {getGreeting()}, {user.name.split(' ')[0]}! ✨
                </h2>
                <p className="text-indigo-100/80 text-sm mt-1 max-w-md">
                  Active Mode: <span className="font-bold underline">{viewMode === 'kanban' ? 'Kanban Task Board' : 'Notes Grid'}</span>. You have {notes.length} total tasks.
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-3">
                <button
                  onClick={() => { setEditingNote(null); setIsModalOpen(true); }}
                  className="px-5 py-3 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-lg shadow-black/10 transition-all active:scale-95 cursor-pointer"
                >
                  + New Task
                </button>
              </div>

              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            {isLoading ? (
              <LoadingSkeleton />
            ) : viewMode === 'kanban' ? (
              /* 📊 KANBAN BOARD VIEW */
              <KanbanBoard
                notes={filteredNotes}
                onEdit={(n) => { setEditingNote(n); setIsModalOpen(true); }}
                onDelete={(n) => setDeleteTarget(n)}
                onTogglePin={handleTogglePin}
                onStatusChange={handleStatusChange}
                onOpenCreateModal={() => { setEditingNote(null); setIsModalOpen(true); }}
              />
            ) : filteredNotes.length > 0 ? (
              /* 🗂️ STANDARD GRID VIEW */
              <>
                {pinnedNotes.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <Pin className="w-3.5 h-3.5 text-indigo-500 fill-current" />
                      <span>Pinned Notes ({pinnedNotes.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pinnedNotes.map((note) => (
                        <NoteCard
                          key={note._id}
                          note={note}
                          onEdit={(n) => { setEditingNote(n); setIsModalOpen(true); }}
                          onDelete={(n) => setDeleteTarget(n)}
                          onTogglePin={handleTogglePin}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {otherNotes.length > 0 && (
                  <section>
                    {pinnedNotes.length > 0 && (
                      <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <Folder className="w-3.5 h-3.5" />
                        <span>All Notes ({otherNotes.length})</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {otherNotes.map((note) => (
                        <NoteCard
                          key={note._id}
                          note={note}
                          onEdit={(n) => { setEditingNote(n); setIsModalOpen(true); }}
                          onDelete={(n) => setDeleteTarget(n)}
                          onTogglePin={handleTogglePin}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <EmptyState
                onOpenCreate={() => { setEditingNote(null); setIsModalOpen(true); }}
                isSearch={searchTerm.trim() !== ''}
                searchTerm={searchTerm}
              />
            )}
          </main>
        </>
      ) : (
        /* Logged Out Landing */
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/10">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Your Private, Encrypted Workspace
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 text-sm sm:text-base leading-relaxed">
            Every user gets their own private account. Sign in or register to manage personal notes and track workflow stages with our new Kanban board.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 transition-all cursor-pointer"
            >
              Get Started — It's Free
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-2xl w-full text-left">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">User Isolated</h4>
              <p className="text-xs text-slate-400 mt-1">Only you can view and edit your tasks.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <Kanban className="w-6 h-6 text-indigo-500 mb-2" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Kanban Board</h4>
              <p className="text-xs text-slate-400 mt-1">To Do, In Progress, and Completed pipelines.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <Sparkles className="w-6 h-6 text-amber-500 mb-2" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Real-time CRUD</h4>
              <p className="text-xs text-slate-400 mt-1">Instant updates with Drag & Drop workflow.</p>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>iNotes • Secure Fullstack Notes & Kanban Platform</p>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

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