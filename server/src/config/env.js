import 'dotenv/config';

export const env = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,

  // Frontend app URL (for PayPal return/cancel, redirects, etc.)
  webAppUrl: process.env.WEB_APP_URL || 'http://localhost:5173',
  frontendBaseUrl: process.env.FRONTEND_BASE_URL || process.env.WEB_APP_URL || 'http://localhost:5173',

  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASS || process.env.DB_PASSWORD || 'hellosir@9958_',
    name: process.env.DB_NAME || process.env.DATABASE || 'research',
    port: process.env.DB_PORT || 3306
  },

  sessionSecret: process.env.SESSION_SECRET || 'your-secret-key',

  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:5000/v1/auth/twitter/callback'
  },

  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
    : ['https://researchlocker.co', 'http://localhost:5173', 'chrome-extension://your-extension-id'],

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_CALLBACK_URL || ''
  },

  paypal: {
    api: process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com',
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    secret: process.env.PAYPAL_SECRET || ''
  }
};
