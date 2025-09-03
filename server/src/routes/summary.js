import { Router } from 'express';
import fs from "fs";
import path from "path";
import pdf from "pdf-parse/lib/pdf-parse.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import multer from "multer";
import cors from "cors";
import mysql from "mysql2/promise";

dotenv.config();

const router = Router();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (adjust as needed)
app.use(cors());

// Middleware
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// MySQL pool setup
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Smarth@2006',
  database: process.env.DB_NAME || 'research_locker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function processPDF(pdfBuffer, filename = "uploaded file") {
  try {
    console.log(`📄 Processing PDF: ${filename}`);

    // Parse PDF
    const pdfData = await pdf(pdfBuffer);

    // Ask Gemini for a structured summary
    const prompt = `
You are an expert document summarizer. Produce a structured summary in the EXACT format below.

FORMAT (use markdown, keep bold and bullets exactly):
• Detailed Summary with Key Points
1. **Background & Motivation**
   - <one sentence>
   - <one sentence>
2. **Key Findings**
   - <one sentence>
   - <one sentence>
   - <one sentence>
3. **Methods & Evidence**
   - <one sentence>
   - <one sentence>
4. **Therapeutic Implications** (or **Practical Implications** if not medical)
   - <one sentence>
   - <one sentence>
5. **Conclusion**
   - <one sentence>
   - <one sentence>

RULES:
- Keep each bullet to a single concise sentence.
- Use bold section titles exactly as above.
- Prefer specific numbers, metrics, named entities, and results when available.
- Output ONLY the formatted summary. No preface or postfix text.

Document text:
${pdfData.text.slice(0, 8000)}
    `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return {
      success: true,
      pdfFile: filename,
      extractedText: pdfData.text,
      summary: summary,
      pages: pdfData.numpages,
      info: pdfData.info
    };

  } catch (err) {
    console.error("❌ Error:", err);
    return {
      success: false,
      error: err.message
    };
  }
}

// Upload and process PDF
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No PDF file uploaded' });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const result = await processPDF(pdfBuffer, req.file.originalname);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Process existing PDF in project root (fallback)
app.get('/process-existing', async (req, res) => {
  try {
    const projectRoot = process.cwd();
    const pdfFile = fs.readdirSync(projectRoot).find(f => f.endsWith(".pdf"));

    if (!pdfFile) {
      return res.status(404).json({ 
        success: false, 
        error: "No PDF file found in project root. Please add a .pdf file." 
      });
    }

    const pdfPath = path.join(projectRoot, pdfFile);
    const dataBuffer = fs.readFileSync(pdfPath);
    const result = await processPDF(dataBuffer, pdfFile);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
console.log("Server starting...");
app.get('/process-pdf', (req, res) => {
  console.log("Route triggered");
  res.send("ok");
});

// New endpoint: Process uploaded PDF by article ID (fetch filename from DB)


app.get('/v1/summary/process-pdf', async (req, res) => {
  console.log("Hello Process pdf");

  try {
    const { pdf_file } = req.query; 
    console.log("Requested PDF:", pdf_file);

    if (!pdf_file) {
      return res.status(400).json({ success: false, error: 'pdf_file query parameter is required' });
    }

    // Absolute path to your uploads folder
    const uploadsDir = path.join("S:", "researcher", "server", "src", "uploads");
    const pdfPath = path.join(uploadsDir, pdf_file);

    console.log("Looking for PDF at:", pdfPath);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ success: false, error: 'PDF file not found on server' });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    // Call your custom PDF processing
    const result = await processPDF(pdfBuffer, pdf_file);

    res.json({ success: true, result });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
