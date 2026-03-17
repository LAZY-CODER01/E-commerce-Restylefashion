"use client";

import React, { useState } from "react";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    let temp = {};
    if (!formData.email) temp.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) temp.email = "Email is invalid.";

    if (!formData.password) temp.password = "Password is required.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (validate()) {
      setLoading(true);
      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setApiError(result.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[calc(100dvh-70px)] bg-brand-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-card shadow-sm p-6 sm:p-8 animate-fadeIn">

        <div className="text-center mb-6">
          <h1 className="text-[24px] font-bold text-brand-dark mb-2">Welcome Back</h1>
          <p className="text-[15px] text-gray-500">Login to your account to continue</p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-[14px] rounded-lg border border-red-100 text-center">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <div className="flex flex-col gap-1.5">
            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />
            <div className="flex justify-end mt-1">
              <Link href="#" className="text-[13px] font-medium text-brand-pink hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button type="submit" fullWidth className="mt-4" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-[14px] text-gray-500 mt-2">
            New here?{' '}
            <Link href="/signup" className="font-semibold text-brand-pink hover:underline">
              Sign up
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}
