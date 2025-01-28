const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Middleware for handling file uploads
app.use(fileUpload());
app.use(express.json());

// Endpoint to upload a file
app.post("/upload", (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No file was uploaded.");
    }

    const uploadedFile = req.files.file;
    const filePath = `./uploads/${uploadedFile.name}`;

    // Save file to the server
    uploadedFile.mv(filePath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.send("File uploaded successfully!");
    });
});

// Endpoint to read and query the file
app.post("/query", (req, res) => {
    const { filename, query } = req.body;

    // Ensure the file exists
    const filePath = `./uploads/${filename}`;
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found.");
    }

    // Read the file content
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Example: Answer a question based on file content
    if (query.includes("line count")) {
        const lineCount = fileContent.split("\n").length;
        return res.json({ answer: `The file has ${lineCount} lines.` });
    }

    res.json({ answer: "Query not recognized." });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
