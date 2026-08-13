import React, { useState, useEffect } from 'react';
import { X, Loader2, Palette, CheckCircle2, Clock, ListTodo, Calendar } from 'lucide-react';

const COLORS = [
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-500' },
  { id: 'sky', label: 'Sky', bg: 'bg-sky-500' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-500' },
];

const STATUS_OPTIONS = [
  { id: 'todo', label: 'To Do', icon: ListTodo },
  { id: 'in_progress', label: 'In Progress', icon: Clock },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

const NoteModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('indigo');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setColor(initialData.color || 'indigo');
      setStatus(initialData.status || 'todo');
      setDueDate(initialData.dueDate ? initialData.dueDate.substring(0, 16) : '');
    } else {
      setTitle('');
      setContent('');
      setColor('indigo');
      setStatus('todo');
      setDueDate('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please add a title for your task');
      return;
    }
    if (!content.trim()) {
      setError('Please write some content');
      return;
    }

    setError('');
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      color,
      status,
      dueDate: dueDate || null,
    });
  };

  const isEditing = Boolean(initialData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">

      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {isEditing ? 'Edit Task' : 'Create Task / Note'}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Assigned in Indian Standard Time (IST)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. Review Quarterly Budget"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              autoFocus
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-medium rounded-2xl border border-slate-200/80 dark:border-slate-700/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-hidden transition-all shadow-xs"
            />
          </div>

          {/* Workflow Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Status Stage
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = status === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatus(opt.id)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color & Optional Due Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Color Accent */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Accent Color</span>
              </label>
              <div className="flex items-center gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    title={c.label}
                    className={`w-7 h-7 rounded-full ${c.bg} transition-all cursor-pointer ${
                      color === c.id
                        ? 'ring-3 ring-offset-2 ring-indigo-500 scale-110 shadow-md'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Optional Target Due Date */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Target Deadline (Optional)</span>
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-hidden cursor-pointer"
              />
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Add task notes, checklist, or links..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm rounded-2xl border border-slate-200/80 dark:border-slate-700/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-hidden transition-all resize-none shadow-xs"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default NoteModal;