import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Article } from '../models/index.js'; // Adjust path as needed

dotenv.config();

const router = express.Router();

const uploadDir = path.resolve('src/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function extractHashtags(text) {
  try {
    const prompt = `
You are a expert medical researcher. Extract 10-15 important keywords or phrases from the following Medical text. Output them as a comma-separated list.

Text:
${text.slice(0, 8000)}
    `;

    const result = await model.generateContent(prompt);
    const keywordsText = result.response.text();

    const keywords = keywordsText
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const hashtags = keywords.map(k => {
      const cleaned = k.replace(/[^a-zA-Z0-9 ]/g, '').trim();
      const pascalCase = cleaned
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
      return '#' + pascalCase;
    });

    return hashtags.join(' ');
  } catch (err) {
    console.error('❌ Error during hashtag extraction:', err);
    return '';
  }
}

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

    const hashtags = await extractHashtags(pdfData.text);

    return {
      success: true,
      pdfFile: filename,
      extractedText: pdfData.text,
      summary,
      hashtags,
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

router.post('/pdf', upload.single('pdf'), async (req, res) => {
  const articleId = req.query.id;
  if (!articleId) return res.status(400).json({ error: 'Article id is required' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const pdfPath = path.join(uploadDir, req.file.filename);
    const pdfBuffer = fs.readFileSync(pdfPath);

    const result = await processPDF(pdfBuffer, req.file.filename);

    if (!result.success) {
      return res.status(500).json({ error: 'PDF processing failed', details: result.error });
    }

    const [updated] = await Article.update(
      {
        file_name: req.file.filename,
        summary: result.summary,
        abstract: result.summary,
        hashtags: result.hashtags // ✅ Make sure this column exists in your model
      },
      { where: { id: articleId } }
    );

    if (!updated) {
      console.warn(`⚠️ Article with ID ${articleId} not found`);
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({
      message: 'File uploaded, processed, and article updated',
      filename: req.file.filename,
      summary: result.summary,
      hashtags: result.hashtags,
      pages: result.pages,
      info: result.info
    });
  } catch (err) {
    console.error('Error in /pdf upload:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
