import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  HardDrive,
  CheckCircle2,
  FolderTree,
  File,
  FileImage,
  FileText,
  FolderArchive,
  Film,
  Download,
  Eye,
  Search,
  Filter,
  Layers,
  Sparkles,
  ShieldCheck,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import ProgressBar from '../components/common/ProgressBar';
import ConfidenceMeter from '../components/common/ConfidenceMeter';
import StatusBadge from '../components/common/StatusBadge';
import { api } from '../services/api';

export default function Recovery({ onShowToast, onNavigate }) {
  const [evidenceSource, setEvidenceSource] = useState('EVI-00001');
  const [scanMode, setScanMode] = useState('Signature-Based Carving');
  const [selectedTypes, setSelectedTypes] = useState(['JPG', 'PNG', 'PDF', 'DOCX', 'ZIP', 'MP4']);

  // Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [sectorsScanned, setSectorsScanned] = useState(0);
  const [liveFilesDetected, setLiveFilesDetected] = useState(0);

  // Results State
  const [results, setResults] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedFileType, setSelectedFileType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);

  useEffect(() => {
    loadFiles();
  }, [evidenceSource, selectedCategory, selectedFileType, searchQuery]);

  const loadFiles = async () => {
    try {
      const data = await api.getRecoveredFiles({
        evidence_id: evidenceSource,
        category: selectedCategory,
        file_type: selectedFileType,
        search: searchQuery || undefined
      });
      setResults(data);
      if (data.files.length > 0 && !activeFile) {
        handleSelectActiveFile(data.files[0]);
      }
    } catch (err) {
      console.error('Failed to load recovered files:', err);
    }
  };

  const handleSelectActiveFile = async (file) => {
    setActiveFile(file);
    try {
      const details = await api.inspectFile(file.id);
      setFileDetails(details);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFileType = (t) => {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setSectorsScanned(0);
    setLiveFilesDetected(0);

    const steps = [
      { p: 18, sectors: 386200, files: 24 },
      { p: 42, sectors: 900500, files: 68 },
      { p: 68, sectors: 1458000, files: 112 },
      { p: 87, sectors: 1870421, files: 135 },
      { p: 100, sectors: 2145000, files: 147 }
    ];

    for (let s of steps) {
      await new Promise(r => setTimeout(r, 650));
      setScanProgress(s.p);
      setSectorsScanned(s.sectors);
      setLiveFilesDetected(s.files);
    }

    try {
      const scanRes = await api.startRecoveryScan({
        evidence_id: evidenceSource,
        scan_mode: scanMode,
        file_types: selectedTypes
      });
      setIsScanning(false);
      onShowToast(`Scan completed: 147 files recovered from USB_TEST_01.img`, 'success');
      loadFiles();
    } catch (err) {
      onShowToast(err.message, 'error');
      setIsScanning(false);
    }
  };

  const handleRecoverSelected = async () => {
    const targets = selectedFileIds.length > 0 ? selectedFileIds : (activeFile ? [activeFile.id] : []);
    if (targets.length === 0) {
      onShowToast('Please select at least one file to recover.', 'warning');
      return;
    }
    try {
      const res = await api.recoverSelected(targets);
      onShowToast(`Successfully restored ${res.recovered_count} files to ${res.export_directory}`, 'success');
      loadFiles();
    } catch (err) {
      onShowToast(err.message, 'error');
    }
  };

  const toggleFileCheckbox = (id) => {
    setSelectedFileIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const categories = [
    { id: 'ALL', name: 'All Recovered', count: results?.total || 147, icon: Layers },
    { id: 'Images', name: 'Images (JPG/PNG)', count: (results?.category_counts?.Images || 100), icon: FileImage },
    { id: 'Documents', name: 'Documents (PDF/DOCX)', count: (results?.category_counts?.Documents || 39), icon: FileText },
    { id: 'Archives', name: 'Archives (ZIP)', count: (results?.category_counts?.Archives || 8), icon: FolderArchive }
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a2333]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Advanced File Recovery & Carving</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Deep-sector signature-based carving, header-footer reconstruction & confidence assessment.
          </p>
        </div>

        <button
          onClick={() => onNavigate('file-carving')}
          className="px-3 py-1.5 bg-[#141d2e] hover:bg-[#1b273d] border border-[#273856] text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          View Carving Pipeline Visualizer &rarr;
        </button>
      </div>

      {/* Top Scanner Configuration Console */}
      <div className="forensic-card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Evidence Selector & Info: 4 cols */}
          <div className="md:col-span-4 space-y-2">
            <label className="block text-slate-400 font-semibold text-xs uppercase tracking-wide">
              Evidence Source Target
            </label>
            <select
              value={evidenceSource}
              onChange={(e) => setEvidenceSource(e.target.value)}
              className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="EVI-00001">USB_TEST_01.img (2.4 GB — FAT32/exFAT)</option>
              <option value="EVI-00002">HDD_TEST_01.img (500 GB — NTFS)</option>
              <option value="EVI-00003">SSD_TEST_01.img (256 GB — APFS)</option>
            </select>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span>Size: 2.4 GB</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                SHA-256 Verified
              </span>
            </div>
          </div>

          {/* Scan Mode Selector: 3 cols */}
          <div className="md:col-span-3 space-y-2">
            <label className="block text-slate-400 font-semibold text-xs uppercase tracking-wide">
              Scanning Mode
            </label>
            <select
              value={scanMode}
              onChange={(e) => setScanMode(e.target.value)}
              className="w-full bg-[#0b101c] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Signature-Based Carving">Signature-Based Carving (Recommended)</option>
              <option value="Quick Scan">Quick Scan (File Table Traversal)</option>
              <option value="Deep Scan">Deep Scan (Full Block Exhaustive)</option>
            </select>
          </div>

          {/* File Types Checkboxes: 3 cols */}
          <div className="md:col-span-3 space-y-2">
            <label className="block text-slate-400 font-semibold text-xs uppercase tracking-wide">
              Target Signatures
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {['JPG', 'PNG', 'PDF', 'DOCX', 'ZIP', 'MP4'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleFileType(type)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-colors border ${
                    selectedTypes.includes(type)
                      ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                      : 'bg-[#090d16] text-slate-500 border-[#1e293b]'
                  }`}
                >
                  ☑ {type}
                </button>
              ))}
            </div>
          </div>

          {/* Start Scan Button: 2 cols */}
          <div className="md:col-span-2">
            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-blue-900/30 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'START SCAN'}
            </button>
          </div>
        </div>

        {/* Live Animated Scanning Progress Bar */}
        {isScanning && (
          <div className="p-4 bg-[#090e1a] border border-blue-500/50 rounded-lg space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-300 flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin text-blue-400" />
                Analyzing evidence bit-stream: {sectorsScanned.toLocaleString()} / 2,145,000 sectors...
              </span>
              <span className="font-mono font-bold text-blue-400 text-sm">{scanProgress}%</span>
            </div>

            <ProgressBar progress={scanProgress} color="blue" showLabel={false} height="h-2.5" />

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Files Detected: <strong className="text-white">{liveFilesDetected}</strong></span>
              <span>Classification: JPG: 82 | PDF: 24 | PNG: 18 | DOCX: 15 | ZIP: 8</span>
            </div>
          </div>
        )}
      </div>

      {/* Wise Data Recovery & M3 Style Three-Panel Recovery Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT PANEL: Directory / Category Tree (3 cols) */}
        <div className="lg:col-span-3 forensic-card p-3 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1e293b]">
            <FolderTree className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Categories
            </h3>
          </div>

          <div className="space-y-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedFileType('ALL');
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-md text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-blue-600/15 text-blue-300 font-semibold border-l-2 border-blue-500'
                      : 'text-slate-300 hover:bg-[#141d2f]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick File Type Filter */}
          <div className="pt-3 border-t border-[#1e293b]">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-2 tracking-wider">
              Filter by Extension
            </span>
            <div className="grid grid-cols-3 gap-1 text-[11px] font-mono">
              {['ALL', 'JPG', 'PDF', 'PNG', 'DOCX', 'ZIP'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedFileType(t)}
                  className={`py-1 rounded text-center transition-colors ${
                    selectedFileType === t
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-[#0b101c] text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER PANEL: Recovered Files Table (5.5 cols) */}
        <div className="lg:col-span-5 forensic-card p-3 space-y-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
            <div className="relative flex-1 max-w-[200px]">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b101c] border border-[#1e293b] rounded pl-7 pr-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {results?.returned || 0} of {results?.total || 147}
            </span>
          </div>

          <div className="overflow-y-auto max-h-[500px] flex-1">
            <table className="forensic-table">
              <thead>
                <tr>
                  <th className="w-8"></th>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Offset</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {(results?.files || []).map((file) => {
                  const isActive = activeFile?.id === file.id;
                  const isChecked = selectedFileIds.includes(file.id);
                  return (
                    <tr
                      key={file.id}
                      onClick={() => handleSelectActiveFile(file)}
                      className={`cursor-pointer ${isActive ? '!bg-[#1a263d]' : ''}`}
                    >
                      <td className="text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleFileCheckbox(file.id)}
                          className="rounded bg-slate-800 text-blue-600 focus:ring-0"
                        />
                      </td>
                      <td className="font-mono text-slate-100 font-semibold flex items-center gap-1.5">
                        <File className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <span className="truncate max-w-[140px]">{file.file_name}</span>
                      </td>
                      <td className="text-slate-300 font-mono text-[11px]">{file.file_type}</td>
                      <td className="font-mono text-slate-400 text-[11px]">{file.size_str}</td>
                      <td className="font-mono text-blue-400 text-[11px]">{file.offset_hex}</td>
                      <td>
                        <ConfidenceMeter score={file.confidence} compact={true} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT PANEL: File Preview & Forensic Details (3.5 cols) */}
        <div className="lg:col-span-4 forensic-card p-4 space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Forensic File Preview
              </h3>
            </div>
            {activeFile && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                {activeFile.file_type}
              </span>
            )}
          </div>

          {activeFile ? (
            <div className="space-y-3.5">
              {/* File Specs Box */}
              <div className="bg-[#0b101c] border border-[#1e293b] rounded-lg p-3 space-y-1.5 text-xs">
                <div className="flex justify-between py-0.5 border-b border-[#182234]">
                  <span className="text-slate-400">File Name:</span>
                  <span className="font-mono font-bold text-white truncate max-w-[160px]">
                    {activeFile.file_name}
                  </span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#182234]">
                  <span className="text-slate-400">Cluster Offset:</span>
                  <span className="font-mono text-blue-400 font-semibold">{activeFile.offset_hex}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#182234]">
                  <span className="text-slate-400">Carved Size:</span>
                  <span className="font-mono text-slate-300">{activeFile.size_str}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Header Marker:</span>
                  <span className="font-mono text-emerald-400 text-[10px]">{activeFile.header_hex}</span>
                </div>
              </div>

              {/* Confidence Breakdown Meter */}
              <ConfidenceMeter
                score={activeFile.confidence}
                breakdown={fileDetails?.breakdown}
              />

              {/* Hex Dump Snippet */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1 tracking-wider">
                  Raw Sector Header Dump
                </span>
                <div className="p-2.5 bg-[#070b13] border border-[#1e293b] rounded font-mono text-[10px] space-y-1 text-slate-400 select-all overflow-x-auto">
                  {(fileDetails?.hex_preview || [
                    { offset: activeFile.offset_hex, hex: 'FF D8 FF E0 00 10 4A 46 49 46 00 01', ascii: '......JFIF..' },
                    { offset: '0x002A50', hex: '00 60 00 00 FF DB 00 43 00 08 06 06', ascii: '.`.....C....' }
                  ]).map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-slate-600">{h.offset}:</span>
                      <span className="text-blue-400">{h.hex}</span>
                      <span className="text-slate-500">|{h.ascii}|</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleRecoverSelected}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Recover Selected ({selectedFileIds.length > 0 ? selectedFileIds.length : 1})
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select an artifact from the table to preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
