"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@/components/Button";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Simulate verification delay
    const timer = setTimeout(() => {
      setVerifying(false);
      toast.success("Account verified successfully! 🌸", { icon: "✅" });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartListing = () => {
    router.push("/seller/onboarding/pickup");
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-sm p-12 text-center flex flex-col items-center gap-8 animate-fadeIn">
        
        {verifying ? (
          <>
            <div className="flex flex-col gap-2 -mt-4 mb-4">
               <span className="text-[12px] font-bold text-brand-pink uppercase tracking-widest">Step 4 of 6</span>
            </div>
            <div className="w-24 h-24 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink relative overflow-hidden">
               <div className="absolute inset-0 border-[6px] border-brand-pink/20 rounded-full" />
               <div className="absolute inset-0 border-[6px] border-brand-pink border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="flex flex-col gap-3">
               <h1 className="text-[28px] font-bold text-brand-dark">Verifying Email...</h1>
               <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
                 Please wait while we confirm your account details.
               </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-scaleIn">
               <CheckCircleIcon sx={{ fontSize: 56 }} />
            </div>
            <div className="flex flex-col gap-3">
               <h1 className="text-[28px] font-bold text-brand-dark">Email Verified!</h1>
               <p className="text-[15px] text-gray-500 font-medium leading-relaxed">
                 Your account has been successfully verified. You are now ready to start selling.
               </p>
            </div>
            <Button 
              onClick={handleStartListing}
              fullWidth 
              className="h-[54px] rounded-full font-bold text-[16px] mt-4 shadow-lg shadow-brand-pink/20"
            >
              Pickup Details
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
