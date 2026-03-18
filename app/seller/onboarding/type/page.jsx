"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SELLER_TYPES = [
  { id: "thrifters", label: "Thrifters" },
  { id: "influencer", label: "Influencer" },
  { id: "individual", label: "Individual Seller" }
];

export default function SellerTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);

  const isSelected = (id) => selectedType === id;

  const handleStartSelling = () => {
    if (selectedType) {
      router.push("/seller/onboarding/credentials");
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-end justify-center sm:items-center p-0 sm:p-4 font-roboto">
      <div className="w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden p-8 sm:p-10 animate-slideUp">
        
        <div className="flex flex-col gap-10">
          <div>
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
            disabled={!selectedType}
            fullWidth 
            className="h-[54px] rounded-full font-bold text-[16px] mt-4"
          >
            Start Selling
          </Button>
        </div>
      </div>
    </div>
  );
}
