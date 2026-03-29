const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
    try {
        const { fullName, email, mobile, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Create user
        const user = await User.create({
            fullName,
            email,
            mobile,
            password,
            role: role || "User",
        });

        // Return user data with token
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Return user data with token
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
    try {
        res.json({
            _id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            mobile: req.user.mobile,
            role: req.user.role,
            avatar: req.user.avatar,
            createdAt: req.user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/auth/seller-profile
// @desc    Save seller onboarding profile and upgrade role to Seller
// @access  Private
router.put("/seller-profile", protect, async (req, res) => {
    try {
        const { sellerType, businessName, instagramId, pincode } = req.body;

        const updateFields = {};
        if (sellerType !== undefined) updateFields.sellerType = sellerType;
        if (businessName !== undefined) updateFields.businessName = businessName;
        if (instagramId !== undefined) updateFields.instagramId = instagramId;
        if (pincode !== undefined) updateFields.pincode = pincode;

        // Upgrade role to Seller when details are provided
        if (businessName || pincode) {
            updateFields.role = "Seller";
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            avatar: user.avatar,
            sellerType: user.sellerType,
            businessName: user.businessName,
            instagramId: user.instagramId,
            pincode: user.pincode,
            sellerStatus: user.sellerStatus,
            isSellerVerified: user.isSellerVerified,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

