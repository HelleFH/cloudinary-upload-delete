const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const multer = require('multer');

const PORT = 10000;


const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

const corsOptions = {
  origin: ['http://localhost:8080', 'https://cloudinary-upload-delete.onrender.com', '*'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


const upload = multer({
  storage: multer.memoryStorage(), 
  limits: {
    fileSize: 100000000, // max file size 10MB 
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
    const crypto = require('crypto');

    function generateDeletionToken() {
      // Generate a random token using crypto module
      const randomBytes = crypto.randomBytes(32); 
      const token = randomBytes.toString('hex'); 
      return token;
    }

    // Generate a delete token
    const deleteToken = generateDeletionToken();

    // Upload file to Cloudinary directly from the buffer with folder
    const result = await cloudinary.uploader.upload_stream(
      { 
        resource_type: 'auto', 
        folder: 'cloudinary-upload-delete', // Specify your folder name here
        context: { delete_token: deleteToken } 
      }, 
      (error, result) => {
        if (error) {
          console.error('Error while uploading to Cloudinary:', error);
          return res.status(400).json({ error: 'Error while uploading image. Try again later.' });
        }

        // If upload succeeds, send the Cloudinary URL and other details in the response
        res.json({ 
          imageUrl: result.secure_url, 
          publicId: result.public_id, 
          deleteToken: deleteToken 
        });
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
      prefix: 'cloudinary-upload-delete/', // Specify your folder name here
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
app.delete('/delete-image/:publicId', async (req, res) => {
  const { publicId } = req.params;

  try {
    console.log('Deleting image with public ID:', publicId);

    const deletionOptions = { invalidate: true, type: 'upload', resource_type: 'image' };
    const result = await cloudinary.uploader.destroy(`cloudinary-upload-delete/${publicId}`, deletionOptions);
    console.log('Cloudinary deletion result:', result);

    res.json({ message: 'Image deleted from Cloudinary successfully' });
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    res.status(500).json({ error: 'Failed to delete image from Cloudinary' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});