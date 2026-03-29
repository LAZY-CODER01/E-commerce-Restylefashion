const mongoose = require("mongoose");

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
            enum: ["streetwear", "vintage", "formals", "ethnic", "accessories", "footwear"],
            lowercase: true,
        },
        condition: {
            type: String,
            enum: ["New", "New without tags", "Excellent", "Gently Used", "Good", "Vintage"],
            default: "Gently Used",
        },
        description: {
            type: String,
            default: "",
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
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Text index for search
productSchema.index({ title: "text", brand: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
