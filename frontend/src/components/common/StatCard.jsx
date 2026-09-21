import React from 'react';

export default function StatCard({ title, value, change, icon: Icon, color = 'blue', subtitle }) {
  const colorMap = {
    blue: {
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-950/60 text-blue-400 border border-blue-800/40',
      text: 'text-blue-400',
    },
    emerald: {
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40',
      text: 'text-emerald-400',
    },
    amber: {
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-950/60 text-amber-400 border border-amber-800/40',
      text: 'text-amber-400',
    },
    purple: {
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-950/60 text-purple-400 border border-purple-800/40',
      text: 'text-purple-400',
    },
    sky: {
      border: 'border-sky-500/20',
      iconBg: 'bg-sky-950/60 text-sky-400 border border-sky-800/40',
      text: 'text-sky-400',
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`forensic-card p-4 hover:border-slate-700 transition-colors ${scheme.border}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-md ${scheme.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white font-mono">{value}</span>
        {change && (
          <span className="text-xs font-semibold text-emerald-400 flex items-center">
            {change}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}
