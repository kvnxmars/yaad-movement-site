import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Storage for images
const upload = multer({ dest: 'uploads/' });

// Settings file path
const SETTINGS_PATH = path.join(process.cwd(), 'site-settings.json');

// Get site settings
app.get('/api/settings', (req, res) => {
  if (fs.existsSync(SETTINGS_PATH)) {
    const data = fs.readFileSync(SETTINGS_PATH, 'utf-8');
    res.json(JSON.parse(data));
  } else {
    res.json({ primaryBg: '#0A0A0A', accentColor: '#FFC300', homepageText: 'Welcome to the site!', artistImages: [] });
  }
});

// Update site settings
app.post('/api/settings', (req, res) => {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

// Upload artist image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Move file to public/images
  const targetPath = path.join(process.cwd(), 'public', 'images', req.file.originalname);
  fs.renameSync(req.file.path, targetPath);
  res.json({ success: true, filename: req.file.originalname, url: `/images/${req.file.originalname}` });
});

// Serve images
app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
