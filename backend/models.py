from pydantic import BaseModel, Field
from typing import Optional, List

class CaseCreate(BaseModel):
    name: str
    case_number: str
    investigator: str
    description: Optional[str] = ""
    organization: Optional[str] = ""
    reference_number: Optional[str] = ""
    evidence_source: Optional[str] = "Disk image"

class EvidenceCreate(BaseModel):
    case_id: str
    case_name: str
    item_name: str
    type: str = "USB"
    brand: Optional[str] = "SanDisk"
    model: Optional[str] = "Ultra Flair 3.0"
    current_location: Optional[str] = "Forensic Lab Vault 1"
    size: Optional[str] = "2.4 GB"
    description: Optional[str] = ""

class CalculateHashRequest(BaseModel):
    evidence_id: str
    algorithm: Optional[str] = "SHA-256"

class VerifyIntegrityRequest(BaseModel):
    evidence_id: str
    tamper_simulation: Optional[bool] = False

class StartRecoveryScanRequest(BaseModel):
    evidence_id: str
    scan_mode: Optional[str] = "Signature-Based Carving"
    file_types: Optional[List[str]] = ["JPG", "PNG", "PDF", "DOCX", "ZIP", "MP4"]

class StartErasureRequest(BaseModel):
    target_id: str
    method: str = "Multi-Pass Test Erasure"
    verification_method: str = "Full Verification"

class FileErasureRequest(BaseModel):
    files: List[str]
    options: Optional[List[str]] = ["Test overwrite simulation", "Metadata cleanup simulation", "Verification"]

class AuditTamperRequest(BaseModel):
    block_id: int
    tampered_operation: Optional[str] = "Unauthorized Evidence Modification"

class GenerateReportRequest(BaseModel):
    case_id: str
    report_type: Optional[str] = "Comprehensive Forensic Analysis"
