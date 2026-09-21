import React, { useState } from 'react';
import {
  Search,
  Bell,
  CheckCircle2,
  ChevronDown,
  Briefcase,
  User,
  Shield,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function TopBar({
  currentCase,
  casesList = [],
  onSelectCase,
  searchQuery,
  setSearchQuery,
  onOpenCaseDashboard
}) {
  const [showCasePicker, setShowCasePicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Recovery scan finished: 147 files carved', time: '16:17', type: 'success' },
    { id: 2, text: 'Cryptographic hash verified for USB_TEST_01.img', time: '16:15', type: 'info' },
    { id: 3, text: 'Audit block #008 chained successfully', time: '16:30', type: 'info' }
  ];

  return (
    <header className="h-14 bg-[#0d131f] border-b border-[#1a2333] px-5 flex items-center justify-between flex-shrink-0 z-20">
      {/* Current Case Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowCasePicker(!showCasePicker)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#131c2d] border border-[#223048] hover:border-blue-500/50 transition-colors text-xs"
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-tight">Current Case:</span>
              <span className="font-semibold text-slate-100 font-mono">
                {currentCase?.id || 'CASE-2026-001'} <span className="text-slate-400">/</span> {currentCase?.name || 'USB Investigation'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {showCasePicker && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-[#111726] border border-[#223048] rounded-lg shadow-xl py-1.5 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-[#1a2333]">
                Switch Active Case
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {casesList.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCase(c);
                      setShowCasePicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#182338] transition-colors flex items-center justify-between ${
                      c.id === currentCase?.id ? 'bg-blue-600/10 text-blue-400' : 'text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-mono font-semibold">{c.id}</div>
                      <div className="text-[11px] text-slate-400 truncate">{c.name}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {c.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {onOpenCaseDashboard && (
          <button
            onClick={onOpenCaseDashboard}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-medium underline flex items-center gap-1"
          >
            Case Dashboard &rarr;
          </button>
        )}
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Global search cases, evidence, artifacts, file hashes..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full bg-[#111726] border border-[#1e293b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* System Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0f1d18] border border-emerald-800/40 text-[11px] text-emerald-300 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>All Systems Operational</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#111726] border border-[#223048] rounded-lg shadow-xl p-3 z-50">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400 pb-2 border-b border-[#1e293b]">
                System Notifications
              </div>
              <div className="mt-2 space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded bg-[#0b101c] border border-[#1e293b] text-xs">
                    <p className="text-slate-200">{n.text}</p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#1e293b]">
          <div className="w-7 h-7 rounded-full bg-blue-900/60 border border-blue-600/40 flex items-center justify-center text-xs font-bold text-blue-300">
            A1
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-none">Analyst-01</div>
            <div className="text-[10px] text-slate-500 leading-tight">Forensics Unit</div>
          </div>
        </div>
      </div>
    </header>
  );
}
