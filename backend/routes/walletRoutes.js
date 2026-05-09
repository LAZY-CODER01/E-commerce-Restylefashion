const express = require("express");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const WalletTransaction = require("../models/WalletTransaction");

const router = express.Router();

// GET /api/wallet
// Fetch seller's wallet balance and transaction history
router.get("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const transactions = await WalletTransaction.find({ seller: req.user._id })
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            balance: user.walletBalance || 0,
            transactions,
        });
    } catch (err) {
        console.error("❌ Wallet fetch error:", err);
        res.status(500).json({ message: "Failed to fetch wallet info.", error: err.message });
    }
});

module.exports = router;
