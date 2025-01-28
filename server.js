import streamlit as st
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI

# Define the file uploading interface
def file_upload_interface():
    st.title("File Upload & QA Chatbot")
    st.write("Upload a PDF file to ask questions about its content.")

    # File uploader
    uploaded_file = st.file_uploader("Upload your PDF file", type=["pdf"])

    if uploaded_file:
        # Display uploaded file name
        st.success(f"File '{uploaded_file.name}' uploaded successfully.")

        # Process file on button click
        if st.button("Process File and Ask Questions"):
            process_file(uploaded_file)

def process_file(uploaded_file):
    # Extract text from the uploaded PDF
    pdf_reader = PdfReader(uploaded_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()

    # Split text into chunks
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(text)

    # Create embeddings and load into FAISS
    embeddings = OpenAIEmbeddings()
    knowledge_base = FAISS.from_texts(chunks, embeddings)

    # Set up the retrieval-based QA system
    retriever = knowledge_base.as_retriever()
    qa_chain = RetrievalQA.from_chain_type(
        llm=ChatOpenAI(),
        retriever=retriever,
        return_source_documents=True
    )

    # Allow the user to ask questions
    st.subheader("Ask Questions About the File")
    user_question = st.text_input("Enter your question here:")

    if user_question:
        with st.spinner("Fetching answer..."):
            response = qa_chain.run(user_question)

        st.write("### Answer:")
        st.write(response)

# Run the file upload interface
if __name__ == "__main__":
    file_upload_interface()
