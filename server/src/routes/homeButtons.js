import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { HomeButton } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public: list buttons, optionally filter by position
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.position) where.position = req.query.position;
    const items = await HomeButton.findAll({ where, order: [['id', 'ASC']] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load home buttons', error: String(err?.message || err) });
  }
});

// Create
router.post('/',
  requireAuth,
  body('name').notEmpty(),
  body('position').isIn(['header', 'footer']),
  async (req, res) => {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const item = await HomeButton.create({ name: req.body.name, position: req.body.position });
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: 'Failed to create home button', error: String(err?.message || err) });
    }
  }
);

// Update
router.put('/:id',
  requireAuth,
  body('name').optional().notEmpty(),
  body('position').optional().isIn(['header', 'footer']),
  async (req, res) => {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const [updated] = await HomeButton.update(req.body, { where: { id: req.params.id } });
      if (!updated) return res.status(404).json({ message: 'Not found' });
      const item = await HomeButton.findByPk(req.params.id);
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update home button', error: String(err?.message || err) });
    }
  }
);

// Delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await HomeButton.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete home button', error: String(err?.message || err) });
  }
});

export default router;


