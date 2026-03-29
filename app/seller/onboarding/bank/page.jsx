"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BankDetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    bankName: "", accountHolder: "", accountNumber: "", ifscCode: ""
  });

  const isFilled = formData.bankName && formData.accountHolder && 
                   formData.accountNumber && formData.ifscCode;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFilled) {
      toast.success("Payment details updated!");
      localStorage.setItem("seller_bank", JSON.stringify(formData));
      router.push("/seller/onboarding/confirmation");
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
               <h2 className="text-[20px] font-bold text-brand-dark">Bank Details</h2>
            </div>
 
            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-end mb-1">
                  <span className="text-[12px] font-bold text-brand-pink uppercase tracking-widest">
                    Payment Info
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">Step 6 of 6</span>
               </div>
               <div className="w-full h-2 bg-brand-light rounded-full overflow-hidden">
                  <div className="h-full bg-brand-pink rounded-full transition-all duration-500 w-full" />
               </div>
            </div>
         </div>

         <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
               <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest border-l-4 border-brand-pink pl-3">Payment Info</h3>
               <div className="grid grid-cols-1 gap-6">
                  <Input 
                    label="Bank Name"
                    placeholder="e.g. HDFC Bank"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                  <Input 
                    label="Account Holder Name"
                    placeholder="Name as per bank records"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                  />
                  <Input 
                    label="Account Number"
                    placeholder="Enter your account number"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  />
                  <Input 
                    label="IFSC Code"
                    placeholder="11 character IFSC code"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                  />
               </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              disabled={!isFilled}
              className="h-[54px] rounded-full font-bold text-[16px] mt-8 mb-4 shadow-lg shadow-brand-pink/20"
            >
              Finish Setup
            </Button>
         </form>
      </div>
    </div>
  );
}
