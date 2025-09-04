import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Article } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// CREATE
router.post('/',
  requireAuth,
  body('title').notEmpty(),
  body('url').isURL(),
  async (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const a = await Article.create({ ...req.body, userId: req.user.id });
    res.json(a);
  }
);

// READ (list)
router.get('/', requireAuth, async (req, res) => {
  try {
    const list = await Article.findAll({
      where: { userId: req.user.id },
      order: [['id', 'DESC']]
    });
    res.json(list);
  } catch (err) {
    console.error('Failed to list articles:', err);
    res.status(500).json({
      message: 'Failed to list articles',
      error: String(err?.message || err),
      name: err?.name,
      code: err?.original?.code || err?.parent?.code,
      sqlMessage: err?.original?.sqlMessage || err?.parent?.sqlMessage,
      sql: err?.sql || err?.original?.sql || err?.parent?.sql
    });
  }
});

// READ (single article by ID)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findOne({
      where: { id, userId: req.user.id }
    });
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    console.error('Failed to get article:', err);
    res.status(500).json({ message: 'Failed to get article', error: String(err?.message || err) });
  }
});

// UPDATE (edit)
router.put('/:id',
  requireAuth,
  body('title').notEmpty(),
  body('url').isURL(),
  async (req, res) => {
    try {
      const errors = validationResult(req); 
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { id } = req.params;
      const [updated] = await Article.update(
        { ...req.body },
        { where: { id, userId: req.user.id } }
      );
      if (!updated) {
        return res.status(404).json({ message: 'Article not found' });
      }
      const updatedArticle = await Article.findOne({ where: { id, userId: req.user.id } });
      res.json(updatedArticle);
    } catch (err) {
      console.error('Failed to update article:', err);
      res.status(500).json({ message: 'Failed to update article', error: String(err?.message || err) });
    }
  }
);

// PATCH route to update only the file_name field
router.patch('/:id/file-name',
  requireAuth,
  body('file_name').notEmpty().withMessage('file_name is required'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { id } = req.params;
      const { file_name } = req.body;

      const [updated] = await Article.update(
        { file_name },
        { where: { id, userId: req.user.id } }
      );

      if (!updated) {
        return res.status(404).json({ message: 'Article not found' });
      }

      const updatedArticle = await Article.findOne({ where: { id, userId: req.user.id } });
      res.json(updatedArticle);
    } catch (err) {
      console.error('Failed to update file_name:', err);
      res.status(500).json({ message: 'Failed to update file_name', error: String(err?.message || err) });
    }
  }
);

// DELETE
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Article.destroy({
      where: { id, userId: req.user.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json({ message: 'Article deleted' });
  } catch (err) {
    console.error('Failed to delete article:', err);
    res.status(500).json({ message: 'Failed to delete article', error: String(err?.message || err) });
  }
});

export default router;
