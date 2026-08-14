import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FilterToolbar from './components/FilterToolbar';
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
import {
  AlertCircle,
  CheckCircle2,
  X,
  Pin,
  Sparkles,
  Folder,
  Lock,
  ShieldCheck,
  Kanban
} from 'lucide-react';

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

  // Filter & Sorter States
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');

  // Data & UI States
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
        showToast('Could not load tasks from server', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
        showToast('Task deleted successfully!');
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

  // Filter & Chronological Sort Engine
  const processedNotes = notes
    .filter((n) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      const matchesStatus =
        viewMode === 'kanban' || statusFilter === 'all' || (n.status || 'todo') === statusFilter;
      const matchesColor =
        colorFilter === 'all' || (n.color || 'indigo') === colorFilter;

      return matchesSearch && matchesStatus && matchesColor;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'title_desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  const pinnedNotes = processedNotes.filter((n) => n.isPinned);
  const otherNotes = processedNotes.filter((n) => !n.isPinned);

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

      {/* Navbar */}
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
          {/* Hero Welcome Banner with Strict DD/MM/YYYY Format */}
          <div className="max-w-6xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-6 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white shadow-xl shadow-indigo-500/15 relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-2.5 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {(() => {
                      const now = new Date();
                      const d = String(now.getDate()).padStart(2, '0');
                      const m = String(now.getMonth() + 1).padStart(2, '0');
                      const y = now.getFullYear();
                      const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
                      return `${d}/${m}/${y} • ${time} (IST)`;
                    })()}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {getGreeting()}, {user.name.split(' ')[0]}! ✨
                </h2>
                <p className="text-indigo-100/80 text-xs sm:text-sm mt-0.5 max-w-md">
                  Showing {processedNotes.length} tasks • Sorted by {sortBy.replace('_', ' ')}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-3">
                <button
                  onClick={() => { setEditingNote(null); setIsModalOpen(true); }}
                  className="px-5 py-2.5 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-lg shadow-black/10 transition-all active:scale-95 cursor-pointer"
                >
                  + New Task
                </button>
              </div>

              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* Filter & Sort Controls Toolbar */}
          <div className="max-w-6xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-2">
            <FilterToolbar
              sortBy={sortBy}
              setSortBy={setSortBy}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              colorFilter={colorFilter}
              setColorFilter={setColorFilter}
              isKanbanView={viewMode === 'kanban'}
            />
          </div>

          {/* Main Display Area */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 space-y-7">
            {isLoading ? (
              <LoadingSkeleton />
            ) : viewMode === 'kanban' ? (
              /* KANBAN BOARD */
              <KanbanBoard
                notes={processedNotes}
                onEdit={(n) => { setEditingNote(n); setIsModalOpen(true); }}
                onDelete={(n) => setDeleteTarget(n)}
                onTogglePin={handleTogglePin}
                onStatusChange={handleStatusChange}
                onOpenCreateModal={() => { setEditingNote(null); setIsModalOpen(true); }}
              />
            ) : processedNotes.length > 0 ? (
              /* GRID VIEW */
              <>
                {/* Pinned Tasks */}
                {pinnedNotes.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <Pin className="w-3.5 h-3.5 text-indigo-500 fill-current" />
                      <span>Pinned Tasks ({pinnedNotes.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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

                {/* All Tasks */}
                {otherNotes.length > 0 && (
                  <section>
                    {pinnedNotes.length > 0 && (
                      <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <Folder className="w-3.5 h-3.5" />
                        <span>All Tasks ({otherNotes.length})</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
                isSearch={searchTerm.trim() !== '' || statusFilter !== 'all' || colorFilter !== 'all'}
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
            Sign in or create an account to start creating, organizing, and tracking tasks chronologically with Kanban workflow.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 transition-all cursor-pointer"
          >
            Get Started — It's Free
          </button>
        </main>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>iNotes • Secure Fullstack Notes & Tasks Platform with IST Sorting</p>
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

// 💡 Essential Default Export
export default App;