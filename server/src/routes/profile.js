import { Router } from 'express';
import { User } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /v1/profile
router.get('/', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// PUT /v1/profile
router.put('/', requireAuth, async (req, res) => {
  const fields = [
    'name', 'email', 'phone_number', 'profile_image', 'gender', 'university',
    'department', 'program', 'year_of_study', 'research_area', 'research_interests',
    'publications', 'linkedin_url', 'google_scholar_url', 'orcid_id', 'bio', 'skills'
  ];
  const updates = {};
  for (const field of fields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  await User.update(updates, { where: { id: req.user.id } });
  const user = await User.findById(req.user.id);
  res.json(user);
});

export default router;