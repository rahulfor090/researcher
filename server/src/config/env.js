import 'dotenv/config';

export const env = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASS || process.env.DB_PASSWORD || 'hellosir@9958_',
    name: process.env.DB_NAME || process.env.DATABASE || 'research',
    port: process.env.DB_PORT || 3306
  },
  sessionSecret: process.env.SESSION_SECRET || 'your-secret-key', // Change this!
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY, // API Key
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET, // API Secret Key
    callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:5000/v1/auth/twitter/callback'
  },
  corsOrigins: (
    process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
      : ['http://localhost:5173', 'chrome-extension://your-extension-id']
  )
};