"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "react-toastify";

const SELLER_TYPES = [
  { id: "individual", label: "Individual Seller" },
  { id: "influencer", label: "Influencer" },
  { id: "thrifter", label: "Thrifter" },
  { id: "designer", label: "Designer" },

];

export default function SellerTypePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedType, setSelectedType] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
    <div className="min-h-[calc(100dvh-80px)] bg-brand-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden p-6 sm:p-8 animate-slideUp">
        <div className="flex flex-col gap-8 sm:gap-10">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-4 mb-3 sm:mb-4 -ml-2">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-brand-dark transition-all"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-[12px] font-bold text-brand-pink uppercase tracking-widest">
                Step 1 of 6
              </span>
            </div>

            <h2 className="text-[26px] sm:text-[28px] font-extrabold text-brand-dark leading-tight">
              Seller Type
            </h2>

            <p className="text-[13px] sm:text-[14px] text-gray-500 font-medium">
              Select your category to customize your profile
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {SELLER_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`w-full h-[60px] sm:h-[64px] rounded-[24px] text-[15px] sm:text-[16px] font-bold transition-all duration-300 border-2 flex items-center px-8 sm:px-10 ${
                  isSelected(type.id)
                    ? "bg-brand-pink/5 border-brand-pink text-brand-pink shadow-md scale-[1.02]"
                    : "bg-white border-gray-100 text-brand-dark hover:border-brand-pink/30 shadow-sm"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Button */}
          <Button
            onClick={handleStartSelling}
            disabled={!selectedType || submitting}
            fullWidth
            className="h-[50px] sm:h-[54px] rounded-full font-bold text-[15px] sm:text-[16px] mt-2 sm:mt-4"
          >
            {submitting ? "Saving..." : "Start Selling"}
          </Button>
        </div>
      </div>
    </div>
  );
}