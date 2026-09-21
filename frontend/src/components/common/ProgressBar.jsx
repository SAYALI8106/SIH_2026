import React from 'react';

export default function ProgressBar({ progress = 0, color = 'blue', showLabel = true, height = 'h-2' }) {
  const clamped = Math.min(100, Math.max(0, progress));

  const colorClasses = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-slate-400 font-mono">Progress</span>
          <span className="text-slate-200 font-mono font-bold">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full bg-[#0e1526] rounded-full overflow-hidden border border-[#1e293b] ${height}`}>
        <div
          className={`${height} ${colorClasses[color] || 'bg-blue-500'} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
