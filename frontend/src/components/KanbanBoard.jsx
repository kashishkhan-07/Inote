import React from 'react';
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
    topBar: 'bg-indigo-500',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    icon: Clock,
    colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/40',
    topBar: 'bg-amber-500',
  },
  {
    id: 'completed',
    title: 'Completed',
    icon: CheckCircle2,
    colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/40',
    topBar: 'bg-emerald-500',
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
  // Format Date in IST
  const formatDateTimeIST = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(dateString));
  };

  // Drag & Drop Handlers
  const handleDragStart = (e, noteId) => {
    e.dataTransfer.setData('noteId', noteId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData('noteId');
    if (noteId) {
      onStatusChange(noteId, targetStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {COLUMNS.map((column) => {
        const Icon = column.icon;
        const columnNotes = notes.filter((n) => (n.status || 'todo') === column.id);

        return (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            className="flex flex-col bg-slate-200/50 dark:bg-slate-900/60 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 min-h-[500px]"
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
                title="Add task in this column"
                className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards in this Column */}
            <div className="space-y-3.5 flex-1">
              {columnNotes.length > 0 ? (
                columnNotes.map((note) => {
                  const borderAccent = colorBorder[note.color] || colorBorder.indigo;

                  return (
                    <div
                      key={note._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, note._id)}
                      className={`group relative bg-white dark:bg-slate-800 rounded-2xl p-4.5 border border-slate-200/80 dark:border-slate-700/70 border-l-4 ${borderAccent} shadow-xs hover:shadow-xl dark:shadow-slate-950/50 hover:-translate-y-1 transition-all duration-200 cursor-grab active:cursor-grabbing flex flex-col justify-between`}
                    >
                      {/* Card Content */}
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

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                          {note.content}
                        </p>
                      </div>

                      {/* Card Footer: Timestamp & Quick Move Controls */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">

                        {/* Time in IST */}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{formatDateTimeIST(note.createdAt)}</span>
                        </div>

                        {/* Quick Action Buttons & Stage Steppers */}
                        <div className="flex items-center gap-1">

                          {/* Move Backward Step (if not in To Do) */}
                          {column.id === 'in_progress' && (
                            <button
                              onClick={() => onStatusChange(note._id, 'todo')}
                              title="Move to To Do"
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {column.id === 'completed' && (
                            <button
                              onClick={() => onStatusChange(note._id, 'in_progress')}
                              title="Move to In Progress"
                              className="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}

                          {/* Edit / Delete */}
                          <button
                            onClick={() => onEdit(note)}
                            title="Edit"
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDelete(note)}
                            title="Delete"
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          {/* Move Forward Step (if not in Completed) */}
                          {column.id === 'todo' && (
                            <button
                              onClick={() => onStatusChange(note._id, 'in_progress')}
                              title="Move to In Progress"
                              className="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {column.id === 'in_progress' && (
                            <button
                              onClick={() => onStatusChange(note._id, 'completed')}
                              title="Mark as Completed"
                              className="p-1 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                        </div>
                      </div>

                    </div>
                  );
                })
              ) : (
                /* Empty Column Drop Target */
                <div className="h-32 border-2 border-dashed border-slate-300/80 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                  <span>No tasks here</span>
                  <span className="text-[10px] text-slate-400/80">Drag a task or click +</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;