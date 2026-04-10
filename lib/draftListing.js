/**
 * Persisted seller listing draft (localStorage key: restyle_draft_listing).
 */

import api from "@/lib/api";

export const DRAFT_LISTING_KEY = "restyle_draft_listing";
const LEGACY_DRAFT_LISTING_KEY = "draft_listing";

export function defaultDraftListing() {
  return {
    sellerType: null,
    sellerProfile: {
      fullName: "",
      businessName: "",
      socialMediaName: "",
      gstNumber: "",
    },
    product: {
      sizes: [],
      name: "",
      category: "",
      description: "",
      condition: "",
      retailPrice: "",
      sellingPrice: "",
    },
    imageDataUrls: [],
  };
}

export function getDraftListing() {
  if (typeof window === "undefined") return null;
  try {
    let raw = localStorage.getItem(DRAFT_LISTING_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_DRAFT_LISTING_KEY);
      if (raw) {
        localStorage.setItem(DRAFT_LISTING_KEY, raw);
        localStorage.removeItem(LEGACY_DRAFT_LISTING_KEY);
      }
    }
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...defaultDraftListing(),
      ...parsed,
      sellerProfile: {
        ...defaultDraftListing().sellerProfile,
        ...(parsed.sellerProfile || {}),
      },
      product: {
        ...defaultDraftListing().product,
        ...(parsed.product || {}),
      },
      imageDataUrls: Array.isArray(parsed.imageDataUrls) ? parsed.imageDataUrls : [],
    };
  } catch {
    return null;
  }
}

export function setDraftListing(next) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DRAFT_LISTING_KEY, JSON.stringify(next));
}

export function mergeDraftListing(partial) {
  const prev = getDraftListing() || defaultDraftListing();
  const next = { ...prev };
  if (partial.sellerType !== undefined) {
    next.sellerType = partial.sellerType;
  }
  if (partial.sellerProfile) {
    next.sellerProfile = { ...prev.sellerProfile, ...partial.sellerProfile };
  }
  if (next.sellerProfile) {
    next.sellerProfile = { ...next.sellerProfile, businessName: "" };
  }
  if (partial.product) {
    next.product = { ...prev.product, ...partial.product };
  }
  if (partial.imageDataUrls !== undefined) {
    next.imageDataUrls = partial.imageDataUrls;
  }
  setDraftListing(next);
  if (next.sellerType) {
    localStorage.setItem("seller_type", next.sellerType);
  }
}

export function clearDraftListing() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DRAFT_LISTING_KEY);
  localStorage.removeItem(LEGACY_DRAFT_LISTING_KEY);
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function dataUrlsToFiles(urls) {
  const files = [];
  for (let i = 0; i < urls.length; i++) {
    const res = await fetch(urls[i]);
    const blob = await res.blob();
    files.push(
      new File([blob], `listing-${i}.jpg`, {
        type: blob.type || "image/jpeg",
      })
    );
  }
  return files;
}

/** Default login redirect target: `/sell` routes to the right step using draft state. */
export const LISTING_REDIRECT_PARAM = "/sell";

/** Paths where we return after auth to rehydrate the draft (no auto-submit). */
export function shouldRehydrateAfterAuth(redirect) {
  if (!redirect) return false;
  const r = redirect.startsWith("/") ? redirect : decodeURIComponent(redirect);
  return (
    r === "/sell" ||
    r === "/seller/products/new" ||
    r === "/seller/onboarding/type"
  );
}

/**
 * After login/register with redirect=complete-listing (or listing-page): auto-submit draft.
 */
export async function completeDraftListingFlow(setUser) {
  const draft = getDraftListing();
  if (!draft || !draft.sellerType) {
    return { ok: false, reason: "no_draft" };
  }

  const { sellerType, sellerProfile, product, imageDataUrls = [] } = draft;
  const socialTypes = new Set(["influencer", "designer", "thrifter"]);

  if (!sellerProfile?.fullName?.trim()) {
    return {
      ok: false,
      reason: "no_draft",
      message: "Your listing draft is incomplete. Finish your seller profile, then try again.",
    };
  }

  if (socialTypes.has(sellerType) && !sellerProfile?.socialMediaName?.trim()) {
    return {
      ok: false,
      reason: "no_draft",
      message: "Your listing draft is incomplete. Add your social media name, then try again.",
    };
  }

  if (!product?.name?.trim() || !imageDataUrls.length) {
    return {
      ok: false,
      reason: "no_draft",
      message: "Your listing draft is incomplete. Finish the product step, then try again.",
    };
  }

  try {
    const { data: profileData } = await api.put("/auth/seller-profile", {
      sellerType,
      businessName: "",
      fullName: sellerProfile.fullName,
      instagramId: socialTypes.has(sellerType)
        ? String(sellerProfile.socialMediaName || "").trim()
        : "",
    });

    if (profileData.token) {
      localStorage.setItem("restyle_token", profileData.token);
      setUser(profileData);
    }

    const fd = new FormData();
    fd.append("title", product.name);
    fd.append("brand", "Unknown");
    fd.append("category", product.category);
    fd.append("condition", product.condition);
    fd.append("description", product.description);
    fd.append("price", String(product.sellingPrice || "").replace(/\D/g, "") || "0");
    fd.append("originalPrice", String(product.retailPrice || "").replace(/\D/g, "") || "0");
    fd.append("sizes", JSON.stringify(product.sizes || []));
    const sm = sellerProfile?.socialMediaName?.trim();
    if (sm && socialTypes.has(sellerType)) {
      fd.append("socialMediaName", sm);
    }
    const files = await dataUrlsToFiles(imageDataUrls);
    files.forEach((file) => fd.append("images", file));

    const { data: postData } = await api.post("/products", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (postData?.user) {
      setUser(postData.user);
    }

    clearDraftListing();
    localStorage.removeItem("seller_profile");

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: "error",
      message: err.response?.data?.message || err.message || "Submission failed",
    };
  }
}
