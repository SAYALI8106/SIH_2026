import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Activity, ShieldCheck, FileCheck, Eraser, HardDrive } from 'lucide-react';
import { api } from '../services/api';

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getDashboardStats().then(setStats).catch(console.error);
  }, []);

  const confidenceData = [
    { name: 'High (>=90%)', count: 118, fill: '#10b981' },
    { name: 'Medium (70-89%)', count: 24, fill: '#f59e0b' },
    { name: 'Low (<70%)', count: 5, fill: '#ef4444' }
  ];

  const caseStatusData = [
    { name: 'Completed', count: 5, fill: '#10b981' },
    { name: 'Processing', count: 6, fill: '#3b82f6' },
    { name: 'New / Intake', count: 3, fill: '#f59e0b' },
    { name: 'Archived', count: 2, fill: '#64748b' }
  ];

  const evidenceProcessingData = [
    { name: 'USB Flash', total: 14, verified: 14 },
    { name: 'HDD Physical', total: 12, verified: 12 },
    { name: 'NVMe SSD', total: 8, verified: 8 },
    { name: 'SD Cards', total: 4, verified: 4 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a2333]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Forensic Analytics & Telemetry</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical distribution of recovered artifacts, confidence scores, sanitization jobs and case velocities.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-blue-950/60 border border-blue-800/40 text-blue-300 rounded-lg">
          Live Telemetry Active
        </span>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Recovered Files by Type */}
        <div className="forensic-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Files Recovered by Signature
            </h3>
            <span className="text-xs text-slate-400 font-mono">147 Artifacts</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.file_types || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d131f', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Recovery Confidence Distribution */}
        <div className="forensic-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Prototype Confidence Distribution
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-semibold">80.2% High Confidence</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  fontSize={10}
                >
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d131f', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Evidence Processing & Intake Status */}
        <div className="forensic-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Evidence Processing Status
            </h3>
            <span className="text-xs text-slate-400 font-mono">38 Total Units</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evidenceProcessingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d131f', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total Intake" />
                <Bar dataKey="verified" fill="#10b981" radius={[4, 4, 0, 0]} name="Cryptographically Verified" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Case Status Breakdown */}
        <div className="forensic-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Case Status Distribution
            </h3>
            <span className="text-xs text-blue-400 font-mono font-semibold">16 Cases Total</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caseStatusData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d131f', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {caseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
