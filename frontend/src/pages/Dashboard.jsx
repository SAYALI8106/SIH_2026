import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  HardDrive,
  FileCheck2,
  Eraser,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileText,
  Activity,
  Plus
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  Cell
} from 'recharts';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import { api } from '../services/api';

export default function Dashboard({ onNavigate, onSelectCase, onNewCaseClick }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fileTypeColors = {
    JPG: '#3b82f6',
    PDF: '#ef4444',
    PNG: '#10b981',
    DOCX: '#6366f1',
    ZIP: '#f59e0b',
    MP4: '#ec4899'
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a2333]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Overview of forensic investigations, evidence, recovery and sanitization operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('recovery')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            Launch Recovery Scan
          </button>
          <button
            onClick={onNewCaseClick}
            className="px-3 py-1.5 bg-[#131c2d] hover:bg-[#1c2942] text-slate-200 border border-[#223048] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            + New Case
          </button>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Active Cases"
          value={stats?.metrics?.active_cases || 12}
          change="+2 this wk"
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Evidence Items"
          value={stats?.metrics?.evidence_items || 38}
          change="+4"
          icon={HardDrive}
          color="sky"
        />
        <StatCard
          title="Recovered Files"
          value={stats?.metrics?.recovered_files || 147}
          change="98% confidence"
          icon={FileCheck2}
          color="emerald"
        />
        <StatCard
          title="Erasure Jobs"
          value={stats?.metrics?.erasure_jobs || 23}
          change="100% verified"
          icon={Eraser}
          color="purple"
        />
        <StatCard
          title="Integrity Verified"
          value={stats?.metrics?.integrity_verified_pct || "98.2%"}
          change="0 tamper detected"
          icon={ShieldCheck}
          color="amber"
        />
      </div>

      {/* Main Grid: Left Recent Cases / Right System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Cases Table (2 Cols on lg) */}
        <div className="lg:col-span-2 forensic-card p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Recent Cases
              </h3>
            </div>
            <button
              onClick={() => onNavigate('cases')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="forensic-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Case Name</th>
                  <th>Evidence</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Investigator</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recent_cases || []).map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => {
                      onSelectCase(c);
                      onNavigate('case-dashboard');
                    }}
                    className="cursor-pointer"
                  >
                    <td className="font-mono font-semibold text-blue-400">{c.id}</td>
                    <td className="font-medium text-slate-100">{c.name}</td>
                    <td className="text-slate-400 font-mono">{c.evidence_count} Items</td>
                    <td className="text-slate-400">{c.created_date}</td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="text-slate-300 text-[11px]">{c.investigator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: System Activity Feed */}
        <div className="forensic-card p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                System Activity
              </h3>
            </div>
            <button
              onClick={() => onNavigate('audit-logs')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              Audit Trail <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {(stats?.system_activity || []).map((act, idx) => (
              <div key={act.block_id || idx} className="flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-md bg-[#0c121e] border border-[#1e293b] flex items-center justify-center flex-shrink-0 text-blue-400">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 truncate">{act.operation}</span>
                    <span className="text-[10px] font-mono text-slate-500">{act.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{act.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recovery Statistics & Erasure Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Statistics Bar Chart */}
        <div className="forensic-card p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Recovery Statistics (By File Type)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Distribution of 147 recovered artifacts from USB_TEST_01.img
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-blue-950/60 border border-blue-800/40 text-blue-300 rounded">
              Total: 147
            </span>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.file_types || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d131f', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {(stats?.file_types || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={fileTypeColors[entry.name] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Erasure Activity Area Chart */}
        <div className="forensic-card p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Erasure Activity Trend
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simulated sanitized capacity & jobs over weekly cycle
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 rounded">
              All Verified
            </span>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.erasure_activity || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="erasureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d131f', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="sectors_gb" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#erasureGradient)" name="Sanitized (GB)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
