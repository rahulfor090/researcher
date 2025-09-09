import { Router } from 'express';
import { Author, Article, ArticleAuthor } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { Op } from 'sequelize';

console.log('🔄 Loading authors route...');

const router = Router();

// Test route to verify authors endpoint is working
router.get('/test', (req, res) => {
  console.log('✅ Authors test route hit!');
  res.json({ message: 'Authors route is working!' });
});

// GET all authors for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    console.log('📋 Fetching authors for user:', req.user.id);
    
    // Simple approach: get all unique authors from articles for this user
    const articles = await Article.findAll({
      where: { 
        userId: req.user.id,
        authors: { [Op.not]: null, [Op.ne]: '' }
      },
      attributes: ['authors']
    });

    // Extract and count unique authors
    const authorCounts = {};
    
    articles.forEach(article => {
      if (article.authors) {
        // Split authors by common delimiters
        const authorNames = article.authors
          .split(/[,;]|\s+and\s+|\s+&\s+/)
          .map(name => name.trim())
          .filter(name => name.length > 0);
        
        authorNames.forEach(name => {
          authorCounts[name] = (authorCounts[name] || 0) + 1;
        });
      }
    });

    // Convert to array format
    const authorsArray = Object.entries(authorCounts).map(([name, count], index) => ({
      id: index + 1,
      name,
      articleCount: count
    }));

    // Sort by name
    authorsArray.sort((a, b) => a.name.localeCompare(b.name));

    console.log('✅ Found authors:', authorsArray.length);
    res.json(authorsArray);
  } catch (err) {
    console.error('❌ Failed to get authors:', err);
    res.status(500).json({ 
      message: 'Failed to get authors', 
      error: String(err?.message || err) 
    });
  }
});

// GET articles by author name (simplified approach)
router.get('/:authorName/articles', requireAuth, async (req, res) => {
  try {
    const { authorName } = req.params;
    const decodedAuthorName = decodeURIComponent(authorName);
    console.log('📚 Fetching articles for author:', decodedAuthorName, 'user:', req.user.id);

    // Find all articles that contain this author name
    const articles = await Article.findAll({
      where: { 
        userId: req.user.id,
        authors: { 
          [Op.like]: `%${decodedAuthorName}%`
        }
      },
      order: [['id', 'DESC']]
    });

    console.log('✅ Found articles for author:', articles.length);
    res.json(articles);
  } catch (err) {
    console.error('❌ Failed to get articles by author:', err);
    res.status(500).json({ 
      message: 'Failed to get articles by author', 
      error: String(err?.message || err) 
    });
  }
});

console.log('🚀 Authors routes loaded');

export default router;