import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Article } from '../models/index.js'; // Adjust path as needed

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

router.post('/pdf', upload.single('pdf'), async (req, res) => {
  const articleId = req.query.id;
  if (!articleId) return res.status(400).json({ error: 'Article id is required' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    // Update both file_name and summary columns in DB
    const [updated] = await Article.update(
      { 
        file_name: req.file.filename,
        summary: req.file.filename// Save filename in summary as well
      },
      { where: { id: articleId } }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'File uploaded and article updated', filename: req.file.filename });
  } catch (err) {
    console.error('DB update error:', err);
    res.status(500).json({ error: 'Database update failed' });
  }
});

export default router;
