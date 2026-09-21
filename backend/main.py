from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import cases, evidence, recovery, erasure, audit, reports, stats

app = FastAPI(
    title="SecureForensics API",
    description="Integrated Digital Forensics, Secure Data Erasure, and Advanced Recovery Platform API",
    version="1.0.0"
)

# Enable CORS for local React/Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(stats.router)
app.include_router(cases.router)
app.include_router(evidence.router)
app.include_router(recovery.router)
app.include_router(erasure.router)
app.include_router(audit.router)
app.include_router(reports.router)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {
        "project": "SecureForensics",
        "tagline": "Secure Data Erasure • Digital Forensics • Advanced File Recovery",
        "status": "Operational",
        "mode": "DEMO / TEST MODE",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "SecureForensics Core Engine", "sandbox_mode": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
