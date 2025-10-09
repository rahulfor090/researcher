import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import passport from 'passport';
import path from 'path'; // Needed for static serving
import './config/passport.js'; // Import passport configuration
import { env } from './config/env.js';
import { syncDb } from './models/index.js';
import authRoutes from './routes/auth.js';
import articleRoutes from './routes/articles.js';
import uploadRoutes from './routes/uploads.js';
import profileRouter from './routes/profile.js';
import authorRoutes from './routes/authors.js';
import tagRouter from './routes/tag.js';
import collectionsRoutes from './routes/collections.js';
import paypalRoutes from './routes/paypal.js'; // Use REST API integration route
import doiReferencesRoutes from './routes/doiReferences.js'; // Import DOI references routes
import publishersRoutes from './routes/publishers.js';

const app = express();

// Enhanced Helmet CSP for Twitter and dev
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'http://localhost:5000', 'http://localhost:5173', 'https://api.twitter.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      frameSrc: ["'self'", 'https://twitter.com']
    }
  }
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
console.log('Allowed CORS origins:', env.corsOrigins);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman / curl
    if (origin && origin.startsWith('chrome-extension://')) return cb(null, true);
    if (origin && env.corsOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS. Origin was: ' + origin));
  },
  credentials: true
}));

app.get('/v1/health', (_, res) => res.json({ ok: true }));

app.use('/v1/auth', authRoutes);
app.use('/v1/articles', articleRoutes);
app.use('/v1/upload', uploadRoutes);
app.use('/v1/profile', profileRouter);
app.use('/v1/authors', authorRoutes);
app.use('/api/authors', authorRoutes); // For backward compatibility if needed
app.use('/v1/tag', tagRouter);
app.use('/v1/collections', collectionsRoutes);
app.use('/v1/doi-references', doiReferencesRoutes); // Add DOI references routes
app.use('/v1/publishers', publishersRoutes);

// PayPal REST API endpoints (create-order and capture-order)
app.use('/v1/paypal', paypalRoutes);

// Serve uploaded files with CORS headers
app.use('/v1/uploads', cors(), express.static('src/uploads'));
app.use('/v1/images', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.resolve('src/uploads/images')));

// If you want this for all image serving routes:
app.use('/images', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.resolve('src/uploads/images')));

// TEMP ARTICLES & TEMP USERS ENDPOINTS
// These endpoints are handled within articleRoutes,
// so you only need to mount the router once at the /v1 path.
// Mounting again at /v1/temp-articles and /v1/temp-users is redundant and
// can cause route conflicts or unexpected behavior.

// Correct setup: Define temp endpoints in articles.js and mount articleRoutes at /v1.

syncDb().then(() => {
  app.listen(env.port, () => console.log(`API on http://localhost:${env.port}`));
}).catch(err => {
  console.error('DB connect failed:', err);
  process.exit(1);
});

export default app; // Export for testing if needed