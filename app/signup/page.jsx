"use client";

import React, { useState } from "react";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    fullName: "", email: "", mobile: "", password: "", confirmPassword: "", role: "User"
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};
    if (!formData.fullName) temp.fullName = "Full Name is required.";
    
    if (!formData.email) temp.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) temp.email = "Email is invalid.";
    
    if (!formData.mobile) temp.mobile = "Mobile Number is required.";
    
    if (!formData.password) temp.password = "Password is required.";
    else if (formData.password.length < 6) temp.password = "Minimum 6 characters.";
    
    if (formData.password !== formData.confirmPassword) {
      temp.confirmPassword = "Passwords do not match.";
    }
    
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Mock registration success
      const storedUsers = JSON.parse(localStorage.getItem("restyle_mock_users") || "{}");
      storedUsers[formData.email] = {
        name: formData.fullName,
        role: formData.role
      };
      localStorage.setItem("restyle_mock_users", JSON.stringify(storedUsers));
      
      router.push("/login?registered=true");
    }
  };

  return (
    <div className="min-h-[calc(100dvh-70px)] bg-brand-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-card shadow-sm p-6 sm:p-8 animate-fadeIn my-8">
        
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-bold text-brand-dark mb-2">Create Account</h1>
          <p className="text-[15px] text-gray-500">Join the Restyle community</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            label="Full Name"
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
          />
          
          <Input 
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <Input 
            label="Mobile Number"
            id="mobile"
            type="tel"
            placeholder="Enter your mobile number"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            error={errors.mobile}
          />
          
          <Input 
            label="Password"
            id="password"
            type="password"
            placeholder="Set a password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />

          <Input 
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />

          <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl mt-2 border border-brand-pink/20">
            <p className="text-[12px] font-semibold text-brand-pink uppercase">Select Account Type</p>
            <select 
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-[14px] text-brand-dark outline-none focus:border-brand-pink"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="User">User (Buyer)</option>
              <option value="Seller">Seller</option>
              <option value="Influencer">Influencer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <Button type="submit" fullWidth className="mt-6">
            Sign Up
          </Button>

          <p className="text-center text-[14px] text-gray-500 mt-2">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-pink hover:underline">
              Log in
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}
