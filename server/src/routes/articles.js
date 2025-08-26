import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Article } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/',
  requireAuth,
  body('title').notEmpty(),
  body('url').isURL(),
  async (req, res) => {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const a = await Article.create({ ...req.body, userId: req.user.id });
    res.json(a);
  });

router.get('/', requireAuth, async (req, res) => {
  const list = await Article.findAll({
    where: { userId: req.user.id },
    order: [['id', 'DESC']]
  });
  res.json(list);
});

export default router;
