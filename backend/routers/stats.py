from fastapi import APIRouter
from database import get_db

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("/dashboard")
def get_dashboard_stats():
    conn = get_db()
    cursor = conn.cursor()

    # Stat Cards
    cursor.execute("SELECT COUNT(*) FROM cases;")
    active_cases = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM evidence;")
    evidence_items = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM recovered_files;")
    recovered_files = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM erasure_jobs;")
    erasure_jobs = cursor.fetchone()[0]

    # Recent cases
    cursor.execute("SELECT * FROM cases ORDER BY created_date DESC LIMIT 5;")
    recent_cases = [dict(c) for c in cursor.fetchall()]

    # System Activity (from audit blocks)
    cursor.execute("SELECT * FROM audit_blocks ORDER BY block_id DESC LIMIT 6;")
    system_activity = [dict(b) for b in cursor.fetchall()]

    # File types distribution
    cursor.execute("""
        SELECT file_type as name, COUNT(*) as value 
        FROM recovered_files 
        GROUP BY file_type 
        ORDER BY value DESC;
    """)
    file_types_data = [dict(r) for r in cursor.fetchall()]

    # Erasure activity trend data
    erasure_activity = [
        {"day": "Mon", "jobs": 2, "sectors_gb": 48},
        {"day": "Tue", "jobs": 5, "sectors_gb": 128},
        {"day": "Wed", "jobs": 3, "sectors_gb": 64},
        {"day": "Thu", "jobs": 7, "sectors_gb": 256},
        {"day": "Fri", "jobs": 4, "sectors_gb": 96},
        {"day": "Sat", "jobs": 1, "sectors_gb": 32},
        {"day": "Sun", "jobs": 1, "sectors_gb": 16}
    ]

    # Confidence distribution data
    confidence_data = [
        {"tier": "High (90-100%)", "count": 118, "fill": "#10B981"},
        {"tier": "Medium (70-89%)", "count": 24, "fill": "#F59E0B"},
        {"tier": "Low (<70%)", "count": 5, "fill": "#EF4444"}
    ]

    conn.close()

    return {
        "metrics": {
            "active_cases": active_cases,
            "evidence_items": evidence_items,
            "recovered_files": recovered_files,
            "erasure_jobs": erasure_jobs,
            "integrity_verified_pct": "98.2%"
        },
        "recent_cases": recent_cases,
        "system_activity": system_activity,
        "file_types": file_types_data,
        "erasure_activity": erasure_activity,
        "confidence_distribution": confidence_data
    }
