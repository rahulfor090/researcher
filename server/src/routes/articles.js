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
  const list = await Article.findAll({
    where: { userId: req.user.id },
    order: [['id', 'DESC']]
  });
  res.json(list);
});

// READ (single article by ID)  <--- ADD THIS ROUTE
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const article = await Article.findOne({
    where: { id, userId: req.user.id }
  });
  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }
  res.json(article);
});

// UPDATE (edit)
router.put('/:id',
  requireAuth,
  body('title').notEmpty(),
  body('url').isURL(),
  async (req, res) => {
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
  }
);

// DELETE
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const deleted = await Article.destroy({
    where: { id, userId: req.user.id }
  });
  if (!deleted) {
    return res.status(404).json({ message: 'Article not found' });
  }
  res.json({ message: 'Article deleted' });
});

export default router;
