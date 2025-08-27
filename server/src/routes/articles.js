import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Article } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST endpoint to create a new article
router.post(
  '/',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('url').isURL().withMessage('Valid URL is required'),
    body('authors').optional().trim(),
    body('doi').optional().trim(),
    body('notes').optional().trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array()); // Log for debugging
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const articleData = {
        ...req.body,
        userId: req.user.id,
        createdAt: new Date() // Explicitly set if needed; Sequelize handles by default
      };
      const article = await Article.create(articleData);
      console.log('Article created:', article.id); // Log success for debugging
      res.status(201).json(article);
    } catch (error) {
      console.error('Error creating article:', error); // Log full error
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ errors: error.errors });
      } else if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Article with this URL already exists' });
      }
      res.status(500).json({ error: 'Error creating article' });
    }
  }
);

// GET endpoint to retrieve user's articles
router.get('/', requireAuth, async (req, res) => {
  try {
    const list = await Article.findAll({
      where: { userId: req.user.id },
      order: [['id', 'DESC']]
    });
    console.log('Articles fetched:', list.length); // Log for debugging
    res.json(list);
  } catch (error) {
    console.error('Error fetching articles:', error); // Log full error
    res.status(500).json({ error: 'Error fetching articles' });
  }
});

export default router;