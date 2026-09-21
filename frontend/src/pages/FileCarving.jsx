import React, { useState, useEffect } from 'react';
import {
  Binary,
  ArrowDown,
  Layers,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Hash,
  Shield,
  Activity,
  Cpu,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

export default function FileCarving({ onNavigate }) {
  const [pipeline, setPipeline] = useState([]);
  const [signatures, setSignatures] = useState({});
  const [activeStep, setActiveStep] = useState(3);

  useEffect(() => {
    loadCarvingInfo();
  }, []);

  const loadCarvingInfo = async () => {
    try {
      const [pipe, sigs] = await Promise.all([
        api.getPipeline(),
        api.getSignatures()
      ]);
      setPipeline(pipe);
      setSignatures(sigs);
    } catch (err) {
      console.error('Failed to load carving details:', err);
    }
  };

  const testCarvedSamples = [
    { name: 'IMG_001.jpg', sig: 'FF D8 FF', offset: '0x002A40', size: '2.4 MB', status: 'Passed', confidence: '98%', tier: 'High' },
    { name: 'financial_report.pdf', sig: '25 50 44 46 (%PDF)', offset: '0x008F20', size: '845 KB', status: 'Passed', confidence: '96%', tier: 'High' },
    { name: 'evidence_photo.png', sig: '89 50 4E 47', offset: '0x00E2B0', size: '1.2 MB', status: 'Passed', confidence: '95%', tier: 'High' },
    { name: 'case_notes.docx', sig: '50 4B 03 04 (PK)', offset: '0x014C90', size: '523 KB', status: 'Passed', confidence: '94%', tier: 'High' },
    { name: 'backup.zip', sig: '50 4B 03 04 (PK)', offset: '0x01B8D0', size: '4.8 MB', status: 'Passed', confidence: '92%', tier: 'High' },
    { name: 'unknown_fragment.bin', sig: 'Unknown / Slack', offset: '0x021F00', size: '400 KB', status: 'Partial', confidence: '43%', tier: 'Low' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1a2333]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">File Carving Engine Architecture</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Low-level sector traversing, magic byte detection, file header-footer reconstruction pipeline.
          </p>
        </div>

        <button
          onClick={() => onNavigate('recovery')}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          Browse Recovered Files &rarr;
        </button>
      </div>

      {/* Visual Carving Pipeline Flow */}
      <div className="forensic-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Interactive 8-Stage Carving Pipeline
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click any stage to inspect logic</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
          {(pipeline.length > 0 ? pipeline : [
            { step: 1, title: 'Evidence Image', description: 'Mounting write-blocked DD image' },
            { step: 2, title: 'Sector Scanner', description: 'Traversing raw clusters & slack space' },
            { step: 3, title: 'Signature Detection', description: 'Pattern matching magic bytes' },
            { step: 4, title: 'Header Validation', description: 'Verifying headers & descriptors' },
            { step: 5, title: 'Structure Validation', description: 'Validating internal chunk tables' },
            { step: 6, title: 'Fragment Detection', description: 'Detecting contiguous cluster runs' },
            { step: 7, title: 'File Reconstruction', description: 'Assembling trailer & footer' },
            { step: 8, title: 'Confidence Scoring', description: 'Computing 6-factor confidence score' }
          ]).map((stage) => {
            const isCurrent = activeStep === stage.step;
            return (
              <div
                key={stage.step}
                onClick={() => setActiveStep(stage.step)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-900/30 ring-1 ring-blue-400/40'
                    : 'bg-[#0b101c] border-[#1e293b] hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-mono font-bold">
                      {stage.step}
                    </span>
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>}
                  </div>
                  <h4 className="font-semibold text-xs text-slate-100 leading-snug">
                    {stage.title}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 line-clamp-3 leading-tight">
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Magic Byte Signature Reference Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Known Signatures Table */}
        <div className="lg:col-span-7 forensic-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Supported File Signatures (Magic Bytes)
              </h3>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">Active in Carving Engine</span>
          </div>

          <div className="overflow-x-auto">
            <table className="forensic-table">
              <thead>
                <tr>
                  <th>Format</th>
                  <th>Header Magic Bytes</th>
                  <th>Trailer / Footer</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(signatures).map(([ext, details]) => (
                  <tr key={ext}>
                    <td className="font-mono font-bold text-blue-400">{ext}</td>
                    <td className="font-mono text-emerald-400 font-semibold text-[11px]">{details.header_hex}</td>
                    <td className="font-mono text-slate-400 text-[11px]">{details.footer_hex}</td>
                    <td className="text-slate-300 text-xs">{details.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 cols: Live Carved Samples Table */}
        <div className="lg:col-span-5 forensic-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Carved Sector Match Log
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">USB_TEST_01.img</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-72 pr-1">
            {testCarvedSamples.map((sample, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-[#0b101c] border border-[#1e293b] rounded-lg text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white">{sample.name}</span>
                  <span className="font-mono font-semibold text-emerald-400">{sample.confidence}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Offset: {sample.offset}</span>
                  <span>Size: {sample.size}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Magic: <span className="text-blue-400">{sample.sig}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
