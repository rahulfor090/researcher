import express from 'express';
import { Tag, Article } from '../models/index.js';
import { Sequelize } from 'sequelize';

const router = express.Router();

// GET /tag/tags - fetch all tags with articleCount
router.get('/tags', async (req, res) => {
  try {
    // Get tags with article count using a LEFT JOIN and GROUP BY
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
          through: { attributes: [] }
        }
      ],
      group: ['Tag.id'],
      order: [['name', 'ASC']]
    });

    // Convert articleCount to integer for each tag (Sequelize returns it as a string)
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

// GET /tag/:id/articles - fetch articles for a given tag id
router.get('/:id/articles', async (req, res) => {
  const tagId = req.params.id;
  try {
    const tag = await Tag.findByPk(tagId, {
      include: [{
        model: Article,
        attributes: ['id', 'title', 'doi', 'authors'],
        through: { attributes: [] } // exclude junction table attributes
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