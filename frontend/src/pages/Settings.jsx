import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Moon,
  CheckCircle2,
  HardDrive,
  RotateCcw,
  Eraser,
  ScrollText,
  FileText,
  Save
} from 'lucide-react';

export default function Settings({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('Security');
  const [config, setConfig] = useState({
    theme: 'Dark (Default Forensic Slate)',
    defaultVerification: 'Full (100% Bit-Level Check)',
    defaultRecoveryMode: 'Signature-Based Carving',
    autoAuditLogging: true,
    requireConfirmation: true,
    writeBlockEnforcement: true,
    exportPath: 'C:\\ForensicCases\\Exports\\',
    operatorId: 'Analyst-01'
  });

  const tabs = [
    { id: 'General', icon: SettingsIcon },
    { id: 'Security', icon: Shield },
    { id: 'Recovery', icon: RotateCcw },
    { id: 'Erasure', icon: Eraser },
    { id: 'Audit', icon: ScrollText },
    { id: 'Reports', icon: FileText }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    onShowToast('Forensic system configuration saved successfully.', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a2333]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">System Settings & Policies</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic standards, hardware write-block enforcement, and default carving parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Tabs: 3 cols */}
        <div className="md:col-span-3 forensic-card p-2 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-[#141d2e] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.id}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form: 9 cols */}
        <div className="md:col-span-9 forensic-card p-6 space-y-5 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-[#1e293b]">
            {activeTab} Preferences
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Active Theme
                </label>
                <input
                  type="text"
                  disabled
                  value={config.theme}
                  className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Default Verification Mode
                </label>
                <select
                  value={config.defaultVerification}
                  onChange={(e) => setConfig({ ...config, defaultVerification: e.target.value })}
                  className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option>Full (100% Bit-Level Check)</option>
                  <option>Quick (10% Sample Check)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Default Recovery Mode
                </label>
                <select
                  value={config.defaultRecoveryMode}
                  onChange={(e) => setConfig({ ...config, defaultRecoveryMode: e.target.value })}
                  className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option>Signature-Based Carving</option>
                  <option>Quick Scan</option>
                  <option>Deep Scan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Active Operator Call-Sign
                </label>
                <input
                  type="text"
                  value={config.operatorId}
                  onChange={(e) => setConfig({ ...config, operatorId: e.target.value })}
                  className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#1e293b] space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.autoAuditLogging}
                  onChange={(e) => setConfig({ ...config, autoAuditLogging: e.target.checked })}
                  className="rounded bg-slate-800 text-blue-600 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-white block">Auto Cryptographic Audit Logging: ON</span>
                  <span className="text-[11px] text-slate-400">Append SHA-256 chained transaction blocks for every forensic action automatically.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.requireConfirmation}
                  onChange={(e) => setConfig({ ...config, requireConfirmation: e.target.checked })}
                  className="rounded bg-slate-800 text-blue-600 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-white block">Require Two-Step Confirmation: ON</span>
                  <span className="text-[11px] text-slate-400">Mandate explicit modal safety confirmation dialogs for all simulated sanitization jobs.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.writeBlockEnforcement}
                  onChange={(e) => setConfig({ ...config, writeBlockEnforcement: e.target.checked })}
                  className="rounded bg-slate-800 text-blue-600 focus:ring-0"
                />
                <div>
                  <span className="font-semibold text-emerald-400 block">Air-Gapped Sandbox Protection: ACTIVE</span>
                  <span className="text-[11px] text-slate-400">Strictly prohibits any physical drive attachment or real host OS disk operations.</span>
                </div>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
