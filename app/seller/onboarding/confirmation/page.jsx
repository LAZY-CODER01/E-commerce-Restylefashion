"use client";

import React from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Link from "next/link";

export default function SellerConfirmationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-sm p-12 text-center flex flex-col items-center gap-8 animate-fadeIn">
        
        {/* Icon */}
        <div className="w-24 h-24 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink animate-bounceSlow">
          <SecurityIcon sx={{ fontSize: 48 }} />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-3">
          <h1 className="text-[28px] font-bold text-brand-dark">You're all set! 🎉</h1>
          <p className="text-[15px] text-gray-500 font-medium leading-relaxed max-w-[320px] mx-auto">
            Your listing has been submitted. It will appear on the marketplace once our team approves it — usually within 24–48 hours.
          </p>
        </div>

        {/* Status Steps */}
        <div className="bg-brand-light p-8 rounded-[24px] border border-gray-100 flex flex-col gap-4 w-full">
           <div className="flex items-center gap-4 text-left">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                 <CheckCircleIcon sx={{ fontSize: 16 }} />
              </div>
              <span className="text-[13px] font-bold text-brand-dark uppercase tracking-widest">Registration Complete</span>
           </div>
           <div className="flex items-center gap-4 text-left">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                 <CheckCircleIcon sx={{ fontSize: 16 }} />
              </div>
              <span className="text-[13px] font-bold text-brand-dark uppercase tracking-widest">Product Submitted</span>
           </div>
           <div className="flex items-center gap-4 text-left">
              <div className="w-6 h-6 rounded-full bg-brand-pink animate-pulse flex items-center justify-center text-white flex-shrink-0">
                 <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest italic opacity-80">Admin Verification in Progress</span>
           </div>
        </div>

        {/* Bank Details CTA */}
        <Link
          href="/seller/onboarding/bank"
          className="w-full flex items-center justify-between gap-4 p-5 bg-brand-pink/5 border border-brand-pink/20 rounded-[20px] hover:bg-brand-pink/10 transition-all group"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink flex-shrink-0">
              <AccountBalanceIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-brand-dark">Complete your bank details</p>
              <p className="text-[12px] text-gray-400 font-medium">Required to receive your payouts</p>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-pink flex-shrink-0 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </Link>

        <p className="text-[13px] text-gray-400 font-medium italic -mt-2 opacity-70">
          Our team is reviewing your profile. Expected time: 24–48 hours.
        </p>

        {/* Secondary actions */}
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
