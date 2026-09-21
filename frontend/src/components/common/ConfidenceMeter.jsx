import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function ConfidenceMeter({ score = 98, breakdown = null, compact = false }) {
  const getTier = (s) => {
    if (s >= 90) return { label: 'High Confidence', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800/60', bar: 'bg-emerald-500' };
    if (s >= 70) return { label: 'Medium Confidence', color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-800/60', bar: 'bg-amber-500' };
    return { label: 'Low Confidence', color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-800/60', bar: 'bg-rose-500' };
  };

  const tier = getTier(score);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className={`h-full ${tier.bar}`} style={{ width: `${score}%` }} />
        </div>
        <span className={`text-xs font-mono font-bold ${tier.color}`}>{score}%</span>
      </div>
    );
  }

  const defaultFactors = [
    { name: 'Signature Match', passed: true, weight: 25 },
    { name: 'Header Validation', passed: true, weight: 20 },
    { name: 'Footer Validation', passed: score >= 90, weight: 15 },
    { name: 'Structure Validation', passed: score >= 85, weight: 15 },
    { name: 'Size Consistency', passed: true, weight: 15 },
    { name: 'Fragment Continuity', passed: score >= 90, weight: 10 },
  ];

  const factors = breakdown?.factors || defaultFactors;

  return (
    <div className="bg-[#0b101c] border border-[#1e293b] rounded-lg p-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <span className="text-[10px] tracking-wider uppercase text-slate-400 font-semibold block">
            PROTOTYPE CONFIDENCE SCORE
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-2xl font-bold font-mono text-white">{score}%</span>
            <span className={`text-xs px-2 py-0.5 rounded border font-medium ${tier.bg} ${tier.color}`}>
              {tier.label}
            </span>
          </div>
        </div>
        {score >= 90 ? (
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
        ) : (
          <ShieldAlert className="w-7 h-7 text-amber-400" />
        )}
      </div>

      <div className="mt-3 space-y-2">
        {factors.map((f, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-0.5">
            <span className="text-slate-300 flex items-center gap-1.5">
              {f.passed ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <X className="w-3.5 h-3.5 text-rose-400" />
              )}
              {f.name}
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              {f.passed ? `+${f.weight}%` : '0%'}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[10px] text-slate-500 italic text-center">
        Algorithmic reconstruction evaluation • For demonstration & triage purposes
      </p>
    </div>
  );
}
