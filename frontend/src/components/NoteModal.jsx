import React, { useState, useEffect } from 'react';
import {
  X,
  Loader2,
  Palette,
  Clock,
  ListTodo,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Check
} from 'lucide-react';

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

const MONTHS = [
  { num: '01', label: '01 - Jan' },
  { num: '02', label: '02 - Feb' },
  { num: '03', label: '03 - Mar' },
  { num: '04', label: '04 - Apr' },
  { num: '05', label: '05 - May' },
  { num: '06', label: '06 - Jun' },
  { num: '07', label: '07 - Jul' },
  { num: '08', label: '08 - Aug' },
  { num: '09', label: '09 - Sep' },
  { num: '10', label: '10 - Oct' },
  { num: '11', label: '11 - Nov' },
  { num: '12', label: '12 - Dec' },
];

const NoteModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('indigo');
  const [status, setStatus] = useState('todo');

  // 🇮🇳 Strict DD / MM / YYYY States
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [time, setTime] = useState('');

  const [error, setError] = useState('');

  // Generate Days 01 to 31
  const daysArray = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  // Generate Years
  const currentYear = new Date().getFullYear();
  const yearsArray = [String(currentYear), String(currentYear + 1), String(currentYear + 2)];

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setColor(initialData.color || 'indigo');
      setStatus(initialData.status || 'todo');

      if (initialData.dueDate) {
        const d = new Date(initialData.dueDate);
        setDay(String(d.getDate()).padStart(2, '0'));
        setMonth(String(d.getMonth() + 1).padStart(2, '0'));
        setYear(String(d.getFullYear()));
        setTime(d.toTimeString().slice(0, 5));
      } else {
        setDay('');
        setMonth('');
        setYear('');
        setTime('');
      }
    } else {
      setTitle('');
      setContent('');
      setColor('indigo');
      setStatus('todo');
      setDay('');
      setMonth('');
      setYear('');
      setTime('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Check if date is set
  const hasDate = day && month && year;
  const combinedDateTime = hasDate
    ? new Date(`${year}-${month}-${day}T${time || '23:59'}`)
    : null;

  const isPastDate = combinedDateTime && combinedDateTime < new Date();

  const handleClearDeadline = () => {
    setDay('');
    setMonth('');
    setYear('');
    setTime('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please provide a title for this task');
      return;
    }
    if (title.trim().length > 100) {
      setError('Title cannot exceed 100 characters');
      return;
    }
    if (!content.trim()) {
      setError('Please provide some description or notes');
      return;
    }

    setError('');
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      color,
      status,
      dueDate: combinedDateTime ? combinedDateTime.toISOString() : null,
    });
  };

  const isEditing = Boolean(initialData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">

      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {isEditing ? 'Edit Task' : 'Create Task / Note'}
            </h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Indian Standard Time (IST) • DD/MM/YYYY
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 overflow-y-auto flex-1 pr-1 scrollbar-thin">

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                {title.length}/100 chars
              </span>
            </div>
            <input
              type="text"
              placeholder="e.g. Review Quarterly Financials"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              autoFocus
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-medium rounded-2xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-hidden transition-all shadow-xs"
            />
          </div>

          {/* Status Row */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
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
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Symmetrical Grid: Color + Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">

            {/* Color Accent Box */}
            <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 h-full flex flex-col justify-between">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                <Palette className="w-3.5 h-3.5 text-indigo-500" />
                <span>Accent Color</span>
              </label>
              <div className="flex items-center justify-between pt-1">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    title={c.label}
                    className={`w-6 h-6 rounded-full ${c.bg} flex items-center justify-center transition-all cursor-pointer ${
                      color === c.id
                        ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110 shadow-sm'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    {color === c.id && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 🇮🇳 STRICT DD / MM / YYYY DEADLINE BOX */}
            <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Deadline (DD/MM/YYYY)</span>
                </label>
                {hasDate && (
                  <button
                    type="button"
                    onClick={handleClearDeadline}
                    className="text-[10px] text-slate-400 hover:text-rose-500 font-semibold flex items-center gap-0.5 cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* 3 Dropdowns strictly formatted: DD / MM / YYYY */}
              <div className="grid grid-cols-3 gap-1.5">

                {/* 1. Day (DD) */}
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="px-2 py-1.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-hidden cursor-pointer"
                >
                  <option value="">DD</option>
                  {daysArray.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                {/* 2. Month (MM) */}
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="px-1.5 py-1.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-hidden cursor-pointer"
                >
                  <option value="">MM</option>
                  {MONTHS.map((m) => (
                    <option key={m.num} value={m.num}>
                      {m.label}
                    </option>
                  ))}
                </select>

                {/* 3. Year (YYYY) */}
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="px-1.5 py-1.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-hidden cursor-pointer"
                >
                  <option value="">YYYY</option>
                  {yearsArray.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Selector (Compact) */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Time:</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex-1 px-2 py-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-hidden cursor-pointer text-center"
                />
              </div>

              {/* Strict Preview in DD/MM/YYYY */}
              {hasDate && (
                <div className="pt-0.5">
                  {isPastDate ? (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>Caution: Past Date ({day}/{month}/{year})</span>
                    </div>
                  ) : (
                    <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-500" />
                      <span>Set for: {day}/{month}/{year} {time ? `at ${time}` : ''}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Description / Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Write task details, acceptance criteria, or ideas..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-hidden transition-all resize-none shadow-xs"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 rounded-xl shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default NoteModal;