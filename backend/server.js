const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// ---------- Middleware ----------
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://e-commerce-restylefashion.vercel.app",
    "https://e-commerce-restylefashion-3325.vercel.app",
];

app.use(
    cors({
        origin(origin, cb) {
            if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
            if (process.env.NODE_ENV !== "production" && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
                return cb(null, true);
            }
            cb(null, false);
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);
    res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Restyle API running on http://localhost:${PORT}`);
    });
});
