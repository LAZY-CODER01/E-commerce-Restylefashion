"use client";

import React from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";

export default function SellerConfirmationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-sm p-12 text-center flex flex-col items-center gap-8 animate-fadeIn">
        
        <div className="w-24 h-24 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink animate-bounceSlow">
          <SecurityIcon sx={{ fontSize: 48 }} />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-[28px] font-bold text-brand-dark">Verify Your Email</h1>
          <p className="text-[15px] text-gray-500 font-medium leading-relaxed max-w-[320px] mx-auto">
            We have sent a verification link to your registered email. Please verify your account to start selling.
          </p>
        </div>

        <div className="bg-brand-light p-8 rounded-[24px] border border-gray-100 flex flex-col gap-4 w-full">
           <div className="flex items-center gap-4 text-left">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                 <CheckCircleIcon sx={{ fontSize: 16 }} />
              </div>
              <span className="text-[13px] font-bold text-brand-dark uppercase tracking-widest">Application Submitted</span>
           </div>
           <div className="flex items-center gap-4 text-left">
              <div className="w-6 h-6 rounded-full bg-brand-pink animate-pulse flex items-center justify-center text-white">
                 <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest italic opacity-80">Verification in Progress</span>
           </div>
        </div>

        <p className="text-[13px] text-gray-400 font-medium italic mt-4 opacity-70">
          We will notify you via email (sarah@style.com) once approved. Expected time: 24-48 hours.
        </p>

        <Button 
          onClick={() => router.push("/seller/verify-email")}
          fullWidth 
          className="h-[54px] rounded-full font-bold text-[16px] mt-4 shadow-lg shadow-brand-pink/20"
        >
          Resend Verification Email
        </Button>
        <button 
          onClick={() => router.push("/")}
          className="text-[14px] font-bold text-gray-400 hover:text-brand-pink transition-colors underline decoration-brand-pink/30"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
