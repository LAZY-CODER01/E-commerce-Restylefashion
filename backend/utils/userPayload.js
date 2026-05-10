/** Birth date sent to clients as plain YYYY-MM-DD (timezone-stable for calendar days). */
function calendarYmd(dob) {
    if (!dob) return null;
    if (typeof dob === "string") {
        const trimmed = dob.trim();
        const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
        if (m) return `${m[1]}-${m[2]}-${m[3]}`;
        const parsed = Date.parse(trimmed);
        if (!Number.isNaN(parsed)) return new Date(parsed).toISOString().slice(0, 10);
        return null;
    }
    if (dob instanceof Date && !Number.isNaN(dob.getTime())) {
        return dob.toISOString().slice(0, 10);
    }
    return null;
}

/** Normalize Mongo/Mongoose user doc fields for JSON. */
function toPlainUser(doc) {
    if (!doc) return null;
    if (typeof doc.toObject === "function") return doc.toObject({ depopulate: true });
    return doc;
}

function normalizeGenderStored(g) {
    const raw = typeof g === "string" ? g.trim().toLowerCase() : "";
    return ["female", "male", "other", "unspecified"].includes(raw) ? raw : "";
}

function buildUserPayload(user) {
    if (!user) return null;
    const u = toPlainUser(user);

    const id = u._id;
    return {
        _id: typeof id?.toString === "function" ? id.toString() : id,
        fullName: u.fullName,
        email: u.email,
        mobile: u.mobile,
        role: u.role,
        avatar: u.avatar || "",
        dateOfBirth: calendarYmd(u.dateOfBirth),
        gender: normalizeGenderStored(u.gender),
        sellerType: u.sellerType,
        businessName: u.businessName,
        instagramId: u.instagramId,
        pincode: u.pincode,
        sellerStatus: u.sellerStatus,
        sellerProfileStatus: u.sellerProfileStatus || u.sellerStatus || "pending",
        hasCompletedSellerSetup: Boolean(
            u.hasCompletedSellerSetup ||
                (u.sellerType != null && String(u.sellerType).trim() !== "")
        ),
        hasBankDetailsAdded: Boolean(
            u.hasBankDetailsAdded ||
                (u.bankingDetails?.accountNumber &&
                    String(u.bankingDetails.accountNumber).trim() !== "")
        ),
        isSellerVerified: u.isSellerVerified,
        addresses: u.addresses || [],
        paymentMethods: u.paymentMethods || [],
        createdAt: u.createdAt,
    };
}

module.exports = { buildUserPayload };
