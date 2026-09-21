from fastapi import APIRouter, HTTPException
from database import get_db
from models import CaseCreate
from services.audit_chain import append_audit_block
from datetime import datetime

router = APIRouter(prefix="/api/cases", tags=["cases"])

@router.get("")
def list_cases(status: str = None, search: str = None):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM cases WHERE 1=1"
    params = []

    if status and status != "ALL":
        query += " AND status = ?"
        params.append(status)

    if search:
        query += " AND (name LIKE ? OR id LIKE ? OR investigator LIKE ?)"
        wildcard = f"%{search}%"
        params.extend([wildcard, wildcard, wildcard])

    query += " ORDER BY created_date DESC;"
    cursor.execute(query, params)
    cases = [dict(c) for c in cursor.fetchall()]
    conn.close()
    return cases

@router.get("/{case_id}")
def get_case(case_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cases WHERE id = ?;", (case_id,))
    case = cursor.fetchone()

    if not case:
        conn.close()
        raise HTTPException(status_code=404, detail="Case not found")

    case_dict = dict(case)

    # Fetch associated evidence
    cursor.execute("SELECT * FROM evidence WHERE case_id = ?;", (case_id,))
    evidence_list = [dict(e) for e in cursor.fetchall()]
    case_dict["evidence"] = evidence_list

    conn.close()
    return case_dict

@router.post("")
def create_case(payload: CaseCreate):
    conn = get_db()
    cursor = conn.cursor()

    # Determine ID
    case_id = payload.case_number if payload.case_number.startswith("CASE-") else f"CASE-2026-{payload.case_number}"
    
    # Check duplicate
    cursor.execute("SELECT id FROM cases WHERE id = ?;", (case_id,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail=f"Case with ID {case_id} already exists.")

    created_date = datetime.now().strftime("%d %b %Y")

    cursor.execute("""
        INSERT INTO cases (id, name, investigator, created_date, evidence_count, status, description, organization, reference_number, scan_status, last_scan, files_discovered, files_recovered)
        VALUES (?, ?, ?, ?, 1, 'Processing', ?, ?, ?, 'Ready', 'None', 0, 0);
    """, (
        case_id, payload.name, payload.investigator, created_date,
        payload.description or "Forensic investigation case.",
        payload.organization or "Cyber Defense Bureau",
        payload.reference_number or f"REF-{case_id[-4:]}"
    ))

    # Also automatically add an initial mock evidence source if chosen
    evidence_name = f"{payload.name.replace(' ', '_').upper()}_EVI_01.img"
    evidence_id = f"EVI-{int(datetime.now().timestamp()) % 100000:05d}"
    cursor.execute("""
        INSERT INTO evidence (id, case_id, case_name, intake_date, type, brand, model, item_name, status, current_location, size, size_bytes, sha256, md5, integrity_status, description)
        VALUES (?, ?, ?, ?, ?, 'Generic', 'Forensic Image', ?, 'Processing', 'Evidence Locker 1', '3.2 GB', 3435973836,
        '9f83461663b65551c6c39f04cb246b1f28b49e1e194ec891cf324c454e99f0f9',
        '84762c9c7b0773d5743c4a6b4904b77f', 'Verified', 'Acquired forensic test container for ' || ?)
    """, (evidence_id, case_id, payload.name, created_date, payload.evidence_source, evidence_name, payload.name))

    conn.commit()
    conn.close()

    append_audit_block(
        operation="Case Created",
        details=f"New forensic case {case_id} ('{payload.name}') registered with evidence {evidence_name}",
        user=payload.investigator
    )

    return {"message": "Case created successfully", "case_id": case_id}
