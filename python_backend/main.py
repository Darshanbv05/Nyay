"""FastAPI-compatible privacy-first Nyay backend for the hackathon demo."""
import io, json, re
from pathlib import Path
from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
RULES = json.loads((ROOT / "backend/src/data/ruleset.json").read_text(encoding="utf-8"))
app = FastAPI(title="Nyay API")

class AnalyzeRequest(BaseModel):
    text: str
    source_type: str = "pasted_text"
    output_language: str

def anonymize(text: str) -> str:
    text = re.sub(r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}", "[EMAIL REDACTED]", text)
    text = re.sub(r"(?:\+91[- ]?)?[6-9]\d{9}", "[PHONE REDACTED]", text)
    return re.sub(r"\b[A-Z]{5}\d{4}[A-Z]\b", "[PAN REDACTED]", text)

def segments(text: str):
    parts = re.split(r"\n(?=(?:Clause\s+)?\d+(?:\.\d+)*[.):\-]\s*)", text, flags=re.I)
    return [p.strip() for p in parts if len(p.strip()) > 20] or [text]

@app.get("/api/health")
def health(): return {"status": "ok", "service": "nyay-fastapi"}

@app.post("/api/extract")
async def extract(file: UploadFile = File(...)):
    data = await file.read()
    if file.content_type == "application/pdf":
        text = "\n".join(page.extract_text() or "" for page in PdfReader(io.BytesIO(data)).pages)
    elif file.content_type and file.content_type.startswith("image/"):
        try:
            import pytesseract
            from PIL import Image
            text = pytesseract.image_to_string(Image.open(io.BytesIO(data)))
        except Exception as exc: raise HTTPException(422, f"OCR unavailable: {exc}")
    else: raise HTTPException(415, "Upload a PDF or image.")
    return {"text": text.strip()}

@app.post("/api/analyze")
def analyze(body: AnalyzeRequest):
    if not body.output_language: raise HTTPException(400, "Choose an explanation language.")
    text = anonymize(body.text)
    clauses=[]
    for index, clause in enumerate(segments(text)):
        match=next((r for r in RULES if any(k.lower() in clause.lower() for k in r["keywords"])), None)
        clauses.append({"clause_id":f"c{index+1}","source_label":clause[:60],"original_text":clause,"plain_explanation_points":[match.get("plain_explanation_template", match["check_description"]) if match else "No indexed warning pattern matched this passage."],"flagged":bool(match),"matched_rule_id":match["rule_id"] if match else None,"risk_level":match["risk_level"] if match else "none","classification":"red" if match and match["risk_level"]=="high" else "yellow" if match else "green","legal_basis":match["legal_basis"] if match else None,"legal_basis_explanation":match["check_description"] if match else None,"suggested_action":"Ask for this wording to be clarified or revised before signing." if match else "Keep a copy of the agreed wording."})
    risk="high" if any(c["risk_level"]=="high" for c in clauses) else "medium" if any(c["risk_level"]=="medium" for c in clauses) else "low"
    return {"output_language":body.output_language,"overall_risk":risk,"summary":"Privacy-filtered rental agreement screening complete.","clauses":clauses,"disclaimer":"This is not legal advice. Consult a licensed professional for your situation."}
