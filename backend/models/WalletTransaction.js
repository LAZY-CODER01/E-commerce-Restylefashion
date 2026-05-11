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
        /** For filters: earnings, withdrawals, refunds, bonuses, top-ups, pending holds */
        category: {
            type: String,
            enum: ["earning", "withdrawal", "refund", "bonus", "topup", "pending", "other"],
            default: "other",
        },
        settlementStatus: {
            type: String,
            enum: ["pending", "completed"],
            default: "completed",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
