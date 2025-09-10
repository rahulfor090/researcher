import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { env } from '../config/env.js';
import passport from '../config/passport.js'; // Import from config file

const router = Router();

router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email in use' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name, email, plan: user.plan } });
  });

router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email, plan: user.plan } });
  });

// Twitter OAuth routes
router.get('/twitter', 
  passport.authenticate('twitter')
);

router.get('/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login?error=twitter_auth_failed' }),
  async (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const token = jwt.sign(
        { id: req.user.id, email: req.user.email },
        env.jwtSecret,
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5000'}/auth/success?token=${token}`);
    } catch (error) {
      console.error('Twitter callback error:', error);
      res.redirect('/login?error=auth_error');
    }
  }
);

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

export default router;
