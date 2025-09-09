import express from 'express';
import { Tag } from '../models/index.js';

const router = express.Router();

// GET /tag/all - fetch all tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });
    res.json({ tags });
  } catch (err) {
    console.error('❌ Error fetching tags:', err);
    res.status(500).json({ error: 'Failed to fetch tags', details: err.message });
  }
});

export default router;