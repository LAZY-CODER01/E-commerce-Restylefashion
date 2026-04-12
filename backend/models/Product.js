const mongoose = require("mongoose");

/** Allowed `condition` values (single source for enum + normalization). */
const PRODUCT_CONDITIONS = [
    "New",
    "Brand new",
    "Like new",
    "Used - Very Good",
    "Used-Very Good",
    "Used - Good",
    "Used-Good",
    "Used",
    "New without tags",
    "Excellent",
    "Gently Used",
    "Good",
    "Vintage",
];

/**
 * Map incoming strings to an exact enum member. Fixes Unicode dashes (U+2013, U+2014, etc.)
 * and spacing so `Used - Good` always validates.
 */
function normalizeProductCondition(raw) {
    if (raw === undefined || raw === null) return null;
    let s = String(raw).trim();
    if (!s) return null;
    // Unicode hyphen / dash / minus → ASCII hyphen (common cause of enum mismatch)
    s = s.replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-");
    s = s.replace(/\s+/g, " ").trim();
    if (PRODUCT_CONDITIONS.includes(s)) return s;
    const lower = s.toLowerCase();
    const byLower = PRODUCT_CONDITIONS.find((c) => c.toLowerCase() === lower);
    if (byLower) return byLower;
    const compact = (x) => x.toLowerCase().replace(/\s+/g, "");
    const sc = compact(s);
    const byCompact = PRODUCT_CONDITIONS.find((c) => compact(c) === sc);
    return byCompact || null;
}

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Product title is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
        },
        originalPrice: {
            type: Number,
        },
        discount: {
            type: Number,
            default: 0,
        },
        brand: {
            type: String,
            required: [true, "Brand is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "streetwear", "vintage", "formals", "ethnic",
                "accessories", "footwear", "tops", "bottoms",
                "dresses", "co-ords", "outerwear", "activewear",
                "bags", "jewellery", "other",
                "jumpsuits", "coats", "desi", "hot",
            ],
            lowercase: true,
        },
        condition: {
            type: String,
            trim: true,
            enum: PRODUCT_CONDITIONS,
            default: "Gently Used",
        },
        description: {
            type: String,
            default: "",
        },
        socialMediaName: {
            type: String,
            default: "",
            trim: true,
        },
        businessName: {
            type: String,
            default: "",
            trim: true,
        },
        details: {
            fabric: { type: String, default: "" },
            fit: { type: String, default: "" },
            care: { type: String, default: "" },
        },
        imageUrl: {
            type: String,
            default: "",
        },
        images: [
            {
                type: String,
            },
        ],
        sizes: {
            type: [String],
            default: ["XS", "S", "M", "L", "XL"],
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        rating: {
            type: Number,
            default: 0,
        },
        ratingCount: {
            type: Number,
            default: 0,
        },
        stockStatus: {
            type: String,
            enum: ["In Stock", "Out of Stock", "Limited"],
            default: "In Stock",
        },
        status: {
            type: String,
            enum: ["pending", "active", "rejected", "approved"],
            default: "pending",
        },
    },
    { timestamps: true }
);

productSchema.pre("validate", function (next) {
    if (this.condition === undefined || this.condition === null) return next();
    const normalized = normalizeProductCondition(this.condition);
    if (normalized) this.condition = normalized;
    next();
});

// Text index for search
productSchema.index({ title: "text", brand: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
