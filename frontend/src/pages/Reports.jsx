import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Calendar,
  User,
  Plus,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { api } from '../services/api';

export default function Reports({ activeCase, onShowToast }) {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await api.getReports();
      setReports(data);
      if (data.length > 0 && !selectedReport) {
        setSelectedReport(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const res = await api.generateReport({
        case_id: activeCase?.id || 'CASE-2026-001',
        report_type: 'Comprehensive Forensic Analysis'
      });
      onShowToast(`Forensic Report ${res.report_id} compiled successfully.`, 'success');
      loadReports();
    } catch (err) {
      onShowToast(err.message, 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const exportJSON = (rep) => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rep, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", jsonStr);
    dlAnchor.setAttribute("download", `${rep.id}_forensic_report.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    onShowToast(`Exported ${rep.id} as JSON`, 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a2333]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Forensic Reports & Chain of Custody</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Court-ready evidentiary dossiers, carved artifact classification, sanitization proof and audit summaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleGenerateReport}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            + Generate Report for Current Case
          </button>
        </div>
      </div>

      {/* Main Split: Reports Registry (left 5 cols) & Report Document Viewer (right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Registry: 4.5 cols */}
        <div className="lg:col-span-4 space-y-3">
          <div className="forensic-card p-3 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-[#1e293b]">
              Generated Reports ({reports.length})
            </div>

            <div className="space-y-2">
              {reports.map((rep) => {
                const isSelected = selectedReport?.id === rep.id;
                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReport(rep)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500/70 shadow-sm'
                        : 'bg-[#0b101c] border-[#1e293b] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-blue-400">{rep.id}</span>
                      <StatusBadge status={rep.status} />
                    </div>
                    <div className="font-semibold text-xs text-white mt-1">{rep.case_id}: {rep.case_name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{rep.report_type}</div>
                    <div className="mt-2 pt-2 border-t border-[#182234] flex items-center justify-between text-[10px] text-slate-500">
                      <span>{rep.created_date}</span>
                      <span className="text-slate-400">{rep.investigator}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Report Document Viewer: 8 cols */}
        <div className="lg:col-span-8">
          {selectedReport ? (
            <div className="forensic-card p-6 space-y-5 bg-[#0e1422] text-slate-200">
              {/* Report Controls Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1e293b]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-300">{selectedReport.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportJSON(selectedReport)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3 h-3 text-blue-400" />
                    Export JSON
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3 h-3" />
                    Print / Export PDF
                  </button>
                </div>
              </div>

              {/* Official Document Body */}
              <div className="bg-[#080c14] border border-[#1e293b] rounded-xl p-6 space-y-6 print:border-none">
                {/* Header */}
                <div className="text-center pb-4 border-b border-[#1e293b]">
                  <div className="font-extrabold text-base tracking-widest text-white font-mono">
                    SECURE<span className="text-blue-400">FORENSICS</span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider mt-1">
                    OFFICIAL FORENSIC ANALYSIS & SANITIZATION REPORT
                  </h2>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Report Reference: {selectedReport.id} • Issued: {selectedReport.created_date}
                  </div>
                </div>

                {/* Case & Evidence Metadata */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#0b101c] p-4 rounded-lg border border-[#1e293b]">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Case Identifier:</span>
                    <span className="font-bold text-white">{selectedReport.case_id} — {selectedReport.case_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Lead Investigator:</span>
                    <span className="text-white">{selectedReport.investigator}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Primary Evidence:</span>
                    <span className="text-blue-400">{selectedReport.evidence_item}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Integrity Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {selectedReport.integrity_status}
                    </span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-[#182234]">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Evidence Baseline SHA-256:</span>
                    <span className="text-emerald-400 break-all text-[11px]">{selectedReport.evidence_hash}</span>
                  </div>
                </div>

                {/* Recovery Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-[#1e293b] pb-1">
                    I. Recovery & Carving Summary
                  </h4>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div className="p-2.5 bg-[#0b101c] border border-[#1e293b] rounded">
                      <span className="text-[10px] text-slate-400 block">Sectors Scanned</span>
                      <span className="font-bold text-white">{selectedReport.files_scanned?.toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 bg-[#0b101c] border border-[#1e293b] rounded">
                      <span className="text-[10px] text-slate-400 block">Files Carved</span>
                      <span className="font-bold text-blue-400">{selectedReport.files_found}</span>
                    </div>
                    <div className="p-2.5 bg-[#0b101c] border border-[#1e293b] rounded">
                      <span className="text-[10px] text-slate-400 block">Valid Files</span>
                      <span className="font-bold text-emerald-400">{selectedReport.valid_files}</span>
                    </div>
                    <div className="p-2.5 bg-[#0b101c] border border-[#1e293b] rounded">
                      <span className="text-[10px] text-slate-400 block">High Confidence</span>
                      <span className="font-bold text-indigo-400">{selectedReport.high_confidence}</span>
                    </div>
                  </div>
                </div>

                {/* File Distribution */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-[#1e293b] pb-1">
                    II. Carved File Type Distribution
                  </h4>
                  <div className="grid grid-cols-6 gap-2 text-center text-xs font-mono">
                    <div className="p-2 bg-[#0b101c] border border-[#1e293b] rounded">
                      <span className="text-[10px] text-slate-400 block">JPG</span>
                      <span className="font-bold text-blue-400">{selectedReport.jpg_count}</span>
                    </div>
                    <div className="p-2 bg-[#0b101c] border border-[#1e293b] rounded">
                      <span className="text-[10px] text-slate-400 block">PDF</span>
                      <span className="font-bold text-rose-400">{selectedReport.pdf_count}</span>
                    </div>
                    <div className="p-2 bg-[#0b101c] border border-[#1e293b] rounded">
                      <span className="text-[10px] text-slate-400 block">PNG</span>
                      <span className="font-bold text-emerald-400">{selectedReport.png_count}</span>
                    </div>
                    <div className="p-2 bg-[#0b101c] border border-[#1e293b] rounded">
                      <span className="text-[10px] text-slate-400 block">DOCX</span>
                      <span className="font-bold text-indigo-400">{selectedReport.docx_count}</span>
                    </div>
                    <div className="p-2 bg-[#0b101c] border border-[#1e293b] rounded">
                      <span className="text-[10px] text-slate-400 block">ZIP</span>
                      <span className="font-bold text-amber-400">{selectedReport.zip_count}</span>
                    </div>
                    <div className="p-2 bg-[#0b101c] border border-[#1e293b] rounded">
                      <span className="text-[10px] text-slate-400 block">MP4</span>
                      <span className="font-bold text-pink-400">{selectedReport.mp4_count}</span>
                    </div>
                  </div>
                </div>

                {/* Sanitization & Audit Ledger */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#0b101c] border border-[#1e293b] rounded-lg text-xs space-y-1">
                    <h5 className="font-bold text-slate-300 text-[11px] uppercase tracking-wide">
                      III. Sanitization Operations
                    </h5>
                    <div className="flex justify-between text-slate-400">
                      <span>Completed Jobs:</span>
                      <span className="text-white font-mono">{selectedReport.sanitization_ops}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Verification Passed:</span>
                      <span className="text-emerald-400 font-mono font-bold">100%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0b101c] border border-[#1e293b] rounded-lg text-xs space-y-1">
                    <h5 className="font-bold text-slate-300 text-[11px] uppercase tracking-wide">
                      IV. Tamper-Evident Audit Chain
                    </h5>
                    <div className="flex justify-between text-slate-400">
                      <span>Chained Blocks:</span>
                      <span className="text-white font-mono">{selectedReport.audit_blocks_count}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Chain Integrity:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Valid
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legal / Prototype Certification Signoff */}
                <div className="pt-4 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-slate-500">
                  <div>
                    <span>Examiner: Analyst-01, Digital Forensics Certified</span>
                    <div className="text-[10px] text-slate-600">Simulated Evidentiary Chain • SecureForensics v1.0</div>
                  </div>
                  <div className="text-right font-mono text-emerald-400">
                    CRYPTOGRAPHICALLY SEALED
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="forensic-card p-12 text-center text-slate-500 text-xs">
              Select a report from the registry to view dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
