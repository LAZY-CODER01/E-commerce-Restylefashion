"use client";

import React, { useState, useRef, useEffect } from "react";
import Input, {
  formFieldErrorClass,
  formFieldInputBase,
  formFieldTextareaBase,
} from "@/components/Input";
import Button from "@/components/Button";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Camera, X, Loader, Check, Sparkles, Rocket, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  getDraftListing,
  mergeDraftListing,
  dataUrlsToFiles,
  fileToDataUrl,
  clearDraftListing,
  isDraftStorageFullError,
} from "@/lib/draftListing";
import { appendSellerProductFromListing } from "@/lib/sellerHubProfile";
import clsx from "clsx";
import { SELLER_PRODUCT_CATEGORY_OPTIONS } from "@/data/categories";

const SOCIAL_SELLER_TYPES = new Set(["influencer", "designer", "thrifter"]);

const defaultProductForm = {
  sizes: [],
  name: "",
  category: "",
  description: "",
  condition: "",
  retailPrice: "",
  sellingPrice: "",
};

const FIELD_ORDER = [
  "name",
  "category",
  "condition",
  "description",
  "sizes",
  "photos",
  "retailPrice",
  "sellingPrice",
];

function readInitialProductForm() {
  if (typeof window === "undefined") return defaultProductForm;
  const draft = getDraftListing();
  if (draft?.product) {
    const { brand: _b, ...rest } = draft.product;
    return { ...defaultProductForm, ...rest };
  }
  return defaultProductForm;
}

function sanitizePriceDigits(value) {
  return String(value).replace(/\D/g, "");
}

/** Max selling = 70% of MRP → at least 30% discount. Integer-safe. */
function maxSellingForRetail(retail) {
  if (!Number.isFinite(retail) || retail <= 0) return null;
  return Math.floor((retail * 70) / 100);
}

/** Inches — reference chart for tops; garment fit may vary by brand and fabric. */
const SIZE_CHART_ROWS = [
  // { size: "XXS", chest: "30-32", waist: "24-26", hips: "30-32", length: "24-25", shoulder: "14-15" },
  { size: "XS", chest: "32-34", waist: "26-28", hips: "32-34", length: "25-26", shoulder: "15-16" },
  { size: "S", chest: "35-37", waist: "28-30", hips: "35-37", length: "26-27", shoulder: "16-17" },
  { size: "M", chest: "38-40", waist: "31-33", hips: "38-40", length: "27-28", shoulder: "17-18" },
  { size: "L", chest: "41-43", waist: "34-36", hips: "41-43", length: "28-29", shoulder: "18-19" },
  { size: "XL", chest: "44-46", waist: "37-39", hips: "44-46", length: "29-30", shoulder: "19-20" },
  // { size: "XXL", chest: "47-49", waist: "40-42", hips: "47-49", length: "30-31", shoulder: "20-21" },
  // { size: "3XL", chest: "50-53", waist: "43-46", hips: "50-53", length: "31-32", shoulder: "21-22" },
  // { size: "4XL", chest: "54-57", waist: "47-50", hips: "54-57", length: "32-33", shoulder: "22-23" },
];

const CONDITION_OPTIONS = [
  {
    title: "Brand new",
    description: "Never worn with original tags",
  },
  {
    title: "Like new",
    description: "Never worn without original tags",
  },
  // {
  //   title: "Used - Very Good",
  //   description:
  //     "Item has been lightly worn and remains in excellent condition with no visible flaws. Examples: creasing, light wear, minimal sole wear.",
  // },
  {
    title: "Used - Good",
    description:
      "Slightly worn, in mint condition with no visible flaws",
  },
  {
    title: "Used",
    description:
      "Clearly worn with visible flaws, still usable",
  },
];

