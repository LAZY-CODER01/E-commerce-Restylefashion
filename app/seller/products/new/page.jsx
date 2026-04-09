"use client";

import React, { useState, useRef, useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  getDraftListing,
  mergeDraftListing,
  dataUrlsToFiles,
  fileToDataUrl,
  clearDraftListing,
} from "@/lib/draftListing";
import clsx from "clsx";
import ValidationTooltip from "@/components/ValidationTooltip";

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
      } catch {
        if (!cancelled) toast.error("Could not save photos to draft.");
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
    const retail = parseInt(cleaned, 10);
    const suggested =
      Number.isFinite(retail) && retail > 0
        ? String(maxSellingForRetail(retail))
        : "";
    setFormData((prev) => ({
      ...prev,
      retailPrice: cleaned,
      sellingPrice: suggested,
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
      const newFiles = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...newFiles].slice(0, 5));
      const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
      setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.photos;
        return next;
      });
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

    mergeDraftListing({ product: formData });

    if (!user) {
      setSubmitting(true);
      try {
        const urls = await Promise.all(imageFiles.map((f) => fileToDataUrl(f)));
        mergeDraftListing({ product: formData, imageDataUrls: urls });
        const next =
          pathname && pathname.startsWith("/") ? pathname : "/sell";
        router.push(`/login?redirect=${encodeURIComponent(next)}`);
      } catch {
        toast.error("Could not save your photos. Try again.");
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

      toast.success("Product listed! Awaiting admin review 🚀", {
        style: { borderRadius: "16px" },
      });
      router.replace("/verification");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-sm overflow-hidden animate-fadeIn pb-12">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-brand-dark transition-all"
            >
              <ArrowBackIcon sx={{ fontSize: 20 }} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-[20px] font-bold text-brand-dark">Product Listing</h2>
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                Create New Submission
              </p>
            </div>
          </div>
          <div className="p-2.5 px-3 bg-brand-pink/5 rounded-full flex items-center gap-2 text-brand-pink">
            <span className="text-[11px] font-bold uppercase tracking-tight">
              Step 3 of 6: Product
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-8">
          <div id="field-photos" className="flex flex-col gap-4">
            <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest pl-3 border-l-4 border-brand-pink">
              Visuals
            </h3>
            <div className="relative isolate">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {imagePreviews.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-50 rounded-[24px] border border-gray-100 relative overflow-hidden group"
                >
                  <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </button>
                </div>
              ))}

              {imagePreviews.length < 5 && (
                <label
                  className={clsx(
                    "aspect-square bg-white border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-pink hover:bg-brand-pink/5 transition-all text-gray-400 hover:text-brand-pink relative overflow-hidden border-gray-300"
                  )}
                >
                  <AddPhotoAlternateIcon sx={{ fontSize: 28 }} />
                  <span className="text-[11px] font-bold uppercase tracking-tight text-center px-2 z-10">
                    Add Photos
                    <br />
                    (Max 5)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              )}

              {[...Array(Math.max(0, 4 - imagePreviews.length))].map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square bg-gray-50 rounded-[24px] border border-gray-100 opacity-50 flex items-center justify-center text-gray-300"
                >
                  <AddPhotoAlternateIcon sx={{ fontSize: 20 }} />
                </div>
              ))}
            </div>
            {fieldErrors.photos && (
              <ValidationTooltip message={fieldErrors.photos} floating />
            )}
            </div>
            <div className="flex items-center justify-center gap-3 px-1 sm:px-2">
              <span
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-700 ring-1 ring-orange-100"
                aria-hidden
              >
                <InfoOutlinedIcon sx={{ fontSize: 18 }} className="block leading-none" />
              </span>
              <p className="max-w-xl flex-1 text-left text-[13px] font-medium italic leading-snug text-orange-800">
                Fill the correct details. Once the product is listed it cannot be edited.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest pl-3 border-l-4 border-brand-pink">
              Product Detail
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  tooltipError
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
                    className="h-[54px] w-full px-6 border border-gray-200 rounded-full bg-gray-50/50 text-[14px] text-brand-dark font-bold cursor-pointer outline-none focus:border-brand-pink focus:bg-white transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="vintage">Vintage</option>
                    <option value="formals">Formals</option>
                    <option value="streetwear">Streetwear</option>
                    <option value="ethnic">Ethnic</option>
                    <option value="accessories">Accessories</option>
                    <option value="footwear">Footwear</option>
                  </select>
                  {fieldErrors.category && (
                    <ValidationTooltip message={fieldErrors.category} floating />
                  )}
                </div>
              </div>

              <div id="field-condition" className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">
                  Condition
                </label>
                <div className="relative isolate w-full">
                  <select
                    value={formData.condition}
                    onChange={(e) => {
                      setFormData({ ...formData, condition: e.target.value });
                      setFieldErrors((prev) => {
                        const n = { ...prev };
                        delete n.condition;
                        return n;
                      });
                    }}
                    className="h-[54px] w-full px-6 border border-gray-200 rounded-full bg-gray-50/50 text-[14px] text-brand-dark font-bold cursor-pointer outline-none focus:border-brand-pink focus:bg-white transition-all"
                  >
                    <option value="">Select Condition</option>
                    <option value="New">Brand New</option>
                    <option value="New without tags">New without Tags</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Gently Used">Gently Used</option>
                    <option value="Good">Good</option>
                    <option value="Vintage">Vintage</option>
                  </select>
                  {fieldErrors.condition && (
                    <ValidationTooltip message={fieldErrors.condition} floating />
                  )}
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
                    className="min-h-[120px] w-full p-6 border border-gray-200 rounded-[28px] bg-gray-50/50 text-[14px] text-brand-dark font-medium outline-none focus:border-brand-pink focus:bg-white transition-all resize-none"
                  />
                  {fieldErrors.description && (
                    <ValidationTooltip message={fieldErrors.description} floating />
                  )}
                </div>
              </div>

              <div id="field-sizes" className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">
                  Select Size
                </label>
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
                  {fieldErrors.sizes && (
                    <ValidationTooltip message={fieldErrors.sizes} floating />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 md:col-span-2">
                {/* <p className="text-[11px] font-medium text-gray-500 pl-1"> */}
                  {/* Selling price auto-fills at <span className="font-bold text-brand-dark">30% off MRP</span> (max 70% of MRP). You can lower it further; raising it above that shows an error. */}
                {/* </p> */}
                <div className="grid grid-cols-2 gap-4">
                  <div id="field-retailPrice">
                    <Input
                      label="Retail Price (MRP)"
                      placeholder="e.g. 2999"
                      inputMode="numeric"
                      value={formData.retailPrice}
                      onChange={(e) => handleRetailPriceChange(e.target.value)}
                      error={fieldErrors.retailPrice}
                      tooltipError
                    />
                  </div>
                  <div id="field-sellingPrice">
                    <Input
                      label="Selling Price (≤ 70% of MRP)"
                      placeholder="Auto from MRP"
                      inputMode="numeric"
                      value={formData.sellingPrice}
                      onChange={(e) => handleSellingPriceChange(e.target.value)}
                      error={fieldErrors.sellingPrice}
                      tooltipError
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={submitting}
              className="h-[54px] rounded-full font-bold text-[16px] mt-8 shadow-xl shadow-brand-pink/20 transition-all"
            >
              {submitting ? "Listing product..." : "Start Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
