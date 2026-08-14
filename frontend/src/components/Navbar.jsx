import React from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Sun,
  Moon,
  LogIn,
  LogOut,
  LayoutGrid,
  Kanban
} from 'lucide-react';

const Navbar = ({
  onOpenCreateModal,
  searchTerm,
  setSearchTerm,
  totalNotes,
  darkMode,
  setDarkMode,
  user,
  onOpenAuthModal,
  onLogout,
  viewMode,
  setViewMode,
}) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8">

        {/* Top Main Navbar Row */}
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">

          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  iNotes
                </h1>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {user ? `${totalNotes} tasks` : 'Private Workspace'}
              </p>
            </div>
          </div>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          {user && (
            <div className="flex-1 max-w-xs md:max-w-md hidden sm:block">
              <div className="relative group">
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search notes or tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-hidden transition-all shadow-xs"
                />
              </div>
            </div>
          )}

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">

            {/* View Switcher (Grid vs Kanban) */}
            {user && (
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  title="Kanban Board"
                  className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'kanban'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <Kanban className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Light Theme' : 'Dark Theme'}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* User Auth Section */}
            {user ? (
              <>
                {/* Add Task Button */}
                <button
                  onClick={onOpenCreateModal}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden xs:inline sm:inline">Add Task</span>
                </button>

                {/* User Avatar & Logout */}
                <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
                  <div
                    title={user.email}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800/60"
                  >
                    {getInitials(user.name)}
                  </div>

                                    <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onLogout();
                    }}
                    title="Logout"
                    className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Search Bar (Full width underneath on small screens) */}
        {user && (
          <div className="sm:hidden pb-3 pt-1">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes or tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-hidden transition-all shadow-xs"
              />
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;