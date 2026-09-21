import React, { useState, useEffect } from 'react';
import {
  Eraser,
  HardDrive,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ScrollText,
  Clock,
  Info,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import ProgressBar from '../components/common/ProgressBar';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import { api } from '../services/api';

export default function DriveEraser({ onNavigate, onShowToast }) {
  const [drives, setDrives] = useState([]);
  const [methods, setMethods] = useState({});
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('Multi-Pass Test Erasure');
  const [selectedVerification, setSelectedVerification] = useState('Full Verification');

  // Execution & Progress State
  const [showConfirm, setShowConfirm] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('');
  const [sectorsProcessed, setSectorsProcessed] = useState(0);
  const [totalSectors, setTotalSectors] = useState(10000);
  const [erasureResult, setErasureResult] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    loadDrivesAndMethods();
  }, []);

  const loadDrivesAndMethods = async () => {
    try {
      const [drvs, mths] = await Promise.all([
        api.getDrives(),
        api.getErasureMethods()
      ]);
      setDrives(drvs);
      setMethods(mths);
      if (drvs.length > 0) {
        // default select USB_TEST_DRIVE or first
        const defaultDrive = drvs.find(d => d.model.includes('USB')) || drvs[0];
        setSelectedDrive(defaultDrive);
      }
    } catch (err) {
      console.error('Failed to load eraser data:', err);
    }
  };

  const handleStartErasure = () => {
    if (!selectedDrive) {
      onShowToast('Please select a target test drive first.', 'warning');
      return;
    }
    setShowConfirm(true);
  };

  const executeErasureSimulation = async () => {
    setShowConfirm(false);
    setIsErasing(true);
    setProgress(0);
    setErasureResult(null);

    const steps = [
      { p: 15, text: 'Locking target volume & unmounting logical sectors...', sectors: 1500 },
      { p: 35, text: 'Pass 1/3: Overwriting sectors with binary 0x00...', sectors: 3500 },
      { p: 60, text: 'Pass 2/3: Overwriting sectors with binary 0xFF...', sectors: 6000 },
      { p: 82, text: 'Pass 3/3: Writing CSPRNG pseudorandom test pattern...', sectors: 8210 },
      { p: 95, text: 'Executing bit-level cryptographic verification...', sectors: 9500 },
      { p: 100, text: 'Generating Sanitization Certificate & Audit Block...', sectors: 10000 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setProgress(steps[i].p);
      setCurrentStepText(steps[i].text);
      setSectorsProcessed(steps[i].sectors);
    }

    try {
      const result = await api.startDriveErasure({
        target_id: selectedDrive.id,
        method: selectedMethod,
        verification_method: selectedVerification
      });
      setErasureResult(result);
      onShowToast(`Sanitization completed & verified: ${result.job_id}`, 'success');
    } catch (err) {
      onShowToast(err.message, 'error');
    } finally {
      setIsErasing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a2333]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Secure Drive Eraser</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-semibold">
              BitRaser & NIST SP 800-88 Spec
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Securely sanitize selected test drives or disk images and cryptographically verify the result.
          </p>
        </div>

        {/* Prototype Safety Notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs text-blue-300">
          <ShieldAlert className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>Real OS drive locked • Operating strictly on sandboxed test media</span>
        </div>
      </div>

      {/* 4-Step Erasure Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Steps 1, 2, 3 */}
        <div className="lg:col-span-8 space-y-5">
          {/* STEP 1: SELECT DRIVE */}
          <div className="forensic-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                  1
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Select Target Test Drive
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Only authorized test units displayed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="forensic-table">
                <thead>
                  <tr>
                    <th className="w-10">Select</th>
                    <th>Model</th>
                    <th>Serial Number</th>
                    <th>Size</th>
                    <th>Type</th>
                    <th>File System</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {drives.map((drv) => {
                    const isSelected = selectedDrive?.id === drv.id;
                    return (
                      <tr
                        key={drv.id}
                        onClick={() => setSelectedDrive(drv)}
                        className={`cursor-pointer ${isSelected ? '!bg-[#1b273d]' : ''}`}
                      >
                        <td className="text-center">
                          <input
                            type="radio"
                            name="drive_select"
                            checked={isSelected}
                            onChange={() => setSelectedDrive(drv)}
                            className="text-blue-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="font-mono font-bold text-slate-100">{drv.model}</td>
                        <td className="font-mono text-slate-400 text-[11px]">{drv.serial_number}</td>
                        <td className="font-mono text-slate-200 font-semibold">{drv.size}</td>
                        <td className="text-slate-300">{drv.type}</td>
                        <td className="font-mono text-slate-400">{drv.file_system}</td>
                        <td>
                          <span className="badge-verified">Ready</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* STEP 2: ERASURE METHOD */}
          <div className="forensic-card p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1e293b]">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                2
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Select Sanitization Standard & Erasure Method
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(methods).map(([methodName, details]) => {
                const isSelected = selectedMethod === methodName;
                return (
                  <div
                    key={methodName}
                    onClick={() => setSelectedMethod(methodName)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500/70 shadow-md shadow-blue-950/40'
                        : 'bg-[#0b101c] border-[#1e293b] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-100">{methodName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {details.passes} Pass{details.passes > 1 ? 'es' : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {details.description}
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-blue-400">
                      Standard: {details.standard}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: VERIFICATION */}
          <div className="forensic-card p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1e293b]">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Verification Depth
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setSelectedVerification('Quick Verification')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedVerification === 'Quick Verification'
                    ? 'bg-blue-950/40 border-blue-500 text-white'
                    : 'bg-[#0b101c] border-[#1e293b] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-slate-100">Quick Verification</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  High-speed sample verification (10% random sector integrity check)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedVerification('Full Verification')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedVerification === 'Full Verification'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white'
                    : 'bg-[#0b101c] border-[#1e293b] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Full Verification (Recommended)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Complete 100% sector read-back with SHA-256 integrity confirmation
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Step 4 Action, Live Progress & Completion Card */}
        <div className="lg:col-span-4 space-y-4">
          {/* Operation Summary & Action Card */}
          <div className="forensic-card p-4 space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#1e293b]">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                4
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Action & Status
              </h3>
            </div>

            <div className="bg-[#0b101c] border border-[#1e293b] rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between py-0.5 border-b border-[#182234]">
                <span className="text-slate-400">Target:</span>
                <span className="font-mono font-bold text-slate-200">{selectedDrive?.model || 'None'}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#182234]">
                <span className="text-slate-400">Drive Size:</span>
                <span className="font-mono text-slate-300">{selectedDrive?.size || '-'}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#182234]">
                <span className="text-slate-400">Method:</span>
                <span className="text-blue-400 font-medium truncate max-w-[150px]">{selectedMethod}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Verification:</span>
                <span className="text-emerald-400 font-medium">{selectedVerification}</span>
              </div>
            </div>

            {!isErasing && !erasureResult && (
              <button
                type="button"
                onClick={handleStartErasure}
                disabled={!selectedDrive}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Eraser className="w-4 h-4" />
                EXECUTE SECURE ERASURE
              </button>
            )}

            {/* In-Progress UI */}
            {isErasing && (
              <div className="p-3.5 bg-[#0b101c] border border-blue-500/40 rounded-lg space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    Erasure In Progress...
                  </span>
                  <span className="font-mono font-bold text-blue-400">{progress}%</span>
                </div>

                <ProgressBar progress={progress} color="blue" showLabel={false} height="h-2.5" />

                <div className="space-y-1 text-[11px] font-mono">
                  <div className="text-slate-300 truncate">
                    <span className="text-slate-500">Operation:</span> {currentStepText}
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Sectors Processed:</span>
                    <span className="text-slate-200">{sectorsProcessed.toLocaleString()} / {totalSectors.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Verification:</span>
                    <span className="text-amber-400">Pending</span>
                  </div>
                </div>
              </div>
            )}

            {/* Post-Completion Result UI */}
            {erasureResult && (
              <div className="p-4 bg-[#0a1814] border border-emerald-600/50 rounded-lg space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ERASURE COMPLETE</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-emerald-950">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verification Passed
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-950 font-mono">
                    <span className="text-slate-400">Operation ID:</span>
                    <span className="text-slate-200 font-bold">{erasureResult.job_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Verification SHA-256:</span>
                    <div className="p-1.5 bg-[#070f0d] rounded text-[10px] font-mono text-emerald-400 break-all mt-0.5">
                      {erasureResult.verification_hash}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    View Certificate of Sanitization
                  </button>
                  <button
                    onClick={() => onNavigate('audit-logs')}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ScrollText className="w-3.5 h-3.5 text-blue-400" />
                    View Tamper-Evident Audit Log
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Safety Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeErasureSimulation}
        target={selectedDrive?.model || 'USB_TEST_DRIVE'}
        method={selectedMethod}
        verification={selectedVerification}
      />

      {/* Sanitization Certificate Modal */}
      <Modal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        title="Official Certificate of Data Sanitization"
        maxWidth="max-w-lg"
      >
        <div className="p-5 bg-[#0b101c] border border-[#1e293b] rounded-xl space-y-4 text-xs font-sans">
          <div className="text-center pb-3 border-b border-[#1e293b]">
            <div className="font-extrabold text-sm tracking-wider text-white font-mono">
              SECURE<span className="text-blue-400">FORENSICS</span>
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-widest mt-0.5">
              Certificate of Secure Sanitization & Data Destruction
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#182234]">
              <span className="text-slate-400">Certificate ID:</span>
              <span className="font-mono font-bold text-blue-400">{erasureResult?.job_id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#182234]">
              <span className="text-slate-400">Target Device:</span>
              <span className="font-semibold text-white">{erasureResult?.target_name} ({erasureResult?.size})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#182234]">
              <span className="text-slate-400">Sanitization Standard:</span>
              <span className="text-slate-200">{erasureResult?.method}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#182234]">
              <span className="text-slate-400">Verification Result:</span>
              <span className="text-emerald-400 font-bold">100% BIT-LEVEL ZERO RESIDUAL (PASSED)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#182234]">
              <span className="text-slate-400">Total Sectors Sanitized:</span>
              <span className="font-mono text-slate-200">{erasureResult?.total_sectors?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#182234]">
              <span className="text-slate-400">Authorized Operator:</span>
              <span className="text-slate-200">{erasureResult?.operator}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Post-Sanitization Checksum (SHA-256):</span>
              <div className="p-2 bg-[#070b13] border border-[#1e293b] rounded font-mono text-[10px] text-emerald-400 break-all mt-1">
                {erasureResult?.verification_hash}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between text-[10px] text-slate-500">
            <span>NIST SP 800-88 Compliant Simulation</span>
            <span className="text-emerald-400 font-mono">CRYPTOGRAPHICALLY CHAINED</span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowCertificate(false)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
