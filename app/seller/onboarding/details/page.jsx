"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { getDraftListing, mergeDraftListing } from "@/lib/draftListing";

const SOCIAL_SELLER_TYPES = new Set(["influencer", "designer", "thrifter"]);

function readInitialSellerType() {
  if (typeof window === "undefined") return "";
  const draft = getDraftListing();
  return draft?.sellerType || localStorage.getItem("seller_type") || "";
}

function readInitialProfile() {
  if (typeof window === "undefined") {
    return { fullName: "", businessName: "", socialMediaName: "" };
  }
  const draft = getDraftListing();
  const sp = draft?.sellerProfile;
  return {
    fullName: sp?.fullName || "",
    businessName: sp?.businessName || "",
    socialMediaName: sp?.socialMediaName || sp?.instagramId || "",
  };
}

export default function SellerDetailsPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [sellerType, setSellerType] = useState(() => readInitialSellerType());
  const [formData, setFormData] = useState(() => readInitialProfile());
  const [submitting, setSubmitting] = useState(false);

  const showSocialField = SOCIAL_SELLER_TYPES.has(sellerType);
  const isIndividual = sellerType === "individual";
  const showBusinessName = !isIndividual;
  const infoHeading = isIndividual ? "Personal Info" : "Business Info";

  useEffect(() => {
    if (user?.fullName) {
      setFormData((prev) =>
        prev.fullName.trim() ? prev : { ...prev, fullName: user.fullName }
      );
    }
  }, [user]);

  useEffect(() => {
    if (!showSocialField) {
      setFormData((prev) => ({ ...prev, socialMediaName: "" }));
    }
  }, [showSocialField, sellerType]);

  useEffect(() => {
    if (isIndividual) {
      setFormData((prev) => ({ ...prev, businessName: "" }));
    }
  }, [isIndividual]);

  useEffect(() => {
    mergeDraftListing({ sellerType, sellerProfile: formData });
  }, [sellerType, formData]);

  const isFilled =
    formData.fullName.trim() !== "" &&
    (showBusinessName ? formData.businessName.trim() !== "" : true) &&
    (showSocialField ? formData.socialMediaName.trim() !== "" : true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFilled) return;

    mergeDraftListing({
      sellerType,
      sellerProfile: {
        ...formData,
        businessName: showBusinessName ? formData.businessName : "",
        socialMediaName: showSocialField ? formData.socialMediaName : "",
      },
    });

    if (user) {
      setSubmitting(true);
      try {
        const { data } = await api.put("/auth/seller-profile", {
          sellerType,
          businessName: showBusinessName ? formData.businessName : "",
          instagramId: showSocialField ? formData.socialMediaName : "",
          fullName: formData.fullName,
        });

        if (data.token) {
          localStorage.setItem("restyle_token", data.token);
          setUser(data);
        }

        localStorage.setItem("seller_profile", JSON.stringify(formData));

        toast.success("Profile saved!");
        router.push("/seller/products/new");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to save profile");
      } finally {
        setSubmitting(false);
      }
    } else {
      localStorage.setItem(
        "seller_profile",
        JSON.stringify({
          ...formData,
          businessName: showBusinessName ? formData.businessName : "",
          socialMediaName: showSocialField ? formData.socialMediaName : "",
        })
      );
      router.push("/seller/products/new");
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-sm overflow-hidden animate-fadeIn">
        
         <div className="p-8 border-b border-gray-100 flex flex-col gap-6">
            <div className="flex items-center gap-4">
               <button 
                 type="button"
                 onClick={() => router.back()}
                 className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-brand-dark transition-all"
               >
                 <ArrowBackIcon sx={{ fontSize: 20 }} />
               </button>
               <h2 className="text-[20px] font-bold text-brand-dark">Seller Profile</h2>
            </div>
 
            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-end mb-1">
                  <span className="text-[12px] font-bold text-brand-pink uppercase tracking-widest">
                    Enterprise Info
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">Step 2 of 6</span>
               </div>
               <div className="w-full h-2 bg-brand-light rounded-full overflow-hidden">
                  <div className="h-full bg-brand-pink rounded-full transition-all duration-500 w-1/3" />
               </div>
            </div>
         </div>

         <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
               <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest border-l-4 border-brand-pink pl-3">{infoHeading}</h3>
               <div className="grid grid-cols-1 gap-6">
                  <Input 
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  {showBusinessName && (
                  <Input 
                    label="Business Name"
                    placeholder="e.g. Vintage Vault"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                  )}
                  {showSocialField && (
                    <Input 
                      label="Social Media Name"
                      placeholder="@handle or display name"
                      value={formData.socialMediaName}
                      onChange={(e) => setFormData({ ...formData, socialMediaName: e.target.value })}
                    />
                  )}
               </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              disabled={!isFilled || submitting}
              className="h-[54px] rounded-full font-bold text-[16px] mt-8 mb-4 shadow-lg shadow-brand-pink/20"
            >
              {submitting ? "Saving..." : "Continue to Product Listing"}
            </Button>
         </form>
      </div>
    </div>
  );
}
