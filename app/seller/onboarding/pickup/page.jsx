"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function PickupDetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    line1: "", line2: "", state: "", city: "", postalCode: ""
  });

  const isFilled = formData.line1 && formData.state && formData.city && formData.postalCode;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFilled) {
      toast.success("Address details saved!");
      localStorage.setItem("seller_address", JSON.stringify(formData));
      router.push("/seller/onboarding/bank");
    }
  };

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
               <h2 className="text-[20px] font-bold text-brand-dark">Pickup Details</h2>
            </div>
 
            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-end mb-1">
                  <span className="text-[12px] font-bold text-brand-pink uppercase tracking-widest">
                    Address Info
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">Step 5 of 6</span>
               </div>
               <div className="w-full h-2 bg-brand-light rounded-full overflow-hidden">
                  <div className="h-full bg-brand-pink rounded-full transition-all duration-500 w-5/6" />
               </div>
            </div>
         </div>

         <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3 mt-4">
               <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest border-l-4 border-brand-pink pl-3">Pickup Address</h3>
               <div className="grid grid-cols-1 gap-6">
                  <Input 
                    label="Address Line 1"
                    placeholder="Building, Flat, Street"
                    value={formData.line1}
                    onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                  />
                  <Input 
                    label="Address Line 2 (Landmark)"
                    placeholder="Optional"
                    value={formData.line2}
                    onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest">State</label>
                        <select 
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="h-[54px] px-6 border border-gray-200 rounded-full outline-none focus:border-gray-300 transition-all bg-gray-50/50 appearance-none text-[14px] font-bold text-brand-dark cursor-pointer"
                        >
                           <option value="">Select State</option>
                           <option value="MH">Maharashtra</option>
                           <option value="DL">Delhi</option>
                           <option value="KA">Karnataka</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest">City</label>
                        <select 
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="h-[54px] px-6 border border-gray-200 rounded-full outline-none focus:border-gray-300 transition-all bg-gray-50/50 appearance-none text-[14px] font-bold text-brand-dark cursor-pointer"
                        >
                           <option value="">Select City</option>
                           <option value="Mumbai">Mumbai</option>
                           <option value="Pune">Pune</option>
                           <option value="Bangalore">Bangalore</option>
                        </select>
                     </div>
                  </div>
                  <Input 
                    label="Postal Code"
                    placeholder="6 Digit PIN Code"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  />
               </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              disabled={!isFilled}
              className="h-[54px] rounded-full font-bold text-[16px] mt-8 mb-4 shadow-lg shadow-brand-pink/20"
            >
              Continue to Bank Details
            </Button>
         </form>
      </div>
    </div>
  );
}
