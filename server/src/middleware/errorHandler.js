// Custom error class for application-specific errors
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Utility to determine if error is trusted (operational) or not
const isTrustedError = (error) => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};

// Handle 404 Not Found
export function notFound(req, res, next) {
  const isDev = process.env.NODE_ENV !== 'production';
  const message = isDev ? `Route ${req.originalUrl} not found` : 'Not found';
  const error = new AppError(message, 404);
  next(error);
}

// Map common Sequelize errors to HTTP status/messages
function mapSequelizeError(err) {
  const name = err?.name || '';
  if (name === 'SequelizeValidationError') {
    return { statusCode: 400, message: err.errors?.map(e => e.message).join(', ') || 'Validation error' };
  }
  if (name === 'SequelizeUniqueConstraintError') {
    return { statusCode: 409, message: 'Duplicate value violates unique constraint' };
  }
  if (name === 'SequelizeForeignKeyConstraintError') {
    return { statusCode: 409, message: 'Related resource not found (foreign key constraint)' };
  }
  if (name === 'SequelizeDatabaseError') {
    return { statusCode: 500, message: 'Database error' };
  }
  return null;
}

// Central error handling middleware
export function errorHandler(err, req, res, next) {
  // Defaults
  let statusCode = err.statusCode || err.status || 500;
  let errorMessage = err.message || 'Something went wrong';

  // Prefer Sequelize mappings if present
  const sequelizeMapped = mapSequelizeError(err);
  if (sequelizeMapped) {
    statusCode = sequelizeMapped.statusCode;
    errorMessage = sequelizeMapped.message;
  }

  // JWT-related errors (if used)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorMessage = 'Invalid token. Please log in again';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorMessage = 'Your token has expired. Please log in again';
  }

  // Structured logging (do not leak secrets)
  const logData = {
    timestamp: new Date().toISOString(),
    level: statusCode >= 500 ? 'error' : 'warn',
    status: statusCode,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    message: errorMessage,
    correlationId: req.headers['x-correlation-id'] || 'not-set',
    userId: req.user?.id || 'anonymous',
    errorName: err.name,
    trusted: isTrustedError(err),
  };
  const logLine = JSON.stringify(logData);
  if (statusCode >= 500) console.error(logLine); else console.warn(logLine);

  // Build safe response
  const isDev = process.env.NODE_ENV !== 'production';
  const payload = {
    success: false,
    status: statusCode,
    message: errorMessage,
  };
  if (isDev) {
    payload.errorName = err.name;
    // Intentionally omit stack from client responses to avoid leaking paths
  }

  // In production, mask only 5xx messages, but keep the original status code
  if (!isDev && statusCode >= 500) {
    payload.message = 'Internal server error';
  }

  // Rate limit error special case (commonly sets status 429)
  if (err.status === 429) {
    payload.message = 'Too many requests. Please try again later';
    payload.retryAfter = err.retryAfter || 60;
  }

  // Content negotiation: return HTML for browsers, JSON for API clients
  const wants = req.accepts(['html', 'json']);
  if (wants === 'html') {
    // Determine where the "Go Home" button should send users.
    // Prefer an explicit FRONTEND_URL env var, otherwise infer from headers.
    const inferredOrigin = getOriginFromHeaders(req.headers);
    const homeHref = process.env.FRONTEND_URL || inferredOrigin || '/';
    const title = `${statusCode} ${payload.status >= 500 ? 'Server Error' : 'Error'}`;
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root { color-scheme: light dark; }
      body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; display: grid; place-items: center; min-height: 100vh; background: #0b1020; color: #e6e8ee; }
      .card { max-width: 720px; padding: 32px; border-radius: 16px; background: rgba(255,255,255,0.06); backdrop-filter: blur(6px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
      .code { font-size: 56px; font-weight: 800; letter-spacing: -1px; margin: 0 0 8px; background: linear-gradient(135deg,#7aa2ff, #00d4ff); -webkit-background-clip: text; background-clip: text; color: transparent; }
      .msg { font-size: 18px; margin: 0 0 16px; opacity: 0.9; }
      .meta { font-size: 14px; opacity: 0.7; }
      a.btn { display: inline-block; margin-top: 18px; padding: 10px 14px; border-radius: 10px; background: #2b5cff; color: white; text-decoration: none; }
    </style>
  </head>
  <body>
    <main class="card" role="main" aria-live="polite">
      <h1 class="code">${statusCode}</h1>
      <p class="msg">${payload.message}</p>
      <p class="meta">Path: ${escapeHtml(req.originalUrl || '/')}<br/>Method: ${escapeHtml(req.method || '')}</p>
      <a class="btn" href="${escapeHtml(homeHref)}">Go Home</a>
    </main>
  </body>
</html>`;
    return res.status(statusCode).type('html').send(html);
  }

  return res.status(statusCode).json(payload);
}

// Async handler wrapper to eliminate try-catch blocks
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global process level error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, consider initiating a graceful shutdown:
  // server.close(() => process.exit(1));
  // setTimeout(() => process.exit(1), 10000);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // In production, consider initiating a graceful shutdown:
  // setTimeout(() => process.exit(1), 10000);
});

// Basic HTML escaping for safe interpolation
function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// Best-effort origin inference from headers
function getOriginFromHeaders(headers = {}) {
  try {
    const ref = headers.referer || headers.referrer || headers.origin;
    if (!ref) return process.env.FRONTEND_URL || null;
    const url = new URL(ref);
    return `${url.protocol}//${url.host}`;
  } catch {
    return process.env.FRONTEND_URL || null;
  }
}