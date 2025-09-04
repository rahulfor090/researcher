import express from 'express';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Article } from '../models/index.js'; // ✅ Sequelize model

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

router.use(cors());
router.use(express.json());

async function processPDF(pdfBuffer, filename = 'uploaded file') {
  try {
    console.log(`📄 Processing PDF: ${filename}`);

    const pdfData = await pdf(pdfBuffer);

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
      summary,
      pages: pdfData.numpages,
      info: pdfData.info
    };
  } catch (err) {
    console.error('❌ Error during PDF processing:', err);
    return {
      success: false,
      error: err.message
    };
  }
}

// ✅ POST /api/process-pdf-by-article
router.post('/api/process-pdf-by-article', async (req, res) => {
  console.log('🔍 Received request to process PDF by article');

  try {
    const { article_id } = req.body;

    if (!article_id) {
      return res.status(400).json({ success: false, error: 'Missing article_id in request body' });
    }

    const article = await Article.findByPk(Number(article_id));

    if (!article || !article.file_name) {
      return res.status(404).json({ success: false, error: 'Article not found or missing file_name' });
    }

    const uploadsDir = path.resolve('src/uploads');
    const pdfPath = path.join(uploadsDir, article.file_name.trim());

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ success: false, error: 'PDF file not found on server' });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const result = await processPDF(pdfBuffer, article.file_name);

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    article.summary = result.summary;
    article.abstract = result.summary;
    await article.save();

    res.json({ success: true, result });
  } catch (error) {
    console.error('❌ Error in /api/process-pdf-by-article:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
