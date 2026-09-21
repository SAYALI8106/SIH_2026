import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Download,
  ExternalLink,
  Calendar,
  User,
  Shield,
  FileCheck
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { api } from '../services/api';

export default function Cases({ onSelectCase, onNavigate, showCreateModal, setShowCreateModal }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Create Case Form State
  const [formData, setFormData] = useState({
    name: '',
    case_number: 'CASE-2026-005',
    investigator: 'Analyst-01',
    description: '',
    organization: 'Cyber Defense Bureau',
    reference_number: 'REF-2026-X',
    evidence_source: 'Disk image'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCases();
  }, [statusFilter, search]);

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await api.getCases({
        status: statusFilter,
        search: search || undefined
      });
      setCases(data);
    } catch (err) {
      console.error('Failed to load cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.createCase(formData);
      setShowCreateModal(false);
      // Fetch the newly created case
      const newCase = await api.getCase(res.case_id);
      onSelectCase(newCase);
      onNavigate('case-dashboard');
    } catch (err) {
      alert(`Error creating case: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a2333]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Case Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Maintain forensic chain of custody, evidence containers, and case processing records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            + New Case
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#111726] border border-[#1e293b] rounded-lg">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cases by ID, name, investigator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0b101c] border border-[#1e293b] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex rounded-md bg-[#0b101c] p-0.5 border border-[#1e293b] text-xs">
            {['ALL', 'New', 'Processing', 'Completed', 'Archived'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cases, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", jsonStr);
              downloadAnchor.setAttribute("download", `forensic_cases_export.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      {/* Cases Table */}
      <div className="forensic-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="forensic-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Case Name</th>
                <th>Investigator</th>
                <th>Created Date</th>
                <th>Evidence Count</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-500">
                    Loading forensic cases...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-500">
                    No cases match the specified filters.
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => {
                      onSelectCase(c);
                      onNavigate('case-dashboard');
                    }}
                    className="cursor-pointer"
                  >
                    <td className="font-mono font-bold text-blue-400">{c.id}</td>
                    <td className="font-medium text-slate-100">{c.name}</td>
                    <td className="text-slate-300">{c.investigator}</td>
                    <td className="text-slate-400">{c.created_date}</td>
                    <td className="font-mono text-slate-300">{c.evidence_count} Items</td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c);
                          onNavigate('case-dashboard');
                        }}
                        className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded text-xs font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        Open Dashboard <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Case Modal Form */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Forensic Case"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Case Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Memory Card Leak"
                className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Case Number *
              </label>
              <input
                type="text"
                required
                value={formData.case_number}
                onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                placeholder="CASE-2026-005"
                className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Investigator *
              </label>
              <input
                type="text"
                required
                value={formData.investigator}
                onChange={(e) => setFormData({ ...formData, investigator: e.target.value })}
                className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Organization
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Reference Number
              </label>
              <input
                type="text"
                value={formData.reference_number}
                onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Evidence Source
              </label>
              <select
                value={formData.evidence_source}
                onChange={(e) => setFormData({ ...formData, evidence_source: e.target.value })}
                className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Disk image">Disk image (.img / .dd / .raw)</option>
                <option value="USB">USB Flash Storage</option>
                <option value="External drive">External HDD / SSD</option>
                <option value="Folder">Test Folder / Extracted Artifacts</option>
                <option value="File">Single Evidence File</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Case Description & Objectives
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Forensic acquisition scope, chain of custody notes, suspect identifiers..."
              className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              {isSubmitting ? 'Creating Case...' : 'Create Case & Open Dashboard'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
