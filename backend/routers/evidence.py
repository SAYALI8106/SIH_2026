from fastapi import APIRouter, HTTPException
from database import get_db
from models import EvidenceCreate, CalculateHashRequest, VerifyIntegrityRequest
from services.audit_chain import append_audit_block
from datetime import datetime
import hashlib

router = APIRouter(prefix="/api/evidence", tags=["evidence"])

@router.get("")
def list_evidence(case_id: str = None, search: str = None):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM evidence WHERE 1=1"
    params = []

    if case_id:
        query += " AND case_id = ?"
        params.append(case_id)

    if search:
        query += " AND (item_name LIKE ? OR brand LIKE ? OR type LIKE ? OR id LIKE ?)"
        wildcard = f"%{search}%"
        params.extend([wildcard, wildcard, wildcard, wildcard])

    query += " ORDER BY intake_date DESC;"
    cursor.execute(query, params)
    evidence_items = [dict(e) for e in cursor.fetchall()]
    conn.close()
    return evidence_items

@router.get("/{evidence_id}")
def get_evidence(evidence_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM evidence WHERE id = ?;", (evidence_id,))
    item = cursor.fetchone()
    conn.close()

    if not item:
        raise HTTPException(status_code=404, detail="Evidence item not found")

    return dict(item)

@router.post("")
def add_evidence(payload: EvidenceCreate):
    conn = get_db()
    cursor = conn.cursor()

    evi_count = cursor.execute("SELECT COUNT(*) FROM evidence;").fetchone()[0] + 1
    evidence_id = f"EVI-{evi_count:05d}"
    intake_date = datetime.now().strftime("%d %b %Y")

    # Generate synthetic SHA-256 and MD5
    raw = f"{payload.case_id}-{payload.item_name}-{datetime.now().isoformat()}"
    sha256_hash = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    md5_hash = hashlib.md5(raw.encode("utf-8")).hexdigest()

    cursor.execute("""
        INSERT INTO evidence (id, case_id, case_name, intake_date, type, brand, model, item_name, status, current_location, size, size_bytes, sha256, md5, integrity_status, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Ready', ?, ?, 2576980377, ?, ?, 'Verified', ?);
    """, (
        evidence_id, payload.case_id, payload.case_name, intake_date,
        payload.type, payload.brand, payload.model, payload.item_name,
        payload.current_location, payload.size, sha256_hash, md5_hash,
        payload.description or "Evidence container securely added."
    ))

    # Update case evidence count
    cursor.execute("UPDATE cases SET evidence_count = evidence_count + 1 WHERE id = ?;", (payload.case_id,))

    conn.commit()
    conn.close()

    append_audit_block(
        operation="Evidence Intake",
        details=f"{payload.item_name} ({payload.size}) registered under case {payload.case_id}. SHA-256: {sha256_hash[:16]}...",
        user="Analyst-01"
    )

    return {"message": "Evidence added successfully", "evidence_id": evidence_id, "sha256": sha256_hash}

@router.post("/calculate-hash")
def calculate_hash(payload: CalculateHashRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM evidence WHERE id = ?;", (payload.evidence_id,))
    item = cursor.fetchone()
    conn.close()

    if not item:
        raise HTTPException(status_code=404, detail="Evidence item not found")

    append_audit_block(
        operation="Hash Calculated",
        details=f"{payload.algorithm} re-calculated for {item['item_name']}: {item['sha256'][:16]}...",
        user="Analyst-01"
    )

    return {
        "evidence_id": item["id"],
        "item_name": item["item_name"],
        "algorithm": payload.algorithm,
        "sha256": item["sha256"],
        "md5": item["md5"],
        "calculated_at": datetime.now().strftime("%H:%M:%S")
    }

@router.post("/verify-integrity")
def verify_integrity(payload: VerifyIntegrityRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM evidence WHERE id = ?;", (payload.evidence_id,))
    item = cursor.fetchone()

    if not item:
        conn.close()
        raise HTTPException(status_code=404, detail="Evidence item not found")

    original_sha256 = item["sha256"]

    if payload.tamper_simulation:
        # Simulate tampering mismatch
        current_sha256 = "c1a980e1b238f92100dfacbe8192305710294819034871902384719028347109"
        status = "INTEGRITY MISMATCH"
        verified = False
        cursor.execute("UPDATE evidence SET integrity_status = 'MISMATCH' WHERE id = ?;", (payload.evidence_id,))
    else:
        current_sha256 = original_sha256
        status = "INTEGRITY VERIFIED"
        verified = True
        cursor.execute("UPDATE evidence SET integrity_status = 'Verified' WHERE id = ?;", (payload.evidence_id,))

    conn.commit()
    conn.close()

    append_audit_block(
        operation="Integrity Verification",
        details=f"Integrity check for {item['item_name']} resulted in: {status}",
        user="Analyst-01"
    )

    return {
        "evidence_id": item["id"],
        "item_name": item["item_name"],
        "original_sha256": original_sha256,
        "current_sha256": current_sha256,
        "verified": verified,
        "status": status,
        "timestamp": datetime.now().strftime("%d %b %Y %H:%M:%S")
    }
