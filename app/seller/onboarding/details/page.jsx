"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function SellerDetailsPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    fullName: "", businessName: "", socialLink: "", 
    line1: "", line2: "", state: "", city: "", postalCode: "",
    bankName: "", accountHolder: "", accountNumber: "", ifscCode: ""
  });

  const isStep1Filled = formData.fullName && formData.businessName && formData.socialLink && 
                        formData.line1 && formData.state && formData.city && formData.postalCode;
  
  const isStep2Filled = formData.bankName && formData.accountHolder && 
                        formData.accountNumber && formData.ifscCode;

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1 && isStep1Filled) {
      setStep(2);
    } else if (step === 2 && isStep2Filled) {
      router.push("/seller/onboarding/confirmation");
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-sm overflow-hidden animate-fadeIn">
        
        {/* Progress Header */}
         <div className="p-8 border-b border-gray-100 flex flex-col gap-6">
            <div className="flex items-center gap-4">
               <button 
                 onClick={handleBack}
                 className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-brand-dark transition-all"
               >
                 <ArrowBackIcon sx={{ fontSize: 20 }} />
               </button>
               <h2 className="text-[20px] font-bold text-brand-dark">Seller Details</h2>
            </div>
 
            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-end mb-1">
                  <span className="text-[12px] font-bold text-brand-pink uppercase tracking-widest">
                    {step === 1 ? "Enterprise Info" : "Payment Details"}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">Step {step + 1} of 3</span>
               </div>
               <div className="w-full h-2 bg-brand-light rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-brand-pink rounded-full transition-all duration-500 ${step === 1 ? "w-2/3" : "w-full"}`} 
                  />
               </div>
            </div>
         </div>

         <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-6">
           {step === 1 ? (
             <>
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
                     <Input 
                       label="Social Media Link"
                       placeholder="Instagram/Facebook/Portfolio URL"
                       value={formData.socialLink}
                       onChange={(e) => setFormData({ ...formData, socialLink: e.target.value })}
                     />
                  </div>
               </div>
 
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
                             className="h-[54px] px-6 border border-gray-200 rounded-full outline-none focus:border-brand-pink transition-all bg-gray-50/50 appearance-none text-[14px] font-bold text-brand-dark cursor-pointer"
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
                             className="h-[54px] px-6 border border-gray-200 rounded-full outline-none focus:border-brand-pink transition-all bg-gray-50/50 appearance-none text-[14px] font-bold text-brand-dark cursor-pointer"
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
             </>
           ) : (
             <div className="flex flex-col gap-3">
                <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest border-l-4 border-brand-pink pl-3">Bank Details</h3>
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
           )}
 
           <Button 
             type="submit" 
             fullWidth 
             disabled={step === 1 ? !isStep1Filled : !isStep2Filled}
             className="h-[54px] rounded-full font-bold text-[16px] mt-8 mb-4 shadow-lg shadow-brand-pink/20"
           >
             {step === 1 ? "Continue" : "Finish Setup"}
           </Button>
         </form>
      </div>
    </div>
  );
}
