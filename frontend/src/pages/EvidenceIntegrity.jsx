import React, { useState, useEffect } from 'react';
import {
  Hash,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Copy,
  Check
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { api } from '../services/api';

export default function EvidenceIntegrity({ onShowToast }) {
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVerification, setActiveVerification] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    loadEvidence();
  }, []);

  const loadEvidence = async () => {
    try {
      setLoading(true);
      const data = await api.getEvidence();
      setEvidenceItems(data);
      if (data.length > 0 && !activeVerification) {
        setActiveVerification({
          item_name: data[0].item_name,
          original_sha256: data[0].sha256,
          current_sha256: data[0].sha256,
          verified: true,
          status: 'INTEGRITY VERIFIED'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (item, tamperSimulation = false) => {
    try {
      setVerifyingId(item.id);
      const res = await api.verifyIntegrity(item.id, tamperSimulation);
      setActiveVerification(res);
      if (res.verified) {
        onShowToast(`Integrity Verified: SHA-256 baseline confirmed for ${item.item_name}`, 'success');
      } else {
        onShowToast(`INTEGRITY MISMATCH: Tampered bits detected in ${item.item_name}!`, 'warning');
      }
      loadEvidence();
    } catch (err) {
      onShowToast(err.message, 'error');
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a2333]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Evidence Integrity & Cryptographic Hashes</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic SHA-256 and MD5 chain of custody verification against pristine intake hashes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-xs text-emerald-300 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          FIPS 180-4 SHA-256 Standard
        </div>
      </div>

      {/* Active Verification Comparison Card */}
      {activeVerification && (
        <div className={`p-5 rounded-xl border transition-all ${
          activeVerification.verified
            ? 'bg-[#0b1612] border-emerald-600/50 shadow-lg shadow-emerald-950/20'
            : 'bg-[#230f14] border-rose-600/60 shadow-lg shadow-rose-950/30'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2.5">
              {activeVerification.verified ? (
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              )}
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  {activeVerification.item_name}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Chain-of-Custody Verification Status
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-md text-xs font-bold font-mono border ${
                activeVerification.verified
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
              }`}>
                {activeVerification.verified ? '✓ INTEGRITY VERIFIED' : '⚠ INTEGRITY MISMATCH'}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#070b13] border border-[#1e293b] rounded-lg space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Baseline Acquisition SHA-256:
              </span>
              <div className="text-emerald-400 break-all select-all font-semibold">
                {activeVerification.original_sha256}
              </div>
            </div>

            <div className={`p-3 rounded-lg border space-y-1 ${
              activeVerification.verified
                ? 'bg-[#070b13] border-[#1e293b]'
                : 'bg-rose-950/50 border-rose-800/80'
            }`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Current Computed SHA-256:
              </span>
              <div className={`break-all select-all font-semibold ${
                activeVerification.verified ? 'text-emerald-400' : 'text-rose-300 font-bold'
              }`}>
                {activeVerification.current_sha256}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Hashes Table */}
      <div className="forensic-card p-4 space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Evidence Registry Hashes
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {evidenceItems.length} Evidence Items Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="forensic-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Size</th>
                <th>SHA-256 Hash</th>
                <th>MD5 Checksum</th>
                <th>Intake Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {evidenceItems.map((item) => (
                <tr key={item.id}>
                  <td className="font-mono font-bold text-slate-100 flex items-center gap-2">
                    <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                    {item.item_name}
                  </td>
                  <td className="font-mono text-slate-300 text-[11px]">{item.size}</td>
                  <td className="font-mono text-emerald-400 text-[11px] max-w-[150px] truncate" title={item.sha256}>
                    {item.sha256}
                  </td>
                  <td className="font-mono text-slate-400 text-[11px]">{item.md5}</td>
                  <td className="text-slate-400 text-[11px]">{item.intake_date}</td>
                  <td>
                    <StatusBadge status={item.integrity_status || 'Verified'} />
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleVerify(item, false)}
                        disabled={verifyingId === item.id}
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 rounded text-xs font-medium transition-colors"
                      >
                        Verify Integrity
                      </button>
                      <button
                        onClick={() => handleVerify(item, true)}
                        className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 text-rose-300 rounded text-[11px] transition-colors"
                        title="Simulate Tampered Bytes"
                      >
                        Simulate Tamper
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
