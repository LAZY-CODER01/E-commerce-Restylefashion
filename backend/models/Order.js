const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        productId:     { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
        title:         { type: String, required: true },
        imageUrl:      { type: String, default: "" },
        selectedSize:  { type: String, default: "" },
        selectedColor: { type: String, default: "" },
        price:         { type: Number, required: true },
        qty:           { type: Number, default: 1 },
    },
    { _id: false }
);

const orderAddressSchema = new mongoose.Schema(
    {
        label:   { type: String, default: "Home" },
        name:    { type: String, default: "" },
        mobile:  { type: String, default: "" },
        line:    { type: String, default: "" },
        city:    { type: String, default: "" },
        state:   { type: String, default: "" },
        pincode: { type: String, default: "" },
        country: { type: String, default: "India" },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:  "User",
            required: true,
        },

        // Cart snapshot
        items: [orderItemSchema],

        // Delivery
        deliveryAddress: orderAddressSchema,
        deliveryOption:  { type: String, enum: ["standard", "express"], default: "standard" },

        // Pricing (all in INR paise stored as rupees here)
        subtotal:     { type: Number, required: true },
        platformFee:  { type: Number, default: 199 },
        deliveryFee:  { type: Number, required: true },
        total:        { type: Number, required: true },

        // Razorpay IDs
        razorpay_order_id:   { type: String, required: true },
        razorpay_payment_id: { type: String, default: "" },
        razorpay_signature:  { type: String, default: "" },

        // Order status
        status: {
            type: String,
            enum: ["created", "paid", "failed"],
            default: "created",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
