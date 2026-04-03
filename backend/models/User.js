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
        isSellerVerified: {
            type: Boolean,
            default: false,
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
