import React, { useState, useEffect } from 'react';
import {
  ScrollText,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Link,
  Lock,
  Unlock,
  Sliders,
  Check
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { api } from '../services/api';

export default function AuditLogs({ onShowToast }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    loadAuditBlocks();
  }, []);

  const loadAuditBlocks = async () => {
    try {
      setLoading(true);
      const data = await api.getAuditBlocks();
      setBlocks(data);
    } catch (err) {
      console.error('Failed to load audit blocks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyChain = async () => {
    try {
      setIsVerifying(true);
      const res = await api.verifyAuditChain();
      setVerificationResult(res);
      if (res.valid) {
        onShowToast('✓ Audit Chain Verified: All block cryptographic hashes valid!', 'success');
      } else {
        onShowToast(`⚠ CHAIN INTEGRITY FAILED: ${res.reason}`, 'warning');
      }
    } catch (err) {
      onShowToast(err.message, 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTamper = async (blockId) => {
    try {
      await api.tamperAuditBlock(blockId, 'UNAUTHORIZED EVIDENCE DELETION');
      onShowToast(`Simulated adversary tampering injected into Block #${blockId}!`, 'warning');
      await loadAuditBlocks();
      // Auto trigger verification to demonstrate detection
      const res = await api.verifyAuditChain();
      setVerificationResult(res);
    } catch (err) {
      onShowToast(err.message, 'error');
    }
  };

  const handleRestore = async () => {
    try {
      await api.restoreAuditChain();
      onShowToast('Audit chain cryptographic links restored successfully.', 'success');
      await loadAuditBlocks();
      const res = await api.verifyAuditChain();
      setVerificationResult(res);
    } catch (err) {
      onShowToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a2333]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Tamper-Evident Audit Ledger</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
              SHA-256 Chained Hash Log
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable chain-of-custody log: <code className="text-blue-400">currentHash = SHA256(timestamp + operation + details + prevHash)</code>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRestore}
            className="px-3 py-1.5 bg-[#141d2f] hover:bg-[#1a263d] text-slate-300 border border-[#273856] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            Reset / Restore Chain
          </button>
          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            {isVerifying ? 'Computing SHA-256 Hashes...' : 'Verify Audit Chain'}
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationResult && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-fadeIn ${
          verificationResult.valid
            ? 'bg-[#0a1814] border-emerald-600/50 text-emerald-200'
            : 'bg-[#261015] border-rose-600/60 text-rose-200'
        }`}>
          <div className="flex items-center gap-3">
            {verificationResult.valid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <div>
              <div className="font-bold text-sm tracking-wide">
                {verificationResult.valid ? '✓ Audit Chain Verified' : '⚠ CHAIN INTEGRITY FAILED'}
              </div>
              <div className="text-[11px] opacity-90 mt-0.5">
                {verificationResult.valid
                  ? `${verificationResult.blocks_count} cryptographic blocks inspected from genesis. Zero anomalies detected.`
                  : verificationResult.reason}
              </div>
            </div>
          </div>

          <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-black/40 border border-white/10">
            {verificationResult.valid ? 'CRYPTO STATUS: SECURE' : `FAIL BLOCK: #${verificationResult.invalid_block}`}
          </span>
        </div>
      )}

      {/* Audit Blocks Table */}
      <div className="forensic-card p-4 space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Audit Chain Blocks ({blocks.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Genesis: 00000000...
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="forensic-table">
            <thead>
              <tr>
                <th className="w-16">Block</th>
                <th>Time</th>
                <th>User</th>
                <th>Operation</th>
                <th>Details</th>
                <th>Previous Hash</th>
                <th>Current Hash</th>
                <th>Status</th>
                <th className="text-right">Adversary Simulation</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((b) => (
                <tr key={b.block_id} className={b.operation.includes('UNAUTHORIZED') ? 'bg-rose-950/30' : ''}>
                  <td className="font-mono font-bold text-blue-400">#{b.block_code}</td>
                  <td className="font-mono text-slate-300 text-[11px]">{b.timestamp}</td>
                  <td className="text-slate-300 font-medium text-[11px]">{b.user}</td>
                  <td className="font-semibold text-slate-100">{b.operation}</td>
                  <td className="text-slate-400 text-[11px] max-w-[220px] truncate" title={b.details}>
                    {b.details}
                  </td>
                  <td className="font-mono text-slate-500 text-[10px] max-w-[100px] truncate" title={b.prev_hash}>
                    {b.prev_hash.substring(0, 10)}...
                  </td>
                  <td className="font-mono text-emerald-400 text-[10px] max-w-[100px] truncate" title={b.current_hash}>
                    {b.current_hash.substring(0, 10)}...
                  </td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleTamper(b.block_id)}
                      className="px-2 py-1 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 text-rose-300 rounded text-[10px] font-mono transition-colors"
                      title="Simulate modifying this block to show chain break"
                    >
                      Tamper Block
                    </button>
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
