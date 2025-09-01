import { Router } from 'express';
import { User } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadProfile } from '../middleware/upload.js';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

// PUT /v1/profile
router.put('/', requireAuth, async (req, res) => {
  try {
    uploadProfile(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const updates = { ...req.body };
      
      // If a new file was uploaded, update profile_image
      if (req.file) {
        // Delete old profile picture if it exists
        const user = await User.findByPk(req.user.id);
        if (user.profile_image) {
          const oldPath = path.join('src/uploads/pictures', path.basename(user.profile_image));
          try {
            await fs.unlink(oldPath);
          } catch (error) {
            console.error('Error deleting old profile picture:', error);
          }
        }
        updates.profile_image = req.file.filename;
      }

      await User.update(updates, { where: { id: req.user.id } });
      const updatedUser = await User.findByPk(req.user.id);
      res.json(updatedUser);
    });
  } catch (error) {
    console.error('Profile PUT Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



export default router;