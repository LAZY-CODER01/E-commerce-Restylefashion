const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, // User specified CLOUD_NAME
    api_key: process.env.CLOUD_API_KEY,   // User specified CLOUD_API_KEY
    api_secret: process.env.CLOUD_API_SECRET, // User specified CLOUD_API_SECRET
});

// Configure Multer storage for Cloudinary
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
