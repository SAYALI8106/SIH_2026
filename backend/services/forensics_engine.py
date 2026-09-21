import time
from database import get_db

FILE_SIGNATURES = {
    "JPG": {
        "name": "JPEG Image",
        "header_hex": "FF D8 FF",
        "footer_hex": "FF D9",
        "category": "Images",
        "mime": "image/jpeg",
        "description": "Standard Joint Photographic Experts Group image container"
    },
    "PNG": {
        "name": "Portable Network Graphics",
        "header_hex": "89 50 4E 47 0D 0A 1A 0A",
        "footer_hex": "49 45 4E 44 AE 42 60 82",
        "category": "Images",
        "mime": "image/png",
        "description": "Lossless raster graphic with IEND footer chunk"
    },
    "PDF": {
        "name": "Adobe Portable Document",
        "header_hex": "25 50 44 46",  # %PDF
        "footer_hex": "25 25 45 4F 46", # %%EOF
        "category": "Documents",
        "mime": "application/pdf",
        "description": "PostScript-derived document with trailer catalog"
    },
    "DOCX": {
        "name": "Microsoft Word OpenXML",
        "header_hex": "50 4B 03 04",  # PK..
        "footer_hex": "50 4B 05 06",
        "category": "Documents",
        "mime": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "description": "Compressed ZIP container with word/document.xml payload"
    },
    "ZIP": {
        "name": "Standard ZIP Archive",
        "header_hex": "50 4B 03 04",
        "footer_hex": "50 4B 05 06",
        "category": "Archives",
        "mime": "application/zip",
        "description": "Deflate-compressed archive directory structure"
    },
    "MP4": {
        "name": "MPEG-4 Part 14 Video",
        "header_hex": "00 00 00 18 66 74 79 70",  # ....ftyp
        "footer_hex": "None (Stream/moov chunk)",
        "category": "Videos",
        "mime": "video/mp4",
        "description": "ISOBMFF media container with atom chunks"
    }
}

CARVING_PIPELINE_STEPS = [
    {
        "step": 1,
        "title": "Evidence Image Mount",
        "description": "Hardware write-blocked DD or E01 bit-stream image mounted in read-only sandbox."
    },
    {
        "step": 2,
        "title": "Sector Scanner",
        "description": "Sequential cluster-by-cluster reading traversing unallocated blocks and slack space."
    },
    {
        "step": 3,
        "title": "Signature Detection",
        "description": "Pattern matching engine scans for magic byte headers (e.g., FF D8 FF, 89 50 4E 47, %PDF)."
    },
    {
        "step": 4,
        "title": "Header Validation",
        "description": "Verifies metadata headers, endianness markers, and initial chunk descriptors."
    },
    {
        "step": 5,
        "title": "File Structure Validation",
        "description": "Validates internal tree, XML tables, EXIF payloads, or index tables for corruption."
    },
    {
        "step": 6,
        "title": "Fragment Detection",
        "description": "Analyzes disk fragmentation, cluster discontinuities, and contiguous payload limits."
    },
    {
        "step": 7,
        "title": "File Reconstruction",
        "description": "Assembles sector chunks, maps valid trailer/footer markers (e.g. FF D9, %%EOF), and carves file."
    },
    {
        "step": 8,
        "title": "Confidence Scoring",
        "description": "Computes transparent 6-factor Prototype Confidence Score based on structural integrity."
    }
]

def calculate_confidence_breakdown(sig_match=True, header_val=True, footer_val=True, struct_val=True, size_consist=True, frag_cont=True):
    """
    Returns transparent prototype confidence score breakdown.
    Total max: 100%
    """
    score = 0
    factors = [
        {"name": "Signature Match", "weight": 25, "passed": bool(sig_match), "desc": "Magic byte sequence detected at cluster boundary"},
        {"name": "Header Validation", "weight": 20, "passed": bool(header_val), "desc": "File header descriptors and dimensions valid"},
        {"name": "Footer Validation", "weight": 15, "passed": bool(footer_val), "desc": "End-of-file terminator sequence located"},
        {"name": "Structure Validation", "weight": 15, "passed": bool(struct_val), "desc": "Internal chunks, tables or stream syntax intact"},
        {"name": "Size Consistency", "weight": 15, "passed": bool(size_consist), "desc": "Reported container length aligns with carved byte count"},
        {"name": "Fragment Continuity", "weight": 10, "passed": bool(frag_cont), "desc": "Zero gaps detected between allocated data blocks"}
    ]

    for f in factors:
        if f["passed"]:
            score += f["weight"]

    confidence_tier = "High Confidence" if score >= 90 else ("Medium Confidence" if score >= 70 else "Low Confidence")

    return {
        "score": score,
        "confidence_tier": confidence_tier,
        "label": "Prototype Confidence Score",
        "factors": factors
    }

def get_recovered_files(evidence_id: str = "EVI-00001", file_type: str = None, category: str = None, search: str = None):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM recovered_files WHERE evidence_id = ?"
    params = [evidence_id]

    if file_type and file_type != "ALL":
        query += " AND file_type = ?"
        params.append(file_type)

    if category and category != "ALL":
        query += " AND category = ?"
        params.append(category)

    if search:
        query += " AND file_name LIKE ?"
        params.append(f"%{search}%")

    query += " ORDER BY confidence DESC, file_name ASC"
    cursor.execute(query, params)
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()

    # augment with confidence factor details
    for r in rows:
        r["breakdown"] = calculate_confidence_breakdown(
            sig_match=r.get("sig_match", 1),
            header_val=r.get("header_val", 1),
            footer_val=r.get("footer_val", 1),
            struct_val=r.get("struct_val", 1),
            size_consist=r.get("size_consist", 1),
            frag_cont=r.get("frag_cont", 1)
        )

    return rows
