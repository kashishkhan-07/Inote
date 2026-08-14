import React, { useState } from 'react';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  Pin,
  ArrowRight,
  ArrowLeft,
  Calendar
} from 'lucide-react';

const COLUMNS = [
  {
    id: 'todo',
    title: 'To Do',
    icon: ListTodo,
    colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/40',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    icon: Clock,
    colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/40',
  },
  {
    id: 'completed',
    title: 'Completed',
    icon: CheckCircle2,
    colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/40',
  },
];

const colorBorder = {
  indigo: 'border-l-indigo-500',
  emerald: 'border-l-emerald-500',
  amber: 'border-l-amber-500',
  rose: 'border-l-rose-500',
  sky: 'border-l-sky-500',
  purple: 'border-l-purple-500',
};

const KanbanBoard = ({
  notes,
  onEdit,
  onDelete,
  onTogglePin,
  onStatusChange,
  onOpenCreateModal,
}) => {
  // Mobile Active Column Tab State
  const [activeMobileTab, setActiveMobileTab] = useState('todo');

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

  const handleDragStart = (e, noteId) => {
    e.dataTransfer.setData('noteId', noteId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData('noteId');
    if (noteId) {
      onStatusChange(noteId, targetStatus);
    }
  };

  return (
    <div className="space-y-4">

      {/* 📱 Mobile Column Switcher Tabs (Visible only on mobile screens) */}
      <div className="md:hidden flex bg-slate-200/80 dark:bg-slate-900 p-1.5 rounded-2xl gap-1">
        {COLUMNS.map((col) => {
          const count = notes.filter((n) => (n.status || 'todo') === col.id).length;
          const isSelected = activeMobileTab === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setActiveMobileTab(col.id)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>{col.title}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-700 rounded-full">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Columns Grid (1 Column on Mobile, 3 on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-start">
        {COLUMNS.map((column) => {
          const Icon = column.icon;
          const columnNotes = notes.filter((n) => (n.status || 'todo') === column.id);
          const isHiddenOnMobile = activeMobileTab !== column.id;

          return (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex flex-col bg-slate-200/50 dark:bg-slate-900/60 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 min-h-[450px] ${
                isHiddenOnMobile ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-xl border ${column.colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {column.title}
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-300/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {columnNotes.length}
                  </span>
                </div>

                <button
                  onClick={onOpenCreateModal}
                  title="Add task"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 flex-1">
                {columnNotes.length > 0 ? (
                  columnNotes.map((note) => {
                    const borderAccent = colorBorder[note.color] || colorBorder.indigo;

                    return (
                      <div
                        key={note._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, note._id)}
                        className={`bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/70 border-l-4 ${borderAccent} shadow-xs hover:shadow-lg transition-all flex flex-col justify-between gap-3`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className={`font-bold text-slate-900 dark:text-white text-sm leading-snug ${
                              note.status === 'completed' ? 'line-through opacity-70' : ''
                            }`}>
                              {note.title}
                            </h4>

                            {note.isPinned && (
                              <Pin className="w-3.5 h-3.5 text-indigo-500 fill-current shrink-0" />
                            )}
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                            {note.content}
                          </p>
                        </div>

                        {/* Footer with Mobile Stage Buttons */}
                        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">

                          <div className="flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDateTimeIST(note.createdAt)}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">

                            {/* Step Backward Button */}
                            {column.id === 'in_progress' && (
                              <button
                                onClick={() => onStatusChange(note._id, 'todo')}
                                title="Move to To Do"
                                className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {column.id === 'completed' && (
                              <button
                                onClick={() => onStatusChange(note._id, 'in_progress')}
                                title="Move to In Progress"
                                className="p-1.5 bg-slate-100 dark:bg-slate-700 text-amber-500 rounded-lg"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Edit / Delete */}
                            <button
                              onClick={() => onEdit(note)}
                              className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-500 rounded-lg"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(note)}
                              className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Step Forward Button */}
                            {column.id === 'todo' && (
                              <button
                                onClick={() => onStatusChange(note._id, 'in_progress')}
                                title="Move to In Progress"
                                className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {column.id === 'in_progress' && (
                              <button
                                onClick={() => onStatusChange(note._id, 'completed')}
                                title="Mark Completed"
                                className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}

                          </div>
                        </div>

                      </div>
                    );
                  })
                ) : (
                  <div className="h-32 border-2 border-dashed border-slate-300/80 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                    <span>No tasks here</span>
                    <span className="text-[10px] text-slate-400/80">Tap + to add a task</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;