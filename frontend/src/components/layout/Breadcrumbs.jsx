import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [], onNavigate }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 select-none font-medium">
      <button
        onClick={() => onNavigate && onNavigate('dashboard')}
        className="hover:text-blue-400 flex items-center gap-1 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            {isLast ? (
              <span className="text-slate-200 font-semibold">{item.label}</span>
            ) : (
              <button
                onClick={() => item.view && onNavigate && onNavigate(item.view)}
                className="hover:text-blue-400 transition-colors"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
