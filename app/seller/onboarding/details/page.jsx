"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function SellerDetailsPage() {
  const router = useRouter();
  const { user, loading, setUser } = useAuth();
  const [sellerType, setSellerType] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    instagramId: "",
    pincode: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const type = localStorage.getItem("seller_type") || "";
      setSellerType(type);
      // Pre-fill name from logged-in user
      if (user?.fullName) {
        setFormData((prev) => ({ ...prev, fullName: user.fullName }));
      }
    }
  }, [user]);

  // Same UX as Thrifter & Influencer: show Instagram for Designer too
  const showSocialField =
    sellerType === "thrifter" ||
    sellerType === "influencer" ||
    sellerType === "designer";

  const isFilled =
    formData.fullName.trim() !== "" &&
    formData.businessName.trim() !== "" &&
    formData.pincode.trim() !== "" &&
    (showSocialField ? formData.instagramId.trim() !== "" : true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFilled) return;

    setSubmitting(true);
    try {
      // Save full profile to backend — this also upgrades role to Seller
      const { data } = await api.put("/auth/seller-profile", {
        sellerType,
        businessName: formData.businessName,
        instagramId: formData.instagramId,
        pincode: formData.pincode,
      });

      // Update stored token with the newly issued one (role is now Seller)
      if (data.token) {
        localStorage.setItem("restyle_token", data.token);
        setUser(data); // sync in-memory user state (role is now Seller)
      }

      // Also cache profile for multi-step reference
      localStorage.setItem("seller_profile", JSON.stringify(formData));

      toast.success("Profile saved!");
      router.push("/seller/products/new");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-sm overflow-hidden animate-fadeIn">
        
         <div className="p-8 border-b border-gray-100 flex flex-col gap-6">
            <div className="flex items-center gap-4">
               <button 
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
               <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest border-l-4 border-brand-pink pl-3">Business Info</h3>
               <div className="grid grid-cols-1 gap-6">
                  <Input 
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  <Input 
                    label="Business Name"
                    placeholder="e.g. Vintage Vault"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                  {showSocialField && (
                    <Input 
                      label="Instagram Handle"
                      placeholder="@yourusername"
                      value={formData.instagramId}
                      onChange={(e) => setFormData({ ...formData, instagramId: e.target.value })}
                    />
                  )}
                  <Input 
                    label="Pincode"
                    placeholder="e.g. 400001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
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
