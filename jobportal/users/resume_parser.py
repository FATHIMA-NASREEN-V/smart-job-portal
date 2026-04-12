import fitz  # PyMuPDF
import anthropic
import json

def extract_text_from_resume(file):
    text = ""
    # Read file bytes (works with Django InMemoryUploadedFile)
    file.seek(0)
    pdf_bytes = file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    for page in doc:
        text += page.get_text()
    return text.strip()

def parse_resume_with_claude(resume_text: str) -> dict:
    client = anthropic.Anthropic()

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": f"""Extract the following fields from this resume text and return ONLY a valid JSON object with no extra text:

{{
  "first_name": "",
  "last_name": "",
  "job_title": "",
  "skills": "",
  "bio": ""
}}

Rules:
- skills: comma-separated list of technical and soft skills
- bio: a short 1-2 sentence professional summary
- job_title: most recent or most relevant job title
- If a field can't be found, leave it as empty string

Resume text:
{resume_text}"""
            }
        ]
    )

    raw = message.content[0].text.strip()

    # Strip markdown fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    return json.loads(raw)