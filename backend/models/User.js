const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: [true, "Mobile number is required"],
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            enum: ["User", "Seller", "Influencer", "Admin"],
            default: "User",
        },
        avatar: {
            type: String,
            default: "",
        },
        coverUrl: {
            type: String,
            default: "",
        },
        followersCount: {
            type: Number,
            default: 0,
        },
        followingCount: {
            type: Number,
            default: 0,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        dateOfBirth: {
            type: Date,
            default: null,
        },
        gender: {
            type: String,
            trim: true,
            default: "",
            enum: {
                values: ["female", "male", "other", "unspecified", ""],
                message: "{VALUE} is not a valid gender",
            },
        },
        // Seller profile fields
        sellerType: {
            type: String,
            // Keep in sync with app/seller/onboarding/type/page.jsx and authRoutes seller-profile validation
            enum: ["thrifter", "influencer", "individual", "designer"],
            default: null,
        },
        businessName: {
            type: String,
            default: "",
        },
        instagramId: {
            type: String,
            default: "",
        },
        pincode: {
            type: String,
            default: "",
        },
        sellerStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        sellerProfileStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        hasCompletedSellerSetup: {
            type: Boolean,
            default: false,
        },
        hasBankDetailsAdded: {
            type: Boolean,
            default: false,
        },
        bankingDetails: {
            accountName: { type: String, default: "" },
            accountNumber: { type: String, default: "" },
            ifsc: { type: String, default: "" },
            routingCode: { type: String, default: "" },
        },
        isSellerVerified: {
            type: Boolean,
            default: false,
        },
        // Saved addresses
        addresses: [
            {
                label:   { type: String, default: "Home" },
                name:    { type: String, required: true, trim: true },
                mobile:  { type: String, required: true, trim: true },
                line1:   { type: String, required: true, trim: true },
                line2:   { type: String, default: "", trim: true },
                city:    { type: String, required: true, trim: true },
                state:   { type: String, required: true, trim: true },
                pincode: { type: String, required: true, trim: true },
                country: { type: String, default: "India", trim: true },
                isDefault: { type: Boolean, default: false },
            },
        ],
        // Saved payment methods (cards + UPI – we never store raw CVV)
        paymentMethods: [
            {
                type:    { type: String, enum: ["card", "upi"], required: true },
                // Card fields
                last4:   { type: String, default: "" },
                brand:   { type: String, default: "" },
                nameOnCard: { type: String, default: "" },
                expiry:  { type: String, default: "" },
                // UPI fields
                upiId:   { type: String, default: "" },
                isDefault: { type: Boolean, default: false },
            },
        ],
        walletBalance: {
            type: Number,
            default: 0,
        },
        vacationMode: {
            isActive: { type: Boolean, default: false },
            startDate: { type: Date, default: null },
            endDate: { type: Date, default: null },
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
