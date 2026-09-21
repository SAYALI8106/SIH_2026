from fastapi import APIRouter, HTTPException
from database import get_db
from models import StartErasureRequest, FileErasureRequest
from services.sanitizer_engine import ERASURE_METHODS, execute_drive_erasure, execute_file_erasure

router = APIRouter(prefix="/api/erasure", tags=["erasure"])

@router.get("/drives")
def list_drives():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM mock_drives ORDER BY id ASC;")
    drives = [dict(d) for d in cursor.fetchall()]
    conn.close()
    return drives

@router.get("/methods")
def list_methods():
    return ERASURE_METHODS

@router.get("/jobs")
def list_jobs():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM erasure_jobs ORDER BY id DESC;")
    jobs = [dict(j) for d in [cursor.fetchall()] for j in d]
    conn.close()
    return jobs

@router.post("/start")
def start_erasure(payload: StartErasureRequest):
    try:
        result = execute_drive_erasure(
            target_id=payload.target_id,
            method=payload.method,
            verification_method=payload.verification_method
        )
        return result
    except (ValueError, PermissionError) as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/files")
def erase_files(payload: FileErasureRequest):
    if not payload.files:
        raise HTTPException(status_code=400, detail="No test files provided for shredding.")
    
    result = execute_file_erasure(
        file_list=payload.files,
        options=payload.options
    )
    return result
