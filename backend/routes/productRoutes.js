const express = require("express");
const Product = require("../models/Product");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const { buildUserPayload } = require("../utils/userPayload");
const fs = require("fs");
const { cloudinary, upload } = require("../config/cloudinary");

const router = express.Router();

// --- Seed data (matches frontend mockData.js) ---
const SEED_PRODUCTS = [
    {
        title: "Vintage Denim Jacket",
        status: "active",
        price: 1299,
        originalPrice: 3999,
        discount: 67,
        brand: "Levi's",
        category: "vintage",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80",
        ],
        condition: "Excellent",
        description: "Classic vintage Levi's denim jacket. Perfect fade and fit.",
        details: { fabric: "100% Cotton", fit: "Regular", care: "Machine Wash" },
        rating: 4.5,
        ratingCount: 128,
    },
    {
        title: "Oversized Formal Blazer",
        status: "active",
        price: 850,
        originalPrice: 1500,
        discount: 43,
        brand: "Zara",
        category: "formals",
        imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
        ],
        condition: "New without tags",
        description: "Elegant oversized blazer for a professional yet trendy look.",
        details: { fabric: "Polyester Blend", fit: "Oversized", care: "Dry Clean Only" },
        rating: 4.3,
        ratingCount: 76,
    },
    {
        title: "Silk Slip Dress",
        status: "active",
        price: 600,
        brand: "Réalisation Par",
        category: "streetwear",
        imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80"],
        condition: "Gently Used",
        description: "Beautiful silk slip dress in a vibrant pattern.",
        details: { fabric: "100% Silk", fit: "Slim", care: "Hand Wash" },
        rating: 4.7,
        ratingCount: 92,
    },
    {
        title: "Chunky Loafers",
        status: "active",
        price: 1200,
        brand: "Prada",
        category: "footwear",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"],
        condition: "Gently Used",
        description: "High-quality chunky loafers that add an edge to any outfit.",
        details: { fabric: "Leather", fit: "True to size", care: "Wipe clean" },
        rating: 4.6,
        ratingCount: 54,
    },
    {
        title: "Ribbed Knit Top",
        status: "active",
        price: 250,
        brand: "H&M",
        category: "streetwear",
        imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80"],
        condition: "Good",
        description: "Comfortable ribbed knit top for everyday wear.",
        details: { fabric: "Cotton Blend", fit: "Tight", care: "Machine Wash" },
        rating: 4.2,
        ratingCount: 38,
    },
    {
        title: "Graphic Tee",
        status: "active",
        price: 150,
        brand: "Vintage",
        category: "vintage",
        imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"],
        condition: "Vintage",
        description: "Cool graphic tee with a retro vibe.",
        details: { fabric: "100% Cotton", fit: "Loose", care: "Machine Wash" },
        rating: 4.0,
        ratingCount: 29,
    },
];

