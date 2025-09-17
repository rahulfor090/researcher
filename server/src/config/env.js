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

  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:5000/v1/auth/linkedin/callback'
  },
  
  paypal: {
    api: process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com',
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    secret: process.env.PAYPAL_SECRET || ''
  },

  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    fromName: process.env.EMAIL_FROM_NAME || 'Research Locker',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || ''
  }
};
