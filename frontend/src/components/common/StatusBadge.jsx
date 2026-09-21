import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, ShieldCheck, ShieldAlert, Archive } from 'lucide-react';

export default function StatusBadge({ status, type = 'status', className = '' }) {
  const norm = String(status || '').toUpperCase();

  if (norm.includes('VERIFIED') || norm.includes('VALID') || norm.includes('COMPLETED') || norm.includes('PASSED')) {
    return (
      <span className={`badge-verified ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        {status}
      </span>
    );
  }

  if (norm.includes('PROCESSING') || norm.includes('SCANNING')) {
    return (
      <span className={`badge-processing ${className}`}>
        <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" />
        {status}
      </span>
    );
  }

  if (norm.includes('PARTIAL') || norm.includes('NEW') || norm.includes('READY') || norm.includes('PENDING')) {
    return (
      <span className={`badge-warning ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        {status}
      </span>
    );
  }

  if (norm.includes('MISMATCH') || norm.includes('FAILED') || norm.includes('CORRUPTED') || norm.includes('ERROR')) {
    return (
      <span className={`badge-danger ${className}`}>
        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
        {status}
      </span>
    );
  }

  if (norm.includes('ARCHIVED')) {
    return (
      <span className={`badge-neutral ${className}`}>
        <Archive className="w-3.5 h-3.5 text-slate-400" />
        {status}
      </span>
    );
  }

  return (
    <span className={`badge-neutral ${className}`}>
      {status}
    </span>
  );
}
