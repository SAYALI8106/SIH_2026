import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  HardDrive,
  Play,
  FileText,
  Plus,
  ShieldCheck,
  Hash,
  Search,
  Tag,
  CheckCircle2,
  Clock,
  Layers,
  FileImage,
  FolderArchive,
  Film,
  Globe,
  Mail,
  Cpu,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { api } from '../services/api';

export default function CaseDashboard({
  activeCase,
  onNavigate,
  onOpenEvidenceDetails,
  onShowToast
}) {
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeCase?.id) {
      loadDetails(activeCase.id);
    }
  }, [activeCase]);

  const loadDetails = async (caseId) => {
    try {
      setLoading(true);
      const data = await api.getCase(caseId);
      setCaseDetails(data);
    } catch (err) {
      console.error('Failed to load case details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHashEvidence = async (evi) => {
    try {
      const res = await api.calculateHash(evi.id);
      onShowToast(`SHA-256 Calculated: ${res.sha256.substring(0, 16)}...`, 'success');
    } catch (err) {
      onShowToast(err.message, 'error');
    }
  };

  const artifactCategories = [
    { name: 'Images', count: 100, icon: FileImage, color: 'text-blue-400', view: 'recovery' },
    { name: 'Documents', count: 39, icon: FileText, color: 'text-emerald-400', view: 'recovery' },
    { name: 'Archives', count: 8, icon: FolderArchive, color: 'text-amber-400', view: 'recovery' },
    { name: 'Videos', count: 14, icon: Film, color: 'text-rose-400', view: 'recovery' },
    { name: 'Web Artifacts', count: 52, icon: Globe, color: 'text-cyan-400', view: 'recovery' },
    { name: 'Email Messages', count: 18, icon: Mail, color: 'text-indigo-400', view: 'recovery' },
    { name: 'System Logs', count: 64, icon: Cpu, color: 'text-purple-400', view: 'recovery' },
    { name: 'Unknown / Carved', count: 7, icon: HelpCircle, color: 'text-slate-400', view: 'recovery' },
  ];

  const tags = [
    { label: 'Important', count: 12, color: 'bg-rose-950/60 text-rose-300 border-rose-800/60' },
    { label: 'Recovered', count: 147, color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' },
    { label: 'Evidence', count: 3, color: 'bg-blue-950/60 text-blue-300 border-blue-800/60' },
    { label: 'High Confidence', count: 96, color: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60' }
  ];

  const current = caseDetails || activeCase;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Magnet AXIOM Case Header */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-950/70 border border-blue-800/60 flex items-center justify-center text-blue-400 shadow-inner">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white font-mono">{current?.id}</h1>
                <StatusBadge status={current?.status || 'Processing'} />
              </div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">
                {current?.name} <span className="text-slate-500">•</span> {current?.organization || 'Cyber Defense Bureau'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('evidence')}
              className="px-3 py-1.5 bg-[#182338] hover:bg-[#202e48] border border-[#273856] text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              Add Evidence
            </button>
            <button
              onClick={() => onNavigate('recovery')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              Start Analysis
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="px-3 py-1.5 bg-[#182338] hover:bg-[#202e48] border border-[#273856] text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Magnet AXIOM Three-Column Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* COLUMN 1 (Left 3.5 cols): Case Overview & Processing Details */}
        <div className="lg:col-span-4 space-y-4">
          {/* Case Overview Card */}
          <div className="forensic-card p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#1e293b]">
              <Layers className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Case Overview
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Case Summary</span>
                <p className="text-slate-300 mt-0.5 leading-relaxed">
                  {current?.description || 'Forensic intake examination of seized media.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#182234]">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Investigator</span>
                  <span className="text-slate-200 font-medium">{current?.investigator || 'Analyst-01'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Case Number</span>
                  <span className="text-blue-400 font-mono font-bold">{current?.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#182234]">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Created Date</span>
                  <span className="text-slate-300">{current?.created_date || '21 Sep 2026'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Reference</span>
                  <span className="text-slate-300 font-mono">{current?.reference_number || 'REF-8849-USB'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Case Processing Details Card */}
          <div className="forensic-card p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#1e293b]">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Case Processing Details
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#182234]">
                <span className="text-slate-400">Scan Status:</span>
                <StatusBadge status={current?.scan_status || 'Processing'} />
              </div>
              <div className="flex justify-between py-1 border-b border-[#182234]">
                <span className="text-slate-400">Last Carving Scan:</span>
                <span className="text-slate-200 font-mono">{current?.last_scan || 'Today 16:17'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#182234]">
                <span className="text-slate-400">Files Discovered:</span>
                <span className="text-blue-400 font-mono font-bold">
                  {(current?.files_discovered || 2431).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Files Recovered:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {(current?.files_recovered || 147).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2 (Middle 4.5 cols): Evidence Overview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="forensic-card p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Evidence Overview
                </h3>
              </div>
              <button
                onClick={() => onNavigate('evidence')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                All Evidence &rarr;
              </button>
            </div>

            {/* Evidence Cards Stack */}
            <div className="mt-3 space-y-3">
              {(current?.evidence || [
                {
                  id: 'EVI-00001',
                  item_name: 'USB_TEST_01.img',
                  size: '2.4 GB',
                  type: 'USB Storage',
                  sha256: '8f4c12d7b539c80a2b7145e9fa01f5c6b2931a72d41b00e843615e4789dca92e',
                  integrity_status: 'Verified',
                  status: 'Processing'
                },
                {
                  id: 'EVI-00002',
                  item_name: 'HDD_TEST_01.img',
                  size: '500 GB',
                  type: 'HDD Physical',
                  sha256: 'a3b190f892c478a87b1c3e5d8e7f12a34b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e',
                  integrity_status: 'Verified',
                  status: 'Ready'
                }
              ]).map((evi) => (
                <div
                  key={evi.id}
                  className="p-3.5 bg-[#0b101c] border border-[#1e293b] rounded-lg hover:border-slate-700 transition-all text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-mono font-bold text-slate-100 text-[13px]">{evi.item_name}</div>
                        <div className="text-slate-400 text-[11px]">
                          {evi.size} <span className="text-slate-600">•</span> {evi.type}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={evi.status || 'Ready'} />
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#182234] flex items-center justify-between">
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>SHA-256:</span>
                      <span className="text-emerald-400 font-semibold">{evi.integrity_status || 'Verified'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleHashEvidence(evi)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono flex items-center gap-1 transition-colors"
                        title="Calculate SHA-256"
                      >
                        <Hash className="w-3 h-3 text-blue-400" />
                        Hash
                      </button>
                      <button
                        onClick={() => onNavigate('recovery')}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-medium transition-colors"
                      >
                        Analyze
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 3 (Right 3 cols): Places to Start (Artifact Categories & Tags) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Artifact Categories Card */}
          <div className="forensic-card p-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#1e293b]">
              <FolderOpen className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Places to Start
              </h3>
            </div>

            <div className="mt-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
              Artifact Categories
            </div>

            <div className="space-y-1">
              {artifactCategories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onNavigate(cat.view)}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-[#151f32] text-xs transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 text-slate-300">
                      <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                      <span>{cat.name}</span>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px] font-semibold">
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags & Comments Card */}
          <div className="forensic-card p-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#1e293b]">
              <Tag className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Tags & Comments
              </h3>
            </div>

            <div className="mt-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
              Recent Tags
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${t.color}`}
                >
                  <span>{t.label}</span>
                  <span className="opacity-75 font-mono">({t.count})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
