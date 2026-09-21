import React, { useState } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  FolderUp,
  FileUp,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  FileCheck2,
  File
} from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { api } from '../services/api';

export default function FileEraser({ onShowToast }) {
  const [items, setItems] = useState([
    { id: 1, name: 'confidential_test.pdf', type: 'PDF', size: '2.4 MB', location: '/test-data/', metadata: 'EXIF, Author Tags Present', status: 'Ready' },
    { id: 2, name: 'test_database.db', type: 'Database', size: '8.2 MB', location: '/test-data/', metadata: 'SQLite Journal Present', status: 'Ready' },
    { id: 3, name: 'suspect_credentials.txt', type: 'Text', size: '48 KB', location: '/test-data/', metadata: 'Creation Timestamps Present', status: 'Ready' },
    { id: 4, name: 'exfiltrated_keys.pem', type: 'Certificate', size: '12 KB', location: '/test-data/', metadata: 'Private Key Header Present', status: 'Ready' }
  ]);

  const [selectedIds, setSelectedIds] = useState([1, 2, 3, 4]);
  const [options, setOptions] = useState({
    overwrite: true,
    metadataCleanup: true,
    verify: true
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [erasureSummary, setErasureSummary] = useState(null);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(items.map(i => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const executeFileErasure = async () => {
    setShowConfirm(false);
    setIsProcessing(true);
    setErasureSummary(null);

    await new Promise(r => setTimeout(r, 1200));

    try {
      const selectedNames = items.filter(i => selectedIds.includes(i.id)).map(i => i.name);
      const appliedOpts = [];
      if (options.overwrite) appliedOpts.push("Test overwrite simulation");
      if (options.metadataCleanup) appliedOpts.push("Metadata cleanup simulation");
      if (options.verify) appliedOpts.push("Verification");

      const res = await api.eraseFiles({
        files: selectedNames,
        options: appliedOpts
      });

      setErasureSummary(res);
      // mark items as shredded
      setItems(items.map(i => selectedIds.includes(i.id) ? { ...i, status: 'Sanitized & Deleted' } : i));
      onShowToast(`${res.items_processed} items securely sanitized & verified.`, 'success');
    } catch (err) {
      onShowToast(err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a2333]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Secure File & Folder Eraser</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Selective secure deletion, metadata neutralization and slack space wiping for test files.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs text-blue-300">
          <ShieldAlert className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>Demo Protection: Targets strictly isolated in /test-data/</span>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div className="border-2 border-dashed border-[#223048] hover:border-blue-500/60 bg-[#0d131f] rounded-xl p-6 text-center transition-colors">
        <UploadCloud className="w-10 h-10 text-blue-400 mx-auto mb-2" />
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
          Drag test files or folders here
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Simulate selective forensic destruction with DoD 5220.22-M overwrite
        </p>

        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => onShowToast('Simulated file selection added to list', 'success')}
            className="px-3 py-1.5 bg-[#141d2e] hover:bg-[#1a273e] text-slate-200 border border-[#273856] text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <FileUp className="w-3.5 h-3.5 text-blue-400" />
            Select Files
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Simulated folder contents loaded', 'success')}
            className="px-3 py-1.5 bg-[#141d2e] hover:bg-[#1a273e] text-slate-200 border border-[#273856] text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <FolderUp className="w-3.5 h-3.5 text-indigo-400" />
            Select Folder
          </button>
        </div>
      </div>

      {/* Table of Selected Items */}
      <div className="forensic-card p-4 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Selected Test Items ({items.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {selectedIds.length} of {items.length} selected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="forensic-table">
            <thead>
              <tr>
                <th className="w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === items.length && items.length > 0}
                    onChange={handleSelectAll}
                    className="rounded bg-slate-800 text-blue-600 focus:ring-0"
                  />
                </th>
                <th>File Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Location</th>
                <th>Metadata</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isChecked = selectedIds.includes(item.id);
                const isSanitized = item.status.includes('Sanitized');
                return (
                  <tr key={item.id} className={isSanitized ? 'opacity-60' : ''}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isSanitized}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded bg-slate-800 text-blue-600 focus:ring-0"
                      />
                    </td>
                    <td className="font-mono font-semibold text-slate-200 flex items-center gap-2">
                      <File className="w-3.5 h-3.5 text-blue-400" />
                      {item.name}
                    </td>
                    <td className="text-slate-300">{item.type}</td>
                    <td className="font-mono text-slate-400">{item.size}</td>
                    <td className="font-mono text-slate-400 text-[11px]">{item.location}</td>
                    <td className="text-slate-400 text-[11px]">{item.metadata}</td>
                    <td>
                      {isSanitized ? (
                        <span className="badge-verified">Sanitized & Deleted</span>
                      ) : (
                        <span className="badge-warning">Ready</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Options & Action Bar */}
        <div className="p-4 bg-[#0b101c] border border-[#1e293b] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.overwrite}
                onChange={(e) => setOptions({ ...options, overwrite: e.target.checked })}
                className="rounded bg-slate-800 text-blue-600"
              />
              <span>Test overwrite simulation (3-Pass DoD)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.metadataCleanup}
                onChange={(e) => setOptions({ ...options, metadataCleanup: e.target.checked })}
                className="rounded bg-slate-800 text-blue-600"
              />
              <span>Metadata cleanup simulation</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.verify}
                onChange={(e) => setOptions({ ...options, verify: e.target.checked })}
                className="rounded bg-slate-800 text-blue-600"
              />
              <span>Bit-level Verification</span>
            </label>
          </div>

          <button
            type="button"
            disabled={selectedIds.length === 0 || isProcessing}
            onClick={() => setShowConfirm(true)}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Secure Erase ({selectedIds.length})
          </button>
        </div>

        {/* Result Summary */}
        {erasureSummary && (
          <div className="p-4 bg-[#0a1814] border border-emerald-600/50 rounded-lg flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="font-bold text-white block">Selective File Erasure Complete</span>
                <span className="text-slate-300 font-mono">
                  {erasureSummary.items_processed} Items Processed • {erasureSummary.items_verified} Verified • {erasureSummary.items_failed} Failed
                </span>
              </div>
            </div>
            <span className="text-[11px] px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-mono">
              Audit Block Recorded
            </span>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeFileErasure}
        title="SECURE FILE DESTRUCTION CONFIRMATION"
        target={`${selectedIds.length} Test Files`}
        method="DoD 5220.22-M + Metadata Sanitization"
        verification="Bit-level Verification"
      />
    </div>
  );
}
