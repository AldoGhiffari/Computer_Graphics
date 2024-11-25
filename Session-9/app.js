const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');

const app = express();
const PORT = 3000;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Serve static files
app.use(express.static('public'));

// Image processing route
app.post('/process', upload.single('image'), async (req, res) => {
  const { option } = req.body;
  const inputPath = req.file.path;
  const outputPath = `./results/processed_${req.file.filename}`;

  try {
    const image = await Jimp.read(inputPath);

    if (option === 'grayscale') {
      image.greyscale(); // Convert to grayscale
    } else if (option === 'blur') {
      image.blur(5); // Apply blur effect
    } else {
      return res.status(400).send('Invalid option selected!');
    }

    await image.writeAsync(outputPath);

    res.json({
      original: `/${req.file.path}`,
      processed: `/${outputPath}`
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('An error occurred while processing the image.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});