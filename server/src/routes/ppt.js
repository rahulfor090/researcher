console.log('ppt.js router loaded');
import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { promisify } from 'util';
import { Article } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
import child_process from 'child_process';
const execFile = promisify(child_process.execFile);

const router = express.Router();
const pptUploadDir = path.resolve('src/uploads/ppts');

if (!fs.existsSync(pptUploadDir)) {
  fs.mkdirSync(pptUploadDir, { recursive: true });
}

function findTemplatePpt(dir) {
  const candidates = ['template.pptx', 'template.ppt', 'example.pptx', 'example.ppt'];
  for (const name of candidates) {
    const p = path.join(dir, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// try multiple python executables (Windows/unix)
async function runPythonScript(scriptPath, payloadPath, options = {}) {
  const candidates = process.platform === 'win32' ? ['py', 'python', 'python3'] : ['python3', 'python', 'py'];
  let lastErr = null;
  for (const exe of candidates) {
    try {
      const args = (exe === 'py' && process.platform === 'win32') ? ['-3', scriptPath, payloadPath] : [scriptPath, payloadPath];
      const execOptions = { timeout: 120000, ...options };
      const { stdout, stderr } = await execFile(exe, args, execOptions);
      return { stdout, stderr, exe };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

router.post('/', requireAuth, async (req, res) => {
  const articleId = req.query.id;
  if (!articleId) return res.status(400).json({ error: 'Article id is required' });

  try {
    const article = await Article.findByPk(articleId);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    if (!article.file_name) return res.status(404).json({ error: 'Article file not found' });
    if (!article.summary || article.summary.trim() === '') {
      return res.status(400).json({ error: 'No summary generated for this article.' });
    }

    const baseName = path.basename(article.file_name, path.extname(article.file_name));
    const pptFileName = `${Date.now()}.pptx`;
    const pptFilePath = path.join(pptUploadDir, pptFileName);

    console.log(`Generating PPTX for articleId: ${articleId}, pptFilePath: ${pptFilePath}`);

    const templatePpt = findTemplatePpt(pptUploadDir);
    if (!templatePpt) {
      return res.status(500).json({ error: 'Template PPTX not found in uploads/ppts folder' });
    }

    // Write payload with the full summary text (the Python script will parse it)
    const payload = {
      templatePath: templatePpt,
      outputPath: pptFilePath,
      title: baseName,
      summary: article.summary
    };

    const tmpDir = os.tmpdir();
    const payloadPath = path.join(tmpDir, `ppt_payload_${Date.now()}.json`);
    await fs.promises.writeFile(payloadPath, JSON.stringify(payload, null, 2), 'utf8');

    const pythonScript = path.resolve('src/scripts/generatePPT.py');
    if (!fs.existsSync(pythonScript)) {
      try { await fs.promises.unlink(payloadPath); } catch (e) {}
      return res.status(500).json({ 
        error: 'Python helper missing', 
        details: pythonScript + ' not found' 
      });
    }

    try {
      console.log('Calling Python helper to populate template from summary...');
      const { stdout, stderr, exe } = await runPythonScript(pythonScript, payloadPath);
      console.log(`Python (${exe}) stdout:`, stdout);
      if (stderr) console.warn('Python stderr:', stderr);
      
      try { await fs.promises.unlink(payloadPath); } catch (e) {}
      
      if (!fs.existsSync(pptFilePath)) {
        return res.status(500).json({ error: 'PPT generation failed: output not found' });
      }
      
      return res.json({
        message: 'PPTX generated from template successfully.',
        pptFileName,
        pptFilePath: path.relative(process.cwd(), pptFilePath)
      });
    } catch (pyErr) {
      console.error('Python helper failed:', pyErr);
      try { await fs.promises.unlink(payloadPath); } catch (e) {}
      const details = (pyErr && pyErr.stderr) ? String(pyErr.stderr) : 
                      (pyErr && pyErr.message) ? pyErr.message : String(pyErr);
      return res.status(500).json({ 
        error: 'Failed to generate PPT using template', 
        details 
      });
    }

  } catch (err) {
    console.error('Failed to generate PPT:', err);
    res.status(500).json({ 
      error: 'Failed to generate PPT', 
      details: err.message 
    });
  }
});

export default router;