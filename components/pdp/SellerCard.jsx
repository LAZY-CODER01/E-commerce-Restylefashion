import React from "react";
import Image from "next/image";
import StarIcon from "@mui/icons-material/Star";
import Button from "@/components/Button";

export default function SellerCard({ seller }) {
  if (!seller) return null;

  return (
    <div className="flex flex-col gap-5 py-9 border-t border-[#F0F0F0]">
      <h4 className="text-[14px] font-bold text-brand-dark uppercase tracking-wide">About Seller</h4>
      
      <div className="flex items-center justify-between bg-brand-light p-6 rounded-[24px] border border-[#EEEEEE]">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-white border-2 border-brand-pink/10 shadow-sm">
            <Image
              src={seller.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"}
              alt={seller.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h5 className="text-[16px] font-bold text-brand-dark">{seller.name}</h5>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-medium text-gray-400">{seller.location}</span>
            </div>
          </div>
        </div>
        
        <Button variant="outlined" className="h-[48px] px-6 text-[13px] font-bold border-brand-pink text-brand-pink bg-white">
          View Profile
        </Button>
      </div>
    </div>
  );
}
