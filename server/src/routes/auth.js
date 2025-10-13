import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'; // Use bcryptjs for consistency
import jwt from 'jsonwebtoken';
import passport from '../config/passport.js';
import { User, TempUser, TempArticle, Article, Author, ArticleAuthor } from '../models/index.js';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';
import emailService from '../services/emailService.js';

const router = Router();

// Registration
router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('tempUserId').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password, tempUserId } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email in use' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: '7d' });

    // If tempUserId provided, migrate temp articles
    let migratedTemp = false;
    if (tempUserId) {
      try {
        // Migrate temp articles to the new user
        const tempArticles = await TempArticle.findAll({ where: { tempUserId } });
        let migratedCount = 0;
        for (const tempArt of tempArticles) {
          // Check for duplicate by URL/DOI for this user
          const existingArt = await Article.findOne({
            where: {
              userId: user.id,
              [Op.or]: [
                { url: tempArt.url },
                tempArt.doi ? { doi: tempArt.doi } : null
              ].filter(Boolean)
            }
          });
          if (!existingArt) {
            // Normalize authors for real articles
            const names = tempArt.authors ? tempArt.authors.split(',').map(a => a.trim()) : [];
            const authorsStringForLegacy = names.join(', ');

            // Create Article
            const created = await Article.create({
              ...tempArt.toJSON(),
              authors: authorsStringForLegacy,
              userId: user.id,
              tempUserId: undefined,
              id: undefined
            });

            // Upsert authors and link without duplicates
            if (names.length > 0) {
              for (const name of names) {
                const [author] = await Author.findOrCreate({ where: { name }, defaults: { name } });
                await ArticleAuthor.findOrCreate({ where: { article_id: created.id, author_id: author.id } });
              }
            }
            migratedCount++;
          }
        }
        await TempArticle.destroy({ where: { tempUserId } });
        await TempUser.destroy({ where: { tempUserId } });
        migratedTemp = migratedCount > 0;
      } catch (err) {
        console.error("Failed to migrate temp articles after registration:", err);
      }
    }

    res.json({
      token,
      user: { id: user.id, name, email, plan: user.plan },
      migratedTemp
    });
  }
);

// Local login (session and JWT)
router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  body('tempUserId').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password, tempUserId } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.login(user, async (err) => {
        if (err) return res.status(500).json({ error: 'Login failed' });
        const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: '7d' });

        // If tempUserId provided, migrate temp articles
        let migratedTemp = false;
        if (tempUserId) {
          try {
            // Migrate temp articles to the main user
            const tempArticles = await TempArticle.findAll({ where: { tempUserId } });
            let migratedCount = 0;
            for (const tempArt of tempArticles) {
              // Check for duplicate by URL/DOI for this user
              const existingArt = await Article.findOne({
                where: {
                  userId: user.id,
                  [Op.or]: [
                    { url: tempArt.url },
                    tempArt.doi ? { doi: tempArt.doi } : null
                  ].filter(Boolean)
                }
              });
              if (!existingArt) {
                // Normalize authors for real articles
                const names = tempArt.authors ? tempArt.authors.split(',').map(a => a.trim()) : [];
                const authorsStringForLegacy = names.join(', ');

                // Create Article
                const created = await Article.create({
                  ...tempArt.toJSON(),
                  authors: authorsStringForLegacy,
                  userId: user.id,
                  tempUserId: undefined,
                  id: undefined
                });

                // Upsert authors and link without duplicates
                if (names.length > 0) {
                  for (const name of names) {
                    const [author] = await Author.findOrCreate({ where: { name }, defaults: { name } });
                    await ArticleAuthor.findOrCreate({ where: { article_id: created.id, author_id: author.id } });
                  }
                }
                migratedCount++;
              }
            }
            await TempArticle.destroy({ where: { tempUserId } });
            await TempUser.destroy({ where: { tempUserId } });
            migratedTemp = migratedCount > 0;
          } catch (err) {
            console.error("Failed to migrate temp articles after login:", err);
          }
        }

        res.json({
          message: 'Logged in',
          token,
          user: { id: user.id, name: user.name, email, plan: user.plan },
          migratedTemp
        });
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }
);


// Twitter authentication routes
// Alias to support /oauth/twitter start URL (keeps login/register links consistent)
router.get('/oauth/twitter', (req, res) => {
  return res.redirect(302, '/v1/auth/twitter');
});
router.get('/twitter', (req, res, next) => {
  // Ensure session is initialized and a state value is set
  req.session.oauthState = Math.random().toString(36).slice(2);
  next();
}, passport.authenticate('twitter'));
router.get('/twitter/callback',
  (req, res, next) => {
    if (!req.session) {
      return res.redirect('http://localhost:5173/login?error=no_session');
    }
    next();
  },
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
    
    // Check if user needs to set password (OAuth users who haven't set one)
    const needsPasswordSetup = !req.user.password_set && req.user.twitterId;
    
    // Redirect to set-password or dashboard with token as query parameter
    const redirectUrl = needsPasswordSetup 
      ? `http://localhost:5173/set-password?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}&oauth=twitter`
      : `http://localhost:5173/dashboard?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`;
    
    res.redirect(redirectUrl);
  }
);

