import React, { useState } from 'react';
import { Pencil, Trash2, Calendar, Copy, Check, Pin, Clock } from 'lucide-react';

const colorThemes = {
  indigo: {
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40',
    topBar: 'bg-gradient-to-r from-indigo-500 to-violet-500',
  },
  emerald: {
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
    topBar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
    topBar: 'bg-gradient-to-r from-amber-500 to-orange-500',
  },
  rose: {
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800/40',
    topBar: 'bg-gradient-to-r from-rose-500 to-pink-500',
  },
  sky: {
    badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-800/40',
    topBar: 'bg-gradient-to-r from-sky-500 to-cyan-500',
  },
  purple: {
    badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800/40',
    topBar: 'bg-gradient-to-r from-purple-500 to-fuchsia-500',
  },
};

const NoteCard = ({ note, onEdit, onDelete, onTogglePin }) => {
  const [copied, setCopied] = useState(false);

  // 🇮🇳 Format Date & Time in Indian Standard Time (IST) e.g., "13 Aug 2026 • 07:23 PM"
  const formatDateTimeIST = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const readingTime = Math.max(1, Math.ceil((note.content || '').split(/\s+/).length / 200));

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUpdated = note.updatedAt && note.createdAt !== note.updatedAt;
  const theme = colorThemes[note.color] || colorThemes.indigo;

  return (
    <div className="group relative bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs hover:shadow-2xl dark:hover:shadow-slate-950/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">

      {/* Top Accent Strip */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.topBar}`} />

      <div>
        {/* Header: Title & Pin/Copy Buttons */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug line-clamp-2">
            {note.title}
          </h3>

          <div className="flex items-center gap-1 shrink-0">
            {/* Pin Toggle */}
            <button
              onClick={() => onTogglePin && onTogglePin(note)}
              title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                note.isPinned
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                  : 'text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100'
              }`}
            >
              <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              title="Copy Note"
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 p-1.5 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line line-clamp-5 mb-6">
          {note.content}
        </p>
      </div>

      {/* Card Footer: Timestamp & Action Buttons */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col gap-2">

        {/* Date, Time & Reading Duration */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-400">

          {/* Indian Date & Time Badge */}
          <div
            className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400"
            title={isUpdated ? `Updated: ${formatDateTimeIST(note.updatedAt)}` : `Created: ${formatDateTimeIST(note.createdAt)}`}
          >
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

          {/* Reading Time */}
          <div className="text-[11px] text-slate-400 font-medium">
            {readingTime}m read
          </div>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center justify-end gap-1 pt-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            title="Edit Note"
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-all cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(note)}
            title="Delete Note"
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default NoteCard;