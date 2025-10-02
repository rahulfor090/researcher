import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/index.js';

// Middleware for requiring JWT authentication
export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  console.log('Auth header received:', header);
  
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  console.log('Extracted token:', token ? 'exists' : 'missing');
  
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    console.log('JWT payload:', payload);
    
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    console.log('User found:', user.email, 'password_set:', user.password_set);
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT auth error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};