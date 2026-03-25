"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SellerLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const isFormValid = formData.email !== "" && formData.password !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      // Check mock DB
      const registeredSellers = JSON.parse(localStorage.getItem("registered_sellers") || "[]");
      const seller = registeredSellers.find(s => s.email === formData.email && s.password === formData.password);
      
      if (!seller) {
        // For development/demo convenience: auto-register if account doesn't exist
        const newSeller = { email: formData.email, password: formData.password };
        localStorage.setItem("registered_sellers", JSON.stringify([...registeredSellers, newSeller]));
      }

      // Proceed to the next step of onboarding
      toast.success("Welcome, Seller! Let's complete your profile.");
      router.push("/seller/onboarding/type");
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-sm p-8 sm:p-10 animate-fadeIn">
        
        <div className="text-center mb-10">
          <h1 className="text-[28px] font-bold text-brand-dark mb-2">Seller Account</h1>
          <p className="text-[15px] text-gray-500 font-medium">Login to your seller account to start selling</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input 
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          
          <div className="flex flex-col gap-2">
            <Input 
              label="Set Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <div className="flex justify-between px-1">
              <Link href="#" className="text-[13px] font-bold text-gray-400 hover:text-brand-pink transition-colors">
                Forgot Password?
              </Link>
              <Link href="#" className="text-[13px] font-bold text-brand-pink underline">
                Reset Password
              </Link>
            </div>
          </div>

          <p className="text-center text-[14px] font-medium text-gray-500 mt-2">
            New Seller? <Link href="/seller/onboarding/credentials" className="text-brand-pink font-bold underline">Sign-up</Link>
          </p>

          <Button 
            type="submit" 
            fullWidth 
            disabled={!isFormValid}
            className="h-[54px] rounded-full font-bold text-[16px] mt-4"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
