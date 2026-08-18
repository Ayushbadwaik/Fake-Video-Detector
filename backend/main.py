import os
import shutil
import tempfile
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer import analyze_video_file_or_url

app = FastAPI(
    title="FAKEDETECT AI Forensic Backend API",
    version="5.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UrlAnalysisRequest(BaseModel):
    url: str
    sensitivity: str = 'balanced'

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "engine": "FAKEDETECT Python Forensic Engine v5.0",
        "features": ["OpenCV Spatial Variance", "2D FFT Spectrum", "Optical Flow", "yt-dlp Metadata Extraction"]
    }

@app.post("/api/analyze-url")
def analyze_url(req: UrlAnalysisRequest):
    if not req.url:
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    try:
        result = analyze_video_file_or_url(req.url, is_url=True, sensitivity=req.sensitivity)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-file")
async def analyze_file(
    file: UploadFile = File(...),
    sensitivity: str = Form('balanced')
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    suffix = os.path.splitext(file.filename)[1] or ".mp4"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        result = analyze_video_file_or_url(tmp_path, is_url=False, sensitivity=sensitivity)
        result['title'] = file.filename
        return result
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Serve built frontend static files if dist folder exists
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")
if os.path.exists(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

@app.get("/")
def serve_index():
    if os.path.exists(DIST_DIR):
        return FileResponse(os.path.join(DIST_DIR, "index.html"))
    return {"message": "FakeDetect API is running. Run 'npm run build' to serve frontend."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
