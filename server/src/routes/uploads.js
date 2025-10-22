import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Article, Tag, ArticleTag, PdfImage } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

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
      return pascalCase.slice(0, 60);
    }).filter(tag => Boolean(tag) && tag.length > 0);

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

    let summary = '';
    try {
      const result = await model.generateContent(prompt);
      summary = result.response.text();
    } catch (genErr) {
      console.error('⚠️ Gemini summary generation failed, continuing without summary:', genErr);
      summary = '';
    }

    const pascalTags = await extractHashtags(pdfData.text);
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

/**
 * Extract images and tables from PDF using Python script
 */
async function extractImagesAndTablesFromPDF(pdfPath) {
  return new Promise((resolve) => {
    console.log(`🐍 Running Python extractor on: ${pdfPath}`);
    
    const pythonScript = path.resolve('src/scripts/pdf_extractor.py');
    
    // Check if Python script exists
    if (!fs.existsSync(pythonScript)) {
      console.error(`❌ Python script not found at: ${pythonScript}`);
      resolve({ success: false, error: 'Python script not found', images: [], tables: [] });
      return;
    }

    console.log(`📜 Python script: ${pythonScript}`);

    // Use 'py -3' command (Windows Python Launcher)
    const pythonProcess = spawn('py', ['-3', pythonScript, pdfPath], {
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      
      // Log Python's stderr (which contains our debug messages)
      const lines = output.split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.log(`  🐍 ${line.trim()}`);
        }
      });
    });

    pythonProcess.on('error', (error) => {
      console.error(`❌ Python process error: ${error.message}`);
      resolve({ success: false, error: error.message, images: [], tables: [] });
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Python process exited with code ${code}`);
        console.error(`stderr: ${stderr}`);
        resolve({ success: false, error: `Python exited with code ${code}`, images: [], tables: [] });
        return;
      }

      try {
        // Parse JSON from stdout
        const jsonMatch = stdout.match(/\{[\s\S]*"success"[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          console.log(`✅ Extraction complete: ${result.total_images} images, ${result.total_tables} tables`);
          resolve(result);
        } else {
          console.warn('⚠️ Could not parse Python output');
          console.log('stdout:', stdout);
          resolve({ success: false, error: 'Failed to parse extraction results', images: [], tables: [] });
        }
      } catch (error) {
        console.error('❌ Error parsing Python output:', error.message);
        console.log('stdout:', stdout);
        resolve({ success: false, error: error.message, images: [], tables: [] });
      }
    });
  });
}

// Authenticated PDF upload and processing
router.post('/pdf', requireAuth, upload.single('pdf'), async (req, res) => {
  const articleId = req.query.id;
  if (!articleId) {
    return res.status(400).json({ error: 'Article id is required' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  if (!model) {
    return res.status(500).json({ error: 'Gemini model not initialized.' });
  }

  try {
    const pdfPath = path.join(uploadDir, req.file.filename);
    const pdfBuffer = await fs.promises.readFile(pdfPath);

    // Process PDF for text, summary, and hashtags
    const result = await processPDF(pdfBuffer, req.file.filename);

    // Extract images and tables using Python
    let extractionResult = { success: false, images: [], tables: [] };
    try {
      console.log('🖼️ Starting image and table extraction...');
      extractionResult = await extractImagesAndTablesFromPDF(pdfPath);
    } catch (extractErr) {
      console.error('⚠️ Failed to extract images/tables:', extractErr);
    }

    // Remove old images for this article from database
    await PdfImage.destroy({ where: { article_id: articleId } });

    // Store extracted images in database
    if (extractionResult.images && extractionResult.images.length > 0) {
      for (const imgName of extractionResult.images) {
        await PdfImage.create({
          article_id: articleId,
          images_name: imgName,
          created_at: new Date()
        });
      }
      console.log(`✅ Stored ${extractionResult.images.length} images in database`);
    }

    // Store extracted table files in database
    if (extractionResult.tables && extractionResult.tables.length > 0) {
      for (const tableName of extractionResult.tables) {
        await PdfImage.create({
          article_id: articleId,
          images_name: tableName,
          created_at: new Date()
        });
      }
      console.log(`✅ Stored ${extractionResult.tables.length} table files in database`);
    }

    // Tag creation and association
    let tagInstances = [];
    if (result.success && Array.isArray(result.hashtags)) {
      for (const tagName of result.hashtags) {
        const safe = (tagName || '').toString().slice(0, 60);
        if (!safe) continue;
        try {
          const [tag, created] = await Tag.findOrCreate({ where: { name: safe } });
          tagInstances.push(tag);
        } catch (tagErr) {
          console.warn('⚠️ Skipping tag due to DB error:', safe, tagErr?.message);
        }
      }
    }

    // Find the article
    let article = await Article.findByPk(articleId);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    // ArticleTag association (ALWAYS set user_id = req.user.id)
    if (tagInstances.length > 0) {
      const rows = tagInstances.map(tag => ({
        article_id: article.id,
        tag_id: tag.id,
        user_id: req.user.id
      }));
      await ArticleTag.bulkCreate(rows, { ignoreDuplicates: true });
    }

    // Update article
    await article.update({
      file_name: req.file.filename,
      summary: result.success ? result.summary : '',
      hashtags: result.success ? result.hashtagsStr : ''
    });

    res.json({
      message: result.success ? 'File uploaded, processed, and article updated with tags' : 'File uploaded; processing failed, saved file reference only',
      filename: req.file.filename,
      summary: result.success ? result.summary : undefined,
      hashtags: result.success ? result.hashtagsStr : undefined,
      pages: result.pages,
      info: result.info,
      extractedImages: extractionResult.images || [],
      extractedTables: extractionResult.tables || [],
      totalImages: extractionResult.total_images || 0,
      totalTables: extractionResult.total_tables || 0,
      extractorVersion: extractionResult.extractor_version,
      extractionTimestamp: extractionResult.extraction_timestamp
    });
  } catch (err) {
    console.error('❌ Error in PDF upload route:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message, stack: err.stack });
  }
});

// Endpoint to get PDF images for an article
router.get('/pdf_images/:articleId', requireAuth, async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const images = await PdfImage.findAll({
      where: { article_id: articleId },
      order: [['created_at', 'ASC']]
    });
    const imageNames = images.map(img => img.images_name);
    res.json({ images: imageNames });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images', details: err.message });
  }
});

// Hashtags endpoints - require authentication
router.get('/tag/tags', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const tags = await Tag.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] });
    // Count only articles for this user
    const rawCounts = await Tag.sequelize.query(`
      SELECT t.id as tag_id, COUNT(at.article_id) as articleCount
      FROM tags t
      LEFT JOIN article_tags at ON at.tag_id = t.id
      LEFT JOIN articles a ON at.article_id = a.id
      WHERE a.id IS NOT NULL AND at.user_id = :userId
      GROUP BY t.id
    `, {
      type: Tag.sequelize.QueryTypes.SELECT,
      replacements: { userId }
    });
    const countsMap = {};
    rawCounts.forEach(row => {
      countsMap[row.tag_id] = parseInt(row.articleCount, 10) || 0;
    });
    const tagsWithCounts = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      articleCount: countsMap[tag.id] || 0
    }));
    res.json({ tags: tagsWithCounts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tags', details: err.message });
  }
});

router.get('/tag/tags/:id/articles', requireAuth, async (req, res) => {
  const tagId = req.params.id;
  try {
    const userId = req.user.id;
    const atRows = await ArticleTag.findAll({
      where: { tag_id: tagId, user_id: userId },
      attributes: ['article_id'],
    });
    const articleIds = atRows.map(row => row.article_id);
    const articles = await Article.findAll({
      where: { id: articleIds },
      attributes: ['id', 'title', 'summary', 'file_name', 'hashtags', 'userId'],
      order: [['id', 'DESC']]
    });
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles for tag', details: err.message });
  }
});

router.delete('/articles/:id', requireAuth, async (req, res) => {
  const articleId = req.params.id;
  try {
    await ArticleTag.destroy({ where: { article_id: articleId, user_id: req.user.id } });
    const deleted = await Article.destroy({ where: { id: articleId, userId: req.user.id } });
    if (deleted === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article and its tag associations deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete article', details: err.message });
  }
});

export default router;