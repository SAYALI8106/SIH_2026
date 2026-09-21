import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-[#0f231e] border-emerald-500/50 text-emerald-200',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    },
    error: {
      bg: 'bg-[#291216] border-rose-500/50 text-rose-200',
      icon: <AlertCircle className="w-4 h-4 text-rose-400" />
    },
    warning: {
      bg: 'bg-[#261b0c] border-amber-500/50 text-amber-200',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />
    }
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slideUp">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md text-xs font-medium ${config.bg}`}>
        {config.icon}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
