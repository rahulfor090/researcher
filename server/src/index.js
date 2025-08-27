import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { env } from './config/env.js';
import { syncDb } from './models/index.js';
import authRoutes from './routes/auth.js';
import articleRoutes from './routes/articles.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// CORS: allow dev web app + extension
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman / curl
    if (origin.startsWith('chrome-extension://')) return cb(null, true);
    if (env.corsOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  }
}));

// Temporary article-saving endpoint (move to articleRoutes.js later)
app.post('/v1/articles', async (req, res) => {
  const { title, url, authors, doi, notes } = req.body;

  try {
    const query = 'INSERT INTO articles (title, url, authors, doi, notes, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
    pool.query(query, [title, url, authors || null, doi || null, notes || null], (err, results) => {
      if (err) {
        console.error('Error adding article:', err.stack);
        return res.status(500).send('Error adding article');
      }
      res.status(201).send('Article added successfully');
    });
  } catch (error) {
    console.error('Error processing request:', error.stack);
    res.status(500).send('Error processing request');
  }
});

app.get('/v1/health', (_, res) => res.json({ ok: true }));
app.use('/v1/auth', authRoutes);
app.use('/v1/articles', articleRoutes);

syncDb().then(() => {
  app.listen(env.port, () => console.log(`API on http://localhost:${env.port}`));
}).catch(err => {
  console.error('DB connect failed:', err);
  process.exit(1);
});