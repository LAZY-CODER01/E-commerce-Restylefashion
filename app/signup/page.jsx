"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { toast } from "react-toastify";
import {
  completeDraftListingFlow,
  shouldRehydrateAfterAuth,
} from "@/lib/draftListing";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectIntent = searchParams.get("redirect");

  const [formData, setFormData] = useState({
    fullName: "", email: "", mobile: "", password: "", confirmPassword: "", role: "User"
  });
  const [errors, setErrors] = useState({});

  const { register, setUser, redirectBasedOnRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (validate()) {
      setLoading(true);
      const wantsRehydrate = shouldRehydrateAfterAuth(redirectIntent);
      const wantsAutoSubmitDraft =
        redirectIntent === "complete-listing" || redirectIntent === "listing-page";
      const skipDefaultRedirect = wantsRehydrate || wantsAutoSubmitDraft;

      const result = await register(
        {
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          role: formData.role,
        },
        { skipRedirect: skipDefaultRedirect }
      );

      if (!result.success) {
        setApiError(result.message);
        toast.error(result.message || "Registration failed. Please try again.");
        setLoading(false);
      } else if (wantsRehydrate) {
        toast.success(`Welcome, ${formData.fullName}! Your listing draft was restored.`);
        router.push(redirectIntent || "/sell");
        setLoading(false);
      } else if (wantsAutoSubmitDraft) {
        const flow = await completeDraftListingFlow(setUser);
        if (flow.ok) {
          toast.success(`Welcome, ${formData.fullName}! Your listing was submitted.`);
          router.push("/verification");
        } else if (flow.reason === "no_draft") {
          toast.info(
            flow.message ||
              "Account created! Complete your listing from the Sell flow when you are ready."
          );
          redirectBasedOnRole(result.user.role);
        } else {
          toast.error(flow.message || "Could not submit your listing. You can finish from your dashboard.");
          redirectBasedOnRole(result.user.role);
        }
        setLoading(false);
      } else {
        toast.success(`Account created successfully! Welcome to Restyle, ${formData.fullName}!`);
        setLoading(false);
      }
    } else {
      toast.warn("Please correct the errors in the form.");
    }
  };

  const loginHref =
    redirectIntent != null && redirectIntent !== ""
      ? `/login?redirect=${encodeURIComponent(redirectIntent)}`
      : "/login";

  return (
    <div className="min-h-[calc(100dvh-70px)] bg-brand-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-card shadow-sm p-6 sm:p-8 animate-fadeIn my-8">

        <div className="text-center mb-6">
          <h1 className="text-[24px] font-bold text-brand-dark mb-2">Create Account</h1>
          <p className="text-[15px] text-gray-500">Join the Restyle community</p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-[14px] rounded-lg border border-red-100 text-center">
            {apiError}
          </div>
        )}

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
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-[14px] text-brand-dark outline-none focus:border-gray-300"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="User">User (Buyer)</option>
              <option value="Seller">Seller</option>
              <option value="Influencer">Influencer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <Button type="submit" fullWidth className="mt-6" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <p className="text-center text-[14px] text-gray-500 mt-2">
            Already have an account?{' '}
            <Link
              href={loginHref}
              className="font-semibold text-brand-pink hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100dvh-70px)] bg-brand-light flex items-center justify-center p-4 text-gray-500 text-[15px]">
          Loading…
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
