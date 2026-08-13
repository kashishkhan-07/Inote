import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-xs animate-pulse flex flex-col justify-between h-56"
        >
          <div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3.5 bg-slate-100 dark:bg-slate-700/60 rounded-sm w-full"></div>
              <div className="h-3.5 bg-slate-100 dark:bg-slate-700/60 rounded-sm w-5/6"></div>
              <div className="h-3.5 bg-slate-100 dark:bg-slate-700/60 rounded-sm w-2/3"></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-sm w-20"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;