"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function SellerCredentialsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    fullName: "", email: "", mobile: "", password: "", confirmPassword: "" 
  });
  
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isOtpMatched, setIsOtpMatched] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  const [strength, setStrength] = useState({
    length: false,
    special: false,
    capital: false,
    number: false
  });

  useEffect(() => {
    const pwd = formData.password;
    setStrength({
      length: pwd.length >= 8,
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      capital: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd)
    });
  }, [formData.password]);

  const allCriteriaMet = Object.values(strength).every(v => v);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFilled = formData.fullName && formData.email && formData.mobile && formData.password && formData.confirmPassword;
  const canGetOtp = isFilled && allCriteriaMet && passwordsMatch;

  const handleGetOtp = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setShowOtp(true);
      setLoading(false);
      alert("OTP sent to " + formData.email + " (Use 123456)");
    }, 1500);
  };

  const verifyOtp = () => {
    if (otp === "123456") {
      setIsOtpMatched(true);
      setOtpError("");
    } else {
      setIsOtpMatched(false);
      setOtpError("OTP does not match. Please try again.");
    }
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (isOtpMatched) {
      router.push("/seller/onboarding/details");
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-sm p-8 sm:p-10 animate-fadeIn">
        
        <div className="text-center mb-10">
          <h1 className="text-[28px] font-bold text-brand-dark mb-2">Create Account</h1>
          <p className="text-[15px] text-gray-500 font-medium tracking-tight">Set up your seller profile and credentials</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
          <Input 
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            disabled={showOtp && isOtpMatched}
          />
          <Input 
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={showOtp && isOtpMatched}
          />
          <Input 
            label="Mobile Number"
            type="tel"
            placeholder="Enter your mobile number"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            disabled={showOtp && isOtpMatched}
          />
          <Input 
            label="Set Password"
            type="password"
            placeholder="Choose a secure password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={showOtp && isOtpMatched}
          />

          {!isOtpMatched && (
            <div className="bg-brand-light p-6 rounded-[24px] border border-gray-100 flex flex-col gap-3">
               <p className="text-[12px] font-bold text-brand-dark uppercase tracking-widest mb-1">Password Strength Checklist</p>
               {[
                 { key: 'length', text: 'Minimum 8 characters (letters & numbers)' },
                 { key: 'special', text: 'Minimum 1 special character (@ # $ % ! ^ & *)' },
                 { key: 'capital', text: 'Minimum 1 capital letter (A-Z)' },
                 { key: 'number', text: 'Minimum 1 number (0-9)' }
               ].map((crit) => (
                  <div key={crit.key} className="flex items-center gap-3">
                     <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${strength[crit.key] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        <CheckIcon sx={{ fontSize: 13 }} />
                     </div>
                     <span className={`text-[13px] font-medium transition-colors ${strength[crit.key] ? 'text-green-600' : 'text-gray-400'}`}>
                        {crit.text}
                     </span>
                  </div>
               ))}
            </div>
          )}

          <Input 
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={formData.confirmPassword && !passwordsMatch ? "Passwords do not match" : ""}
            disabled={showOtp && isOtpMatched}
          />

          {showOtp && (
            <div className="flex flex-col gap-3 animate-slideUp">
              <Input 
                label="Enter OTP"
                placeholder="6 Digit OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError("");
                }}
                error={otpError}
              />
              {!isOtpMatched && (
                <button 
                  type="button"
                  onClick={verifyOtp}
                  className="text-[13px] font-bold text-brand-pink underline self-start ml-2"
                >
                  Verify OTP
                </button>
              )}
              {isOtpMatched && (
                <p className="text-[13px] font-bold text-green-600 ml-2 flex items-center gap-1">
                  <CheckIcon sx={{ fontSize: 16 }} /> OTP Matched Successfully!
                </p>
              )}
            </div>
          )}

          {!showOtp ? (
            <Button 
              type="button" 
              onClick={handleGetOtp}
              fullWidth 
              disabled={!canGetOtp || loading}
              className="h-[54px] rounded-full font-bold text-[16px] mt-4"
            >
              {loading ? "Sending..." : "Get OTP"}
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={handleCreateAccount}
              fullWidth 
              disabled={!isOtpMatched}
              className="h-[54px] rounded-full font-bold text-[16px] mt-4 shadow-lg shadow-brand-pink/20"
            >
              Create Account
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
