const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Multer to use memory storage (compatible with Vercel serverless functions)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = { cloudinary, upload };

