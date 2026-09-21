const BASE_URL = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    let errorDetail = 'Network response was not ok';
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch {
      errorDetail = await res.text();
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  // Stats
  getDashboardStats: () => fetch(`${BASE_URL}/stats/dashboard`).then(handleResponse),

  // Cases
  getCases: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/cases${query ? `?${query}` : ''}`).then(handleResponse);
  },
  getCase: (id) => fetch(`${BASE_URL}/cases/${id}`).then(handleResponse),
  createCase: (data) => fetch(`${BASE_URL}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Evidence
  getEvidence: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/evidence${query ? `?${query}` : ''}`).then(handleResponse);
  },
  getEvidenceItem: (id) => fetch(`${BASE_URL}/evidence/${id}`).then(handleResponse),
  addEvidence: (data) => fetch(`${BASE_URL}/evidence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  calculateHash: (evidenceId, algorithm = 'SHA-256') => fetch(`${BASE_URL}/evidence/calculate-hash`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evidence_id: evidenceId, algorithm })
  }).then(handleResponse),
  verifyIntegrity: (evidenceId, tamperSimulation = false) => fetch(`${BASE_URL}/evidence/verify-integrity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evidence_id: evidenceId, tamper_simulation: tamperSimulation })
  }).then(handleResponse),

  // Recovery & Carving
  getRecoveredFiles: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/recovery/files${query ? `?${query}` : ''}`).then(handleResponse);
  },
  getSignatures: () => fetch(`${BASE_URL}/recovery/signatures`).then(handleResponse),
  getPipeline: () => fetch(`${BASE_URL}/recovery/pipeline`).then(handleResponse),
  startRecoveryScan: (data) => fetch(`${BASE_URL}/recovery/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  recoverSelected: (fileIds) => fetch(`${BASE_URL}/recovery/recover-selected`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fileIds)
  }).then(handleResponse),
  inspectFile: (fileId) => fetch(`${BASE_URL}/recovery/file/${fileId}`).then(handleResponse),

  // Erasure & Sanitization
  getDrives: () => fetch(`${BASE_URL}/erasure/drives`).then(handleResponse),
  getErasureMethods: () => fetch(`${BASE_URL}/erasure/methods`).then(handleResponse),
  getErasureJobs: () => fetch(`${BASE_URL}/erasure/jobs`).then(handleResponse),
  startDriveErasure: (data) => fetch(`${BASE_URL}/erasure/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  eraseFiles: (data) => fetch(`${BASE_URL}/erasure/files`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),

  // Audit
  getAuditBlocks: () => fetch(`${BASE_URL}/audit/blocks`).then(handleResponse),
  verifyAuditChain: () => fetch(`${BASE_URL}/audit/verify`, { method: 'POST' }).then(handleResponse),
  tamperAuditBlock: (blockId, operation) => fetch(`${BASE_URL}/audit/tamper`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ block_id: blockId, tampered_operation: operation })
  }).then(handleResponse),
  restoreAuditChain: () => fetch(`${BASE_URL}/audit/restore`, { method: 'POST' }).then(handleResponse),

  // Reports
  getReports: () => fetch(`${BASE_URL}/reports`).then(handleResponse),
  getReport: (id) => fetch(`${BASE_URL}/reports/${id}`).then(handleResponse),
  generateReport: (data) => fetch(`${BASE_URL}/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse)
};
