import hashlib
from datetime import datetime
from database import get_db

def append_audit_block(operation: str, details: str, user: str = "Analyst-01") -> dict:
    """
    Appends a new block to the cryptographic audit chain.
    currentHash = SHA256(timestamp + operation + details + prevHash)
    """
    conn = get_db()
    cursor = conn.cursor()

    # Fetch latest block for prev_hash
    cursor.execute("SELECT block_id, current_hash FROM audit_blocks ORDER BY block_id DESC LIMIT 1;")
    last_block = cursor.fetchone()

    if last_block:
        prev_hash = last_block["current_hash"]
        next_id = last_block["block_id"] + 1
    else:
        prev_hash = "0000000000000000000000000000000000000000000000000000000000000000"
        next_id = 1

    now_ts = datetime.now().strftime("%H:%M")
    raw_payload = f"{now_ts}{operation}{details}{prev_hash}"
    current_hash = hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()
    block_code = f"{next_id:03d}"

    cursor.execute("""
        INSERT INTO audit_blocks (block_code, timestamp, user, operation, details, prev_hash, current_hash, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (block_code, now_ts, user, operation, details, prev_hash, current_hash, "Verified"))

    conn.commit()
    conn.close()

    return {
        "block_id": next_id,
        "block_code": block_code,
        "timestamp": now_ts,
        "user": user,
        "operation": operation,
        "details": details,
        "prev_hash": prev_hash,
        "current_hash": current_hash,
        "status": "Verified"
    }

def verify_entire_chain() -> dict:
    """
    Iterates through all blocks in sequential order from genesis,
    re-computing SHA256(timestamp + operation + details + prevHash)
    and verifying it matches both current_hash and next block's prev_hash.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_blocks ORDER BY block_id ASC;")
    blocks = [dict(b) for b in cursor.fetchall()]
    conn.close()

    if not blocks:
        return {"valid": True, "blocks_count": 0, "status": "Empty Chain", "invalid_block": None}

    prev_hash_expected = "0000000000000000000000000000000000000000000000000000000000000000"

    for block in blocks:
        # Check linkage
        if block["prev_hash"] != prev_hash_expected:
            return {
                "valid": False,
                "status": "CHAIN INTEGRITY FAILED",
                "reason": f"Broken linkage at Block {block['block_code']}: prev_hash mismatch",
                "invalid_block": block["block_code"],
                "blocks_checked": len(blocks)
            }

        # Recompute hash
        raw_payload = f"{block['timestamp']}{block['operation']}{block['details']}{block['prev_hash']}"
        expected_curr = hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()

        if expected_curr != block["current_hash"]:
            return {
                "valid": False,
                "status": "CHAIN INTEGRITY FAILED",
                "reason": f"Tampered data detected in Block {block['block_code']}: hash mismatch",
                "invalid_block": block["block_code"],
                "blocks_checked": len(blocks)
            }

        prev_hash_expected = block["current_hash"]

    return {
        "valid": True,
        "status": "Audit Chain Verified",
        "blocks_count": len(blocks),
        "genesis_hash": "0000000000000000000000000000000000000000000000000000000000000000",
        "latest_hash": prev_hash_expected,
        "message": "All cryptographic links and transaction payloads are tamper-free."
    }

def simulate_tamper(block_id: int, fake_op: str = "Unauthorized Evidence Modification"):
    """
    Simulates deliberate tampering in an audit block to demonstrate chain failure detection.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE audit_blocks 
        SET operation = ?, details = 'DATA CORRUPTED BY ADVERSARY'
        WHERE block_id = ?;
    """, (fake_op, block_id))
    conn.commit()
    conn.close()

def restore_tampered_chain():
    """
    Rebuilds the chain hashes to restore valid integrity for demo reset.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_blocks ORDER BY block_id ASC;")
    blocks = [dict(b) for b in cursor.fetchall()]

    prev_hash = "0000000000000000000000000000000000000000000000000000000000000000"
    for b in blocks:
        # if operation had been changed to fake, restore reasonable title
        op = "Evidence Inspection" if "Unauthorized" in b["operation"] else b["operation"]
        det = "Routine verification check" if "DATA CORRUPTED" in b["details"] else b["details"]
        raw = f"{b['timestamp']}{op}{det}{prev_hash}"
        curr = hashlib.sha256(raw.encode("utf-8")).hexdigest()
        cursor.execute("""
            UPDATE audit_blocks 
            SET operation = ?, details = ?, prev_hash = ?, current_hash = ?, status = 'Verified'
            WHERE block_id = ?;
        """, (op, det, prev_hash, curr, b["block_id"]))
        prev_hash = curr

    conn.commit()
    conn.close()
