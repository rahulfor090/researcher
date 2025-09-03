import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { env } from './config/env.js';
import { syncDb } from './models/index.js';
import authRoutes from './routes/auth.js';
import articleRoutes from './routes/articles.js';
import uploadRoutes from './routes/uploads.js';
import profileRouter from './routes/profile.js';
import summary from "./routes/summary.js";

const app = express();


app.use(express.json({ limit: '10mb' }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS: allow dev web app + extension
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman / curl
    if (origin.startsWith('chrome-extension://')) return cb(null, true);
    if (env.corsOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  }
}));
app.get('/v1/health', (_, res) => res.json({ ok: true }));
app.use('/v1/auth', authRoutes);
app.use('/v1/articles', articleRoutes);
app.use('/v1/upload', uploadRoutes);
app.use('/v1/profile', profileRouter);
app.use('/v1/summary', summary);
app.use('/uploads', express.static('src/uploads'));

syncDb().then(() => {
  app.listen(env.port, () => console.log(`API on http://localhost:${env.port}`));
}).catch(err => {
  console.error('DB connect failed:', err);
  process.exit(1);
});
