import { Router } from 'express';
import { Publisher, Article, ArticlePublisher } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { Op, Sequelize } from 'sequelize';

const router = Router();

// Get all publishers with article count for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    console.log('🔍 Publishers API called by user:', req.user.id);
    const userId = req.user.id;
    
    // Get all publishers
    const publishers = await Publisher.findAll({
      order: [['name', 'ASC']]
    });

    console.log('📚 Found publishers:', publishers.length);

    // Calculate article count for each publisher for this user
    const publishersData = await Promise.all(
      publishers.map(async (publisher) => {
        // Count articles for this publisher that belong to the current user
        const articleCount = await ArticlePublisher.count({
          include: [
            {
              model: Article,
              where: { userId },
              required: true
            }
          ],
          where: { publisher_id: publisher.id }
        });

        console.log(`📊 Publisher "${publisher.name}" has ${articleCount} articles for user ${userId}`);

        return {
          id: publisher.id,
          name: publisher.name,
          createdAt: publisher.createdAt,
          updatedAt: publisher.updatedAt,
          articleCount: articleCount
        };
      })
    );

    res.json({ data: publishersData });
  } catch (error) {
    console.error('❌ Error in publishers API:', error);
    res.status(500).json({ error: 'Failed to fetch publishers', details: error.message });
  }
});

// Get publisher by ID with articles
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const publisher = await Publisher.findByPk(id, {
      include: [{
        model: Article,
        as: 'articles',
        where: { userId: req.user.id },
        required: false,
        attributes: ['id', 'title', 'doi', 'url', 'journal', 'year', 'createdAt']
      }]
    });

    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }

    res.json(publisher);
  } catch (error) {
    console.error('Error fetching publisher:', error);
    res.status(500).json({ error: 'Failed to fetch publisher' });
  }
});

// Get articles for a specific publisher
router.get('/:id/articles', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const publisher = await Publisher.findByPk(id);

    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }

    const articles = await Article.findAll({
      include: [{
        model: Publisher,
        as: 'publishers',
        where: { id },
        through: { attributes: [] }
      }],
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      publisher: publisher.name,
      count: articles.length,
      articles
    });
  } catch (error) {
    console.error('Error fetching articles for publisher:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Create or get publisher
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Publisher name is required' });
    }

    const [publisher, created] = await Publisher.findOrCreate({
      where: { name: name.trim() },
      defaults: { name: name.trim() }
    });

    res.status(created ? 201 : 200).json(publisher);
  } catch (error) {
    console.error('Error creating publisher:', error);
    res.status(500).json({ error: 'Failed to create publisher' });
  }
});

// Update publisher
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Publisher name is required' });
    }

    const publisher = await Publisher.findByPk(id);

    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }

    // Check if another publisher with the same name exists
    const existing = await Publisher.findOne({
      where: {
        name: name.trim(),
        id: { [Op.ne]: id }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Publisher with this name already exists' });
    }

    await publisher.update({ name: name.trim() });
    res.json(publisher);
  } catch (error) {
    console.error('Error updating publisher:', error);
    res.status(500).json({ error: 'Failed to update publisher' });
  }
});

// Delete publisher
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const publisher = await Publisher.findByPk(id);

    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }

    // Delete associated article_publishers entries (cascade should handle this)
    await ArticlePublisher.destroy({ where: { publisher_id: id } });
    
    await publisher.destroy();
    res.json({ message: 'Publisher deleted successfully' });
  } catch (error) {
    console.error('Error deleting publisher:', error);
    res.status(500).json({ error: 'Failed to delete publisher' });
  }
});

// Add publisher to article
router.post('/article/:articleId', requireAuth, async (req, res) => {
  try {
    const { articleId } = req.params;
    const { publisherName } = req.body;

    if (!publisherName || !publisherName.trim()) {
      return res.status(400).json({ error: 'Publisher name is required' });
    }

    // Verify article belongs to user
    const article = await Article.findOne({
      where: { id: articleId, userId: req.user.id }
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Find or create publisher
    const [publisher] = await Publisher.findOrCreate({
      where: { name: publisherName.trim() },
      defaults: { name: publisherName.trim() }
    });

    // Check if association already exists
    const existing = await ArticlePublisher.findOne({
      where: { article_id: articleId, publisher_id: publisher.id }
    });

    if (existing) {
      return res.json({ message: 'Publisher already associated with article', publisher });
    }

    // Create association
    await ArticlePublisher.create({
      article_id: articleId,
      publisher_id: publisher.id
    });

    res.json({ message: 'Publisher added to article', publisher });
  } catch (error) {
    console.error('Error adding publisher to article:', error);
    res.status(500).json({ error: 'Failed to add publisher to article' });
  }
});

// Remove publisher from article
router.delete('/article/:articleId/publisher/:publisherId', requireAuth, async (req, res) => {
  try {
    const { articleId, publisherId } = req.params;

    // Verify article belongs to user
    const article = await Article.findOne({
      where: { id: articleId, userId: req.user.id }
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Remove association
    const deleted = await ArticlePublisher.destroy({
      where: { article_id: articleId, publisher_id: publisherId }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Association not found' });
    }

    res.json({ message: 'Publisher removed from article' });
  } catch (error) {
    console.error('Error removing publisher from article:', error);
    res.status(500).json({ error: 'Failed to remove publisher from article' });
  }
});

// Search publishers
router.get('/search/:query', requireAuth, async (req, res) => {
  try {
    const { query } = req.params;
    const publishers = await Publisher.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`
        }
      },
      order: [['name', 'ASC']],
      limit: 20
    });

    res.json(publishers);
  } catch (error) {
    console.error('Error searching publishers:', error);
    res.status(500).json({ error: 'Failed to search publishers' });
  }
});

export default router;
