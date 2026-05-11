const express = require("express");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const WalletTransaction = require("../models/WalletTransaction");

const router = express.Router();

const MIN_WITHDRAW = 200;
const MAX_TOPUP = 500000;

function toPlain(tx) {
    if (!tx) return {};
    return typeof tx.toObject === "function" ? tx.toObject() : { ...tx };
}

function inferCategory(tx) {
    const c = tx.category;
    if (c && c !== "other") return c;
    const desc = (tx.description || "").trim();
    if (desc.startsWith("Sold:")) return "earning";
    const low = desc.toLowerCase();
    if (low.includes("withdraw")) return "withdrawal";
    if (low.includes("refund")) return "refund";
    if (low.includes("bonus")) return "bonus";
    if (low.includes("money added") || low.includes("top-up") || low.includes("top up")) return "topup";
    if (tx.type === "credit") return "earning";
    return "withdrawal";
}

function normalizeTransaction(tx) {
    const o = toPlain(tx);
    const normalizedCategory = inferCategory(o);
    const settlementStatus = o.settlementStatus === "pending" ? "pending" : "completed";
    return { ...o, normalizedCategory, settlementStatus };
}

function breakdownFromTransactions(balance, normalizedTxs) {
    let bonusSum = 0;
    let pendingSum = 0;
    for (const t of normalizedTxs) {
        const amt = Math.abs(Number(t.amount) || 0);
        if (t.type !== "credit") continue;
        if (t.normalizedCategory === "bonus") bonusSum += amt;
        if (t.settlementStatus === "pending" || t.normalizedCategory === "pending") pendingSum += amt;
    }
    const withdrawable = Math.max(0, Number(balance) - bonusSum - pendingSum);
    return {
        withdrawable,
        pending: pendingSum,
        bonus: bonusSum,
    };
}

// GET /api/wallet
router.get("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const raw = await WalletTransaction.find({ seller: req.user._id })
            .sort({ createdAt: -1 })
            .lean();

        const transactions = raw.map((r) => normalizeTransaction(r));
        const balance = user.walletBalance || 0;
        const breakdown = breakdownFromTransactions(balance, transactions);

        res.json({
            success: true,
            balance,
            breakdown,
            transactions,
        });
    } catch (err) {
        console.error("❌ Wallet fetch error:", err);
        res.status(500).json({ message: "Failed to fetch wallet info.", error: err.message });
    }
});

// POST /api/wallet/topup — add money (records credit + top-up category)
router.post("/topup", protect, async (req, res) => {
    try {
        const n = Math.floor(Number(req.body.amount));
        if (!Number.isFinite(n) || n < 1 || n > MAX_TOPUP) {
            return res.status(400).json({ message: "Enter a valid amount between ₹1 and ₹5,00,000." });
        }

        await User.findByIdAndUpdate(req.user._id, { $inc: { walletBalance: n } });
        await WalletTransaction.create({
            seller: req.user._id,
            amount: n,
            type: "credit",
            category: "topup",
            settlementStatus: "completed",
            description: "Money added to wallet",
        });

        const updated = await User.findById(req.user._id).lean();
        const raw = await WalletTransaction.find({ seller: req.user._id })
            .sort({ createdAt: -1 })
            .lean();
        const transactions = raw.map((r) => normalizeTransaction(r));
        const breakdown = breakdownFromTransactions(updated.walletBalance || 0, transactions);

        res.json({
            success: true,
            balance: updated.walletBalance || 0,
            breakdown,
            transactions,
        });
    } catch (err) {
        console.error("❌ Wallet topup error:", err);
        res.status(500).json({ message: "Could not add money.", error: err.message });
    }
});

// POST /api/wallet/withdraw — debit wallet + ledger row
router.post("/withdraw", protect, async (req, res) => {
    try {
        const n = Math.floor(Number(req.body.amount));
        if (!Number.isFinite(n) || n < MIN_WITHDRAW) {
            return res.status(400).json({
                message: `Minimum withdrawal is ₹${MIN_WITHDRAW.toLocaleString("en-IN")}.`,
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const bal = Number(user.walletBalance) || 0;
        if (n > bal) {
            return res.status(400).json({ message: "Insufficient wallet balance." });
        }

        const rawPre = await WalletTransaction.find({ seller: req.user._id })
            .sort({ createdAt: -1 })
            .lean();
        const normalizedPre = rawPre.map((r) => normalizeTransaction(r));
        const { withdrawable } = breakdownFromTransactions(bal, normalizedPre);
        if (n > withdrawable) {
            return res.status(400).json({
                message:
                    "Amount exceeds balance available for withdrawal. Bonus or pending amounts may not be withdrawn yet.",
            });
        }

        user.walletBalance = bal - n;
        await user.save();

        await WalletTransaction.create({
            seller: req.user._id,
            amount: n,
            type: "debit",
            category: "withdrawal",
            settlementStatus: "completed",
            description: "Withdrawal to bank",
        });

        const updated = await User.findById(req.user._id).lean();
        const raw = await WalletTransaction.find({ seller: req.user._id })
            .sort({ createdAt: -1 })
            .lean();
        const transactions = raw.map((r) => normalizeTransaction(r));
        const breakdown = breakdownFromTransactions(updated.walletBalance || 0, transactions);

        res.json({
            success: true,
            balance: updated.walletBalance || 0,
            breakdown,
            transactions,
        });
    } catch (err) {
        console.error("❌ Wallet withdraw error:", err);
        res.status(500).json({ message: "Withdrawal failed.", error: err.message });
    }
});

module.exports = router;
