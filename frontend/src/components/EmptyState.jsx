import React from 'react';
import { NotebookPen, Plus } from 'lucide-react';

const EmptyState = ({ onOpenCreate, isSearch, searchTerm }) => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
        <NotebookPen className="w-8 h-8" />
      </div>

      {isSearch ? (
        <>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No matching notes</h3>
          <p className="text-sm text-slate-500 mb-6">
            We couldn't find any note matching "<span className="text-slate-700 font-medium">{searchTerm}</span>".
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No notes yet</h3>
          <p className="text-sm text-slate-500 mb-6">
            Capture your thoughts, ideas, and tasks by creating your first note.
          </p>
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Note</span>
          </button>
        </>
      )}
    </div>
  );
};

export default EmptyState;