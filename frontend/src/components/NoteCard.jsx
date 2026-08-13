import React, { useState } from 'react';
import { Pencil, Trash2, Calendar, Copy, Check } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);

  // Format date nicely (e.g., "Aug 13, 2026")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Copy note content to clipboard
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUpdated = note.updatedAt && note.createdAt !== note.updatedAt;

  return (
    <div className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">

      <div>
        {/* Card Header: Title & Copy Button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-slate-900 text-lg leading-snug line-clamp-2">
            {note.title}
          </h3>

          <button
            onClick={handleCopy}
            title="Copy Note"
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Card Body: Content */}
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line line-clamp-5 mb-6">
          {note.content}
        </p>
      </div>

      {/* Card Footer: Timestamp & Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">

        {/* Date Info */}
        <div className="flex items-center gap-1.5" title={isUpdated ? `Updated ${formatDate(note.updatedAt)}` : `Created ${formatDate(note.createdAt)}`}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(note.createdAt)}</span>
          {isUpdated && (
            <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-1.5 py-0.5 rounded-full">
              edited
            </span>
          )}
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            title="Edit Note"
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(note)}
            title="Delete Note"
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default NoteCard;