function SelectChevron() {
  return (
    <span
      className="pointer-events-none absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-brand-dark/50"
      aria-hidden
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}

/** Single thin circle + “i”, sized to sit next to label text (e.g. condition hints). */
function InlineInfoGlyph({ tone = "brand", size = 16 }) {
  const color = tone === "orange" ? "text-orange-600" : "text-brand-pink";
  return (
    <svg
      width={size}
      height={size}
      className={`shrink-0 ${color}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.15" />
      <path d="M12 16v-5M12 8h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

const inlineInfoBtnClass =
  "inline-flex min-h-[26px] min-w-[26px] shrink-0 cursor-pointer items-center justify-center rounded-full text-brand-pink transition hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink/40";

function getLivePriceErrors(retailStr, sellingStr) {
  const err = {};
  const retail = retailStr ? parseInt(retailStr, 10) : NaN;
  const selling = sellingStr ? parseInt(sellingStr, 10) : NaN;
  if (
    !retailStr ||
    !sellingStr ||
    !Number.isFinite(retail) ||
    retail <= 0 ||
    !Number.isFinite(selling) ||
    selling <= 0
  ) {
    return err;
  }
  if (selling >= retail) {
    err.sellingPrice =
      "Fill correct details: selling price must be less than retail (MRP).";
  } else {
    const maxSell = maxSellingForRetail(retail);
    if (maxSell != null && selling > maxSell) {
      err.sellingPrice =
        "Offer at least 30% off MRP. Lower your selling price (max 70% of MRP).";
    }
  }
  return err;
}

/**
 * Maps a moderation API reason code to a user-friendly inline message.
 * @param {string|null} reason
 */
function getModerationMessage(reason) {
  const map = {
    email_detected: "Description cannot include email addresses.",
    phone_detected: "Description cannot include phone numbers.",
    url_detected: "Description cannot include website URLs or links.",
    pii_detected: "Personal information (name, address, phone, etc.) is not allowed in descriptions.",
    toxic_content: "Description contains prohibited content (hate speech, harassment, or explicit material).",
    rate_limit_exceeded: "Too many requests. Please slow down.",
  };
  return map[reason] || "Description was flagged by our content policy. Please revise it.";
}

export default function NewProductPage() {
  const sizes = ["XS", "S", "M", "L", "XL"];
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, loading } = useAuth();
  const fileInputRef = useRef(null);
  const [imagesReady, setImagesReady] = useState(false);
  const [draftRehydrated, setDraftRehydrated] = useState(false);

  const [formData, setFormData] = useState(() => readInitialProductForm());
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadingMap, setUploadingMap] = useState({});
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [liveModalOpen, setLiveModalOpen] = useState(false);
  const [isConditionDropdownOpen, setIsConditionDropdownOpen] = useState(false);
  const [isSellingPriceInfoOpen, setIsSellingPriceInfoOpen] = useState(false);
  const sellingInfoRef = useRef(null);
  const conditionDropdownRef = useRef(null);
  const uploadTimersRef = useRef(new Map());

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    async function rehydrateFromStorage() {
      const draft = getDraftListing();
      if (draft?.product) {
        const { brand: _b, ...rest } = draft.product;
        setFormData({ ...defaultProductForm, ...rest });
      }
      if (draft?.imageDataUrls?.length) {
        try {
          const files = await dataUrlsToFiles(draft.imageDataUrls);
          if (!cancelled) {
            setImageFiles(files);
            setImagePreviews(draft.imageDataUrls);
          }
        } catch {
          if (!cancelled) toast.error("Could not restore saved photos.");
        }
      }
      if (!cancelled) {
        setImagesReady(true);
        setDraftRehydrated(true);
      }
    }

    rehydrateFromStorage();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      uploadTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      uploadTimersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!draftRehydrated) return;
    mergeDraftListing({ product: formData });
  }, [formData, draftRehydrated]);

  useEffect(() => {
    if (!draftRehydrated || !imagesReady) return;
    let cancelled = false;
    async function sync() {
      if (imageFiles.length === 0) {
        mergeDraftListing({ imageDataUrls: [] });
        return;
      }
      try {
        const urls = await Promise.all(imageFiles.map((f) => fileToDataUrl(f)));
        if (!cancelled) mergeDraftListing({ imageDataUrls: urls });
      } catch (err) {
        if (!cancelled) {
          toast.error(
            isDraftStorageFullError(err)
              ? "Photos exceed browser storage. Use fewer or smaller images, or log in so uploads skip this step."
              : err?.message === "Image decode failed"
                ? "One image could not be read. Try JPG or PNG."
                : "Could not save photos to draft."
          );
        }
      }
    }
    sync();
    return () => {
      cancelled = true;
    };
  }, [imageFiles, imagesReady, draftRehydrated]);

  useEffect(() => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.sellingPrice;
      delete next.retailPrice;
      delete next.priceCompare;
      const pe = getLivePriceErrors(formData.retailPrice, formData.sellingPrice);
      return { ...next, ...pe };
    });
  }, [formData.retailPrice, formData.sellingPrice]);


  useEffect(() => {
    if (!isSizeChartOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isSizeChartOpen]);

  useEffect(() => {
    if (!isSellingPriceInfoOpen) return;
    const onClickOutside = (e) => {
      if (sellingInfoRef.current && !sellingInfoRef.current.contains(e.target)) {
        setIsSellingPriceInfoOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isSellingPriceInfoOpen]);

  useEffect(() => {
    if (!isConditionDropdownOpen) return;
    const onClickOutside = (e) => {
      if (conditionDropdownRef.current && !conditionDropdownRef.current.contains(e.target)) {
        setIsConditionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isConditionDropdownOpen]);

  useEffect(() => {
    if (!guidelinesOpen && !liveModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [guidelinesOpen, liveModalOpen]);

  const setPriceField = (key, raw) => {
    const cleaned = sanitizePriceDigits(raw);
    setFormData((prev) => ({ ...prev, [key]: cleaned }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      delete next.priceCompare;
      return next;
    });
  };

  const handleRetailPriceChange = (raw) => {
    const cleaned = sanitizePriceDigits(raw);
    setFormData((prev) => ({
      ...prev,
      retailPrice: cleaned,
    }));
  };

  const handleSellingPriceChange = (raw) => {
    setPriceField("sellingPrice", raw);
  };

  const validateProductForm = () => {
    const err = {};

    if (!formData.name.trim()) err.name = "Please fill in this field.";
    if (!formData.category) err.category = "Please fill in this field.";
    if (!formData.condition) err.condition = "Please fill in this field.";
    if (!formData.description.trim()) err.description = "Please fill in this field.";
    if (!formData.sizes.length) err.sizes = "Please fill in this field.";
    if (imageFiles.length === 0) err.photos = "Please fill in this field.";

    const retailStr = sanitizePriceDigits(formData.retailPrice);
    const sellingStr = sanitizePriceDigits(formData.sellingPrice);
    const retail = retailStr ? parseInt(retailStr, 10) : NaN;
    const selling = sellingStr ? parseInt(sellingStr, 10) : NaN;

    if (!retailStr) {
      err.retailPrice = "Please fill in this field.";
    } else if (!Number.isFinite(retail) || retail <= 0) {
      err.retailPrice = "Please enter a valid number.";
    }

    if (!sellingStr) {
      err.sellingPrice = "Please fill in this field.";
    } else if (!Number.isFinite(selling) || selling <= 0) {
      err.sellingPrice = "Please enter a valid number.";
    }

    const livePrice = getLivePriceErrors(retailStr, sellingStr);
    Object.assign(err, livePrice);

    setFieldErrors(err);

    const firstKey = FIELD_ORDER.find((k) => err[k]);
    if (firstKey) {
      const el = document.getElementById(`field-${firstKey}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return Object.keys(err).length === 0;
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const slotsLeft = Math.max(0, 5 - imageFiles.length);
      const filesToAdd = selectedFiles.slice(0, slotsLeft);
      if (filesToAdd.length === 0) {
        e.target.value = "";
        return;
      }

      const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
      setImageFiles((prev) => [...prev, ...filesToAdd]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setUploadingMap((prev) => {
        const next = { ...prev };
        newPreviews.forEach((previewUrl) => {
          next[previewUrl] = true;
        });
        return next;
      });

      newPreviews.forEach((previewUrl) => {
        const delayMs = 1200 + Math.floor(Math.random() * 1100);
        const timerId = window.setTimeout(() => {
          setUploadingMap((prev) => {
            const next = { ...prev };
            next[previewUrl] = false;
            return next;
          });
          uploadTimersRef.current.delete(previewUrl);
        }, delayMs);
        uploadTimersRef.current.set(previewUrl, timerId);
      });

      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.photos;
        return next;
      });
      e.target.value = "";
    }
  };

  const toggleSize = (size) => {
    setFormData((prev) => {
      const updatedSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updatedSizes };
    });
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.sizes;
      return next;
    });
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const removed = prev[index];
      const timerId = uploadTimersRef.current.get(removed);
      if (timerId) {
        window.clearTimeout(timerId);
        uploadTimersRef.current.delete(removed);
      }
      setUploadingMap((prevMap) => {
        const next = { ...prevMap };
        delete next[removed];
        return next;
      });
      if (removed && removed.startsWith("blob:")) URL.revokeObjectURL(removed);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!validateProductForm()) {
      toast.error("Please complete all required fields correctly.");
      return;
    }

    // ── Moderation check on submit ─────────────────────────────────────────
    const descText = formData.description.trim();
    if (descText) {
      setSubmitting(true);
      try {
        const res = await fetch("/api/moderate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: descText }),
        });
        const data = await res.json();
        if (data.status === "rejected") {
          const msg = getModerationMessage(data.reason);
          setFieldErrors((prev) => ({ ...prev, description: msg }));
          toast.error("Description was rejected: " + msg);
          const el = document.getElementById("field-description");
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
          setSubmitting(false);
          return;
        }
      } catch {
        // Moderation API unreachable — degrade gracefully, allow submission
      }
      setSubmitting(false);
    }
    // ──────────────────────────────────────────────────────────────────────

    mergeDraftListing({ product: formData });

    if (!user) {
      setSubmitting(true);
      try {
        const urls = await Promise.all(imageFiles.map((f) => fileToDataUrl(f)));
        mergeDraftListing({ product: formData, imageDataUrls: urls });
        const next =
          pathname && pathname.startsWith("/") ? pathname : "/sell";
        router.push(`/login?redirect=${encodeURIComponent(next)}`);
      } catch (err) {
        toast.error(
          isDraftStorageFullError(err)
            ? "Could not save photos in your browser (storage full). Try fewer or smaller images, or log in first — photos then upload directly to our servers."
            : err?.message === "Image decode failed"
              ? "One image could not be read. Try JPG or PNG."
              : "Could not save your photos. Try again."
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.name);
      fd.append("brand", "Unknown");
      fd.append("category", formData.category);
      fd.append("condition", formData.condition);
      fd.append("description", formData.description);
      fd.append("price", sanitizePriceDigits(formData.sellingPrice));
      fd.append("originalPrice", sanitizePriceDigits(formData.retailPrice));
      fd.append("sizes", JSON.stringify(formData.sizes));
      imageFiles.forEach((file) => fd.append("images", file));

      const draft = getDraftListing();
      const sm = draft?.sellerProfile?.socialMediaName?.trim();
      if (sm && draft?.sellerType && SOCIAL_SELLER_TYPES.has(draft.sellerType)) {
        fd.append("socialMediaName", sm);
      }

      if (draft?.sellerType) {
        fd.append("onboardingSellerType", draft.sellerType);
        fd.append("onboardingBusinessName", "");
        fd.append("onboardingInstagramId", draft.sellerProfile?.socialMediaName || "");
      }

      const { data } = await api.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data?.user) {
        setUser(data.user);
      }

      const created = data?.product ?? data;
      const productId = created?.id ?? created?._id ?? `local-${Date.now()}`;
      const firstImage =
        (Array.isArray(created?.images) && created.images[0]) ||
        created?.imageUrl ||
        created?.thumbnail ||
        "";
      appendSellerProductFromListing({
        productId,
        title: formData.name,
        price: formData.sellingPrice,
        category: formData.category,
        image: typeof firstImage === "string" ? firstImage : "",
      });

      clearDraftListing();
      try {
        localStorage.removeItem("seller_profile");
      } catch {
        /* ignore */
      }

      imagePreviews.forEach((url) => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      setFormData({ ...defaultProductForm });
      setImageFiles([]);
      setImagePreviews([]);
      setFieldErrors({});

      setLiveModalOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;
  const retailNum = parseInt(formData.retailPrice, 10);
  const recommendedPlaceholder =
    Number.isFinite(retailNum) && retailNum > 0
      ? `₹${maxSellingForRetail(retailNum)} ~ Recommended`
      : "Enter price";

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-sm overflow-hidden animate-fadeIn pb-12">
        <div className="relative p-8 border-b border-gray-100 flex items-center justify-center">
          <div className="absolute left-8 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-brand-dark transition-all"
            >
              <ArrowBackIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-[20px] font-bold text-brand-dark">Create Listing</h2>
          </div>
          {/* <div className="p-2.5 px-3 bg-brand-pink/5 rounded-full flex items-center gap-2 text-brand-pink">
            <span className="text-[11px] font-bold uppercase tracking-tight">
              Step 3 of 6: Product
            </span>
          </div> */}
        </div>

        <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-5">
          <div id="field-photos" className="flex flex-col gap-2.5">
            <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest pl-3 border-l-4 border-brand-pink">
            Visuals
            </h3>
            <div className="relative isolate space-y-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mx-auto flex aspect-square w-full max-w-[130px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/30 px-4 text-center transition hover:border-gray-400"
              >
                <Camera className="h-5 w-5 text-gray-500" />
                <p className="mt-1.5 text-[15px] font-bold text-gray-700">Add Photos</p>
                <p className="mt-0.5 text-[10px] font-medium text-gray-400">
                  Add Pictures from your device
                </p>
              </button>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {imagePreviews.map((img, index) => {
                  const isUploading = Boolean(uploadingMap[img]);
                  return (
                    <div
                      key={img}
                      className="relative h-16 w-16 shrink-0 overflow-visible rounded-xl bg-gray-200"
                    >
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full rounded-xl object-cover"
                      />
                      {isUploading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/55">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40">
                            <Loader className="h-4 w-4 animate-spin text-white" />
                          </div>
                          <span className="absolute bottom-1 text-[8px] font-medium text-white">
                            Uploading...
                          </span>
                        </div>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:text-black"
                        aria-label="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="min-h-[18px]">
                {fieldErrors.photos ? (
                  <span className="text-[12px] text-red-600 font-medium">{fieldErrors.photos}</span>
                ) : null}
              </div>
            </div>
            {/* <div className="flex w-full items-start justify-start gap-2 px-1 sm:px-2">
              <span className="mt-0.5 inline-flex shrink-0" aria-hidden>
                <InlineInfoGlyph tone="orange" size={17} />
              </span> */}
              {/* <p className="min-w-0 text-left text-[13px] font-medium italic leading-snug text-orange-800">
                Fill the correct details. Once the product is listed it cannot be edited.
              </p> */}
            {/* </div> */}
            <button
              type="button"
              onClick={() => setGuidelinesOpen(true)}
              className="w-full px-1 text-left text-[13px] font-medium text-red-500 underline underline-offset-2 hover:text-red-600 sm:px-2"
            >
              Read our Picture Guidelines
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest pl-3 border-l-4 border-brand-pink">
              Product Detail
            </h3>
            <div className="grid grid-cols-1 gap-y-2 gap-x-4 md:grid-cols-2">
              <div id="field-name">
                <Input
                  label="Product Name"
                  placeholder="e.g. Vintage Denim Jacket"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setFieldErrors((prev) => {
                      const n = { ...prev };
                      delete n.name;
                      return n;
                    });
                  }}
                  error={fieldErrors.name}
                />
              </div>

              <div id="field-category" className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">
                  Category
                </label>
                <div className="relative isolate w-full">
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      setFieldErrors((prev) => {
                        const n = { ...prev };
                        delete n.category;
                        return n;
                      });
                    }}
                    className={clsx(
                      "cursor-pointer appearance-none py-0 pl-4 pr-12",
                      formFieldInputBase,
                      fieldErrors.category && formFieldErrorClass
                    )}
                  >
                    <option value="">Select Category</option>
                    {SELLER_PRODUCT_CATEGORY_OPTIONS.map(({ id, label }) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
                <div className="min-h-[18px]">
                  {fieldErrors.category ? (
                    <span className="text-[12px] text-red-600 font-medium">{fieldErrors.category}</span>
                  ) : null}
                </div>
              </div>

              <div
                id="field-condition"
                className={`flex flex-col gap-1 ${isConditionDropdownOpen ? "relative z-30" : ""}`}
              >
                <div className="flex items-center justify-start gap-1 pl-1">
                  <label className="text-[12px] font-semibold text-brand-dark uppercase tracking-widest">
                    Condition
                  </label>
                </div>
                <div className="relative isolate w-full" ref={conditionDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsConditionDropdownOpen((prev) => !prev)}
                    className={clsx(
                      "cursor-pointer py-0 pl-4 pr-12 text-left",
                      formFieldInputBase,
                      fieldErrors.condition && formFieldErrorClass
                    )}
                    aria-haspopup="listbox"
                    aria-expanded={isConditionDropdownOpen}
                  >
                    {formData.condition || "Select Condition"}
                  </button>
                  <SelectChevron />
                  {isConditionDropdownOpen ? (
                    <div
                      role="listbox"
                      className="absolute left-0 right-0 z-40 mt-1 max-h-80 overflow-y-auto rounded-none border border-gray-200 bg-white p-1.5 shadow-xl"
                    >
                      {CONDITION_OPTIONS.map((option) => {
                        const selected = formData.condition === option.title;
                        return (
                          <button
                            key={option.title}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            onClick={() => {
                              setFormData({ ...formData, condition: option.title });
                              setFieldErrors((prev) => {
                                const n = { ...prev };
                                delete n.condition;
                                return n;
                              });
                              setIsConditionDropdownOpen(false);
                            }}
                            className={`w-full rounded-xl px-3 py-2 text-left transition ${
                              selected ? "bg-brand-pink/10" : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span
                                className={`mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                  selected ? "border-brand-pink" : "border-gray-300"
                                }`}
                                aria-hidden
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    selected ? "bg-brand-pink" : "bg-transparent"
                                  }`}
                                />
                              </span>
                              <span className="min-w-0">
                                <p className="text-[15px] font-medium leading-snug text-brand-dark">{option.title}</p>
                                <p className="mt-0.5 text-xs font-normal leading-snug text-gray-500">{option.description}</p>
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
                <div className="min-h-[18px]">
                  {fieldErrors.condition ? (
                    <span className="text-[12px] text-red-600 font-medium">{fieldErrors.condition}</span>
                  ) : null}
                </div>
              </div>

              <div id="field-description" className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">
                  Description
                </label>
                <div className="relative isolate w-full">
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      setFieldErrors((prev) => {
                        const n = { ...prev };
                        delete n.description;
                        return n;
                      });
                    }}
                    placeholder="Share your story about this product..."
                    className={clsx(
                      formFieldTextareaBase,
                      fieldErrors.description && formFieldErrorClass
                    )}
                  />
                </div>
                <div className="min-h-[18px]">
                  {fieldErrors.description ? (
                    <span className="text-[12px] text-red-600 font-medium">{fieldErrors.description}</span>
                  ) : null}
                </div>
              </div>

              <div id="field-sizes" className="flex flex-col gap-1.5 md:col-span-2">
                <div className="flex items-center justify-start gap-0.1 pl-1">
                  <span className="text-[12px] font-bold text-brand-dark uppercase tracking-widest">
                    Select Size * 
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeChartOpen(true)}
                    className={inlineInfoBtnClass}
                    aria-label="Open size chart"
                  >
                    <InlineInfoGlyph />
                  </button>
                </div>
                <div className="relative isolate w-full">
                  <div className="flex gap-3 flex-wrap cursor-pointer">
                    {sizes.map((size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`h-[48px] w-[60px] rounded-xl border font-bold transition-all cursor-pointer
                          ${formData.sizes.includes(size)
                            ? "bg-brand-pink text-white border-brand-pink"
                            : "bg-gray-50 text-brand-dark border-gray-200 hover:border-brand-pink"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="min-h-[18px]">
                  {fieldErrors.sizes ? (
                    <span className="text-[12px] text-red-600 font-medium">{fieldErrors.sizes}</span>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1 md:col-span-2">
                {/* <p className="text-[11px] font-medium text-gray-500 pl-1"> */}
                  {/* Selling price auto-fills at <span className="font-bold text-brand-dark">30% off MRP</span> (max 70% of MRP). You can lower it further; raising it above that shows an error. */}
                {/* </p> */}
                <div className="grid grid-cols-1 items-start gap-x-3 gap-y-2 sm:grid-cols-2">
                  <div id="field-retailPrice" className="min-w-0">
                    <Input
                      label="Retail Price (MRP)"
                      placeholder="e.g. 2999"
                      inputMode="numeric"
                      value={formData.retailPrice}
                      onChange={(e) => handleRetailPriceChange(e.target.value)}
                      error={fieldErrors.retailPrice}
                    />
                  </div>
                  <div id="field-sellingPrice" className="min-w-0">
                    <div className="flex w-full flex-col gap-1.5">
                      <div className="flex items-center justify-start gap-1">
                        <label className="text-[13px] font-medium leading-snug text-brand-dark sm:text-[14px]">
                          Selling Price *
                        </label>
                        <div className="relative shrink-0" ref={sellingInfoRef}>
                          <button
                            type="button"
                            onClick={() => setIsSellingPriceInfoOpen((prev) => !prev)}
                            className={inlineInfoBtnClass}
                            aria-label="Selling price help"
                          >
                            <InlineInfoGlyph />
                          </button>
                          {isSellingPriceInfoOpen && (
                            <div className="absolute right-0 top-7 z-20 w-64 rounded-none border border-brand-pink/20 bg-white p-3 text-[12px] font-medium leading-relaxed text-brand-dark shadow-xl">
                              The selling price of a product cannot exceed its original price.
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="relative isolate w-full">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formData.sellingPrice}
                          onChange={(e) => handleSellingPriceChange(e.target.value)}
                          placeholder={recommendedPlaceholder}
                          className={clsx(
                            formFieldInputBase,
                            fieldErrors.sellingPrice && formFieldErrorClass
                          )}
                        />
                      </div>
                      <div
                        className={clsx(
                          "min-h-[18px]",
                          fieldErrors.sellingPrice && "pt-0.5"
                        )}
                      >
                        {fieldErrors.sellingPrice ? (
                          <span className="block text-[12px] leading-snug text-red-600 font-medium">
                            {fieldErrors.sellingPrice}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={submitting}
              className="mt-4 h-[54px] rounded-xl bg-[#22C55E] font-bold text-[16px] text-[#FFFFFF] shadow-lg shadow-[#22C55E]/25 ring-1 ring-white/85 transition-all hover:bg-[#16A34A] active:bg-[#16A34A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#22C55E] disabled:active:bg-[#22C55E]"
            >
              {submitting ? "Listing product..." : "Start Selling"}
            </Button>
          </div>
        </form>
      </div>

      {isSizeChartOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-chart-title"
        >
          <div className="absolute inset-0 cursor-default bg-black/45" aria-hidden />
          <div
            className="relative z-[101] max-h-[min(90vh,720px)] w-full max-w-2xl overflow-y-auto rounded-none bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-brand-pink transition hover:bg-brand-pink/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
              aria-label="Close"
            >
              <span className="text-2xl font-light leading-none">&times;</span>
            </button>

            <h2
              id="size-chart-title"
              className="pr-10 text-left text-lg font-bold tracking-tight text-brand-dark sm:text-xl"
            >
              SIZE CHART (inches)
            </h2>
            <p className="mt-1 text-left text-[13px] leading-relaxed text-gray-500 sm:text-[14px]">
              Refer to the sizing chart to help you find your best fit. <br/> Garment sizes may vary based
              on brand, fabric and design.
            </p>

            <div className="mt-4 overflow-x-auto rounded-none border border-gray-100">
              <table className="w-full min-w-[520px] border-collapse text-left text-[12px] sm:text-[13px]">
                <thead>
                  <tr className="bg-brand-pink text-white">
                    <th className="px-3 py-2.5 font-bold sm:px-4">Size</th>
                    <th className="px-3 py-2.5 font-bold sm:px-4">Chest</th>
                    <th className="px-3 py-2.5 font-bold sm:px-4">Waist</th>
                    <th className="px-3 py-2.5 font-bold sm:px-4">Hips</th>
                    <th className="px-3 py-2.5 font-bold sm:px-4">Length (Top)</th>
                    <th className="px-3 py-2.5 font-bold sm:px-4">Shoulder</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART_ROWS.map((row, i) => (
                    <tr
                      key={row.size}
                      className={i % 2 === 0 ? "bg-brand-pink/[0.06]" : "bg-white"}
                    >
                      <td className="px-3 py-2 font-bold text-brand-pink sm:px-4">{row.size}</td>
                      <td className="px-3 py-2 text-brand-dark sm:px-4">{row.chest}</td>
                      <td className="px-3 py-2 text-brand-dark sm:px-4">{row.waist}</td>
                      <td className="px-3 py-2 text-brand-dark sm:px-4">{row.hips}</td>
                      <td className="px-3 py-2 text-brand-dark sm:px-4">{row.length}</td>
                      <td className="px-3 py-2 text-brand-dark sm:px-4">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <div className="overflow-hidden rounded-none p-1 sm:p-2">
                <img
                  src="/size-measure-guide.png"
                  alt="How to measure size guide"
                  className="mx-auto h-auto w-full max-w-[920px] scale-[1.04] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {guidelinesOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="picture-guidelines-title"
        >
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            aria-hidden
            onClick={() => setGuidelinesOpen(false)}
          />
          <div
            className="relative z-[101] max-h-[min(88vh,680px)] w-full max-w-[620px] overflow-y-auto rounded-none bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setGuidelinesOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-brand-dark"
              aria-label="Close"
            >
              <span className="text-2xl font-light leading-none">&times;</span>
            </button>

            <h2
              id="picture-guidelines-title"
              className="pr-10 text-[17px] font-bold tracking-tight text-brand-dark sm:text-xl"
            >
              Picture guidelines
            </h2>

            <div className="mt-6 space-y-6 text-left text-[13px] leading-relaxed text-gray-700 sm:text-[14px]">
              <section>
                <p className="font-bold text-brand-dark">✅ PRODUCT CRITERIA</p>
              </section>
              <section className="space-y-2">
                <p className="font-bold text-brand-dark">📸 IMAGE QUALITY</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Clear, sharp (no blur/noise)</li>
                  <li>Bright, even lighting</li>
                  <li>No filters (real colors)</li>
                </ul>
              </section>
              <section className="space-y-2">
                <p className="font-bold text-brand-dark">🎨 BACKGROUND</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Plain white/light background</li>
                  <li>No clutter or distractions</li>
                </ul>
              </section>
              <section className="space-y-2">
                <p className="font-bold text-brand-dark">👗 PRESENTATION</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Clean & wrinkle-free</li>
                  <li>No misleading styling</li>
                </ul>
              </section>
              <section className="space-y-2">
                <p className="font-bold text-brand-dark">🔄 MUST-HAVE ANGLES</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Front view</li>
                  <li>Back view</li>
                  <li>Side view</li>
                  <li>Close-up (fabric/texture)</li>
                  <li>Detail shots (buttons, etc.)</li>
                </ul>
              </section>
              <section>
                <p className="font-bold text-brand-dark">📝 PRODUCT DETAILS</p>
                <p className="mt-1 text-gray-600">
                  Type • Fabric • Color<br />
                  Size • Condition • Fit
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      {liveModalOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-live-title"
        >
          <div className="relative z-[121] w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-[480px]">
            {/* Top: soft gradient + success mark */}
            <div className="relative bg-gradient-to-b from-rose-100/90 via-violet-100/50 to-white px-6 pb-2 pt-10 sm:px-8 sm:pt-12">
              <button
                type="button"
                onClick={() => {
                  setLiveModalOpen(false);
                  router.push("/seller/profile");
                }}
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/60 hover:text-slate-800"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
              <div className="flex justify-center">
                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-white shadow-lg shadow-rose-200/40 ring-1 ring-white/80 sm:h-[100px] sm:w-[100px]">
                  <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-[#d23284] shadow-md sm:h-[62px] sm:w-[62px]">
                    <Check className="h-8 w-8 text-white sm:h-9 sm:w-9" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
              <h2
                id="product-live-title"
                className="text-center font-manrope text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]"
              >
                Your Product is Live!
              </h2>
              <p className="mt-3 text-center font-inter text-sm leading-relaxed text-slate-500 sm:text-base">
                Your listing has been successfully live and is now visible to buyers on the platform.
              </p>

              <div className="relative mt-6 overflow-hidden rounded-2xl bg-slate-50 p-5 sm:p-6">
                <Rocket
                  className="pointer-events-none absolute -right-1 -top-1 h-24 w-24 text-rose-200/35 sm:h-28 sm:w-28"
                  strokeWidth={1.25}
                  aria-hidden
                />
                <div className="relative z-[1] flex items-center gap-2">
                  <Sparkles className="h-5 w-5 shrink-0 text-[#d23284]" strokeWidth={2} />
                  <p className="font-manrope text-base font-bold text-slate-900 sm:text-lg">
                    Maximize your reach
                  </p>
                </div>
                <p className="relative z-[1] mt-3 font-inter text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                  Want to reach more buyers faster? Boost your listing to increase visibility, appear
                  higher in search results and attract more views.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLiveModalOpen(false);
                  router.push("/seller/boost");
                }}
                className="mt-6 h-12 w-full rounded-xl bg-gradient-to-r from-rose-500 to-[#d23284] font-inter text-sm font-semibold text-white shadow-md shadow-rose-500/25 transition hover:brightness-105 active:scale-[0.98] sm:h-14 sm:text-base"
              >
                Boost Listing
              </button>
              <button
                type="button"
                onClick={() => {
                  setLiveModalOpen(false);
                  router.push("/seller/profile");
                }}
                className="mt-6 w-full text-center font-inter text-sm font-medium text-slate-500 transition hover:text-slate-800"
              >
                Maybe Later
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50/90 px-4 py-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} />
              <p className="text-center font-inter text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                Verified marketplace transaction
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
