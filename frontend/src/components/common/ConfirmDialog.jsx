import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "SECURE ERASURE CONFIRMATION",
  target = "USB_TEST_DRIVE",
  method = "Multi-Pass Test Erasure",
  verification = "Full Verification",
  confirmText = "Start Test Erasure",
  cancelText = "Cancel",
  isDestructive = true,
  isLoading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
          <div className="text-xs text-rose-200">
            <span className="font-bold block uppercase tracking-wide">Prototype Safety Protection</span>
            This operation runs safely against simulated test media only. System drives are locked.
          </div>
        </div>

        <div className="bg-[#0b101c] border border-[#1e293b] rounded-lg p-3 space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-[#182234]">
            <span className="text-slate-400">Target Media:</span>
            <span className="font-mono font-semibold text-slate-200">{target}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#182234]">
            <span className="text-slate-400">Sanitization Method:</span>
            <span className="font-medium text-blue-400">{method}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Verification Depth:</span>
            <span className="font-medium text-emerald-400">{verification}</span>
          </div>
        </div>

        <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs text-amber-300">
          WARNING: This will overwrite sectors in the simulated image. A cryptographic audit block will be logged.
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-2 ${
              isDestructive ? 'bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-900/30' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
