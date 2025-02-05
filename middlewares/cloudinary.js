const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig'); // Path to your cloudinary config

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'justVkey product Images', // Cloudinary folder to store images
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed file types
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage });

module.exports = upload;
