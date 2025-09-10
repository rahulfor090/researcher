import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Article, Tag } from '../models/index.js';

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

// === Debug: Log GEMINI_API_KEY config === //
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in your environment!');
}

let genAI, model;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
} catch (e) {
  console.error('❌ Failed to initialize GoogleGenerativeAI:', e);
}

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

    const pascalTags = keywords.map(k => {
      const cleaned = k.replace(/[^a-zA-Z0-9 ]/g, '').trim();
      const pascalCase = cleaned
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
      return pascalCase;
    }).filter(Boolean);

    return pascalTags;
  } catch (err) {
    console.error('❌ Error during hashtag extraction:', err);
    throw err;
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

    const pascalTags = await extractHashtags(pdfData.text);

    // Prepare string for hashtags column in Article (with # prefix)
    const hashtagsStr = pascalTags.map(tag => `#${tag}`).join(' ');

    return {
      success: true,
      pdfFile: filename,
      extractedText: pdfData.text,
      summary,
      hashtags: pascalTags,
      hashtagsStr,
      pages: pdfData.numpages,
      info: pdfData.info
    };
  } catch (err) {
    console.error('❌ Error during PDF processing:', err);
    return {
      success: false,
      error: err.message,
      stack: err.stack
    };
  }
}

router.post('/pdf', upload.single('pdf'), async (req, res) => {
  const articleId = req.query.id;
  if (!articleId) {
    console.error('❌ Article id is required');
    return res.status(400).json({ error: 'Article id is required' });
  }
  if (!req.file) {
    console.error('❌ No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }
  if (!model) {
    console.error('❌ Gemini model not initialized.');
    return res.status(500).json({ error: 'Gemini model not initialized.' });
  }

  try {
    const pdfPath = path.join(uploadDir, req.file.filename);
    const pdfBuffer = await fs.promises.readFile(pdfPath);

    const result = await processPDF(pdfBuffer, req.file.filename);

    if (!result.success) {
      console.error('❌ PDF processing failed:', result.error);
      return res.status(500).json({ error: 'PDF processing failed', details: result.error, stack: result.stack });
    }

    let tagInstances = [];
    try {
      for (const tagName of result.hashtags) {
        const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
        tagInstances.push(tag);
      }
    } catch (tagErr) {
      console.error('❌ Error inserting tags:', tagErr);
      return res.status(500).json({ error: 'Failed to insert tags', details: tagErr.message, stack: tagErr.stack });
    }

    let article;
    try {
      article = await Article.findByPk(articleId);
      if (!article) {
        console.warn(`⚠️ Article with ID ${articleId} not found`);
        return res.status(404).json({ error: 'Article not found' });
      }
    } catch (artErr) {
      console.error('❌ Error finding article:', artErr);
      return res.status(500).json({ error: 'Failed to find article', details: artErr.message, stack: artErr.stack });
    }

    try {
      await article.setTags(tagInstances);
    } catch (assocErr) {
      console.error('❌ Error associating tags to article:', assocErr);
      return res.status(500).json({ error: 'Failed to associate tags', details: assocErr.message, stack: assocErr.stack });
    }

    try {
      await article.update({
        file_name: req.file.filename,
        summary: result.summary,
        hashtags: result.hashtagsStr
      });
    } catch (updateErr) {
      console.error('❌ Error updating article:', updateErr);
      return res.status(500).json({ error: 'Failed to update article', details: updateErr.message, stack: updateErr.stack });
    }

    res.json({
      message: 'File uploaded, processed, and article updated with tags',
      filename: req.file.filename,
      summary: result.summary,
      hashtags: result.hashtagsStr,
      pages: result.pages,
      info: result.info
    });
  } catch (err) {
    console.error('❌ Error in /pdf upload:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message, stack: err.stack });
  }
});

// ---- ADDITION: API for getting all hashtags ----
router.get('/tags', async (req, res) => {
  try {
    const tags = await Tag.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] });
    res.json({ tags });
  } catch (err) {
    console.error('❌ Error fetching tags:', err);
    res.status(500).json({ error: 'Failed to fetch tags', details: err.message });
  }
});

export default router;