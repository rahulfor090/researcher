import { Router } from 'express';
import { Author, Article, ArticleAuthor } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = Router();

// GET all authors for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    // Get all authors that have articles associated with the current user
    const authors = await Author.findAll({
      include: [{
        model: ArticleAuthor,
        include: [{
          model: Article,
          where: { userId: req.user.id },
          attributes: ['id', 'title']
        }],
        required: true // Only include authors that have articles
      }],
      order: [['name', 'ASC']]
    });

    // Transform the data to include article count
    const authorsWithCount = authors.map(author => ({
      id: author.id,
      name: author.name,
      articleCount: author.ArticleAuthors?.length || 0,
      articles: author.ArticleAuthors?.map(aa => aa.Article) || []
    }));

    res.json(authorsWithCount);
  } catch (err) {
    console.error('Failed to get authors:', err);
    res.status(500).json({ 
      message: 'Failed to get authors', 
      error: String(err?.message || err) 
    });
  }
});

// GET articles by author ID
router.get('/:authorId/articles', requireAuth, async (req, res) => {
  try {
    const { authorId } = req.params;

    // Get all articles by this author for the current user
    const articleAuthors = await ArticleAuthor.findAll({
      where: { author_id: authorId },
      include: [{
        model: Article,
        where: { userId: req.user.id },
        attributes: ['id', 'title', 'authors', 'journal', 'doi', 'url', 'purchaseDate', 'price', 'tags', 'summary', 'hashtags']
      }]
    });

    const articles = articleAuthors.map(aa => aa.Article);

    res.json(articles);
  } catch (err) {
    console.error('Failed to get articles by author:', err);
    res.status(500).json({ 
      message: 'Failed to get articles by author', 
      error: String(err?.message || err) 
    });
  }
});

export default router;