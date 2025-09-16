import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Collection, CollectionMaster, Article, User } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /collections - Get all collections for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Article,
          as: 'articles',
          attributes: ['id', 'title'],
          through: { attributes: [] } // Don't include junction table data
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      collections: collections.map(collection => ({
        id: collection.id,
        collection_name: collection.collection_name,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        articleCount: collection.articles ? collection.articles.length : 0
      }))
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Failed to fetch collections' });
  }
});

// POST /collections - Create a new collection
router.post('/', 
  requireAuth,
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Collection name is required')
      .isLength({ max: 255 })
      .withMessage('Collection name must be less than 255 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name } = req.body;

      // Check if collection with same name already exists for this user
      const existingCollection = await Collection.findOne({
        where: { 
          userId: req.user.id,
          collection_name: name
        }
      });

      if (existingCollection) {
        return res.status(400).json({ 
          message: 'A collection with this name already exists' 
        });
      }

      const collection = await Collection.create({
        userId: req.user.id,
        collection_name: name
      });

      res.status(201).json({
        message: 'Collection created successfully',
        collection: {
          id: collection.id,
          collection_name: collection.collection_name,
          createdAt: collection.createdAt,
          updatedAt: collection.updatedAt,
          articleCount: 0
        }
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      res.status(500).json({ message: 'Failed to create collection' });
    }
  }
);

// GET /collections/:id - Get a specific collection with its articles
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id // Ensure user owns this collection
      },
      include: [
        {
          model: Article,
          as: 'articles',
          attributes: ['id', 'title', 'summary', 'url', 'doi', 'createdAt'],
          through: { attributes: [] }
        }
      ]
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json({
      collection: {
        id: collection.id,
        collection_name: collection.collection_name,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        articles: collection.articles || []
      }
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ message: 'Failed to fetch collection' });
  }
});

// PUT /collections/:id - Update collection name
router.put('/:id',
  requireAuth,
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Collection name is required')
      .isLength({ max: 255 })
      .withMessage('Collection name must be less than 255 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name } = req.body;

      const collection = await Collection.findOne({
        where: { 
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }

      // Check if another collection with the same name exists
      const existingCollection = await Collection.findOne({
        where: { 
          userId: req.user.id,
          collection_name: name,
          id: { [Op.ne]: req.params.id }
        }
      });

      if (existingCollection) {
        return res.status(400).json({ 
          message: 'A collection with this name already exists' 
        });
      }

      collection.collection_name = name;
      await collection.save();

      res.json({
        message: 'Collection updated successfully',
        collection: {
          id: collection.id,
          collection_name: collection.collection_name,
          createdAt: collection.createdAt,
          updatedAt: collection.updatedAt
        }
      });
    } catch (error) {
      console.error('Error updating collection:', error);
      res.status(500).json({ message: 'Failed to update collection' });
    }
  }
);

// DELETE /collections/:id - Delete a collection and all its assignments
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Delete all collection-article assignments first
    await CollectionMaster.destroy({
      where: { collection_id: req.params.id }
    });

    // Delete the collection
    await collection.destroy();

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ message: 'Failed to delete collection' });
  }
});

// POST /collections/:id/articles - Assign articles to a collection
router.post('/:id/articles',
  requireAuth,
  [
    body('articleIds')
      .isArray({ min: 1 })
      .withMessage('Article IDs must be a non-empty array')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { articleIds } = req.body;

      // Verify collection exists and belongs to user
      const collection = await Collection.findOne({
        where: { 
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }

      // Verify all articles exist and belong to user
      const articles = await Article.findAll({
        where: { 
          id: articleIds,
          userId: req.user.id
        }
      });

      if (articles.length !== articleIds.length) {
        return res.status(400).json({ 
          message: 'Some articles not found or do not belong to you' 
        });
      }

      // Create collection-article assignments (ignore duplicates)
      const assignments = [];
      for (const articleId of articleIds) {
        try {
          const [assignment, created] = await CollectionMaster.findOrCreate({
            where: {
              collection_id: req.params.id,
              article_id: articleId
            },
            defaults: {
              collection_id: req.params.id,
              article_id: articleId
            }
          });
          if (created) {
            assignments.push(assignment);
          }
        } catch (error) {
          // Skip duplicates (unique constraint violations)
          if (error.name !== 'SequelizeUniqueConstraintError') {
            throw error;
          }
        }
      }

      res.json({
        message: `${assignments.length} articles assigned to collection`,
        assignedCount: assignments.length,
        totalRequested: articleIds.length
      });
    } catch (error) {
      console.error('Error assigning articles to collection:', error);
      res.status(500).json({ message: 'Failed to assign articles to collection' });
    }
  }
);

// DELETE /collections/:id/articles/:articleId - Remove article from collection
router.delete('/:id/articles/:articleId', requireAuth, async (req, res) => {
  try {
    // Verify collection belongs to user
    const collection = await Collection.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const deleted = await CollectionMaster.destroy({
      where: {
        collection_id: req.params.id,
        article_id: req.params.articleId
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ 
        message: 'Article not found in this collection' 
      });
    }

    res.json({ message: 'Article removed from collection successfully' });
  } catch (error) {
    console.error('Error removing article from collection:', error);
    res.status(500).json({ message: 'Failed to remove article from collection' });
  }
});

// GET /collections/:id/available-articles - Get articles available to add to collection
router.get('/:id/available-articles', requireAuth, async (req, res) => {
  try {
    // Verify collection belongs to user
    const collection = await Collection.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Get articles that are NOT in this collection
    const availableArticles = await Article.findAll({
      where: {
        userId: req.user.id,
        id: {
          [Op.notIn]: {
            [Op.any]: await CollectionMaster.findAll({
              where: { collection_id: req.params.id },
              attributes: ['article_id']
            }).then(records => records.map(r => r.article_id))
          }
        }
      },
      attributes: ['id', 'title', 'summary', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      articles: availableArticles
    });
  } catch (error) {
    console.error('Error fetching available articles:', error);
    res.status(500).json({ message: 'Failed to fetch available articles' });
  }
});

export default router;