// @route   POST /api/products/seed
// @desc    Seed database with mock product data
// @access  Public (for initial setup)
router.post("/seed", async (req, res) => {
    try {
        const count = await Product.countDocuments();
        if (count > 0) {
            return res.json({ message: "Database already seeded", count });
        }
        const products = await Product.insertMany(SEED_PRODUCTS);
        res.status(201).json({
            message: `Seeded ${products.length} products successfully`,
            count: products.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/products
// @desc    Get all products with optional filters
// @access  Public
router.get("/", async (req, res) => {
    try {
        const { category, search, page = 1, limit = 20 } = req.query;
        const query = { 
            status: { $in: ["active", "approved"] },
            sellerVacationMode: { $ne: true }
        };

        // Category filter
        if (category && category !== "all") {
            query.category = category.toLowerCase();
        }

        // Search filter (title or brand)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [products, total] = await Promise.all([
            Product.find(query)
                .populate("seller", "fullName avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Product.countDocuments(query),
        ]);

        res.json({
            products,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/products/seller/me
// @desc    Get logged-in seller's products
// @access  Private (Seller/Admin)
router.get("/seller/me", protect, authorize("Seller", "Admin"), async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/products/my-listings
// @desc    All listings for the authenticated seller (dashboard)
// @access  Private (any logged-in user — filtered by seller id)
router.get("/my-listings", protect, async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/products/admin/pending
// @desc    Get all products pending admin approval
// @access  Private (Admin only)
router.get("/admin/pending", protect, authorize("Admin"), async (req, res) => {
    try {
        const { status = "pending" } = req.query;
        const filter =
            status === "active"
                ? { status: { $in: ["active", "approved"] } }
                : { status };
        const products = await Product.find(filter)
            .populate("seller", "fullName email businessName sellerType avatar")
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PATCH /api/products/admin/:id/status
// @desc    Approve or reject a product listing
// @access  Private (Admin only)
router.patch("/admin/:id/status", protect, authorize("Admin"), async (req, res) => {
    try {
        let { status } = req.body;
        if (status === "approved") status = "active";
        if (!["active", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate("seller", "fullName email");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: `Product ${status} successfully`, product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            "seller",
            "fullName avatar followersCount"
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Get similar products (same category, different ID)
        const similarProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
            status: { $in: ["active", "approved"] },
            sellerVacationMode: { $ne: true },
        }).limit(4);

        // Get active listings count
        const listingsCount = await Product.countDocuments({
            seller: product.seller._id,
            status: { $in: ["active", "approved"] },
        });

        const productObj = product.toObject();
        productObj.seller.products = listingsCount;

        res.json({ ...productObj, similarProducts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/products
// @desc    Create a new product with image upload
// @access  Private (Seller/Admin)
router.post(
    "/",
    protect,
    authorize("Seller", "Admin"),
    upload.array("images", 5),

    async (req, res) => {
        const uploadedFiles = req.files || [];
        const imageUrls = [];

        try {
            const {
                title,
                price,
                originalPrice,
                discount,
                brand,
                category,
                condition,
                description,
                fabric,
                fit,
                care,
                sizes,
                sizeInventory,
                colors,
                socialMediaName,
                businessName,
                onboardingSellerType,
                onboardingBusinessName,
                onboardingInstagramId,
            } = req.body;

            const currentUser = await User.findById(req.user._id);
            if (!currentUser) {
                return res.status(401).json({ message: "User not found" });
            }

            const userUpdates = {};
            const isAdmin = currentUser.role === "Admin";

            if (!isAdmin && !currentUser.hasCompletedSellerSetup) {
                const st = onboardingSellerType ? String(onboardingSellerType).trim() : "";
                const existingType =
                    currentUser.sellerType && String(currentUser.sellerType).trim();

                if (st) {
                    userUpdates.sellerType = st;
                    userUpdates.businessName =
                        onboardingBusinessName !== undefined && onboardingBusinessName !== null
                            ? String(onboardingBusinessName).trim()
                            : "";
                    userUpdates.instagramId =
                        onboardingInstagramId !== undefined && onboardingInstagramId !== null
                            ? String(onboardingInstagramId).trim()
                            : "";
                    userUpdates.hasCompletedSellerSetup = true;
                    userUpdates.role = "Seller";
                    userUpdates.sellerProfileStatus = "pending";
                    userUpdates.sellerStatus = "pending";
                } else if (existingType) {
                    userUpdates.hasCompletedSellerSetup = true;
                    if (currentUser.role !== "Admin" && currentUser.role !== "Seller") {
                        userUpdates.role = "Seller";
                    }
                } else {
                    return res.status(400).json({ message: "Seller onboarding is required before listing." });
                }
            }

            if (Object.keys(userUpdates).length) {
                await User.findByIdAndUpdate(req.user._id, { $set: userUpdates });
            }

            // Upload files to Cloudinary manually from memory buffer
            if (uploadedFiles.length > 0) {
                for (const file of uploadedFiles) {
                    try {
                        const secureUrl = await new Promise((resolve, reject) => {
                            const uploadStream = cloudinary.uploader.upload_stream(
                                {
                                    folder: "restyle-products",
                                    transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
                                },
                                (error, result) => {
                                    if (error) return reject(error);
                                    resolve(result.secure_url);
                                }
                            );
                            uploadStream.end(file.buffer);
                        });
                        imageUrls.push(secureUrl);
                    } catch (uploadErr) {
                        console.error("Cloudinary Upload Error Details:", uploadErr);
                        const errMsg = uploadErr.message || uploadErr.error?.message || "Unknown Cloudinary Error";
                        throw new Error(`Cloudinary upload failed: ${errMsg}`);
                    }
                }
            }

            const product = await Product.create({
                title,
                price: parseFloat(price),
                originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
                discount: discount ? parseInt(discount) : 0,
                brand,
                category,
                condition,
                description,
                socialMediaName: socialMediaName ? String(socialMediaName).trim() : "",
                businessName:
                    businessName !== undefined && businessName !== null
                        ? String(businessName).trim()
                        : "",
                details: { fabric, fit, care },
                images: imageUrls,
                imageUrl: imageUrls[0] || "",
                sizes: sizes ? (typeof sizes === "string" ? JSON.parse(sizes) : sizes) : (sizeInventory ? (typeof sizeInventory === "string" ? JSON.parse(sizeInventory) : sizeInventory).map(s => s.size) : []),
                sizeInventory: sizeInventory ? (typeof sizeInventory === "string" ? JSON.parse(sizeInventory) : sizeInventory) : [],
                colors: colors ? (typeof colors === "string" ? JSON.parse(colors) : colors) : [],
                seller: req.user._id,
                status: "pending",
            });

            const freshUser = await User.findById(req.user._id);
            res.status(201).json({
                product,
                user: buildUserPayload(freshUser),
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;
