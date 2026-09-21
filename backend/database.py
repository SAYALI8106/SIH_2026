import sqlite3
import os
import hashlib
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "secureforensics.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Cases Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        investigator TEXT NOT NULL,
        created_date TEXT NOT NULL,
        evidence_count INTEGER DEFAULT 0,
        status TEXT NOT NULL,
        description TEXT,
        organization TEXT,
        reference_number TEXT,
        scan_status TEXT DEFAULT 'Ready',
        last_scan TEXT,
        files_discovered INTEGER DEFAULT 0,
        files_recovered INTEGER DEFAULT 0
    );
    """)

    # Evidence Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evidence (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        case_name TEXT NOT NULL,
        intake_date TEXT NOT NULL,
        type TEXT NOT NULL,
        brand TEXT,
        model TEXT,
        item_name TEXT NOT NULL,
        status TEXT NOT NULL,
        current_location TEXT NOT NULL,
        size TEXT NOT NULL,
        size_bytes INTEGER DEFAULT 0,
        sha256 TEXT NOT NULL,
        md5 TEXT NOT NULL,
        integrity_status TEXT DEFAULT 'Verified',
        description TEXT,
        FOREIGN KEY (case_id) REFERENCES cases(id)
    );
    """)

    # Simulated Drives for Eraser
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS mock_drives (
        id TEXT PRIMARY KEY,
        model TEXT NOT NULL,
        serial_number TEXT NOT NULL,
        size TEXT NOT NULL,
        total_sectors INTEGER NOT NULL,
        type TEXT NOT NULL,
        file_system TEXT NOT NULL,
        status TEXT NOT NULL,
        is_safe_target BOOLEAN DEFAULT 1
    );
    """)

    # Erasure Jobs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS erasure_jobs (
        id TEXT PRIMARY KEY,
        target_name TEXT NOT NULL,
        target_type TEXT NOT NULL,
        method TEXT NOT NULL,
        verification_method TEXT NOT NULL,
        status TEXT NOT NULL,
        sectors_processed INTEGER NOT NULL,
        total_sectors INTEGER NOT NULL,
        verification_hash TEXT,
        timestamp TEXT NOT NULL,
        operator TEXT NOT NULL,
        certificate_issued BOOLEAN DEFAULT 1
    );
    """)

    # Recovered Files Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recovered_files (
        id TEXT PRIMARY KEY,
        evidence_id TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        category TEXT NOT NULL,
        size_str TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        offset_hex TEXT NOT NULL,
        status TEXT NOT NULL,
        confidence INTEGER NOT NULL,
        header_hex TEXT,
        footer_hex TEXT,
        sig_match BOOLEAN DEFAULT 1,
        header_val BOOLEAN DEFAULT 1,
        footer_val BOOLEAN DEFAULT 1,
        struct_val BOOLEAN DEFAULT 1,
        size_consist BOOLEAN DEFAULT 1,
        frag_cont BOOLEAN DEFAULT 1,
        recovered_state BOOLEAN DEFAULT 0,
        FOREIGN KEY (evidence_id) REFERENCES evidence(id)
    );
    """)

    # Tamper-Evident Audit Blocks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_blocks (
        block_id INTEGER PRIMARY KEY AUTOINCREMENT,
        block_code TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        user TEXT NOT NULL,
        operation TEXT NOT NULL,
        details TEXT NOT NULL,
        prev_hash TEXT NOT NULL,
        current_hash TEXT NOT NULL,
        status TEXT NOT NULL
    );
    """)

    # Forensic Reports Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        case_name TEXT NOT NULL,
        report_type TEXT NOT NULL,
        created_date TEXT NOT NULL,
        investigator TEXT NOT NULL,
        status TEXT NOT NULL,
        evidence_item TEXT NOT NULL,
        evidence_hash TEXT NOT NULL,
        integrity_status TEXT NOT NULL,
        files_scanned INTEGER NOT NULL,
        files_found INTEGER NOT NULL,
        valid_files INTEGER NOT NULL,
        high_confidence INTEGER NOT NULL,
        jpg_count INTEGER NOT NULL,
        pdf_count INTEGER NOT NULL,
        png_count INTEGER NOT NULL,
        docx_count INTEGER NOT NULL,
        zip_count INTEGER NOT NULL,
        mp4_count INTEGER NOT NULL,
        sanitization_ops INTEGER NOT NULL,
        audit_blocks_count INTEGER NOT NULL
    );
    """)

    conn.commit()
    seed_initial_data(conn)
    conn.close()

def seed_initial_data(conn):
    cursor = conn.cursor()
    
    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM cases;")
    if cursor.fetchone()[0] > 0:
        return

    # 1. Seed Cases
    cases = [
        ("CASE-2026-001", "USB Investigation", "Analyst-01", "21 Sep 2026", 3, "Processing",
         "Unauthorized data exfiltration investigation involving encrypted and formatted flash drive.",
         "Federal Cyber Bureau", "REF-8849-USB", "Processing", "Today 16:17", 2431, 147),
        ("CASE-2026-002", "Laptop Analysis", "Analyst-02", "20 Sep 2026", 5, "Completed",
         "Enterprise insider threat forensics examining suspect workstation NVMe image.",
         "OmniCorp InfoSec", "REF-8820-LAP", "Completed", "Yesterday 11:30", 5420, 312),
        ("CASE-2026-003", "External Drive Recovery", "Analyst-01", "18 Sep 2026", 2, "New",
         "Critical file restoration and chain of custody preservation from damaged Western Digital HDD.",
         "State Police Cyber Unit", "REF-8791-HDD", "Ready", "None", 0, 0),
        ("CASE-2026-004", "Ransomware Incident", "Analyst-03", "15 Sep 2026", 4, "Processing",
         "Post-incident carving of shadowed volume artifacts and wiped user directories.",
         "National Cyber Response", "REF-8750-RAN", "Scanning", "Today 14:00", 18200, 489)
    ]
    cursor.executemany("""
        INSERT INTO cases (id, name, investigator, created_date, evidence_count, status, description, organization, reference_number, scan_status, last_scan, files_discovered, files_recovered)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, cases)

    # 2. Seed Evidence
    evidence_items = [
        ("EVI-00001", "CASE-2026-001", "USB Investigation", "21 Sep 2026", "USB", "SanDisk", "Ultra Flair 3.0",
         "USB_TEST_01.img", "Processing", "Forensic Lab Vault 1", "2.4 GB", 2576980377,
         "8f4c12d7b539c80a2b7145e9fa01f5c6b2931a72d41b00e843615e4789dca92e",
         "4c2b9f33a1e27608b0f89d1235abc74e", "Verified",
         "Raw DD disk image acquired with hardware write-blocker from suspect USB flash drive."),
        ("EVI-00002", "CASE-2026-001", "USB Investigation", "21 Sep 2026", "HDD", "Western Digital", "WD Blue 500G",
         "HDD_TEST_01.img", "Ready", "Forensic Lab Vault 1", "500 GB", 500107862016,
         "a3b190f892c478a87b1c3e5d8e7f12a34b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
         "9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b", "Verified",
         "Bit-stream physical backup of secondary storage volume."),
        ("EVI-00003", "CASE-2026-002", "Laptop Analysis", "20 Sep 2026", "SSD", "Samsung", "980 Pro NVMe",
         "SSD_TEST_01.img", "Completed", "Secure Evidence Locker A", "256 GB", 256060514304,
         "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
         "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d", "Verified",
         "Forensic image acquired from CEO laptop following compromised administrative alert."),
        ("EVI-00004", "CASE-2026-003", "External Drive Recovery", "18 Sep 2026", "Flash", "Kingston", "Canvas Select",
         "MEMORY_CARD_TEST.img", "Ready", "Evidence Locker 2", "64 GB", 64023740416,
         "7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e",
         "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e", "Verified",
         "MicroSD recovered from dashcam unit during perimeter incident inspection.")
    ]
    cursor.executemany("""
        INSERT INTO evidence (id, case_id, case_name, intake_date, type, brand, model, item_name, status, current_location, size, size_bytes, sha256, md5, integrity_status, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, evidence_items)

    # 3. Seed Mock Drives for Drive Eraser (100% Safe Test Drives)
    mock_drives = [
        ("DRV-001", "WD_TEST_DRIVE", "TEST-SN-001", "500 GB", 976773168, "HDD", "NTFS", "Ready", 1),
        ("DRV-002", "USB_TEST_DRIVE", "TEST-SN-002", "32 GB", 62500000, "USB", "exFAT", "Ready", 1),
        ("DRV-003", "SSD_TEST_DRIVE", "TEST-SN-003", "128 GB", 250069680, "SSD", "APFS/EXT4", "Ready", 1),
        ("DRV-004", "FLASH_TEST_CARD", "TEST-SN-004", "16 GB", 31250000, "Flash", "FAT32", "Ready", 1)
    ]
    cursor.executemany("""
        INSERT INTO mock_drives (id, model, serial_number, size, total_sectors, type, file_system, status, is_safe_target)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, mock_drives)

    # 4. Seed Erasure Jobs
    erasure_jobs = [
        ("ERA-2026-00021", "FLASH_TEST_CARD", "Flash", "Zero Fill Simulation", "Quick Verification", "Completed",
         31250000, 31250000, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "19 Sep 2026 14:10", "Analyst-01", 1),
        ("ERA-2026-00022", "SSD_TEST_DRIVE", "SSD", "Random Pattern Simulation", "Full Verification", "Completed",
         250069680, 250069680, "72c9bc4389e1a8b79d84f04c609825b41fa6e289f3bb3298a09a5b78d2b7e193", "20 Sep 2026 09:30", "Analyst-02", 1),
        ("ERA-2026-00023", "USB_TEST_DRIVE", "USB", "Multi-Pass Test Erasure", "Full Verification", "Completed",
         62500000, 62500000, "8f4c12d7b539c80a2b7145e9fa01f5c6b2931a72d41b00e843615e4789dca92e", "21 Sep 2026 15:45", "Analyst-01", 1)
    ]
    cursor.executemany("""
        INSERT INTO erasure_jobs (id, target_name, target_type, method, verification_method, status, sectors_processed, total_sectors, verification_hash, timestamp, operator, certificate_issued)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, erasure_jobs)

    # 5. Seed 147 Recovered Files for EVI-00001 (USB_TEST_01.img)
    # Distribution: JPG: 82, PDF: 24, PNG: 18, DOCX: 15, ZIP: 8 -> Total: 147
    recovered_files = []
    file_idx = 1

    # Realistic JPEG entries (82)
    jpeg_names = [
        "IMG_001.jpg", "IMG_002.jpg", "evidence_photo_01.jpg", "id_card_front.jpg", "id_card_back.jpg",
        "surveillance_frame_04.jpg", "car_plate_snapshot.jpg", "passport_scan.jpg", "meeting_photo.jpg",
        "desktop_screenshot.jpg", "whatsapp_img_01.jpg", "whatsapp_img_02.jpg", "receipt_01.jpg", "receipt_02.jpg",
        "contract_photo.jpg", "device_sn.jpg", "warehouse_cctv_01.jpg", "warehouse_cctv_02.jpg", "office_door.jpg",
        "vehicle_vin.jpg"
    ]
    for i in range(82):
        name = jpeg_names[i] if i < len(jpeg_names) else f"recovered_img_{i+1:03d}.jpg"
        size_kb = 850 + (i * 37 % 2400)
        size_bytes = size_kb * 1024
        size_str = f"{size_kb / 1024:.1f} MB" if size_kb > 1000 else f"{size_kb} KB"
        offset = f"0x{0x002A40 + (i * 0x14F0):06X}"
        conf = 98 if i % 7 != 0 else (92 if i % 3 != 0 else 88)
        status = "Valid" if conf >= 90 else "Partial"
        recovered_files.append((
            f"REC-{file_idx:05d}", "EVI-00001", name, "JPG", "Images", size_str, size_bytes, offset, status, conf,
            "FF D8 FF E0 00 10 4A 46 49 46 00 01", "FF D9",
            1, 1, 1 if conf >= 90 else 0, 1, 1, 1 if conf >= 90 else 0, 1 if i < 5 else 0
        ))
        file_idx += 1

    # Realistic PDF entries (24)
    pdf_names = [
        "financial_report.pdf", "case_notes.pdf", "audit_log_2026.pdf", "bank_statement_q2.pdf",
        "confidential_nda.pdf", "invoice_9921.pdf", "board_minutes.pdf", "flight_itinerary.pdf",
        "payroll_summary.pdf", "tax_filing_2025.pdf", "wire_transfer_receipt.pdf", "export_license.pdf"
    ]
    for i in range(24):
        name = pdf_names[i] if i < len(pdf_names) else f"recovered_document_{i+1:02d}.pdf"
        size_kb = 340 + (i * 85 % 1800)
        size_bytes = size_kb * 1024
        size_str = f"{size_kb / 1024:.1f} MB" if size_kb > 1000 else f"{size_kb} KB"
        offset = f"0x{0x008F20 + (i * 0x2210):06X}"
        conf = 96 if i % 5 != 0 else 89
        status = "Valid" if conf >= 90 else "Partial"
        recovered_files.append((
            f"REC-{file_idx:05d}", "EVI-00001", name, "PDF", "Documents", size_str, size_bytes, offset, status, conf,
            "25 50 44 46 2D 31 2E 37 0A 25 E2 E3", "25 25 45 4F 46",
            1, 1, 1 if conf >= 90 else 0, 1, 1, 1, 0
        ))
        file_idx += 1

    # Realistic PNG entries (18)
    png_names = [
        "evidence_photo.png", "screen_capture_01.png", "browser_auth_token.png", "chat_snippet.png",
        "qr_code_key.png", "signature_specimen.png", "network_topology.png", "map_coordinates.png"
    ]
    for i in range(18):
        name = png_names[i] if i < len(png_names) else f"recovered_graphic_{i+1:02d}.png"
        size_kb = 420 + (i * 65 % 1400)
        size_bytes = size_kb * 1024
        size_str = f"{size_kb / 1024:.1f} MB" if size_kb > 1000 else f"{size_kb} KB"
        offset = f"0x{0x00E2B0 + (i * 0x1A40):06X}"
        conf = 95 if i % 4 != 0 else 86
        status = "Valid" if conf >= 90 else "Partial"
        recovered_files.append((
            f"REC-{file_idx:05d}", "EVI-00001", name, "PNG", "Images", size_str, size_bytes, offset, status, conf,
            "89 50 4E 47 0D 0A 1A 0A 00 00 00 0D", "49 45 4E 44 AE 42 60 82",
            1, 1, 1, 1, 1, 1 if conf >= 90 else 0, 0
        ))
        file_idx += 1

    # Realistic DOCX entries (15)
    docx_names = [
        "case_notes.docx", "witness_interview.docx", "threat_assessment.docx", "incident_summary.docx",
        "employee_roster.docx", "system_credentials.docx", "project_plan_v3.docx"
    ]
    for i in range(15):
        name = docx_names[i] if i < len(docx_names) else f"document_{i+1:02d}.docx"
        size_kb = 120 + (i * 45 % 800)
        size_bytes = size_kb * 1024
        size_str = f"{size_kb} KB"
        offset = f"0x{0x014C90 + (i * 0x1830):06X}"
        conf = 94 if i % 3 != 0 else 84
        status = "Valid" if conf >= 90 else "Partial"
        recovered_files.append((
            f"REC-{file_idx:05d}", "EVI-00001", name, "DOCX", "Documents", size_str, size_bytes, offset, status, conf,
            "50 4B 03 04 14 00 06 00 08 00 00 00", "50 4B 05 06",
            1, 1, 1 if conf >= 90 else 0, 1 if conf >= 90 else 0, 1, 1, 0
        ))
        file_idx += 1

    # Realistic ZIP entries (8)
    zip_names = [
        "backup.zip", "extracted_logs.zip", "source_archive.zip", "keys_backup.zip",
        "firmware_dump.zip", "sqlite_dumps.zip", "encrypted_vault.zip", "archive_misc.zip"
    ]
    for i in range(8):
        name = zip_names[i]
        size_kb = 1500 + (i * 420 % 6000)
        size_bytes = size_kb * 1024
        size_str = f"{size_kb / 1024:.1f} MB"
        offset = f"0x{0x01B8D0 + (i * 0x3100):06X}"
        conf = 92 if i % 2 == 0 else 85
        status = "Valid" if conf >= 90 else "Partial"
        recovered_files.append((
            f"REC-{file_idx:05d}", "EVI-00001", name, "ZIP", "Archives", size_str, size_bytes, offset, status, conf,
            "50 4B 03 04 0A 00 00 00 00 00 82 73", "50 4B 05 06",
            1, 1, 1, 1, 1, 1, 0
        ))
        file_idx += 1

    cursor.executemany("""
        INSERT INTO recovered_files (id, evidence_id, file_name, file_type, category, size_str, size_bytes, offset_hex, status, confidence, header_hex, footer_hex, sig_match, header_val, footer_val, struct_val, size_consist, frag_cont, recovered_state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, recovered_files)

    # 6. Seed Hash-Chained Audit Ledger
    # Formula: currentHash = SHA256(timestamp + operation + details + prevHash)
    initial_actions = [
        ("16:01", "Analyst-01", "Evidence Intake", "USB_TEST_01.img registered into case CASE-2026-001"),
        ("16:05", "Analyst-01", "Hash Generated", "SHA-256 computed: 8f4c12d7b539c80a2b7145e9fa01f5c6b2931a72d41b00e843615e4789dca92e"),
        ("16:10", "Analyst-01", "Integrity Check", "Evidence integrity verified matching baseline acquisition hash"),
        ("16:15", "Analyst-01", "Recovery Scan Started", "Signature-based carving initiated across 2,145,000 sectors"),
        ("16:17", "Analyst-01", "Recovery Completed", "147 valid and partial files carved from USB_TEST_01.img"),
        ("16:20", "Analyst-01", "Evidence Added", "HDD_TEST_01.img associated with case CASE-2026-001"),
        ("16:25", "Analyst-01", "Test Erasure Executed", "Sanitization simulated for USB_TEST_DRIVE (ERA-2026-00023)"),
        ("16:30", "Analyst-01", "Report Generated", "Official forensic summary compiled for CASE-2026-001")
    ]

    prev_hash = "0000000000000000000000000000000000000000000000000000000000000000"
    audit_rows = []
    for idx, (ts, user, op, det) in enumerate(initial_actions, 1):
        raw_str = f"{ts}{op}{det}{prev_hash}"
        curr_hash = hashlib.sha256(raw_str.encode("utf-8")).hexdigest()
        audit_rows.append((f"{idx:03d}", ts, user, op, det, prev_hash, curr_hash, "Verified"))
        prev_hash = curr_hash

    cursor.executemany("""
        INSERT INTO audit_blocks (block_code, timestamp, user, operation, details, prev_hash, current_hash, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, audit_rows)

    # 7. Seed Initial Forensic Report
    report = (
        "REP-2026-001", "CASE-2026-001", "USB Investigation", "Comprehensive Forensic Analysis",
        "21 Sep 2026 16:30", "Analyst-01", "Verified", "USB_TEST_01.img",
        "8f4c12d7b539c80a2b7145e9fa01f5c6b2931a72d41b00e843615e4789dca92e",
        "VERIFIED", 2431, 147, 132, 96,
        82, 24, 18, 15, 8, 0,
        4, len(initial_actions)
    )
    cursor.execute("""
        INSERT INTO reports (id, case_id, case_name, report_type, created_date, investigator, status, evidence_item, evidence_hash, integrity_status, files_scanned, files_found, valid_files, high_confidence, jpg_count, pdf_count, png_count, docx_count, zip_count, mp4_count, sanitization_ops, audit_blocks_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, report)

    conn.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
