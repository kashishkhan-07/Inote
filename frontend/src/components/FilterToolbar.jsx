import React from 'react';
import { ArrowUpDown, Check } from 'lucide-react';

const COLORS = [
  { id: 'all', label: 'All', bg: 'bg-slate-400' },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-500' },
  { id: 'sky', label: 'Sky', bg: 'bg-sky-500' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-500' },
];

const FilterToolbar = ({
  sortBy,
  setSortBy,
  statusFilter,
  setStatusFilter,
  colorFilter,
  setColorFilter,
  isKanbanView,
}) => {
  return (
    <div className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-xs space-y-3">

      {/* 1. Status Filter Tabs (Only shown in Grid View to prevent Kanban clash!) */}
      {!isKanbanView && (
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'todo', label: 'To Do' },
            { id: 'in_progress', label: 'Progress' },
            { id: 'completed', label: 'Done' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`py-1.5 text-center font-bold rounded-lg transition-all text-xs cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* 2. Color Dots & Sort Controls */}
      <div className="flex items-center justify-between gap-2">

        {/* Color Palette Dots (Clean spacing, no overlapping) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setColorFilter(c.id)}
              title={`Filter by ${c.label}`}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${c.bg} flex items-center justify-center transition-all cursor-pointer ${
                colorFilter === c.id
                  ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              {colorFilter === c.id && c.id !== 'all' && (
                <Check className="w-2.5 h-2.5 text-white" />
              )}
            </button>
          ))}
        </div>

        {/* Compact Sorter Dropdown */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-slate-700 dark:text-slate-200 font-bold text-xs border-none outline-hidden cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title_asc">A → Z</option>
            <option value="title_desc">Z → A</option>
          </select>
        </div>

      </div>

    </div>
  );
};

export default FilterToolbar;