const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { buildUserPayload } = require("../utils/userPayload");

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

        res.status(201).json({
            ...buildUserPayload(user),
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

        res.json({
            ...buildUserPayload(user),
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
        res.json(buildUserPayload(req.user));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/auth/seller-profile
// @desc    Save seller onboarding profile and upgrade role to Seller
// @access  Private
router.put("/seller-profile", protect, async (req, res) => {
    try {
        const { sellerType, businessName, instagramId, pincode, fullName } = req.body;

        const updateFields = {};
        if (sellerType !== undefined) updateFields.sellerType = sellerType;
        if (businessName !== undefined) updateFields.businessName = businessName;
        if (instagramId !== undefined) updateFields.instagramId = instagramId;
        if (pincode !== undefined) updateFields.pincode = pincode;
        if (fullName !== undefined && String(fullName).trim()) {
            updateFields.fullName = String(fullName).trim();
        }

        if (sellerType || businessName || pincode) {
            updateFields.role = "Seller";
            updateFields.hasCompletedSellerSetup = true;
            updateFields.sellerProfileStatus = "pending";
            updateFields.sellerStatus = "pending";
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.json({
            ...buildUserPayload(user),
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/auth/banking-details
// @desc    Save seller payout / banking details
// @access  Private
router.put("/banking-details", protect, async (req, res) => {
    try {
        const { accountName, accountNumber, ifsc, routingCode } = req.body;
        const accName = accountName ? String(accountName).trim() : "";
        const accNum = accountNumber ? String(accountNumber).trim() : "";
        const ifscV = ifsc ? String(ifsc).trim() : "";
        const routing = routingCode ? String(routingCode).trim() : "";
        if (!accName || !accNum || (!ifscV && !routing)) {
            return res.status(400).json({
                message:
                    "Account name, account number, and at least one of IFSC or routing code are required.",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    bankingDetails: {
                        accountName: accName,
                        accountNumber: accNum,
                        ifsc: ifscV,
                        routingCode: routing,
                    },
                    hasBankDetailsAdded: true,
                },
            },
            { new: true, runValidators: true }
        );

        res.json({
            ...buildUserPayload(user),
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

