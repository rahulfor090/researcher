import { Router } from 'express';
import { DoiReference } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Test endpoint to check if route is working
router.get('/test', (req, res) => {
  res.json({ message: 'DOI References route is working!', timestamp: new Date() });
});

// POST - Save DOI references
router.post('/', requireAuth, async (req, res) => {
  try {
    console.log('DOI References POST request received:', {
      body: req.body,
      user: req.user?.id
    });
    
    const { doi, references } = req.body;

    if (!doi) {
      console.log('Missing DOI in request');
      return res.status(400).json({ message: 'DOI is required' });
    }

    // Clean the DOI
    const cleanDoi = doi.replace(/^https?:\/\/doi\.org\//, '');
    console.log('Cleaned DOI:', cleanDoi);

    // Check if DOI already exists
    const existingDoi = await DoiReference.findOne({
      where: { doi: cleanDoi }
    });

    if (existingDoi) {
      console.log('DOI already exists in database:', cleanDoi);
      // DOI already exists, don't insert anything
      return res.json({ 
        message: 'DOI already exists, references not updated',
        existing: true 
      });
    }

    // Convert references to JSON string
    const referencesJson = references ? JSON.stringify(references) : null;
    console.log('References to save:', references ? `${references.length} references` : 'No references');

    // Create new DOI reference entry
    const doiReference = await DoiReference.create({
      doi: cleanDoi,
      reference: referencesJson,
      createdAt: new Date()
    });

    console.log('Successfully created DOI reference:', doiReference.id);

    res.json({
      message: 'DOI references saved successfully',
      id: doiReference.id,
      existing: false,
      referencesCount: references ? references.length : 0
    });

  } catch (err) {
    console.error('Failed to save DOI references:', err);
    res.status(500).json({ 
      message: 'Failed to save DOI references',
      error: String(err?.message || err)
    });
  }
});

// GET - Get DOI references by DOI
router.get('/:doi', requireAuth, async (req, res) => {
  try {
    const { doi } = req.params;
    const cleanDoi = doi.replace(/^https?:\/\/doi\.org\//, '');

    const doiReference = await DoiReference.findOne({
      where: { doi: cleanDoi }
    });

    if (!doiReference) {
      return res.status(404).json({ message: 'DOI references not found' });
    }

    // Parse references JSON
    let references = null;
    if (doiReference.reference) {
      try {
        references = JSON.parse(doiReference.reference);
      } catch (parseError) {
        console.error('Failed to parse references JSON:', parseError);
        references = null;
      }
    }

    res.json({
      id: doiReference.id,
      doi: doiReference.doi,
      references: references,
      createdAt: doiReference.createdAt
    });

  } catch (err) {
    console.error('Failed to get DOI references:', err);
    res.status(500).json({ 
      message: 'Failed to get DOI references',
      error: String(err?.message || err)
    });
  }
});

// GET - List all DOI references (for admin purposes)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const { rows: doiReferences, count } = await DoiReference.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    // Parse references for each entry
    const processedReferences = doiReferences.map(ref => {
      let references = null;
      if (ref.reference) {
        try {
          references = JSON.parse(ref.reference);
        } catch (parseError) {
          references = null;
        }
      }
      
      return {
        id: ref.id,
        doi: ref.doi,
        references: references,
        createdAt: ref.createdAt
      };
    });

    res.json({
      data: processedReferences,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (err) {
    console.error('Failed to list DOI references:', err);
    res.status(500).json({ 
      message: 'Failed to list DOI references',
      error: String(err?.message || err)
    });
  }
});

export default router;