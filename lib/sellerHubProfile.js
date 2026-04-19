/**
 * Merges persisted seller data (onboarding, listings, optional hub state) for SellerProfile.
 */

import { getDraftListing, patchSellerProfileInDraft } from "@/lib/draftListing";

const HUB_KEY = "restyle_seller_hub";

export function readSellerHubState() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(HUB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function writeSellerHubState(partial) {
  if (typeof window === "undefined") return;
  try {
    const prev = readSellerHubState();
    localStorage.setItem(HUB_KEY, JSON.stringify({ ...prev, ...partial }));
  } catch {
    /* ignore */
  }
}

const SELLER_PRODUCTS_KEY = "seller_products";

/** Stable ID for this browser’s seller (store preview + product scoping). */
export function getSellerStoreId() {
  if (typeof window === "undefined") return "";
  const hub = readSellerHubState();
  if (hub.sellerStoreId) return hub.sellerStoreId;
  const id = `store_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  writeSellerHubState({ sellerStoreId: id });
  return id;
}

/**
 * Call after a listing goes live so Live products count updates.
 * @param {object} item — id, title, price, image (optional), productId from API
 */
export function appendSellerProductFromListing(item) {
  if (typeof window === "undefined") return;
  const sellerStoreId = getSellerStoreId();
  let prev = [];
  try {
    prev = JSON.parse(localStorage.getItem(SELLER_PRODUCTS_KEY) || "[]");
  } catch {
    prev = [];
  }
  if (!Array.isArray(prev)) prev = [];
  const row = {
    ...item,
    sellerStoreId,
    createdAt: Date.now(),
  };
  localStorage.setItem(SELLER_PRODUCTS_KEY, JSON.stringify([...prev, row]));
  try {
    window.dispatchEvent(new Event("seller-products-updated"));
  } catch {
    /* ignore */
  }
}

export function readSellerProductsForStore(sellerStoreId) {
  if (typeof window === "undefined") return [];
  let products = [];
  try {
    products = JSON.parse(localStorage.getItem(SELLER_PRODUCTS_KEY) || "[]");
  } catch {
    return [];
  }
  if (!Array.isArray(products)) return [];
  if (!sellerStoreId) return products;
  return products.filter((p) => !p.sellerStoreId || p.sellerStoreId === sellerStoreId);
}

function safeParse(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Stable snapshot for SSR and the client’s first paint (before localStorage is read).
 * Must match `mergeSellerProfileFromStorage()` when `window` is undefined.
 */
export function getSellerProfileSsrPlaceholder() {
  return {
    name: "Seller",
    avatarName: "Seller",
    subtitle: "Pro Merchant • Verified",
    duplicateIndex: undefined,
    verified: true,
    followers: 0,
    followings: 0,
    liveProducts: 0,
    onlineStore: true,
    gstNumber: "",
    businessName: "",
    fullName: "",
    socialMediaName: "",
    sellerType: "",
    pickupAddress: {},
    bankDetails: {},
    activePremiumPlansCount: 0,
    boostLabel: "",
    boostHistory: [],
    sellerStoreId: "",
  };
}

/**
 * Build merged profile for the current browser session (onboarding + listings + hub).
 */
export function mergeSellerProfileFromStorage() {
  if (typeof window === "undefined") {
    return getSellerProfileSsrPlaceholder();
  }

  const draft = getDraftListing();
  const sp = draft?.sellerProfile || {};
  const address = safeParse("seller_address") || {};
  const bank = safeParse("seller_bank") || {};
  const sellerType = localStorage.getItem("seller_type") || "";

  let products = [];
  try {
    products = JSON.parse(localStorage.getItem(SELLER_PRODUCTS_KEY) || "[]");
  } catch {
    products = [];
  }

  const hub = readSellerHubState();
  const sellerStoreId = hub.sellerStoreId || "";
  const businessName = sp.businessName || "";
  const fullName = sp.fullName || "";
  const displayName =
    (typeof hub.displayName === "string" && hub.displayName.trim()) ||
    businessName ||
    fullName ||
    "Seller";

  const titleToken =
    (sellerType && String(sellerType).replace(/_/g, " ")) ||
    (businessName ? "Merchant" : "Seller");

  const hasGst = !!(sp.gstNumber || hub.gstNumber);
  const isVerified = hub.verified === true || hasGst;

  const subtitleParts = [];
  if (titleToken) subtitleParts.push(titleToken.charAt(0).toUpperCase() + titleToken.slice(1));
  if (isVerified) subtitleParts.push("Verified");

  const liveProducts =
    Array.isArray(products) && products.length
      ? sellerStoreId
        ? products.filter((p) => !p.sellerStoreId || p.sellerStoreId === sellerStoreId).length
        : products.length
      : 0;

  /** Full name for avatar initials (first + last word); not seller type. */
  const avatarNameSource = (fullName && fullName.trim()) || displayName;

  return {
    name: displayName,
    avatarName: avatarNameSource,
    subtitle:
      subtitleParts.length > 0
        ? subtitleParts.join(" • ")
        : "Pro Merchant • Verified",
    duplicateIndex: hub.duplicateIndex,
    verified: isVerified,
    followers: typeof hub.followers === "number" ? hub.followers : 0,
    followings: typeof hub.followings === "number" ? hub.followings : 0,
    liveProducts,
    onlineStore: hub.onlineStore !== false,
    gstNumber: sp.gstNumber || hub.gstNumber || "",
    businessName,
    fullName,
    socialMediaName: sp.socialMediaName || "",
    sellerType,
    pickupAddress: address,
    bankDetails: bank,
    activePremiumPlansCount:
      typeof hub.activePremiumPlansCount === "number" ? hub.activePremiumPlansCount : 0,
    boostLabel: typeof hub.boostLabel === "string" ? hub.boostLabel : "",
    boostHistory: Array.isArray(hub.boostHistory) ? hub.boostHistory : [],
    sellerStoreId,
  };
}

/**
 * Persist profile edits from SellerProfile (hub + draft listing sellerProfile).
 * @param {object} fields
 */
export function saveSellerProfileEdits(fields) {
  if (typeof window === "undefined") return;
  const {
    displayName,
    fullName,
    businessName,
    gstNumber,
    socialMediaName,
    sellerType,
  } = fields;

  const hubPatch = {};
  if (typeof displayName === "string") hubPatch.displayName = displayName.trim();
  if (typeof gstNumber === "string") hubPatch.gstNumber = gstNumber.trim();
  if (Object.keys(hubPatch).length) writeSellerHubState(hubPatch);

  const draftPatch = {};
  if (typeof fullName === "string") draftPatch.fullName = fullName.trim();
  if (typeof businessName === "string") draftPatch.businessName = businessName.trim();
  if (typeof gstNumber === "string") draftPatch.gstNumber = gstNumber.trim();
  if (typeof socialMediaName === "string") draftPatch.socialMediaName = socialMediaName.trim();
  if (Object.keys(draftPatch).length) patchSellerProfileInDraft(draftPatch);

  if (typeof sellerType === "string" && sellerType.trim()) {
    localStorage.setItem("seller_type", sellerType.trim());
  }
}
