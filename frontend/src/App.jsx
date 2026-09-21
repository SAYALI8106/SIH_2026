import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Breadcrumbs from './components/layout/Breadcrumbs';
import Toast from './components/common/Toast';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import CaseDashboard from './pages/CaseDashboard';
import Evidence from './pages/Evidence';
import DriveEraser from './pages/DriveEraser';
import FileEraser from './pages/FileEraser';
import Recovery from './pages/Recovery';
import FileCarving from './pages/FileCarving';
import EvidenceIntegrity from './pages/EvidenceIntegrity';
import AuditLogs from './pages/AuditLogs';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

import { api } from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [casesList, setCasesList] = useState([]);
  const [activeCase, setActiveCase] = useState({
    id: 'CASE-2026-001',
    name: 'USB Investigation',
    status: 'Processing',
    investigator: 'Analyst-01',
    created_date: '21 Sep 2026'
  });
  const [showCreateCaseModal, setShowCreateCaseModal] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const cases = await api.getCases();
      setCasesList(cases);
      if (cases.length > 0 && !activeCase) {
        setActiveCase(cases[0]);
      }
    } catch (err) {
      console.error('Failed to load cases:', err);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const getBreadcrumbs = () => {
    const map = {
      dashboard: [{ label: 'Overview' }],
      cases: [{ label: 'Cases' }],
      'case-dashboard': [{ label: 'Cases', view: 'cases' }, { label: `${activeCase?.id || 'Case'}` }],
      evidence: [{ label: 'Cases', view: 'cases' }, { label: 'Evidence Repository' }],
      'drive-eraser': [{ label: 'Data Sanitization' }, { label: 'Drive Eraser' }],
      'file-eraser': [{ label: 'Data Sanitization' }, { label: 'File & Folder Eraser' }],
      'erasure-history': [{ label: 'Data Sanitization' }, { label: 'Erasure History' }],
      recovery: [{ label: 'Forensic Recovery' }, { label: 'Carving Console' }],
      'file-carving': [{ label: 'Forensic Recovery', view: 'recovery' }, { label: 'Carving Architecture' }],
      'recovered-files': [{ label: 'Forensic Recovery' }, { label: 'Recovered Files' }],
      'evidence-hashes': [{ label: 'Integrity' }, { label: 'Evidence Hashes' }],
      'audit-logs': [{ label: 'Integrity' }, { label: 'Tamper-Evident Audit Ledger' }],
      'integrity-chain': [{ label: 'Integrity' }, { label: 'Audit Chain' }],
      reports: [{ label: 'Reporting' }, { label: 'Forensic Dossiers' }],
      export: [{ label: 'Reporting' }, { label: 'Case Export' }],
      analytics: [{ label: 'System' }, { label: 'Analytics' }],
      settings: [{ label: 'System' }, { label: 'Settings' }],
      help: [{ label: 'System' }, { label: 'Help & Demo Walkthrough' }]
    };
    return map[currentView] || [{ label: currentView }];
  };

  return (
    <div className="flex h-screen bg-[#0a0d14] text-slate-100 overflow-hidden font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        activeCase={activeCase}
        onNewCaseClick={() => {
          setCurrentView('cases');
          setShowCreateCaseModal(true);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <TopBar
          currentCase={activeCase}
          casesList={casesList}
          onSelectCase={(c) => {
            setActiveCase(c);
            showToast(`Active Case switched to ${c.id}`, 'success');
          }}
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
          onOpenCaseDashboard={() => setCurrentView('case-dashboard')}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6">
          <Breadcrumbs items={getBreadcrumbs()} onNavigate={setCurrentView} />

          {/* View Routing */}
          {currentView === 'dashboard' && (
            <Dashboard
              onNavigate={setCurrentView}
              onSelectCase={setActiveCase}
              onNewCaseClick={() => {
                setCurrentView('cases');
                setShowCreateCaseModal(true);
              }}
            />
          )}

          {currentView === 'cases' && (
            <Cases
              onSelectCase={setActiveCase}
              onNavigate={setCurrentView}
              showCreateModal={showCreateCaseModal}
              setShowCreateModal={setShowCreateCaseModal}
            />
          )}

          {currentView === 'case-dashboard' && (
            <CaseDashboard
              activeCase={activeCase}
              onNavigate={setCurrentView}
              onShowToast={showToast}
            />
          )}

          {currentView === 'evidence' && (
            <Evidence
              onNavigate={setCurrentView}
              onShowToast={showToast}
              activeCase={activeCase}
            />
          )}

          {(currentView === 'drive-eraser' || currentView === 'erasure-history') && (
            <DriveEraser
              onNavigate={setCurrentView}
              onShowToast={showToast}
            />
          )}

          {currentView === 'file-eraser' && (
            <FileEraser
              onShowToast={showToast}
            />
          )}

          {(currentView === 'recovery' || currentView === 'recovered-files') && (
            <Recovery
              onShowToast={showToast}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'file-carving' && (
            <FileCarving
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'evidence-hashes' && (
            <EvidenceIntegrity
              onShowToast={showToast}
            />
          )}

          {(currentView === 'audit-logs' || currentView === 'integrity-chain') && (
            <AuditLogs
              onShowToast={showToast}
            />
          )}

          {(currentView === 'reports' || currentView === 'export') && (
            <Reports
              activeCase={activeCase}
              onShowToast={showToast}
            />
          )}

          {currentView === 'analytics' && (
            <Analytics />
          )}

          {currentView === 'settings' && (
            <Settings onShowToast={showToast} />
          )}

          {currentView === 'help' && (
            <div className="forensic-card p-6 space-y-4 max-w-3xl">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                SecureForensics Demo Guide & Presentation Script
              </h2>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  Welcome to <strong>SecureForensics</strong> — an integrated desktop-grade digital forensics, data sanitization, and evidence recovery prototype.
                </p>
                <div className="bg-[#0b101c] p-4 rounded-lg border border-[#1e293b] space-y-2 font-mono">
                  <div className="text-blue-400 font-bold">Recommended Demo Workflow:</div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li><strong>Dashboard:</strong> View top 5 statistics, recent cases, and Recharts artifact distributions.</li>
                    <li><strong>Case Management:</strong> Open <span className="text-white">CASE-2026-001</span> to explore the Magnet AXIOM 3-column dashboard.</li>
                    <li><strong>Evidence Repository:</strong> Inspect <span className="text-white">USB_TEST_01.img</span>, click <em>Hash</em> and <em>Verify Integrity</em>.</li>
                    <li><strong>Recovery & File Carving:</strong> Run the signature-based carving scan, see live sectors progress, and browse 147 carved artifacts with transparent 6-factor Prototype Confidence Scores.</li>
                    <li><strong>Drive Eraser:</strong> Step through the 4-stage BitRaser sanitization wizard (Multi-Pass DoD 5220.22-M), run the safe simulation, and view the generated Certificate of Sanitization.</li>
                    <li><strong>Tamper-Evident Audit Ledger:</strong> Click <em>Verify Audit Chain</em> to prove cryptographic hash chaining, then test <em>Tamper Block</em> to demonstrate real-time breach detection!</li>
                    <li><strong>Forensic Dossiers:</strong> Review and print the official court-ready case report.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
