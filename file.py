from flask import Flask, request, jsonify
import fitz  # PyMuPDF
import os

app = Flask(__name__)

# Define a folder to temporarily store uploaded PDFs
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/extract-text", methods=["POST"])
def extract_text():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Extract text from PDF
    text = extract_text_from_pdf(file_path)

    # Remove the file after processing
    os.remove(file_path)

    return jsonify({"extracted_text": text})

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = "\n".join([page.get_text() for page in doc])
    return text

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
