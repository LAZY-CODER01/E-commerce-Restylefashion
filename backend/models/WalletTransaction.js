const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        amount: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
        type: {
            type: String,
            enum: ["credit", "debit"],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
