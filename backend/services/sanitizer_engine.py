import hashlib
import time
from datetime import datetime
from database import get_db
from services.audit_chain import append_audit_block

ERASURE_METHODS = {
    "Standard Test Erasure": {
        "passes": 1,
        "standard": "NIST SP 800-88 Clear",
        "description": "Single-pass logical overwrite with zeros, suitable for non-sensitive test storage media.",
        "pattern": "0x00"
    },
    "Multi-Pass Test Erasure": {
        "passes": 3,
        "standard": "DoD 5220.22-M (E)",
        "description": "3-pass military-grade overwrite: Pass 1 with zeros, Pass 2 with ones (0xFF), Pass 3 with pseudorandom pattern followed by verification.",
        "pattern": "0x00 -> 0xFF -> Random"
    },
    "Zero Fill Simulation": {
        "passes": 1,
        "standard": "Zero Sanitization",
        "description": "Fills all selected sectors with binary 0x00, resetting allocation pointers.",
        "pattern": "0x00"
    },
    "Random Pattern Simulation": {
        "passes": 2,
        "standard": "Cryptographic PRNG Overwrite",
        "description": "Generates cryptographically random bitstream across all blocks to prevent magnetic remnant recovery.",
        "pattern": "CSPRNG Random Bytes"
    }
}

def execute_drive_erasure(target_id: str, method: str, verification_method: str, operator: str = "Analyst-01") -> dict:
    conn = get_db()
    cursor = conn.cursor()

    # Safety Guard: Ensure target is in mock_drives and flagged as safe
    cursor.execute("SELECT * FROM mock_drives WHERE id = ? OR model = ?;", (target_id, target_id))
    drive = cursor.fetchone()

    if not drive:
        conn.close()
        raise ValueError(f"Safety Violation: Target '{target_id}' is not an authorized test drive.")

    if not drive["is_safe_target"]:
        conn.close()
        raise PermissionError("Access Denied: Attempted operation on non-test drive.")

    # Generate operation ID
    cursor.execute("SELECT COUNT(*) FROM erasure_jobs;")
    job_count = cursor.fetchone()[0] + 1
    job_id = f"ERA-2026-{job_count:05d}"

    timestamp_str = datetime.now().strftime("%d %b %Y %H:%M")
    
    # Calculate simulated verification hash (SHA-256 of empty sanitized volume)
    raw_hash_source = f"{drive['model']}-{method}-{verification_method}-{timestamp_str}"
    verification_hash = hashlib.sha256(raw_hash_source.encode("utf-8")).hexdigest()

    cursor.execute("""
        INSERT INTO erasure_jobs (id, target_name, target_type, method, verification_method, status, sectors_processed, total_sectors, verification_hash, timestamp, operator, certificate_issued)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        job_id, drive["model"], drive["type"], method, verification_method, "Completed",
        drive["total_sectors"], drive["total_sectors"], verification_hash, timestamp_str, operator, 1
    ))

    conn.commit()
    conn.close()

    # Append to Cryptographic Audit Chain
    append_audit_block(
        operation="Drive Sanitization Completed",
        details=f"Job {job_id} sanitized {drive['model']} ({drive['size']}) via {method}. Verification: {verification_method}.",
        user=operator
    )

    return {
        "job_id": job_id,
        "target_name": drive["model"],
        "target_type": drive["type"],
        "size": drive["size"],
        "total_sectors": drive["total_sectors"],
        "sectors_processed": drive["total_sectors"],
        "method": method,
        "verification_method": verification_method,
        "status": "Verification Passed",
        "verification_hash": verification_hash,
        "timestamp": timestamp_str,
        "operator": operator,
        "certificate_issued": True,
        "demo_mode": True
    }

def execute_file_erasure(file_list: list, options: list, operator: str = "Analyst-01") -> dict:
    timestamp_str = datetime.now().strftime("%d %b %Y %H:%M")
    processed_count = len(file_list)

    # Log to audit trail
    append_audit_block(
        operation="Selective File Erasure",
        details=f"Securely shredded {processed_count} test items with metadata sanitization.",
        user=operator
    )

    return {
        "timestamp": timestamp_str,
        "items_processed": processed_count,
        "items_verified": processed_count,
        "items_failed": 0,
        "status": "Completed & Verified",
        "options_applied": options,
        "files": file_list
    }
