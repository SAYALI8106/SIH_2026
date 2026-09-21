from fastapi import APIRouter, HTTPException, Query
from database import get_db
from models import StartRecoveryScanRequest
from services.forensics_engine import (
    get_recovered_files, FILE_SIGNATURES, CARVING_PIPELINE_STEPS, calculate_confidence_breakdown
)
from services.audit_chain import append_audit_block
from datetime import datetime
from typing import List

router = APIRouter(prefix="/api/recovery", tags=["recovery"])

@router.get("/files")
def list_recovered_files(
    evidence_id: str = "EVI-00001",
    file_type: str = "ALL",
    category: str = "ALL",
    search: str = None
):
    files = get_recovered_files(evidence_id, file_type, category, search)
    
    # Calculate category summary counts
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT category, COUNT(*) as count 
        FROM recovered_files 
        WHERE evidence_id = ? 
        GROUP BY category;
    """, (evidence_id,))
    category_counts = {row["category"]: row["count"] for row in cursor.fetchall()}

    cursor.execute("""
        SELECT file_type, COUNT(*) as count 
        FROM recovered_files 
        WHERE evidence_id = ? 
        GROUP BY file_type;
    """, (evidence_id,))
    type_counts = {row["file_type"]: row["count"] for row in cursor.fetchall()}

    cursor.execute("SELECT COUNT(*) FROM recovered_files WHERE evidence_id = ?;", (evidence_id,))
    total_count = cursor.fetchone()[0]

    conn.close()

    return {
        "total": total_count,
        "returned": len(files),
        "category_counts": category_counts,
        "type_counts": type_counts,
        "files": files
    }

@router.get("/signatures")
def get_signatures():
    return FILE_SIGNATURES

@router.get("/pipeline")
def get_pipeline():
    return CARVING_PIPELINE_STEPS

@router.post("/scan")
def start_scan(payload: StartRecoveryScanRequest):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM evidence WHERE id = ?;", (payload.evidence_id,))
    evi = cursor.fetchone()
    if not evi:
        conn.close()
        raise HTTPException(status_code=404, detail="Evidence not found")

    # Update case processing status
    cursor.execute("""
        UPDATE cases 
        SET scan_status = 'Processing', last_scan = 'Just now', files_discovered = 2431, files_recovered = 147
        WHERE id = ?;
    """, (evi["case_id"],))
    conn.commit()
    conn.close()

    append_audit_block(
        operation="Recovery Scan Started",
        details=f"Carving scan executed on {evi['item_name']} using mode: {payload.scan_mode}. 147 files identified.",
        user="Analyst-01"
    )

    return {
        "status": "Scan Complete",
        "evidence_id": payload.evidence_id,
        "evidence_name": evi["item_name"],
        "scan_mode": payload.scan_mode,
        "sectors_scanned": 1870421,
        "total_sectors": 2145000,
        "files_detected": 147,
        "classification": {
            "JPG": 82,
            "PDF": 24,
            "PNG": 18,
            "DOCX": 15,
            "ZIP": 8
        },
        "elapsed_seconds": 3.4
    }

@router.post("/recover-selected")
def recover_selected(file_ids: List[str]):
    conn = get_db()
    cursor = conn.cursor()

    for fid in file_ids:
        cursor.execute("UPDATE recovered_files SET recovered_state = 1 WHERE id = ?;", (fid,))

    conn.commit()
    conn.close()

    append_audit_block(
        operation="Files Recovered",
        details=f"Extracted and saved {len(file_ids)} carved evidence files to secure forensic export folder.",
        user="Analyst-01"
    )

    return {
        "recovered_count": len(file_ids),
        "status": "Files Restored",
        "export_directory": "C:/ForensicCases/CASE-2026-001/RecoveredArtifacts/"
    }

@router.get("/file/{file_id}")
def inspect_file(file_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recovered_files WHERE id = ?;", (file_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Carved file not found")

    item = dict(row)
    item["breakdown"] = calculate_confidence_breakdown(
        sig_match=item.get("sig_match", 1),
        header_val=item.get("header_val", 1),
        footer_val=item.get("footer_val", 1),
        struct_val=item.get("struct_val", 1),
        size_consist=item.get("size_consist", 1),
        frag_cont=item.get("frag_cont", 1)
    )

    # Simulated hex dump preview snippet
    item["hex_preview"] = [
        {"offset": item["offset_hex"], "hex": "FF D8 FF E0 00 10 4A 46 49 46 00 01 01 01 00 60", "ascii": "......JFIF.....`"},
        {"offset": f"0x{int(item['offset_hex'], 16) + 16:06X}", "hex": "00 60 00 00 FF DB 00 43 00 08 06 06 07 06 05 08", "ascii": ".`.....C........"},
        {"offset": f"0x{int(item['offset_hex'], 16) + 32:06X}", "hex": "07 07 07 09 09 08 0A 0C 14 0D 0C 0B 0B 0C 19 12", "ascii": "................"},
        {"offset": f"0x{int(item['offset_hex'], 16) + 48:06X}", "hex": "13 0F 14 1D 1A 1F 1E 1D 1A 1C 1C 20 24 2E 27 20", "ascii": "........... $.' "}
    ]

    return item
