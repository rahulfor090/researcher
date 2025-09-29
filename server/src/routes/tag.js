import express from 'express';
import { Tag, Article } from '../models/index.js';
import { Sequelize } from 'sequelize';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /tag/tags - fetch all tags with articleCount (only for logged-in user)
router.get('/tags', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    // Only include articles for this user!
    const tags = await Tag.findAll({
      attributes: [
        'id',
        'name',
        [Sequelize.fn('COUNT', Sequelize.col('Articles.id')), 'articleCount']
      ],
      include: [
        {
          model: Article,
          attributes: [],
          where: { userId }, // <--- restrict by logged-in user
          through: { attributes: [] }
        }
      ],
      group: ['Tag.id'],
      order: [['name', 'ASC']]
    });

    const tagsWithCount = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      articleCount: parseInt(tag.get('articleCount'), 10) || 0
    }));

    res.json({ tags: tagsWithCount });
  } catch (err) {
    console.error('❌ Error fetching tags:', err);
    res.status(500).json({ error: 'Failed to fetch tags', details: err.message });
  }
});

// GET /tag/tags/:id/articles - fetch articles for a given tag id (only for logged-in user)
router.get('/tags/:id/articles', requireAuth, async (req, res) => {
  const tagId = req.params.id;
  try {
    const userId = req.user.id;
    const tag = await Tag.findByPk(tagId, {
      include: [{
        model: Article,
        attributes: ['id', 'title', 'doi', 'authors', 'summary', 'file_name', 'hashtags', 'userId'],
        where: { userId }, // <--- restrict by logged-in user
        through: { attributes: [] }
      }]
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ articles: tag.Articles });
  } catch (err) {
    console.error('❌ Error fetching articles for tag:', err);
    res.status(500).json({ error: 'Failed to fetch articles', details: err.message });
  }
});

export default router;