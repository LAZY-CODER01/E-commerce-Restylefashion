const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
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

// @route   POST /api/auth/make-admin
// @desc    Promote the currently logged-in user to Admin (bootstrap helper)
// @access  Private
router.post("/make-admin", protect, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { role: "Admin" } },
            { new: true }
        );
        res.json({
            message: "Your account has been promoted to Admin.",
            ...buildUserPayload(user),
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update basic profile info (fullName, mobile)
// @access  Private
router.put("/profile", protect, async (req, res) => {
    try {
        const { fullName, mobile } = req.body;
        const updateFields = {};
        if (fullName && String(fullName).trim()) updateFields.fullName = String(fullName).trim();
        if (mobile !== undefined) updateFields.mobile = String(mobile).trim();

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );
        res.json(buildUserPayload(user));
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

// ─────────────────────────────────────────────────────────────────────────────
// ADDRESSES
// ─────────────────────────────────────────────────────────────────────────────

// GET all addresses
router.get("/addresses", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.addresses || []);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// POST add new address
router.post("/addresses", protect, async (req, res) => {
    try {
        const { label, name, mobile, line1, line2, city, state, pincode, country, isDefault } = req.body;
        if (!name || !mobile || !line1 || !city || !state || !pincode)
            return res.status(400).json({ message: "Please fill all required address fields." });

        const user = await User.findById(req.user._id);

        if (isDefault || user.addresses.length === 0)
            user.addresses.forEach((a) => { a.isDefault = false; });

        user.addresses.push({
            label: label || "Home",
            name: String(name).trim(),
            mobile: String(mobile).trim(),
            line1: String(line1).trim(),
            line2: line2 ? String(line2).trim() : "",
            city: String(city).trim(),
            state: String(state).trim(),
            pincode: String(pincode).trim(),
            country: country ? String(country).trim() : "India",
            isDefault: Boolean(isDefault) || user.addresses.length === 0,
        });

        await user.save();
        res.status(201).json(user.addresses);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// PUT update address
router.put("/addresses/:id", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const addr = user.addresses.id(req.params.id);
        if (!addr) return res.status(404).json({ message: "Address not found." });

        const { label, name, mobile, line1, line2, city, state, pincode, country, isDefault } = req.body;
        if (isDefault) user.addresses.forEach((a) => { a.isDefault = false; });

        if (label !== undefined) addr.label = label;
        if (name) addr.name = String(name).trim();
        if (mobile) addr.mobile = String(mobile).trim();
        if (line1) addr.line1 = String(line1).trim();
        if (line2 !== undefined) addr.line2 = String(line2).trim();
        if (city) addr.city = String(city).trim();
        if (state) addr.state = String(state).trim();
        if (pincode) addr.pincode = String(pincode).trim();
        if (country) addr.country = String(country).trim();
        if (isDefault !== undefined) addr.isDefault = Boolean(isDefault);

        await user.save();
        res.json(user.addresses);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// DELETE address
router.delete("/addresses/:id", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const addr = user.addresses.id(req.params.id);
        if (!addr) return res.status(404).json({ message: "Address not found." });
        const wasDefault = addr.isDefault;
        user.addresses.pull({ _id: req.params.id });
        if (wasDefault && user.addresses.length > 0) user.addresses[0].isDefault = true;
        await user.save();
        res.json(user.addresses);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// PATCH set default address
router.patch("/addresses/:id/default", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses.forEach((a) => { a.isDefault = String(a._id) === req.params.id; });
        await user.save();
        res.json(user.addresses);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT METHODS
// ─────────────────────────────────────────────────────────────────────────────

// GET all payment methods
router.get("/payment-methods", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.paymentMethods || []);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// POST add payment method (CVV never stored)
router.post("/payment-methods", protect, async (req, res) => {
    try {
        const { type, number, nameOnCard, expiry, upiId, isDefault } = req.body;
        if (!type || !["card", "upi"].includes(type))
            return res.status(400).json({ message: "Invalid payment method type." });

        const user = await User.findById(req.user._id);

        if (isDefault || user.paymentMethods.length === 0)
            user.paymentMethods.forEach((m) => { m.isDefault = false; });

        if (type === "card") {
            const clean = String(number || "").replace(/\s/g, "");
            if (clean.length < 13) return res.status(400).json({ message: "Invalid card number." });
            if (!nameOnCard || !expiry) return res.status(400).json({ message: "Card name and expiry are required." });
            let brand = "Card";
            if (/^4/.test(clean)) brand = "Visa";
            else if (/^5[1-5]/.test(clean)) brand = "Mastercard";
            else if (/^3[47]/.test(clean)) brand = "Amex";
            user.paymentMethods.push({ type: "card", last4: clean.slice(-4), brand, nameOnCard: String(nameOnCard).trim(), expiry: String(expiry).trim(), isDefault: Boolean(isDefault) || user.paymentMethods.length === 0 });
        } else {
            if (!upiId || !String(upiId).includes("@"))
                return res.status(400).json({ message: "Enter a valid UPI ID (e.g. name@upi)." });
            user.paymentMethods.push({ type: "upi", upiId: String(upiId).trim(), isDefault: Boolean(isDefault) || user.paymentMethods.length === 0 });
        }

        await user.save();
        res.status(201).json(user.paymentMethods);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// DELETE payment method
router.delete("/payment-methods/:id", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const method = user.paymentMethods.id(req.params.id);
        if (!method) return res.status(404).json({ message: "Payment method not found." });
        const wasDefault = method.isDefault;
        user.paymentMethods.pull({ _id: req.params.id });
        if (wasDefault && user.paymentMethods.length > 0) user.paymentMethods[0].isDefault = true;
        await user.save();
        res.json(user.paymentMethods);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// PATCH set default payment method
router.patch("/payment-methods/:id/default", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.paymentMethods.forEach((m) => { m.isDefault = String(m._id) === req.params.id; });
        await user.save();
        res.json(user.paymentMethods);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — USERS
// ─────────────────────────────────────────────────────────────────────────────

// @route   GET /api/auth/users
// @desc    Get all users (admin only) with optional role filter & search
// @access  Private/Admin
router.get("/users", protect, authorize("Admin"), async (req, res) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;
        const query = {};
        if (role && role !== "all") query.role = role;
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email:    { $regex: search, $options: "i" } },
                { mobile:   { $regex: search, $options: "i" } },
            ];
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [users, total] = await Promise.all([
            User.find(query)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            User.countDocuments(query),
        ]);
        res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// @route   PATCH /api/auth/users/:id/role
// @desc    Change a user's role (admin only)
// @access  Private/Admin
router.patch("/users/:id/role", protect, authorize("Admin"), async (req, res) => {
    try {
        const { role } = req.body;
        const allowed = ["User", "Seller", "Influencer", "Admin"];
        if (!allowed.includes(role)) return res.status(400).json({ message: "Invalid role." });
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found." });
        res.json(buildUserPayload(user));
    } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;

