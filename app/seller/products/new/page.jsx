"use client";

import React, { useState, useRef, useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  getDraftListing,
  mergeDraftListing,
  dataUrlsToFiles,
  fileToDataUrl,
  clearDraftListing,
} from "@/lib/draftListing";

const SOCIAL_SELLER_TYPES = new Set(["influencer", "designer", "thrifter"]);

const defaultProductForm = {
  sizes: [],
  name: "",
  brand: "",
  category: "",
  description: "",
  condition: "",
  retailPrice: "",
  sellingPrice: "",
};

function readInitialProductForm() {
  if (typeof window === "undefined") return defaultProductForm;
  const draft = getDraftListing();
  if (draft?.product) {
    return { ...defaultProductForm, ...draft.product };
  }
  return defaultProductForm;
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

   useEffect(() => {
      if (typeof window === "undefined") return;
      let cancelled = false;

      async function rehydrateFromStorage() {
         const draft = getDraftListing();
         if (draft?.product) {
            setFormData({ ...defaultProductForm, ...draft.product });
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

   const isFilled =
      formData.name.trim() !== "" &&
      formData.category !== "" &&
      formData.condition !== "" &&
      formData.description.trim() !== "" &&
      formData.retailPrice.trim() !== "" &&
      formData.sellingPrice.trim() !== "" &&
      formData.sizes.length > 0 &&
      imageFiles.length > 0;

   const handleImageUpload = (e) => {
      if (e.target.files) {
         const newFiles = Array.from(e.target.files);
         setImageFiles((prev) => [...prev, ...newFiles].slice(0, 5));
         const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
         setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
      }
   };

   const toggleSize = (size) => {
      setFormData((prev) => {
         const updatedSizes = prev.sizes.includes(size)
            ? prev.sizes.filter((s) => s !== size)
            : [...prev.sizes, size];
         return { ...prev, sizes: updatedSizes };
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
      if (!isFilled || submitting) return;

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
         fd.append("brand", formData.brand || "Unknown");
         fd.append("category", formData.category);
         fd.append("condition", formData.condition);
         fd.append("description", formData.description);
         fd.append("price", formData.sellingPrice);
         fd.append("originalPrice", formData.retailPrice);
         fd.append("sizes", JSON.stringify(formData.sizes));
         imageFiles.forEach((file) => fd.append("images", file));

         const draft = getDraftListing();
         const sm = draft?.sellerProfile?.socialMediaName?.trim();
         if (sm && draft?.sellerType && SOCIAL_SELLER_TYPES.has(draft.sellerType)) {
            fd.append("socialMediaName", sm);
         }
         const bn = draft?.sellerProfile?.businessName?.trim();
         if (
            draft?.sellerType &&
            draft.sellerType !== "individual" &&
            bn
         ) {
            fd.append("businessName", bn);
         }

         if (draft?.sellerType) {
            fd.append("onboardingSellerType", draft.sellerType);
            fd.append(
               "onboardingBusinessName",
               draft.sellerType === "individual" ? "" : draft.sellerProfile?.businessName || ""
            );
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

            {/* Header */}
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
                     <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Create New Submission</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="p-2.5 px-3 bg-brand-pink/5 rounded-full flex items-center gap-2 text-brand-pink">
                    <InfoIcon sx={{ fontSize: 18 }} />
                    <span className="text-[11px] font-bold uppercase tracking-tight">Step 3 of 6: Product</span>
                  </div>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-8">
               {/* Section 1: Photos */}
               <div className="flex flex-col gap-4">
                  <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest pl-3 border-l-4 border-brand-pink">Visuals</h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                     {/* Uploaded Images */}
                     {imagePreviews.map((img, index) => (
                        <div key={index} className="aspect-square bg-gray-50 rounded-[24px] border border-gray-100 relative overflow-hidden group">
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

                     {/* Upload Button visible if slots left */}
                     {imagePreviews.length < 5 && (
                        <label className="aspect-square bg-white border-2 border-dashed border-gray-300 rounded-[24px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-pink hover:bg-brand-pink/5 transition-all text-gray-400 hover:text-brand-pink relative overflow-hidden">
                           <AddPhotoAlternateIcon sx={{ fontSize: 28 }} />
                           <span className="text-[11px] font-bold uppercase tracking-tight text-center px-2 z-10">Add Photos<br />(Max 5)</span>
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

                     {/* Empty State placeholders */}
                     {[...Array(Math.max(0, 4 - imagePreviews.length))].map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square bg-gray-50 rounded-[24px] border border-gray-100 opacity-50 flex items-center justify-center text-gray-300">
                           <AddPhotoAlternateIcon sx={{ fontSize: 20 }} />
                        </div>
                     ))}
                  </div>
                  <div className="p-4 bg-orange-50/50 rounded-2xl flex items-center gap-3 border border-orange-100">
                     <InfoIcon className="text-orange-400 scale-75" />
                     <p className="text-[12px] font-medium text-orange-700 italic">&quot;All this information will be seen by the buyers&quot;</p>
                  </div>
               </div>

               {/* Section 2: Details */}
               <div className="flex flex-col gap-6">
                  <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest pl-3 border-l-4 border-brand-pink">Product Detail</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Input label="Product Name" placeholder="e.g. Vintage Denim Jacket" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                     <Input label="Brand" placeholder="e.g. Levi's, Zara" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />

                     <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">Category</label>
                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="h-[54px] px-6 border border-gray-200 rounded-full bg-gray-50/50 text-[14px] text-brand-dark font-bold cursor-pointer outline-none focus:border-brand-pink focus:bg-white transition-all">
                           <option value="">Select Category</option>
                           <option value="vintage">Vintage</option>
                           <option value="formals">Formals</option>
                           <option value="streetwear">Streetwear</option>
                           <option value="ethnic">Ethnic</option>
                           <option value="accessories">Accessories</option>
                           <option value="footwear">Footwear</option>
                        </select>
                     </div>

                     <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">Condition</label>
                        <select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className="h-[54px] px-6 border border-gray-200 rounded-full bg-gray-50/50 text-[14px] text-brand-dark font-bold cursor-pointer outline-none focus:border-brand-pink focus:bg-white transition-all">
                           <option value="">Select Condition</option>
                           <option value="New">Brand New</option>
                           <option value="New without tags">New without Tags</option>
                           <option value="Excellent">Excellent</option>
                           <option value="Gently Used">Gently Used</option>
                           <option value="Good">Good</option>
                           <option value="Vintage">Vintage</option>
                        </select>
                     </div>

                     <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Share your story about this product..." className="min-h-[120px] p-6 border border-gray-200 rounded-[28px] bg-gray-50/50 text-[14px] text-brand-dark font-medium outline-none focus:border-brand-pink focus:bg-white transition-all resize-none" />
                     </div>

                     <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">Select Size</label>
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

                     <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <Input label="Retail Price (MRP)" placeholder="e.g. 2999" value={formData.retailPrice} onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })} />
                        <Input label="Selling Price" placeholder="Your offer price" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })} />
                     </div>
                  </div>

                  <Button
                     type="submit"
                     fullWidth
                     disabled={!isFilled || submitting}
                     className={`h-[54px] rounded-full font-bold text-[16px] mt-8 shadow-xl shadow-brand-pink/20 transition-all ${
                        isFilled && !submitting ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-50"
                     }`}
                  >
                     {submitting ? "Listing product..." : "Start Listing"}
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
}
