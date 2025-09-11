import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'; // Use bcryptjs for consistency
import jwt from 'jsonwebtoken';
import passport from '../config/passport.js';
import { User } from '../models/index.js';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Registration
router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email in use' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name, email, plan: user.plan } });
  }
);

// Local login (session and JWT)
router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.login(user, (err) => {
        if (err) return res.status(500).json({ error: 'Login failed' });
        const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: '7d' });
        res.json({ message: 'Logged in', token, user: { id: user.id, name: user.name, email, plan: user.plan } });
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }
);

// Twitter authentication routes
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    console.log('Twitter callback successful, user:', req.user);
    console.log('Session:', req.session);
    
    // Generate JWT token for the authenticated user
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      env.jwtSecret,
      { expiresIn: '7d' }
    );
    
    // Redirect to dashboard with token as query parameter
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

// Check auth status (for OAuth flows)
router.get('/status', (req, res) => {
  if (req.user) {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      env.jwtSecret,
      { expiresIn: '7d' }
    );
    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
      },
      token
    });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

// Get current user info (for JWT-authenticated requests)
router.get('/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      plan: req.user.plan,
      profile_image: req.user.profile_image
    }
  });
});

// Google OAuth: start -> redirect to Google
const startGoogle = (req, res) => {
  const clientId = env.google?.clientId;
  const redirectUri = env.google?.redirectUri || `${req.protocol}://${req.get('host')}/v1/auth/oauth/google/callback`;
  const scope = encodeURIComponent('openid email profile');
  const state = encodeURIComponent('nl');
  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;
  return res.redirect(url);
};
router.get('/oauth/google', startGoogle);
router.get('/google', startGoogle);

// Google OAuth: callback -> exchange code, create/login user, redirect with token
const callbackGoogle = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send('Missing code');
    const clientId = env.google?.clientId;
    const clientSecret = env.google?.clientSecret;
    const redirectUri = env.google?.redirectUri || `${req.protocol}://${req.get('host')}/v1/auth/oauth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });
    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) {
      return res.status(400).json({ error: 'Token exchange failed', details: tokenJson });
    }

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` }
    });
    const profile = await userRes.json();

    const email = profile.email;
    const name = profile.name || profile.given_name || 'Google User';
    if (!email) return res.status(400).json({ error: 'No email from Google' });

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ name, email, password: '' });
    }

    const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: '7d' });

    const redirect = new URL(env.webAppUrl + '/dashboard');
    redirect.searchParams.set('token', token);
    redirect.searchParams.set('name', user.name);
    redirect.searchParams.set('email', user.email);
    return res.redirect(redirect.toString());
  } catch (err) {
    console.error('Google OAuth error', err);
    return res.status(500).send('OAuth failed');
  }
};
router.get('/oauth/google/callback', callbackGoogle);
router.get('/google/callback', callbackGoogle);

export default router;