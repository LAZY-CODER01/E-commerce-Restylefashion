"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";

const ROLES = ["Admin", "Seller", "Influencer", "User"];

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState("User");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    
    if (!isLogin) {
      if (!formData.name) newErrors.name = "Full name is required.";
      if (!formData.mobile) newErrors.mobile = "Mobile number is required.";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate Auth API Success & Role based redirection
    alert(`${isLogin ? "Logged in" : "Registered"} successfully as ${selectedRole}!`);
    
    switch(selectedRole) {
      case "Admin":
        router.push("/admin/dashboard");
        break;
      case "Seller":
        router.push("/seller/dashboard");
        break;
      case "Influencer":
        router.push("/influencer/profile");
        break;
      case "User":
      default:
        router.push("/home");
        break;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error on change
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-drawer w-full max-w-md p-8 sm:p-10 animate-fadeIn">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-extrabold text-[32px] tracking-tight bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent mb-2">
            Restyle
          </Link>
          <h1 className="text-2xl font-bold text-brand-dark">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin ? "Enter your details to access your account." : "Join the community fashion marketplace."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Role Selection Slider */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-2 overflow-x-auto hide-scrollbar">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`flex-1 min-w-[80px] text-[13px] font-semibold py-2 px-3 rounded-lg transition-all duration-200 ${
                  selectedRole === role 
                    ? "bg-white text-brand-dark shadow-sm" 
                    : "text-gray-500 hover:text-brand-dark"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Registration Fields */}
          {!isLogin && (
            <>
              <Input
                label="Full Name"
                name="name"
                placeholder="Sarah Jenkins"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <Input
                label="Mobile Number"
                name="mobile"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.mobile}
                onChange={handleChange}
                error={errors.mobile}
              />
            </>
          )}

          {/* Shared Fields */}
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="sarah@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          
          <div>
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            {isLogin && (
              <div className="flex justify-end mt-2">
                <a href="#" className="text-[13px] font-semibold text-brand-pink hover:text-brand-pink-hover">
                  Forgot password?
                </a>
              </div>
            )}
          </div>

          {!isLogin && (
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          )}

          {/* Submit Button */}
          <Button type="submit" fullWidth className="mt-2 py-3.5 text-[16px]">
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </form>

        {/* Footer Switch */}
        <div className="mt-8 text-center text-[14px] text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="font-bold text-brand-pink hover:text-brand-pink-hover"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>

      </div>
    </div>
  );
}
