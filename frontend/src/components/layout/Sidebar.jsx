import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  FolderPlus,
  HardDrive,
  Eraser,
  FileSpreadsheet,
  History,
  RotateCcw,
  Binary,
  FileCheck2,
  Hash,
  ScrollText,
  ShieldCheck,
  FileText,
  Download,
  Settings,
  HelpCircle,
  Shield,
  Radio
} from 'lucide-react';

export default function Sidebar({ currentView, setView, activeCase, onNewCaseClick }) {
  const navSections = [
    {
      label: null,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      label: 'CASE MANAGEMENT',
      items: [
        { id: 'cases', label: 'Cases', icon: Briefcase },
        { id: 'new-case', label: 'New Case', icon: FolderPlus, action: onNewCaseClick },
        { id: 'evidence', label: 'Evidence', icon: HardDrive }
      ]
    },
    {
      label: 'DATA SANITIZATION',
      items: [
        { id: 'drive-eraser', label: 'Drive Eraser', icon: Eraser },
        { id: 'file-eraser', label: 'File & Folder Eraser', icon: FileSpreadsheet },
        { id: 'erasure-history', label: 'Erasure History', icon: History }
      ]
    },
    {
      label: 'FORENSIC RECOVERY',
      items: [
        { id: 'recovery', label: 'Recovery', icon: RotateCcw },
        { id: 'file-carving', label: 'File Carving', icon: Binary },
        { id: 'recovered-files', label: 'Recovered Files', icon: FileCheck2 }
      ]
    },
    {
      label: 'INTEGRITY',
      items: [
        { id: 'evidence-hashes', label: 'Evidence Hashes', icon: Hash },
        { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText },
        { id: 'integrity-chain', label: 'Integrity Chain', icon: ShieldCheck }
      ]
    },
    {
      label: 'REPORTING',
      items: [
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'export', label: 'Export', icon: Download }
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'help', label: 'Help', icon: HelpCircle }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0d131f] border-r border-[#1a2333] flex flex-col h-screen flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1a2333]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-950/40 border border-blue-400/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-wider text-white font-mono flex items-center gap-1.5">
              SECURE<span className="text-blue-400">FORENSICS</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-tight">
              Cybersecurity & Digital Forensics
            </div>
          </div>
        </div>

        {/* Safety Mode Indicator */}
        <div className="mt-3 px-2 py-1 bg-emerald-950/50 border border-emerald-800/40 rounded flex items-center justify-between text-[10px]">
          <span className="text-emerald-300 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            DEMO / TEST MODE
          </span>
          <span className="text-slate-400 font-mono">Sandbox Safe</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-medium">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            {section.label && (
              <div className="px-3 mb-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {section.label}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        setView(item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-left ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 font-semibold border-l-2 border-blue-500 shadow-sm'
                        : 'text-slate-300 hover:text-slate-100 hover:bg-[#141c2c]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom User Profile */}
      <div className="p-3 border-t border-[#1a2333] bg-[#0a0f19]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-blue-400">
              A1
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Analyst-01</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Online status
              </div>
            </div>
          </div>
          <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
        </div>
      </div>
    </aside>
  );
}
