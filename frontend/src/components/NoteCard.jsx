import React, { useState } from 'react';
import { Pencil, Trash2, Calendar, Copy, Check, Pin, Clock, AlertTriangle } from 'lucide-react';

const colorThemes = {
  indigo: {
    topBar: 'bg-gradient-to-r from-indigo-500 to-violet-500',
  },
  emerald: {
    topBar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
  },
  amber: {
    topBar: 'bg-gradient-to-r from-amber-500 to-orange-500',
  },
  rose: {
    topBar: 'bg-gradient-to-r from-rose-500 to-pink-500',
  },
  sky: {
    topBar: 'bg-gradient-to-r from-sky-500 to-cyan-500',
  },
  purple: {
    topBar: 'bg-gradient-to-r from-purple-500 to-fuchsia-500',
  },
};

const NoteCard = ({ note, onEdit, onDelete, onTogglePin }) => {
  const [copied, setCopied] = useState(false);

    // Format Card Date: "14 Aug 2026, 01:10 pm"
  const formatDateTimeIST = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(dateString));
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUpdated = note.updatedAt && note.createdAt !== note.updatedAt;
  const isOverdue = note.dueDate && new Date(note.dueDate) < new Date() && note.status !== 'completed';
  const theme = colorThemes[note.color] || colorThemes.indigo;

  return (
    <div className="group relative bg-white dark:bg-slate-800/90 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:shadow-xl dark:shadow-slate-950/60 transition-all duration-200 flex flex-col justify-between overflow-hidden">

      {/* Top Color Accent */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.topBar}`} />

      <div>
        {/* Title & Top Action Buttons */}
        <div className="flex items-start justify-between gap-2.5 mb-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-snug line-clamp-2">
            {note.title}
          </h3>

          <div className="flex items-center gap-1 shrink-0">
            {/* Pin Button */}
            <button
              onClick={() => onTogglePin && onTogglePin(note)}
              title={note.isPinned ? 'Unpin' : 'Pin'}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                note.isPinned
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              title="Copy content"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Overdue Warning Badge */}
        {isOverdue && (
          <div className="mb-2.5 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
            <AlertTriangle className="w-3 h-3" />
            <span>Overdue Deadline</span>
          </div>
        )}

        {/* Content Body */}
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line line-clamp-4 sm:line-clamp-5 mb-4">
          {note.content}
        </p>
      </div>

      {/* Card Footer: Clean Timestamp & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col gap-2.5">

        {/* Creation Timestamp in IST */}
        <div className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400 text-xs">
          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="text-[11px] sm:text-xs">
            {formatDateTimeIST(note.createdAt)}
          </span>
          {isUpdated && (
            <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded-md font-semibold">
              edited
            </span>
          )}
        </div>

        {/* Action Buttons: Touch Friendly */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-50 dark:border-slate-800">
          <button
            onClick={() => onEdit(note)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete(note)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default NoteCard;