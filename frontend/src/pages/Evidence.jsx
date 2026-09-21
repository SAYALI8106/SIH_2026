import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Hash,
  Play,
  FileText,
  Download,
  X,
  Copy,
  Check,
  ExternalLink,
  Plus
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { api } from '../services/api';

export default function Evidence({
  onNavigate,
  onShowToast,
  activeCase
}) {
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isHashing, setIsHashing] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Evidence Form State
  const [newEvi, setNewEvi] = useState({
    case_id: activeCase?.id || 'CASE-2026-001',
    case_name: activeCase?.name || 'USB Investigation',
    item_name: 'SD_CARD_RECOVERED.img',
    type: 'Flash',
    brand: 'Samsung',
    model: 'EVO Plus 128G',
    size: '128 GB',
    current_location: 'Forensic Lab Vault 1',
    description: 'Hardware write-blocked test image acquired from seized test media.'
  });

  useEffect(() => {
    loadEvidence();
  }, [search]);

  const loadEvidence = async () => {
    try {
      setLoading(true);
      const data = await api.getEvidence({ search: search || undefined });
      setEvidenceList(data);
      if (data.length > 0 && !selectedItem) {
        setSelectedItem(data[0]);
      }
    } catch (err) {
      console.error('Failed to load evidence:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateHash = async (evi) => {
    try {
      setIsHashing(true);
      const res = await api.calculateHash(evi.id);
      // update item state
      setSelectedItem({ ...selectedItem, sha256: res.sha256, md5: res.md5 });
      onShowToast(`Calculated SHA-256 for ${evi.item_name}`, 'success');
      loadEvidence();
    } catch (err) {
      onShowToast(err.message, 'error');
    } finally {
      setIsHashing(false);
    }
  };

  const handleVerifyIntegrity = async (evi, simulateTamper = false) => {
    try {
      const res = await api.verifyIntegrity(evi.id, simulateTamper);
      setSelectedItem({ ...selectedItem, integrity_status: res.verified ? 'Verified' : 'MISMATCH' });
      if (res.verified) {
        onShowToast(`Integrity Verified: SHA-256 match confirmed.`, 'success');
      } else {
        onShowToast(`WARNING: INTEGRITY MISMATCH DETECTED!`, 'warning');
      }
      loadEvidence();
    } catch (err) {
      onShowToast(err.message, 'error');
    }
  };

  const handleAddEvidence = async (e) => {
    e.preventDefault();
    try {
      await api.addEvidence(newEvi);
      setShowAddModal(false);
      onShowToast(`Evidence item ${newEvi.item_name} registered successfully.`, 'success');
      loadEvidence();
    } catch (err) {
      onShowToast(err.message, 'error');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
    onShowToast('Hash copied to clipboard', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a2333]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Evidence Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically tracked evidence containers, storage media and disk image repository.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            + Intake Evidence
          </button>
        </div>
      </div>

      {/* Main Split Layout: Table (left) & Details Panel (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Table: 7 cols */}
        <div className="lg:col-span-7 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter evidence by ID, item name, brand, or case..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111726] border border-[#1e293b] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="forensic-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="forensic-table">
                <thead>
                  <tr>
                    <th>Evidence ID</th>
                    <th>Case</th>
                    <th>Item Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-slate-500">
                        Loading evidence registry...
                      </td>
                    </tr>
                  ) : evidenceList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-slate-500">
                        No evidence items found.
                      </td>
                    </tr>
                  ) : (
                    evidenceList.map((evi) => {
                      const isSelected = selectedItem?.id === evi.id;
                      return (
                        <tr
                          key={evi.id}
                          onClick={() => setSelectedItem(evi)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? '!bg-[#1b273d] border-l-2 border-l-blue-500' : ''
                          }`}
                        >
                          <td className="font-mono font-bold text-blue-400">{evi.id}</td>
                          <td className="font-mono text-slate-300 text-[11px]">{evi.case_id}</td>
                          <td className="font-medium text-slate-100">{evi.item_name}</td>
                          <td className="text-slate-300">{evi.type}</td>
                          <td className="font-mono text-slate-400">{evi.size}</td>
                          <td>
                            <StatusBadge status={evi.status} />
                          </td>
                          <td className="text-slate-400 text-[11px] truncate max-w-[120px]">
                            {evi.current_location}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Details Panel: 5 cols (Monolith Forensics style) */}
        <div className="lg:col-span-5">
          {selectedItem ? (
            <div className="forensic-card p-5 space-y-4 sticky top-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold">
                    Evidence Inspector
                  </span>
                  <h3 className="text-sm font-bold text-white font-mono mt-0.5">
                    {selectedItem.item_name}
                  </h3>
                </div>
                <StatusBadge status={selectedItem.integrity_status || 'Verified'} />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => onNavigate('recovery')}
                  className="px-2 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  Analyze
                </button>
                <button
                  onClick={() => handleCalculateHash(selectedItem)}
                  disabled={isHashing}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Hash className="w-3 h-3 text-blue-400" />
                  {isHashing ? 'Hashing...' : 'Hash'}
                </button>
                <button
                  onClick={() => handleVerifyIntegrity(selectedItem, false)}
                  className="px-2 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Verify
                </button>
                <button
                  onClick={() => onNavigate('reports')}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <FileText className="w-3 h-3 text-emerald-400" />
                  Report
                </button>
              </div>

              {/* Forensic Details Grid */}
              <div className="space-y-2 text-xs bg-[#0b101c] p-3.5 rounded-lg border border-[#1e293b]">
                <div className="flex justify-between py-1 border-b border-[#182234]">
                  <span className="text-slate-400">Evidence ID:</span>
                  <span className="font-mono text-slate-200">{selectedItem.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#182234]">
                  <span className="text-slate-400">Associated Case:</span>
                  <span className="font-mono text-blue-400">{selectedItem.case_id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#182234]">
                  <span className="text-slate-400">Device Model:</span>
                  <span className="text-slate-200">{selectedItem.brand} {selectedItem.model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#182234]">
                  <span className="text-slate-400">Media Type / Size:</span>
                  <span className="font-mono text-slate-200">{selectedItem.type} ({selectedItem.size})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#182234]">
                  <span className="text-slate-400">Intake Date:</span>
                  <span className="text-slate-300">{selectedItem.intake_date}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Storage Location:</span>
                  <span className="text-slate-200">{selectedItem.current_location}</span>
                </div>
              </div>

              {/* Cryptographic Hashes (SHA-256 & MD5) */}
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Hash className="w-3 h-3 text-blue-400" />
                      SHA-256 Baseline Hash
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedItem.sha256)}
                      className="text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-1"
                    >
                      {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <div className="p-2 bg-[#090d16] border border-[#1e293b] rounded font-mono text-[11px] text-emerald-400 break-all leading-tight select-all">
                    {selectedItem.sha256}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Hash className="w-3 h-3 text-slate-500" />
                    MD5 Checksum
                  </span>
                  <div className="p-2 bg-[#090d16] border border-[#1e293b] rounded font-mono text-[11px] text-slate-300 select-all">
                    {selectedItem.md5}
                  </div>
                </div>
              </div>

              {/* Tamper Simulation Test Button */}
              <div className="pt-2 border-t border-[#1e293b]">
                <button
                  onClick={() => handleVerifyIntegrity(selectedItem, true)}
                  className="w-full py-1.5 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/40 text-rose-300 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Test Tamper Detection (Simulate Hash Mismatch)
                </button>
              </div>
            </div>
          ) : (
            <div className="forensic-card p-8 text-center text-slate-500 text-xs">
              Select an evidence item from the table to inspect details and hashes.
            </div>
          )}
        </div>
      </div>

      {/* Intake Evidence Modal Form */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Intake New Evidence Container"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddEvidence} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Item File Name *</label>
            <input
              type="text"
              required
              value={newEvi.item_name}
              onChange={(e) => setNewEvi({ ...newEvi, item_name: e.target.value })}
              className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Hardware Brand</label>
              <input
                type="text"
                value={newEvi.brand}
                onChange={(e) => setNewEvi({ ...newEvi, brand: e.target.value })}
                className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Storage Capacity</label>
              <input
                type="text"
                value={newEvi.size}
                onChange={(e) => setNewEvi({ ...newEvi, size: e.target.value })}
                className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Evidence Type</label>
              <select
                value={newEvi.type}
                onChange={(e) => setNewEvi({ ...newEvi, type: e.target.value })}
                className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="USB">USB Flash</option>
                <option value="HDD">HDD Physical</option>
                <option value="SSD">NVMe / SATA SSD</option>
                <option value="Flash">SD / MicroSD Card</option>
                <option value="Image">DD Disk Image</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Vault / Location</label>
              <input
                type="text"
                value={newEvi.current_location}
                onChange={(e) => setNewEvi({ ...newEvi, current_location: e.target.value })}
                className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              Add to Registry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
