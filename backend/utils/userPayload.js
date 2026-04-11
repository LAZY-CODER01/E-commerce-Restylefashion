function buildUserPayload(user) {
    if (!user) return null;
    return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        avatar: user.avatar,
        sellerType: user.sellerType,
        businessName: user.businessName,
        instagramId: user.instagramId,
        pincode: user.pincode,
        sellerStatus: user.sellerStatus,
        sellerProfileStatus: user.sellerProfileStatus || user.sellerStatus || "pending",
        hasCompletedSellerSetup: Boolean(
            user.hasCompletedSellerSetup ||
                (user.sellerType != null && String(user.sellerType).trim() !== "")
        ),
        hasBankDetailsAdded: Boolean(
            user.hasBankDetailsAdded ||
                (user.bankingDetails?.accountNumber &&
                    String(user.bankingDetails.accountNumber).trim() !== "")
        ),
        isSellerVerified: user.isSellerVerified,
        addresses: user.addresses || [],
        paymentMethods: user.paymentMethods || [],
        createdAt: user.createdAt,
    };
}

module.exports = { buildUserPayload };
