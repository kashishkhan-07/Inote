import React from 'react';
import { ArrowUpDown, Filter, Palette, Check, Calendar } from 'lucide-react';

const COLORS = [
  { id: 'all', label: 'All Colors', bg: 'bg-slate-400' },
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
  totalFiltered,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs text-xs">

      {/* Left: Status Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'todo', label: 'To Do' },
          { id: 'in_progress', label: 'In Progress' },
          { id: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right: Sort By Dropdown & Color Filter Dots */}
      <div className="flex items-center gap-3 ml-auto">

        {/* Color Filter Dots */}
        <div className="flex items-center gap-1">
          {COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setColorFilter(c.id)}
              title={`Filter by ${c.label}`}
              className={`w-5 h-5 rounded-full ${c.bg} flex items-center justify-center transition-all cursor-pointer ${
                colorFilter === c.id
                  ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {colorFilter === c.id && c.id !== 'all' && (
                <Check className="w-2.5 h-2.5 text-white" />
              )}
            </button>
          ))}
        </div>

        {/* Chronological Sorter Dropdown */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-2.5 py-1.5 rounded-xl border-none outline-hidden cursor-pointer"
          >
            <option value="newest">⏱️ Newest Time First (Default)</option>
            <option value="oldest">⏳ Oldest First</option>
            <option value="title_asc">🔤 Title (A → Z)</option>
            <option value="title_desc">🔤 Title (Z → A)</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default FilterToolbar;