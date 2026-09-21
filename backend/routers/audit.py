from fastapi import APIRouter
from database import get_db
from models import AuditTamperRequest
from services.audit_chain import verify_entire_chain, simulate_tamper, restore_tampered_chain

router = APIRouter(prefix="/api/audit", tags=["audit"])

@router.get("/blocks")
def list_blocks():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_blocks ORDER BY block_id ASC;")
    blocks = [dict(b) for b in cursor.fetchall()]
    conn.close()
    return blocks

@router.post("/verify")
def verify_chain():
    result = verify_entire_chain()
    return result

@router.post("/tamper")
def tamper_block(payload: AuditTamperRequest):
    simulate_tamper(payload.block_id, payload.tampered_operation)
    return {
        "message": f"Block {payload.block_id} has been modified to simulate adversary tampering.",
        "target_block": payload.block_id
    }

@router.post("/restore")
def restore_chain():
    restore_tampered_chain()
    return {
        "message": "Audit chain cryptographic signatures successfully re-calculated and restored.",
        "status": "Verified"
    }
