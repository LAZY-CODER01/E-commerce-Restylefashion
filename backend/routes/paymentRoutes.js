const express = require("express");
const Razorpay = require("razorpay");
const crypto  = require("crypto");
const { protect } = require("../middleware/auth");
const Order = require("../models/Order");

const router = express.Router();

// ── Razorpay instance ─────────────────────────────────────────────────────────
const razorpay = new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/create-order
// Creates a Razorpay order and returns the order id + public key to the client
// ─────────────────────────────────────────────────────────────────────────────
router.post("/create-order", protect, async (req, res) => {
    try {
        const {
            items,
            deliveryAddress,
            deliveryOption,
            subtotal,
            platformFee,
            deliveryFee,
            total,
        } = req.body;

        // Validate essential fields
        if (!items || !items.length) {
            return res.status(400).json({ message: "Cart is empty." });
        }
        if (!total || total <= 0) {
            return res.status(400).json({ message: "Invalid total amount." });
        }

        // Razorpay amounts are in paise (1 INR = 100 paise)
        const amountInPaise = Math.round(total * 100);

        const razorpayOrder = await razorpay.orders.create({
            amount:   amountInPaise,
            currency: "INR",
            receipt:  `receipt_${Date.now()}`,
            notes: {
                userId:  req.user._id.toString(),
                items:   items.length,
            },
        });

        res.json({
            success:  true,
            orderId:  razorpayOrder.id,
            amount:   razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key:      process.env.RAZORPAY_KEY_ID,
        });
    } catch (err) {
        console.error("❌ Razorpay create-order error:", err);
        res.status(500).json({ message: "Failed to create payment order.", error: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/verify
// Verifies the Razorpay HMAC signature, saves the order in DB
// ─────────────────────────────────────────────────────────────────────────────
router.post("/verify", protect, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            // order metadata to persist
            items,
            deliveryAddress,
            deliveryOption,
            subtotal,
            platformFee,
            deliveryFee,
            total,
        } = req.body;

        // ── 1. Verify HMAC signature ──────────────────────────────────────────
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed. Invalid signature." });
        }

        // ── 2. Save order to DB ───────────────────────────────────────────────
        const order = await Order.create({
            user:               req.user._id,
            items:              items || [],
            deliveryAddress:    deliveryAddress || {},
            deliveryOption:     deliveryOption  || "standard",
            subtotal:           subtotal        || 0,
            platformFee:        platformFee     || 199,
            deliveryFee:        deliveryFee     || 49,
            total:              total           || 0,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            status: "paid",
        });

        res.json({
            success: true,
            message: "Payment verified and order placed!",
            order,
        });
    } catch (err) {
        console.error("❌ Razorpay verify error:", err);
        res.status(500).json({ message: "Payment verification failed.", error: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payment/orders
// Returns the authenticated user's order history (newest first)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/orders", protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, orders });
    } catch (err) {
        console.error("❌ Fetch orders error:", err);
        res.status(500).json({ message: "Failed to fetch orders.", error: err.message });
    }
});

module.exports = router;
