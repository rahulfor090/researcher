import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Article, Author, ArticleAuthor } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Helper function to parse authors string and create/find authors
async function processAuthors(authorsString) {
  if (!authorsString || !authorsString.trim()) {
    return [];
  }

  // Split authors by common delimiters (comma, semicolon, " and ", " & ")
  const authorNames = authorsString
    .split(/[,;]|\s+and\s+|\s+&\s+/)
    .map(name => name.trim())
    .filter(name => name.length > 0);

  const authors = [];
  for (const name of authorNames) {
    // Find or create author
    const [author] = await Author.findOrCreate({
      where: { name },
      defaults: { name }
    });
    authors.push(author);
  }

  return authors;
}

// Helper function to associate authors with article
async function associateAuthors(article, authors) {
  // Remove existing associations
  await ArticleAuthor.destroy({
    where: { article_id: article.id }
  });

  // Create new associations
  for (const author of authors) {
    await ArticleAuthor.create({
      article_id: article.id,
      author_id: author.id
    });
  }
}

// Helper function to get authors for an article as a formatted string
async function getArticleAuthorsString(articleId) {
  const articleAuthors = await ArticleAuthor.findAll({
    where: { article_id: articleId },
    include: [{ model: Author }]
  });

  return articleAuthors.map(aa => aa.Author.name).join(', ');
}

// CREATE
router.post('/',
  requireAuth,
  body('title').notEmpty(),
  body('url').isURL(),
  body('doi').notEmpty().isString(),
  async (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      // Check for existing article with same URL or DOI for this user
      const existing = await Article.findOne({
        where: {
          userId: req.user.id,
          [Op.or]: [
            { url: req.body.url },
            req.body.doi ? { doi: req.body.doi } : null
          ].filter(Boolean)
        }
      });

      if (existing) {
        return res.status(400).json({ message: 'An article with the same URL or DOI already exists' });
      }

      // Create article (including authors in string field for backward compatibility)
      const { authors: authorsString, ...articleData } = req.body;
      const a = await Article.create({ 
        ...articleData, 
        authors: authorsString || '', // Save authors string for backward compatibility
        userId: req.user.id 
      });
      
      // Process and associate authors in relational tables
      if (authorsString) {
        const authors = await processAuthors(authorsString);
        await associateAuthors(a, authors);
      }

      // Return article with authors as string for backward compatibility
      const authorsStr = await getArticleAuthorsString(a.id);
      res.json({ ...a.toJSON(), authors: authorsStr || authorsString || '' });
    } catch (err) {
      console.error('Failed to create article:', err);
      res.status(500).json({ message: 'Failed to create article', error: String(err?.message || err) });
    }
  }
);

// READ (list)
router.get('/', requireAuth, async (req, res) => {
  try {
    const list = await Article.findAll({
      where: { userId: req.user.id },
      order: [['id', 'DESC']]
    });
    
    // Add authors string to each article for backward compatibility
    const articlesWithAuthors = await Promise.all(
      list.map(async (article) => {
        const authorsStr = await getArticleAuthorsString(article.id);
        return { ...article.toJSON(), authors: authorsStr || article.authors || '' };
      })
    );
    
    res.json(articlesWithAuthors);
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
    
    // Add authors string for backward compatibility
    const authorsStr = await getArticleAuthorsString(article.id);
    res.json({ ...article.toJSON(), authors: authorsStr || article.authors || '' });
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
  body('doi').notEmpty().isString(),
  async (req, res) => {
    try {
      const errors = validationResult(req); 
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { id } = req.params;

      // Check if another article (different id) has the same URL or DOI for this user
      /*const existing = await Article.findOne({
        where: {
          userId: req.user.id,
          id: { [Op.ne]: id },
          [Op.or]: [
            { url: req.body.url },
            req.body.doi ? { doi: req.body.doi } : null
          ].filter(Boolean)
        }
      });

      if (existing) {
        return res.status(400).json({ message: 'Another article with the same URL or DOI already exists' });
      }*/

      // Separate authors from other data
      const { authors: authorsString, ...articleData } = req.body;
      
      // Update article including authors string field
      const [updated] = await Article.update(
        { 
          ...articleData,
          authors: authorsString !== undefined ? authorsString : undefined // Only update if provided
        },
        { where: { id, userId: req.user.id } }
      );
      if (!updated) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      // Update relational authors if provided
      if (authorsString !== undefined) {
        const authors = await processAuthors(authorsString);
        await associateAuthors({ id }, authors);
      }
      
      const updatedArticle = await Article.findOne({ where: { id, userId: req.user.id } });
      const authorsStr = await getArticleAuthorsString(id);
      res.json({ ...updatedArticle.toJSON(), authors: authorsStr || updatedArticle.authors || '' });
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
      const authorsStr = await getArticleAuthorsString(id);
      res.json({ ...updatedArticle.toJSON(), authors: authorsStr || updatedArticle.authors || '' });
    } catch (err) {
      console.error('Failed to update file_name:', err);
      res.status(500).json({ message: 'Failed to update file_name', error: String(err?.message || err) });
    }
  }
);

// SEARCH - Search articles by title, authors, or other fields
router.get('/search/:query', requireAuth, async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = `%${query}%`;
    
    // Search in articles by title, doi, summary, hashtags
    const articleResults = await Article.findAll({
      where: {
        userId: req.user.id,
        [Op.or]: [
          { title: { [Op.like]: searchTerm } },
          { doi: { [Op.like]: searchTerm } },
          { summary: { [Op.like]: searchTerm } },
          { hashtags: { [Op.like]: searchTerm } }
        ]
      },
      order: [['id', 'DESC']]
    });
    
    // Search by author names
    const authorResults = await Article.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Author,
        as: 'authorList',
        where: {
          name: { [Op.like]: searchTerm }
        },
        through: { attributes: [] }
      }],
      order: [['id', 'DESC']]
    });
    
    // Combine and deduplicate results
    const allResults = [...articleResults, ...authorResults];
    const uniqueResults = allResults.filter((article, index, self) => 
      index === self.findIndex(a => a.id === article.id)
    );
    
    // Add authors string to each result
    const resultsWithAuthors = await Promise.all(
      uniqueResults.map(async (article) => {
        const authorsStr = await getArticleAuthorsString(article.id);
        return { ...article.toJSON(), authors: authorsStr || article.authors || '' };
      })
    );
    
    res.json(resultsWithAuthors);
  } catch (err) {
    console.error('Failed to search articles:', err);
    res.status(500).json({ message: 'Failed to search articles', error: String(err?.message || err) });
  }
});

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
