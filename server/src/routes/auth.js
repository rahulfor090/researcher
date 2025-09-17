import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'; // Use bcryptjs for consistency
import jwt from 'jsonwebtoken';
import passport from '../config/passport.js';
import { User } from '../models/index.js';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';
import emailService from '../services/emailService.js';

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

// LinkedIn authentication routes - force fresh login each time
router.get('/linkedin', (req, res) => {
  // Generate unique state and add timestamp to force fresh auth
  const timestamp = Date.now();
  const randomState = Math.random().toString(36).substring(7);
  
  // Build LinkedIn authorization URL manually with force re-auth parameters
  const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', process.env.LINKEDIN_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', process.env.LINKEDIN_CALLBACK_URL);
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('state', `${randomState}_${timestamp}`);
  authUrl.searchParams.set('prompt', 'login'); // Force login
  authUrl.searchParams.set('max_age', '0'); // Force fresh authentication
  
  res.redirect(authUrl.toString());
});
router.get('/linkedin/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      console.error('No authorization code received');
      return res.redirect('http://localhost:5173/login?error=no_code');
    }
    
    console.log('LinkedIn callback received code:', code);
    console.log('State:', state);
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.LINKEDIN_CALLBACK_URL,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
    });
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenResponse.status, await tokenResponse.text());
      return res.redirect('http://localhost:5173/login?error=token_exchange_failed');
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    console.log('LinkedIn Access Token received');
    
    // Use the same profile fetching logic from passport strategy
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    let linkedinId, name, userEmail, profileImage;
    
    if (!profileResponse.ok) {
      console.error('Profile fetch failed:', profileResponse.status, await profileResponse.text());
      // Fallback to token-based ID
      linkedinId = Buffer.from(accessToken.substring(0, 20)).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
      name = 'LinkedIn User';
      userEmail = `linkedin_${linkedinId}@linkedin.local`;
      profileImage = null;
    } else {
      const profileData = await profileResponse.json();
      console.log('LinkedIn Profile Data:', profileData);
      
      linkedinId = profileData.sub || profileData.id;
      name = profileData.name || `${profileData.given_name || ''} ${profileData.family_name || ''}`.trim() || 'LinkedIn User';
      userEmail = profileData.email || `${linkedinId}@linkedin.local`;
      profileImage = profileData.picture;
    }
    
    // Find or create user
    const { User } = await import('../models/index.js');
    const bcrypt = await import('bcryptjs');
    
    let user = await User.findOne({ where: { linkedinId } });
    if (!user) {
      const password = await bcrypt.default.hash(Math.random().toString(36).slice(-8), 10);
      user = await User.create({
        name,
        email: userEmail,
        password,
        linkedinId,
        linkedinToken: accessToken,
        profile_image: profileImage || null
      });
    } else {
      await user.update({ 
        linkedinToken: accessToken,
        name: name,
        email: userEmail,
        profile_image: profileImage || user.profile_image
      });
    }
    
    // Generate JWT token for the authenticated user
    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('LinkedIn authentication successful for user:', user.name);
    
    // Redirect to dashboard with token as query parameter
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    res.redirect('http://localhost:5173/login?error=callback_failed');
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    // Clear session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session destruction failed' });
      }
      // Clear session cookie
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// GET logout for backward compatibility
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session destruction failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
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

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'Server misconfigured: Google OAuth env missing', missing: { clientId: !clientId, clientSecret: !clientSecret } });
    }

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

    if (!env.jwtSecret) {
      return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET missing' });
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

// Forgot Password
router.post('/forgot-password',
  body('email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { email } = req.body;
    
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Email does not match for the existing user' });
      }

      // Generate reset token
      const resetToken = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, { expiresIn: '1h' });
      
      // Create reset URL
      const resetUrl = `${env.webAppUrl}/reset-password?token=${resetToken}`;
      
      console.log('=== PASSWORD RESET REQUEST ===');
      console.log(`User: ${user.name} (${user.email})`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('============================');
      
      // Send password reset email
      const emailResult = await emailService.sendPasswordResetEmail(user.email, user.name, resetUrl);
      
      if (!emailResult.success) {
        console.error('Email sending failed:', emailResult.error);
        return res.status(500).json({ 
          message: 'Failed to send password reset email. Please try again later.' 
        });
      }
      
      console.log(`✅ Password reset email sent to ${user.email}`);
      
      res.json({ 
        message: 'Password reset link has been sent to your email address. Please check your inbox.',
        // For development - include the reset URL in response (remove in production)
        resetUrl: env.nodeEnv === 'development' ? resetUrl : undefined
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Reset Password
router.post('/reset-password',
  body('token').notEmpty(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { token, password } = req.body;
    
    try {
      // Verify the reset token
      const decoded = jwt.verify(token, env.jwtSecret);
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }
      
      // Hash the new password
      const hash = await bcrypt.hash(password, 10);
      
      // Update user's password
      await user.update({ password: hash });
      
      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Test Email Endpoint (for development only)
router.post('/test-email', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ message: 'Endpoint not available in production' });
  }

  try {
    const result = await emailService.testEmail();
    
    if (result.success) {
      res.json({ 
        message: 'Test email sent successfully!',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to send test email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      message: 'Test email failed',
      error: error.message
    });
  }
});

export default router;