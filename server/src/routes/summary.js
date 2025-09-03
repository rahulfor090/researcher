import express from 'express';
import fs from "fs";
import path from "path";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Gemini client
const genAI = new GoogleGenerativeAI(env.geminiApiKey);
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

// Generate summary for an existing PDF file
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { filename } = req.body;
    
    if (!filename) {
      return res.status(400).json({ success: false, error: 'Filename is required' });
    }

    const uploadDir = path.resolve('src/uploads');
    const filePath = path.join(uploadDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'PDF file not found' });
    }

    const pdfBuffer = fs.readFileSync(filePath);
    const result = await processPDF(pdfBuffer, filename);
    
    res.json(result);
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;