// LinkedIn authentication with enhanced debugging
router.get('/oauth/linkedin', (req, res) => {
  return res.redirect(302, '/v1/auth/linkedin');
});
router.get('/linkedin', (req, res) => {
  const timestamp = Date.now();
  const randomState = Math.random().toString(36).substring(7);

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const callbackUrl = process.env.LINKEDIN_CALLBACK_URL;

  console.log('=== LinkedIn OAuth Init ===');
  console.log('Client ID:', clientId);
  console.log('Redirect URI:', callbackUrl);

  if (!clientId || !callbackUrl) {
    console.error('Missing LINKEDIN_CLIENT_ID or LINKEDIN_CALLBACK_URL in environment variables');
    return res.status(500).send('Server misconfigured for LinkedIn OAuth');
  }

  const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('state', `${randomState}_${timestamp}`);

  console.log('LinkedIn Auth URL (decoded):', authUrl.toString());
  res.redirect(authUrl.toString());
});
router.get('/linkedin/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    console.log('=== LinkedIn Callback ===');
    console.log('Query:', req.query);

    if (error) {
      console.error('LinkedIn OAuth Error:', error);
      console.error('Error Description:', error_description);
      return res.redirect(`http://localhost:5173/login?error=${encodeURIComponent(error)}&description=${encodeURIComponent(error_description || '')}`);
    }

    if (!code) {
      console.error('No authorization code received');
      return res.redirect('http://localhost:5173/login?error=no_code');
    }

    const callbackUrl = process.env.LINKEDIN_CALLBACK_URL;
    console.log('Using Redirect URI for token exchange:', callbackUrl);

    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: callbackUrl,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    });

    console.log('Token Request Params:', Object.fromEntries(tokenParams.entries()));

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams,
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', tokenResponse.status, errorText);
      return res.redirect(`http://localhost:5173/login?error=token_exchange_failed&token_status=${tokenResponse.status}&body=${encodeURIComponent(errorText)}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      console.error('No access token received:', tokenData);
      return res.redirect('http://localhost:5173/login?error=no_access_token');
    }

    // Fetch LinkedIn userinfo
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    let linkedinId, name, userEmail, profileImage;

    if (!profileResponse.ok) {
      console.error('Profile fetch failed:', profileResponse.status, await profileResponse.text());
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
    let user = await User.findOne({ where: { linkedinId } });
    if (!user) {
      user = await User.findOne({ where: { email: userEmail } });
      if (user) {
        await user.update({
          linkedinId,
          linkedinToken: accessToken,
          profile_image: profileImage || user.profile_image
        });
      } else {
        user = await User.create({
          name,
          email: userEmail,
          password: null,
          linkedinId,
          linkedinToken: accessToken,
          profile_image: profileImage || null,
          password_set: false
        });
      }
    } else {
      await user.update({
        linkedinToken: accessToken,
        name: name,
        email: userEmail,
        profile_image: profileImage || user.profile_image
      });
    }

    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const needsPasswordSetup = !user.password_set && user.linkedinId;
    const redirectUrl = needsPasswordSetup
      ? `http://localhost:5173/set-password?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&oauth=linkedin`
      : `http://localhost:5173/dashboard?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`;

    res.redirect(redirectUrl);

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
      profile_image: req.user.profile_image,
      password_set: req.user.password_set !== false // Default to true for existing users
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
      user = await User.create({ 
        name, 
        email, 
        password: null, // OAuth users start without password
        googleId: profile.sub,
        password_set: false // Flag that password needs to be set
      });
    } else {
      // Update existing user with Google ID if not set
      if (!user.googleId) {
        await user.update({ googleId: profile.sub });
      }
    }

    if (!env.jwtSecret) {
      return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET missing' });
    }
    const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: '7d' });

    // Check if user needs to set password (OAuth users who haven't set one)
    const needsPasswordSetup = !user.password_set && user.googleId;
    
    const redirect = new URL(env.webAppUrl + (needsPasswordSetup ? '/set-password' : '/dashboard'));
    redirect.searchParams.set('token', token);
    redirect.searchParams.set('name', user.name);
    redirect.searchParams.set('email', user.email);
    if (needsPasswordSetup) {
      redirect.searchParams.set('oauth', 'google');
    }
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

// Set password for OAuth users
router.post('/set-password',
  requireAuth,
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { password } = req.body;
    
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if user is OAuth user who needs to set password
      if (user.password_set) {
        return res.status(400).json({ message: 'Password already set' });
      }
      
      // Hash and set the password
      const hashedPassword = await bcrypt.hash(password, 10);
      await user.update({ 
        password: hashedPassword, 
        password_set: true 
      });
      
      res.json({ 
        success: true, 
        message: 'Password set successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          password_set: true
        }
      });
    } catch (error) {
      console.error('Set password error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;