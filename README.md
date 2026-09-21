# SecureForensics

> **Secure Data Erasure • Digital Forensics • Advanced File Recovery**  
> *An integrated desktop-grade forensic platform combining safe data sanitization, signature-based file carving, evidence integrity verification, tamper-evident audit logging, and court-ready forensic reporting.*

---

## 🛡️ Safety Sandbox Notice

> [!IMPORTANT]
> **100% Non-Destructive Simulation**: SecureForensics is engineered strictly as a high-fidelity prototype and research demonstration. It operates **exclusively** on sandboxed test storage media (`WD_TEST_DRIVE`, `USB_TEST_DRIVE`, `SSD_TEST_DRIVE`, `FLASH_TEST_CARD`) and synthetic disk images (`USB_TEST_01.img`, `HDD_TEST_01.img`, `SSD_TEST_01.img`). Real host operating system drives, partitions, and user files are locked out of all execution paths.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Design References & Inspirations](#-design-references--inspirations)
3. [Core Feature Modules](#-core-feature-modules)
4. [Architecture & System Flow](#-architecture--system-flow)
5. [Tech Stack](#-tech-stack)
6. [Repository Structure](#-repository-structure)
7. [Installation & Setup](#-installation--setup)
8. [End-to-End Demo Walkthrough](#-end-to-end-demo-walkthrough)
9. [REST API Documentation](#-rest-api-documentation)
10. [Confidence Scoring & Carving Logic](#-confidence-scoring--carving-logic)
11. [Tamper-Evident Audit Ledger](#-tamper-evident-audit-ledger)
12. [License & Disclaimer](#-license--disclaimer)

---

## 🔍 Project Overview

Digital forensics examiners face two intertwined challenges:
1. **Evidence Integrity & Recovery**: Recovering deleted or hidden files from raw sector disk images while preserving the mathematical chain of custody.
2. **Defensible Sanitization**: Proving that decommissioned storage media has been irreversibly purged in compliance with national and international standards (e.g., NIST SP 800-88, DoD 5220.22-M).

**SecureForensics** bridges these disciplines in a unified desktop-style cyber suite that combines:
- **High-speed File Carving**: Sector-by-sector traversal utilizing magic byte detection (JPEG, PNG, PDF, DOCX, ZIP, MP4).
- **Transparent Confidence Scoring**: A 6-factor algorithmic score evaluating structural indicators without deceptive claims.
- **Standards-Compliant Sanitization**: Multi-pass drive wiping and file shredding simulations with bit-level verification and downloadable certificates.
- **Cryptographic Audit Ledger**: Blockchain-inspired SHA-256 chained hash logs that mathematically prove tamper-resistance.
- **Court-Ready Case Management**: Forensic case records and printable dossiers linking evidence hashes to recovery telemetry.

---

## 🎨 Design References & Inspirations

SecureForensics crafts an original, dense, dark-mode cybersecurity visual identity inspired by established forensic and data recovery tools:

| Reference Software | Architectural & Visual Inspiration |
| :--- | :--- |
| **Magnet AXIOM** | 3-column case dashboard (Case Overview & Processing Details, Evidence Overview Cards, Places to Start Categories, Artifact Tagging). |
| **BitRaser Drive Eraser** | 4-stage guided drive sanitization wizard (Target selection, standards tooltip, verification depth, two-step safety confirmation, completion certificate). |
| **Wise Data Recovery & M3** | 3-panel recovery console (Categorized directory tree, dense sector offset table, forensic hex dump inspector). |
| **Monolith Forensics** | Deep slate/charcoal cybersecurity UI, slide-over evidence metadata inspector, cryptographic hash tracking. |
| **Secure Shredder** | Selective test file drag-and-drop dropzone, slack space zeroing, metadata neutralization. |

---

## 🚀 Core Feature Modules

### 1. Dashboard & Telemetry
- **Top 5 Metric Cards**: Active Cases, Evidence Containers, Carved Files, Sanitization Jobs, and Cryptographic Integrity Verified %.
- **Recent Cases Table**: Real-time status badges (`Processing`, `Completed`, `New`).
- **Live System Activity Feed**: Event stream dynamically sourced from cryptographically chained audit blocks.
- **Recharts Data Visualizations**:
  - *Recovered File Distribution*: Breakdown across JPG, PDF, PNG, DOCX, ZIP, MP4.
  - *Sanitization Velocity Trend*: Weekly volume of sanitized gigabytes and completed jobs.

### 2. Case Management & Magnet AXIOM Dashboard
- **Case Registry**: Filter by status, search by investigator or case reference, export database to JSON.
- **Case Intake Wizard**: Create cases with assigned investigators, client organizations, and initial test evidence.
- **3-Column Case Dashboard**:
  - *Column 1*: Summary details, processing metrics (2,431 files scanned, 147 files carved).
  - *Column 2*: Evidence cards with quick **Hash**, **Analyze**, and **Inspect** actions.
  - *Column 3*: Artifact categories with count badges (Images, Documents, Archives, Web, Email, System) and triage tags.

### 3. Evidence Management & Integrity Verification
- **Monolith-Style Table**: Intake date, hardware brand, device model, capacity, and current location vault.
- **Slide-Over Inspector**: SHA-256 and MD5 hash values with 1-click clipboard copying.
- **Integrity Verification**: Compares live sector SHA-256 against baseline acquisition values.
- **Tamper Simulation Button**: Allows examiners to inject deliberate byte discrepancies to demonstrate instant `⚠ INTEGRITY MISMATCH` detection.

### 4. Advanced File Recovery & Carving
- **Configurable Scanner**: Target evidence selection, scan modes (*Signature-Based Carving*, *Quick Scan*, *Deep Scan*), and extension filters.
- **Realistic Sector Progress**: Animated sector reading (`1,870,421 / 2,145,000 sectors`) with dynamic file counters.
- **3-Panel Recovery Browser**:
  - *Category Tree*: Hierarchical breakdown of 147 recovered test files.
  - *Results Table*: Hexadecimal cluster offsets (`0x002A40`, `0x008F20`, etc.), file types, sizes, and validation status.
  - *Forensic Preview Panel*: Raw hex dump snippet and transparent 6-factor confidence score.
- **Recovery Action**: Export carved artifacts to a secure evidence folder.

### 5. File Carving Architecture Visualizer
- **Interactive 8-Stage Pipeline**:
  $$\text{Mount} \rightarrow \text{Sector Scanner} \rightarrow \text{Signature Detection} \rightarrow \text{Header Validation} \rightarrow \text{Structure Validation} \rightarrow \text{Fragment Detection} \rightarrow \text{Reconstruction} \rightarrow \text{Confidence Scoring}$$
- **Signatures Reference Table**: Magic bytes reference for JPEG (`FF D8 FF`), PNG (`89 50 4E 47`), PDF (`25 50 44 46`), ZIP/DOCX (`50 4B 03 04`), and MP4 (`ftyp`).

### 6. Secure Drive Eraser & File Shredder
- **BitRaser 4-Step Wizard**:
  - *Step 1*: Safe test drive picker (`WD_TEST_DRIVE`, `USB_TEST_DRIVE`, `SSD_TEST_DRIVE`, `FLASH_TEST_CARD`).
  - *Step 2*: Sanitization standard (Multi-Pass DoD 5220.22-M 3-pass, NIST SP 800-88 Clear, Zero Fill, CSPRNG Random).
  - *Step 3*: Verification depth (Quick 10% sample vs. Full 100% bit-level verification).
  - *Step 4*: Two-step confirmation safety dialog.
- **Live Overwrite Visualizer**: Multi-pass pattern progress, sectors processed counter (`8,210 / 10,000`), and post-erasure hash generation.
- **Official Sanitization Certificate**: Court-ready modal detailing target drive serial number, operator callsign, sanitization algorithm, and SHA-256 verification hash.
- **File & Folder Eraser**: Selective test item shredder with metadata neutralization.

### 7. Tamper-Evident Cryptographic Audit Ledger
- **Blockchain-Style Chained Hash Ledger**:
  $$\text{currentHash} = \text{SHA256}(\text{timestamp} + \text{operation} + \text{details} + \text{prevHash})$$
- Starting from genesis block `0000000000000000000000000000000000000000000000000000000000000000`.
- **Verify Audit Chain**: Traverses all blocks from block #001 to latest, recalculating each SHA-256 cryptographic link.
- **Adversary Simulation**: 1-click **Tamper Block** corrupts an entry, triggering instant `⚠ CHAIN INTEGRITY FAILED` and identifying the compromised block number.
- **Restore / Reset Chain**: Recomputes authentic cryptographic hashes.

### 8. Court-Ready Forensic Reports
- Complete dossiers for cases (e.g., `CASE-2026-001`), including evidence hashes, recovery statistics, file distribution, sanitization history, and cryptographic audit confirmation.
- **Printable Layout**: Clean print stylesheet (`window.print()`) for court presentation and PDF export.
- **JSON Export**: Raw machine-readable dossier export.

---

## 🏗️ Architecture & System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    SecureForensics Platform                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐
│     Frontend (Port 5173)      │       │     Backend (Port 8000)       │
│  React 18 + Vite + Tailwind   │ REST  │  Python FastAPI + SQLite      │
│  Lucide Icons + Recharts      │◄─────►│  Pydantic + Hash Engine       │
│  Desktop Forensic Dark Theme  │       │  Audit Chain + Mock Engine    │
└───────────────────────────────┘       └───────────────────────────────┘
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 18 (Vite 5)
- **Styling**: Tailwind CSS (Custom Dark Forensic Theme: `#0a0d14`, `#111726`, `#1e293b`)
- **Icons**: Lucide React
- **Data Visualizations**: Recharts
- **Fonts**: Inter (Sans) & JetBrains Mono (Hex/Hashes)

### Backend
- **Framework**: Python 3.14+ / FastAPI
- **Server**: Uvicorn (ASGI)
- **Database**: SQLite3 (`secureforensics.db`)
- **Data Validation**: Pydantic v2
- **Cryptographic Engine**: Python standard library `hashlib` (SHA-256 & MD5)

---

## 📁 Repository Structure

```
d:\Projects\SIH\
├── backend/
│   ├── main.py                      # FastAPI app entry point & CORS configuration
│   ├── database.py                  # SQLite schema creation & seed data initialization
│   ├── models.py                    # Pydantic request/response schemas
│   ├── requirements.txt             # Python dependencies
│   ├── secureforensics.db           # Local SQLite database
│   ├── routers/
│   │   ├── stats.py                 # Dashboard metrics & analytics feed
│   │   ├── cases.py                 # Case CRUD & processing status
│   │   ├── evidence.py              # Evidence registry, hash calculation & integrity check
│   │   ├── recovery.py              # Recovery scan simulation & 147 carved artifacts
│   │   ├── erasure.py               # Safe mock drive sanitization & certificates
│   │   ├── audit.py                 # Hash-chained audit ledger & tamper simulation
│   │   └── reports.py               # Forensic dossier compilation & exports
│   └── services/
│       ├── audit_chain.py           # Cryptographic chaining & chain validation logic
│       ├── forensics_engine.py      # Magic byte signatures & 6-factor confidence score
│       └── sanitizer_engine.py      # DoD 5220.22-M & NIST SP 800-88 erasure simulation
│
├── frontend/
│   ├── package.json                 # Node dependencies & build scripts
│   ├── vite.config.js               # Vite config with proxy to backend port 8000
│   ├── tailwind.config.js           # Custom cybersecurity color palette & tokens
│   ├── postcss.config.js            # PostCSS configuration
│   ├── index.html                   # HTML entry point with Inter & JetBrains Mono
│   └── src/
│       ├── main.jsx                 # React root mount
│       ├── App.jsx                  # Master app router, sidebar, topbar & global state
│       ├── index.css                # Base Tailwind & custom forensic table classes
│       ├── services/
│       │   └── api.js               # Centralized REST API client
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.jsx      # Navigation, active case indicator, safety badge
│       │   │   ├── TopBar.jsx       # Case selector, global search, notifications
│       │   │   └── Breadcrumbs.jsx  # Hierarchical path navigation
│       │   └── common/
│       │       ├── StatCard.jsx     # High-density metric card
│       │       ├── StatusBadge.jsx  # Context-sensitive status pills
│       │       ├── ProgressBar.jsx  # Animated progress bar
│       │       ├── Modal.jsx        # Glassmorphic modal dialog
│       │       ├── ConfirmDialog.jsx# BitRaser-inspired safety confirmation
│       │       ├── ConfidenceMeter.jsx # 6-factor confidence breakdown
│       │       └── Toast.jsx        # Transient feedback notifications
│       └── pages/
│           ├── Login.jsx            # Sleek sign-in screen with 1-click demo autofill
│           ├── Dashboard.jsx        # Command center with stats, activity & Recharts
│           ├── Cases.jsx            # Case management table & creation wizard
│           ├── CaseDashboard.jsx    # Magnet AXIOM-inspired 3-column case overview
│           ├── Evidence.jsx         # Monolith Forensics-inspired evidence inspector
│           ├── DriveEraser.jsx      # BitRaser 4-step drive sanitization wizard
│           ├── FileEraser.jsx       # Selective file & folder shredding dropzone
│           ├── Recovery.jsx         # Wise/M3-inspired 3-panel carving console
│           ├── FileCarving.jsx      # 8-step carving visualizer & magic bytes reference
│           ├── EvidenceIntegrity.jsx# SHA-256 baseline comparison & tamper simulator
│           ├── AuditLogs.jsx        # Tamper-evident chained hash ledger & verification
│           ├── Reports.jsx          # Official court-ready case report & print view
│           ├── Analytics.jsx        # Interactive telemetry and forensic charts
│           └── Settings.jsx         # System policies & security settings
│
└── README.md                        # Complete project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Python**: Version 3.10+ (Tested on Python 3.14)
- **Node.js**: Version 18+ (Tested on Node.js v24)
- **npm**: Version 9+

---

### Step 1: Start Backend (FastAPI + SQLite)

Open a terminal in `backend/`:

```powershell
cd d:\Projects\SIH\backend

# Install Python dependencies
py -m pip install -r requirements.txt

# Start the FastAPI server (starts on http://127.0.0.1:8000)
py -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The database (`secureforensics.db`) initializes and seeds automatically on startup.

---

### Step 2: Start Frontend (React + Vite)

Open a second terminal in `frontend/`:

```powershell
cd d:\Projects\SIH\frontend

# Install dependencies
npm install

# Start the Vite development server (starts on http://127.0.0.1:5173)
npm run dev -- --host 127.0.0.1 --port 5173
```

---

### Step 3: Open in Browser

Navigate to:
👉 **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)**

---

## 🌐 Deploying to Render (Free Cloud Hosting)

SecureForensics includes full out-of-the-box support for hosting on [Render](https://render.com) using the included `render.yaml` Blueprint.

### 1-Click Blueprint Deploy
1. Go to your [Render Dashboard](https://dashboard.render.com/) &rarr; Click **New +** &rarr; **Blueprint**.
2. Connect your GitHub repository: **`SAYALI8106/SIH_2026`**.
3. Render automatically configures both services:
   - **`secureforensics-backend`**: FastAPI Python Web Service (`backend/`)
   - **`secureforensics-frontend`**: React + Vite Static Site (`frontend/`)
4. Click **Apply** to deploy both services live on the web!

For manual step-by-step instructions and environment variable settings, refer to the [DEPLOY_RENDER.md](DEPLOY_RENDER.md) guide.

---

## 🎬 End-to-End Demo Walkthrough

Follow this scripted flow for presentations or hackathon evaluations:

| Stage | Action | Expected Result |
| :--- | :--- | :--- |
| **1. Authentication** | Open `http://127.0.0.1:5173/` &rarr; Click **Auto Fill** &rarr; **Sign In**. | Enters the secure dashboard with session active as `Analyst-01`. |
| **2. Command Center** | Review the **Dashboard**. | Top 5 stats displayed; live activity feed loaded from audit chain; Recharts display file type distribution (JPG, PDF, PNG, DOCX, ZIP, MP4). |
| **3. AXIOM Case View** | Click **Cases** in the sidebar &rarr; Select `CASE-2026-001` (USB Investigation). | Loads Magnet AXIOM 3-column layout: Overview & processing metrics on left, evidence cards in center, artifact categories & tags on right. |
| **4. Integrity Verification** | Click **Evidence** &rarr; Select `USB_TEST_01.img` &rarr; Click **Verify Integrity**. | Shows green `✓ INTEGRITY VERIFIED`. Then click **Test Tamper Detection** to show instant `⚠ INTEGRITY MISMATCH`. |
| **5. File Carving** | Navigate to **Recovery** &rarr; Click **START SCAN**. | Animated sector scanner advances (`1,870,421 / 2,145,000 sectors`), populating 147 carved artifacts. Browse the 3-panel view and inspect the 6-factor Prototype Confidence Score. Click **Recover Selected**. |
| **6. Carving Visualizer** | Click **File Carving** in the sidebar. | Explores the 8-stage visual pipeline and inspects the magic byte signature table (`FF D8 FF`, `89 50 4E 47`, etc.). |
| **7. Drive Sanitization** | Navigate to **Drive Eraser** &rarr; Target: `USB_TEST_DRIVE` &rarr; Method: *Multi-Pass Test Erasure (DoD 3-Pass)* &rarr; Click **EXECUTE SECURE ERASURE** &rarr; Confirm. | Live sector progress bar (`8,210 / 10,000`), pattern write simulation, followed by completion screen. Click **View Certificate of Sanitization**. |
| **8. Audit Ledger** | Navigate to **Audit Logs** &rarr; Click **Verify Audit Chain**. | Recomputes all SHA-256 blocks from genesis, displaying `✓ Audit Chain Verified`. Click **Tamper Block** to demonstrate `⚠ CHAIN INTEGRITY FAILED`. Click **Reset / Restore Chain** to return to green. |
| **9. Forensic Dossier** | Navigate to **Reports** &rarr; Inspect `REP-2026-001`. | View official court dossier with evidence baseline hash, recovery distribution, sanitization count, and print-ready format. |

---

## 🔌 REST API Documentation

FastAPI provides an interactive OpenAPI / Swagger UI at **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**.

### Key Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & sandbox mode confirmation |
| `GET` | `/api/stats/dashboard` | Top metric counters, recent cases, Recharts datasets |
| `GET` | `/api/cases` | List cases with optional status and text search query |
| `GET` | `/api/cases/{id}` | Retrieve case details, processing metrics, and evidence list |
| `POST`| `/api/cases` | Create new forensic case |
| `GET` | `/api/evidence` | List all evidence containers |
| `POST`| `/api/evidence/calculate-hash` | Recompute SHA-256 / MD5 checksum |
| `POST`| `/api/evidence/verify-integrity` | Compare current hash to intake baseline (supports tamper simulation) |
| `GET` | `/api/recovery/files` | Retrieve carved files with category and type filtering |
| `POST`| `/api/recovery/scan` | Execute simulated recovery scan across sectors |
| `POST`| `/api/recovery/recover-selected` | Export selected carved file IDs to evidence vault |
| `GET` | `/api/erasure/drives` | List safe authorized test drives |
| `GET` | `/api/erasure/methods` | List supported erasure standards and pass counts |
| `POST`| `/api/erasure/start` | Run safe simulated drive sanitization & log audit block |
| `POST`| `/api/erasure/files` | Selective file shredding simulation |
| `GET` | `/api/audit/blocks` | List sequential blocks in the audit ledger |
| `POST`| `/api/audit/verify` | Verify entire cryptographic chain from genesis |
| `POST`| `/api/audit/tamper` | Simulate adversary tampering on a specific block |
| `POST`| `/api/audit/restore` | Recalculate and restore authentic hash chain |
| `GET` | `/api/reports` | List forensic reports |
| `POST`| `/api/reports/generate` | Compile official forensic dossier for a case |

---

## 🔬 Confidence Scoring & Carving Logic

Each carved file is evaluated using a transparent 6-factor algorithmic score (maximum 100%):

$$\text{Confidence Score} = S_{\text{sig}} (25\%) + H_{\text{val}} (20\%) + F_{\text{val}} (15\%) + T_{\text{struct}} (15\%) + C_{\text{size}} (15\%) + K_{\text{frag}} (10\%)$$

```
┌────────────────────────┬─────────┬────────────────────────────────────────────────────────┐
│ Factor                 │ Weight  │ Verification Condition                                 │
├────────────────────────┼─────────┼────────────────────────────────────────────────────────┤
│ Signature Match        │ 25%     │ Magic byte sequence detected at cluster boundary       │
│ Header Validation      │ 20%     │ Internal dimensions, markers & chunk descriptors valid │
│ Footer Validation      │ 15%     │ End-of-file terminator sequence located (e.g., FF D9)  │
│ Structure Validation   │ 15%     │ Internal tables, stream syntax & metadata intact       │
│ Size Consistency       │ 15%     │ Reported container length aligns with carved byte size │
│ Fragment Continuity    │ 10%     │ Zero discontinuous cluster gaps in allocated sequence  │
└────────────────────────┴─────────┴────────────────────────────────────────────────────────┘
```

- **High Confidence**: $\ge 90\%$ (Green)
- **Medium Confidence**: $70\% - 89\%$ (Amber)
- **Low Confidence**: $< 70\%$ (Rose)

*Labeled explicitly as **Prototype Confidence Score** for demonstration and triage purposes.*

---

## ⛓️ Tamper-Evident Audit Ledger

The audit ledger implements cryptographic hash-chaining to ensure accountability for every forensic action:

$$\text{Block Hash}_i = \text{SHA-256}\Big(\text{Timestamp}_i \mathbin{\Vert} \text{Operation}_i \mathbin{\Vert} \text{Details}_i \mathbin{\Vert} \text{BlockHash}_{i-1}\Big)$$

- **Genesis Block ($i = 0$)**:
  $$\text{BlockHash}_0 = \text{0000000000000000000000000000000000000000000000000000000000000000}$$
- **Verification Routine**:
  When **Verify Audit Chain** is clicked, the system iteratively recomputes the expected hash for every block from genesis. If any payload or previous hash pointer has been modified by an adversary, the chain breaks immediately, notifying the examiner with `⚠ CHAIN INTEGRITY FAILED` and highlighting the tampered block.

---

## 📄 License & Disclaimer

- **Prototype Disclaimer**: SecureForensics is developed as an educational prototype and technology demonstrator for digital forensics and cyber defense hackathons. It does not replace certified, court-licensed hardware write-blockers or commercial forensic software suites.
- **Data Protection**: All mock media and simulated evidence artifacts contained within this repository are synthetic and contain no real personal, commercial, or confidential data.
- **License**: MIT License. See [LICENSE](LICENSE) for details.
