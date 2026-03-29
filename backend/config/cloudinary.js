const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config(); // Force load env variables to prevent missing credential
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use memory storage (compatible with Vercel serverless functions)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = { cloudinary, upload };

