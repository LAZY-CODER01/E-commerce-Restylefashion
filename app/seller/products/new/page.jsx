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
import { Camera, X, Loader } from "lucide-react";
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
import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";

const SOCIAL_SELLER_TYPES = new Set(["influencer", "designer", "thrifter"]);

const defaultProductForm = {
  sizes: [],
  colors: [],
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

const DESCRIPTION_MAX_CHARS = 100;

function countDescriptionChars(text) {
  return String(text ?? "").length;
}

/** Keeps at most `max` characters; extra input from paste/typing is dropped. */
function clampDescriptionToMaxChars(text, max = DESCRIPTION_MAX_CHARS) {
  return String(text ?? "").slice(0, max);
}

function readInitialProductForm() {
  if (typeof window === "undefined") return defaultProductForm;
  const draft = getDraftListing();
  if (draft?.product) {
    const { brand: _b, ...rest } = draft.product;
    return {
      ...defaultProductForm,
      ...rest,
      description: clampDescriptionToMaxChars(rest.description ?? ""),
    };
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

function SelectChevron({ open = false }) {
  return (
    <span
      className={clsx(
        "pointer-events-none absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-brand-dark/50 transition-transform duration-200",
        open && "rotate-180"
      )}
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
        setFormData({
          ...defaultProductForm,
          ...rest,
          description: clampDescriptionToMaxChars(rest.description ?? ""),
        });
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
    const onKey = (e) => {
      if (e.key === "Escape") setIsConditionDropdownOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isConditionDropdownOpen]);

  useEffect(() => {
    if (!isConditionDropdownOpen) return;
    const onPointer = (e) => {
      if (conditionDropdownRef.current && !conditionDropdownRef.current.contains(e.target)) {
        setIsConditionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
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

  const clearDescriptionFieldError = () => {
    setFieldErrors((prev) => {
      const n = { ...prev };
      delete n.description;
      return n;
    });
  };

  const applyDescriptionValue = (next) => {
    setFormData((prev) => ({ ...prev, description: clampDescriptionToMaxChars(next) }));
  };

  const descriptionInputWouldTruncate = (next) =>
    clampDescriptionToMaxChars(next) !== next;

  const handleDescriptionChange = (e) => {
    applyDescriptionValue(e.target.value);
    clearDescriptionFieldError();
  };

  const handleDescriptionBeforeInput = (e) => {
    if (e.inputType?.startsWith("delete")) return;
    if (e.inputType === "insertFromComposition" || (e.inputType && String(e.inputType).includes("Composition")))
      return;
    if (e.inputType === "insertFromPaste" || e.inputType === "insertFromDrop") {
      e.preventDefault();
      return;
    }

    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start == null || end == null) return;

    let insert = e.data;
    if (e.inputType === "insertLineBreak" || e.inputType === "insertParagraph") {
      insert = "\n";
    } else if (insert == null) return;

    const next = el.value.slice(0, start) + insert + el.value.slice(end);
    if (descriptionInputWouldTruncate(next)) e.preventDefault();
  };

  const handleDescriptionPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const el = e.currentTarget;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const next = el.value.slice(0, start) + text + el.value.slice(end);
    applyDescriptionValue(next);
    clearDescriptionFieldError();
  };

  const handleDescriptionDrop = (e) => {
    e.preventDefault();
    const text = e.dataTransfer.getData("text/plain");
    if (!text) return;
    const el = e.currentTarget;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const next = el.value.slice(0, start) + text + el.value.slice(end);
    applyDescriptionValue(next);
    clearDescriptionFieldError();
    
  };

  const validateProductForm = () => {
    const err = {};

    if (!formData.name.trim()) err.name = "Please fill in this field.";
    if (!formData.category) err.category = "Please fill in this field.";
    if (!formData.condition) err.condition = "Please fill in this field.";
    if (!formData.description.trim()) {
      err.description = "Please fill in this field.";
    } else if (countDescriptionChars(formData.description) > DESCRIPTION_MAX_CHARS) {
      err.description = `Description must be ${DESCRIPTION_MAX_CHARS} characters or fewer.`;
    }
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

  const toggleColor = (color) => {
    setFormData((prev) => {
      const updatedColors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: updatedColors };
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
        router.push(`/auth?next=${encodeURIComponent(next)}`);
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
      fd.append("colors", JSON.stringify(formData.colors));
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
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 pb-24 font-roboto">
      <div className="w-full max-w-2xl overflow-visible rounded-[32px] bg-white shadow-sm animate-fadeIn pb-12">
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
            <h1 className="text-[20px] font-bold text-brand-pink">Snap, Describe, Sell</h1>
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
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
              <div id="field-name" className="md:col-span-2">
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
                  className="!rounded-2xl"
                />
              </div>

              <div id="field-category" className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-brand-dark" htmlFor="product-category">
                  Category
                </label>
                <div className="relative isolate w-full">
                  <select
                    id="product-category"
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
                      "cursor-pointer appearance-none py-0 pl-4 pr-12 !rounded-2xl",
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
                className={`flex flex-col gap-1.5 ${isConditionDropdownOpen ? "relative z-[100]" : ""}`}
              >
                <div className="relative w-full" ref={conditionDropdownRef}>
                  <label
                    id="field-condition-label"
                    className="block text-[14px] font-medium text-brand-dark"
                    htmlFor={!isConditionDropdownOpen ? "product-condition-trigger" : undefined}
                  >
                    Condition
                  </label>

                  <div className="relative mt-1.5 min-h-12 w-full">
                    {!isConditionDropdownOpen && (
                      <div className="relative isolate w-full">
                        <button
                          id="product-condition-trigger"
                          type="button"
                          onClick={() => setIsConditionDropdownOpen((prev) => !prev)}
                          className={clsx(
                            "h-12 w-full cursor-pointer py-0 pl-4 pr-12 text-left !rounded-2xl",
                            formFieldInputBase,
                            fieldErrors.condition && formFieldErrorClass
                          )}
                          aria-haspopup="listbox"
                          aria-expanded={false}
                          aria-labelledby="field-condition-label"
                        >
                          {formData.condition || "Select Condition"}
                        </button>
                        <SelectChevron open={false} />
                      </div>
                    )}
                    {isConditionDropdownOpen && (
                      <div
                        role="listbox"
                        aria-labelledby="field-condition-label"
                        className="absolute left-1/2 top-0 z-50 w-[min(100%,24rem)] max-w-md -translate-x-1/2 max-h-80 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xl"
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
                                  <p className="text-[15px] font-medium leading-snug text-brand-dark">
                                    {option.title}
                                  </p>
                                  <p className="mt-0.5 text-xs font-normal leading-snug text-gray-500">
                                    {option.description}
                                  </p>
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
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
                    onChange={handleDescriptionChange}
                    onBeforeInput={handleDescriptionBeforeInput}
                    onPaste={handleDescriptionPaste}
                    onDrop={handleDescriptionDrop}
                    placeholder="Share your story about this product..."
                    className={clsx(
                      formFieldTextareaBase,
                      "pb-9",
                      fieldErrors.description && formFieldErrorClass
                    )}
                    aria-describedby="description-count"
                  />
                  <p
                    id="description-count"
                    className={clsx(
                      "pointer-events-none absolute bottom-2.5 right-3 text-[11px] sm:text-xs tabular-nums",
                      countDescriptionChars(formData.description) >= DESCRIPTION_MAX_CHARS
                        ? "font-medium text-amber-800"
                        : "text-gray-500"
                    )}
                    aria-label={`${countDescriptionChars(formData.description)} of ${DESCRIPTION_MAX_CHARS} characters`}
                  >
                    {countDescriptionChars(formData.description)}/{DESCRIPTION_MAX_CHARS}
                  </p>
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
                  <div className="grid w-full grid-cols-5 gap-1.5 sm:gap-2.5">
                    {sizes.map((size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`flex h-9 w-full min-w-0 max-w-full items-center justify-center rounded-md border text-[12px] font-bold leading-none transition-colors sm:h-9 sm:rounded-lg sm:text-[13px]
                          ${formData.sizes.includes(size)
                            ? "border-brand-pink bg-brand-pink/10 text-brand-pink"
                            : "border-gray-200 bg-white text-brand-dark hover:border-gray-300"
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

              {/* ── Color Picker ──────────────────────────────────────────── */}
              <div id="field-colors" className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">
                  Colour (optional)
                </span>
                <div className="flex flex-wrap gap-3 pl-1">
                  {[
                    { name: "Black",      hex: "#1C1C1E" },
                    { name: "White",      hex: "#FFFFFF" },
                    { name: "Red",        hex: "#E8001C" },
                    { name: "Pink",       hex: "#F7246E" },
                    { name: "Blue",       hex: "#2563EB" },
                    { name: "Light Blue", hex: "#93C5FD" },
                    { name: "Navy",       hex: "#1E3A5F" },
                    { name: "Green",      hex: "#16A34A" },
                    { name: "Yellow",     hex: "#FBBF24" },
                    { name: "Orange",     hex: "#F97316" },
                    { name: "Purple",     hex: "#7C3AED" },
                    { name: "Brown",      hex: "#92400E" },
                    { name: "Beige",      hex: "#D4B896" },
                    { name: "Grey",       hex: "#9CA3AF" },
                  ].map(({ name, hex }) => {
                    const selected = formData.colors.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        title={name}
                        onClick={() => toggleColor(name)}
                        className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-150 ${
                          selected
                            ? "ring-2 ring-brand-pink ring-offset-2"
                            : "ring-1 ring-gray-200 hover:ring-gray-300"
                        }`}
                        style={{ backgroundColor: hex }}
                        aria-label={name}
                        aria-pressed={selected}
                      >
                        {selected && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={name === "White" || name === "Beige" || name === "Light Blue" || name === "Yellow" ? "#1C1C1E" : "#FFFFFF"}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
                {formData.colors.length > 0 && (
                  <p className="text-[11px] font-medium text-gray-500 pl-1">
                    Selected: {formData.colors.join(", ")}
                  </p>
                )}
              </div>
              {/* ───────────────────────────────────────────────────────────── */}

              <div className="grid grid-cols-1 gap-1 md:col-span-2">
                {/* <p className="text-[11px] font-medium text-gray-500 pl-1"> */}
                  {/* Selling price auto-fills at <span className="font-bold text-brand-dark">30% off MRP</span> (max 70% of MRP). You can lower it further; raising it above that shows an error. */}
                {/* </p> */}
                <div className="grid grid-cols-1 items-stretch gap-x-3 gap-y-2 sm:grid-cols-2 sm:items-start">
                  <div id="field-retailPrice" className="min-w-0">
                    <div className="flex w-full flex-col gap-1.5">
                      <div className="flex min-h-[26px] items-center gap-1">
                        <label
                          htmlFor="product-retail-price"
                          className="text-[14px] font-medium leading-none text-brand-dark"
                        >
                          Retail Price (MRP)
                        </label>
                      </div>
                      <div className="relative isolate w-full">
                        <input
                          id="product-retail-price"
                          type="text"
                          inputMode="numeric"
                          value={formData.retailPrice}
                          onChange={(e) => handleRetailPriceChange(e.target.value)}
                          placeholder="e.g. 2999"
                          className={clsx(
                            formFieldInputBase,
                            fieldErrors.retailPrice && formFieldErrorClass
                          )}
                        />
                      </div>
                      <div className="min-h-[18px]">
                        {fieldErrors.retailPrice ? (
                          <span className="text-[12px] font-medium text-red-600">
                            {fieldErrors.retailPrice}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div id="field-sellingPrice" className="min-w-0">
                    <div className="flex w-full flex-col gap-1.5">
                      <div className="flex min-h-[26px] items-center gap-1">
                        <label
                          htmlFor="product-selling-price"
                          className="text-[14px] font-medium leading-none text-brand-dark"
                        >
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
                          id="product-selling-price"
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
                      {Number.isFinite(retailNum) && retailNum > 0 && !fieldErrors.sellingPrice && (
                        <p className="text-[11px] font-medium text-brand-pink pl-1">
                          💡 Recommended price: <span className="font-bold">₹{maxSellingForRetail(retailNum)}</span> (30% off MRP)
                        </p>
                      )}
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
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px] sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-live-title"
        >
          <div className="relative z-[121] w-full max-w-[460px] overflow-hidden rounded-2xl bg-white p-6 shadow-2xl sm:max-w-[520px] sm:p-8">
            <button
              type="button"
              onClick={() => setLiveModalOpen(false)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            <h2
              id="product-live-title"
              className="pt-1 text-center font-manrope text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl"
            >
              Your product is live ⚡
            </h2>
            <p className="mt-2 text-center font-inter text-sm leading-relaxed text-slate-500 sm:text-[15px]">
              Your product listing is now successfully active.
            </p>
            <div className="mt-4 border-b border-slate-200" />

            <div className="mt-5 flex gap-3 sm:gap-4">
              <div className="shrink-0" aria-hidden>
                <img
                  src="/boost-growth-icon.png"
                  alt=""
                  className="h-11 w-11 object-contain sm:h-12 sm:w-12"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(18%) sepia(99%) saturate(5409%) hue-rotate(329deg) brightness(101%) contrast(106%)",
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-manrope text-sm font-bold text-slate-900 sm:text-base">
                  Want to sell faster?
                </p>
                <p className="mt-1.5 font-inter text-[13px] leading-relaxed text-slate-600 sm:text-sm">
                  Boost your listing to increase visibility, appear higher in search results and
                  attract more views.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setLiveModalOpen(false);
                router.push("/seller/boost");
              }}
              className="mt-5 h-12 w-full rounded-xl bg-[#008A45] font-inter text-sm font-bold text-white transition hover:bg-[#007A3D] active:scale-[0.99] sm:h-[52px] sm:text-base"
            >
              Boost Listing
            </button>

            <div className="mt-5 flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="shrink-0 font-inter text-xs font-medium text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setLiveModalOpen(false);
                  router.push("/profile/listings");
                }}
                className="h-11 min-h-0 flex-1 rounded-xl border border-slate-200 bg-white font-inter text-sm font-medium text-slate-900 transition hover:bg-slate-50 active:scale-[0.99] sm:h-12"
              >
                View My Listings
              </button>
              <button
                type="button"
                onClick={() => {
                  setLiveModalOpen(false);
                }}
                className="h-11 min-h-0 flex-1 rounded-xl border border-slate-200 bg-white font-inter text-sm font-medium text-slate-900 transition hover:bg-slate-50 active:scale-[0.99] sm:h-12"
              >
                List Another Item
              </button>
            </div>
          </div>
        </div>
      )}

      <SellerProcessBottomNav />
    </div>
  );
}
