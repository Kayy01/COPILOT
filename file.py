from flask import Flask, request, jsonify
from openai import OpenAI
import PyPDF2

app = Flask(__name__)

# Function to extract text from PDF
def extract_text_from_pdf(file_path):
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        return "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])

@app.route("/ask", methods=["POST"])
def ask_ai():
    data = request.json
    user_query = data.get("query")
    document_content = data.get("document", "")

    # Use OpenAI's API (or another AI model) to answer based on the document
    response = OpenAI().chat.completions.create(
        model="gpt-4-turbo",
        messages=[{"role": "system", "content": "Answer questions based on the provided document."},
                  {"role": "user", "content": f"Document:\n{document_content}\n\nQuestion: {user_query}"}]
    )

    return jsonify({"answer": response.choices[0].message.content})

if __name__ == "__main__":
    app.run(debug=True)
