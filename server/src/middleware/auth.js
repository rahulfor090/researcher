import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.id };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
