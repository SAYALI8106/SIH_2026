import React, { useState } from 'react';
import { Shield, KeyRound, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('analyst@secureforensics.local');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 600);
  };

  const fillDemo = () => {
    setEmail('analyst@secureforensics.local');
    setPassword('DemoForensic2026!');
  };

  return (
    <div className="min-h-screen bg-[#070a10] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Cyber Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="w-full max-w-md bg-[#0e1422] border border-[#1e293b] rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/40 border border-blue-400/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-extrabold tracking-wider text-white font-mono">
            SECURE<span className="text-blue-400">FORENSICS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Integrated Digital Forensics & Data Sanitization
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mb-6 p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="text-blue-400 font-semibold block text-[11px] uppercase tracking-wider">Demo Credentials</span>
            <span className="font-mono text-slate-300">analyst@secureforensics.local</span>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            className="px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-[11px] font-medium rounded border border-blue-500/40 transition-colors"
          >
            Auto Fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
              Operator Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
              placeholder="analyst@secureforensics.local"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#090d16] border border-[#1e293b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                placeholder="••••••••••••"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>Sign In to Forensic Suite</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Safety Footer */}
        <div className="mt-6 pt-4 border-t border-[#1a2333] flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Air-Gapped Sandbox
          </span>
          <span>Build 2026.09-v1</span>
        </div>
      </div>
    </div>
  );
}
