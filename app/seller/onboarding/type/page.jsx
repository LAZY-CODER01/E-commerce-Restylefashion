"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "react-toastify";

const SELLER_TYPES = [
  { id: "thrifter", label: "Thrifter" },
  { id: "influencer", label: "Influencer" },
  { id: "individual", label: "Individual Seller" },
];

export default function SellerTypePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedType, setSelectedType] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const isSelected = (id) => selectedType === id;

  const handleStartSelling = async () => {
    if (!selectedType) return;
    setSubmitting(true);
    try {
      // Persist seller type to backend
      await api.put("/auth/seller-profile", { sellerType: selectedType });
      localStorage.setItem("seller_type", selectedType);
      router.push("/seller/onboarding/details");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-brand-light flex items-end justify-center sm:items-center p-0 sm:p-4 font-roboto">
      <div className="w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden p-8 sm:p-10 animate-slideUp">
        
        <div className="flex flex-col gap-10">
          <div>
            <div className="flex items-center gap-4 mb-4 -ml-2">
               <button 
                 onClick={() => router.back()}
                 className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-brand-dark transition-all"
               >
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
               </button>
               <span className="text-[12px] font-bold text-brand-pink uppercase tracking-widest">Step 1 of 6</span>
            </div>
            <h2 className="text-[28px] font-extrabold text-brand-dark leading-tight">Seller Type</h2>
            <p className="text-[14px] text-gray-500 font-medium">Select your category to customize your profile</p>
          </div>

          <div className="flex flex-col gap-4">
            {SELLER_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`w-full h-[64px] rounded-[24px] text-[16px] font-bold transition-all duration-300 border-2 flex items-center px-10 ${
                  isSelected(type.id) 
                    ? "bg-brand-pink/5 border-brand-pink text-brand-pink shadow-md scale-[1.02]" 
                    : "bg-white border-gray-100 text-brand-dark hover:border-brand-pink/30 shadow-sm"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <Button 
            onClick={handleStartSelling} 
            disabled={!selectedType || submitting}
            fullWidth 
            className="h-[54px] rounded-full font-bold text-[16px] mt-4"
          >
            {submitting ? "Saving..." : "Start Selling"}
          </Button>
        </div>
      </div>
    </div>
  );
}
