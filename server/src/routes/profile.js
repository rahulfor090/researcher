import { Router } from 'express';
import { User } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadProfile } from '../middleware/upload.js';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const router = Router();

// GET /v1/profile - return current user's profile
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Profile GET Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /v1/profile/me - return current user's profile (conventional)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Profile GET /me Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// OPTIONS preflight for CORS
router.options('/image/:filename', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

// GET /v1/profile/image/:filename - serve profile image as base64 (no CORS issues)
router.get('/image/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join('src/uploads/pictures', filename);

    // Check if file exists
    try {
      await fs.access(imagePath);
    } catch {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);
    const ext = path.extname(filename).toLowerCase();

    // Convert to base64
    const base64Image = imageBuffer.toString('base64');

    // Determine MIME type
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.webp') mimeType = 'image/webp';

    // Return as JSON with base64 data
    res.json({
      success: true,
      data: `data:${mimeType};base64,${base64Image}`,
      filename: filename
    });
  } catch (error) {
    console.error('Profile image GET Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

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

// POST /v1/profile/change-password
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check previous password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Incorrect previous password' });
    }

    // Check new password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    // Optionally: check password strength here
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password should be at least 6 characters.' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.update({ password: hashedPassword }, { where: { id: user.id } });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;