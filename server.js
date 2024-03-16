const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000000, // max file size 1MB 
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error('Only upload files with jpeg, jpg, or png format.'));
    }
    cb(null, true);
  },
});

// Upload image route
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { buffer } = req.file;

    // Upload file to Cloudinary directly from the buffer
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'react-upload-delete' }, // Specify the folder name here
      (error, result) => {
        if (error) {
          console.error('Error while uploading to Cloudinary:', error);
          return res.status(400).json({ error: 'Error while uploading image. Try again later.' });
        }

        // If upload succeeds, send the Cloudinary URL and other details in the response
        res.json({ imageUrl: result.secure_url, publicId: result.public_id });
      }
    ).end(buffer);
  } catch (error) {
    console.error('Error in image upload:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
// Fetch image URLs route
app.get('/images', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      resource_type: 'image',
      type: 'upload', // Specify the resource type as 'upload' for images
      prefix: 'react-upload-delete/', // Specify the folder name as the prefix
      max_results: 500
    });

    const imageUrls = result.resources.map(resource => resource.secure_url);

    res.json({ imageUrls });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Delete image route
app.delete('/delete/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;

    // Delete image from Cloudinary using the public ID
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({ message: 'Image deleted successfully.' });
    } else {
      res.status(400).json({ error: 'Failed to delete image. Please try again later.' });
    }
  } catch (error) {
    console.error('Error in image deletion:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
