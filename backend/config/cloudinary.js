const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME || process.env.cloud_name;
const apiKey =
    process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY || process.env.api_key;
const apiSecret =
    process.env.CLOUDINARY_API_SECRET ||
    process.env.CLOUD_API_SECRET ||
    process.env.api_secret;

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

// Configure Multer to use memory storage (compatible with Vercel serverless functions)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = { cloudinary, upload };

