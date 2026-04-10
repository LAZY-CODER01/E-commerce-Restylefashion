"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const EMAIL_RE = /\S+@\S+\.\S+/;
const PHONE_RE = /^[6-9]\d{9}$/;

function RestyleLogoMark() {
  // Matches `components/Navigastion.jsx` logo wordmark; fixed size on mobile + desktop.
  return (
    <div className="mx-auto flex h-[50px] items-center justify-center">
      <Link
        href="/"
        className="inline-block font-extrabold text-[28px] leading-none tracking-tight bg-gradient-to-b from-black to-[#F7246E] bg-clip-text text-transparent"
      >
        Restyle
      </Link>
    </div>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 1 0 2.8 2.8" />
      <path d="M6.7 6.7C4.4 8.1 3 10 3 12c0 0 3.6 6 9 6 2 0 3.8-.7 5.3-1.7" />
      <path d="M9.9 4.3A11 11 0 0 1 12 4c6.4 0 10 6 10 6a15.8 15.8 0 0 1-2.6 3.4" />
    </svg>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function BaseInput({ type = "text", value, onChange, placeholder, rightSlot, name }) {
  return (
    <div className="relative">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-[48px] w-full rounded-[14px] border border-gray-300 bg-white px-4 pr-11 text-[15px] text-brand-dark outline-none transition focus:border-brand-pink focus:shadow-[0_0_0_3px_rgba(247,36,110,0.12)] placeholder:text-gray-400"
      />
      {rightSlot ? (
        <div className="absolute inset-y-0 right-4 flex items-center text-gray-500">{rightSlot}</div>
      ) : null}
    </div>
  );
}

function SocialButtons({ onSocialLogin }) {
  const social = ["Google", "Facebook", "Apple"];
  return (
    <div className="space-y-3">
      <p className="text-center text-[13px] font-medium text-gray-500 sm:text-[14px]">Continue with</p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {social.map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => onSocialLogin(provider)}
            className="h-10 min-h-[40px] rounded-xl border border-gray-300 bg-white px-1 text-[11px] font-semibold leading-tight text-brand-dark transition hover:border-brand-pink hover:text-brand-pink sm:px-2 sm:text-[13px]"
          >
            {provider}
          </button>
        ))}
      </div>
    </div>
  );
}

function SignupView({ onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    else if (!PHONE_RE.test(form.phone)) next.phone = "Enter a valid 10-digit phone.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (!form.confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Placeholder submit handler (wire backend auth here).
    console.log("Signup submit payload:", form);
  };

  const handleSocialLogin = (provider) => {
    // Placeholder social auth handler (OAuth hook point).
    console.log("Signup social login:", provider);
  };

  return (
    <div className="w-full min-w-0 max-w-[420px] rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 text-center sm:mb-6">
        <RestyleLogoMark />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <BaseInput
            name="fullName"
            value={form.fullName}
            onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            placeholder="Full Name"
          />
          <FieldError message={errors.fullName} />
        </div>

        <div>
          <BaseInput
            name="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Email"
          />
          <FieldError message={errors.email} />
        </div>

        <div>
          <BaseInput
            name="phone"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
            placeholder="Phone Number"
          />
          <FieldError message={errors.phone} />
        </div>

        <div>
          <BaseInput
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            placeholder="Password"
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-gray-500"
                aria-label="Toggle password visibility"
              >
                <EyeIcon open={showPassword} />
              </button>
            }
          />
          <FieldError message={errors.password} />
        </div>

        <div>
          <BaseInput
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            placeholder="Confirm Password"
            rightSlot={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="text-gray-500"
                aria-label="Toggle confirm password visibility"
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            }
          />
          <FieldError message={errors.confirmPassword} />
        </div>

        <button
          type="submit"
          className="mt-2 h-[48px] w-full rounded-[10px] bg-brand-pink text-[15px] font-semibold text-white transition hover:bg-brand-pink-hover"
        >
          Sign Up
        </button>
      </form>

      <div className="mt-7">
        <SocialButtons onSocialLogin={handleSocialLogin} />
      </div>

      <p className="mt-6 text-center text-[14px] leading-relaxed text-brand-dark sm:mt-7 sm:text-[16px]">
        Already have an account?{" "}
        <button type="button" className="font-semibold text-black underline" onClick={onSwitchToLogin}>
          Login
        </button>
      </p>
    </div>
  );
}

function LoginView({ onSwitchToSignup }) {
  const [method, setMethod] = useState("email");
  const [showPassword, setShowPassword] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const sessionPayload = useMemo(
    () => ({
      token: null,
      refreshToken: null,
      rememberMe: form.rememberMe,
      expiresAt: null,
      autoLogoutTimer: null,
    }),
    [form.rememberMe]
  );

  useEffect(() => {
    // Placeholder session lifecycle prep.
    // On real login success: set token, expiry, and start auto-logout timer.
    if (!sessionPayload.token || !sessionPayload.expiresAt) return;
    const ms = new Date(sessionPayload.expiresAt).getTime() - Date.now();
    if (ms <= 0) return;
    const timerId = window.setTimeout(() => {
      console.log("Auto logout triggered.");
    }, ms);
    return () => window.clearTimeout(timerId);
  }, [sessionPayload]);

  const validate = () => {
    const next = {};
    if (method === "email") {
      if (!form.email.trim()) next.email = "Email is required.";
      else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email.";
      if (!form.password) next.password = "Password is required.";
    } else {
      if (!form.phone.trim()) next.phone = "Phone number is required.";
      else if (!PHONE_RE.test(form.phone)) next.phone = "Enter a valid 10-digit phone.";
      if (otpRequested && !form.otp.trim()) next.otp = "OTP is required.";
      else if (otpRequested && !/^\d{4,6}$/.test(form.otp)) next.otp = "Enter a valid OTP.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRequestOtp = () => {
    const phoneError = !PHONE_RE.test(form.phone) ? "Enter a valid 10-digit phone." : "";
    setErrors((prev) => ({ ...prev, phone: phoneError }));
    if (phoneError) return;
    setOtpRequested(true);
    // Placeholder OTP handler.
    console.log("Request OTP for:", form.phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Placeholder login handler + token setup.
    console.log("Login submit payload:", form);
  };

  const handleSocialLogin = (provider) => {
    // Placeholder social auth handler.
    console.log("Login social login:", provider);
  };

  return (
    <div className="w-full min-w-0 max-w-[420px] rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 text-center sm:mb-6">
        <RestyleLogoMark />
      </div>

      <div className="mb-5 flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => {
            setMethod("email");
            setErrors({});
          }}
          className={`w-1/2 border-b-4 px-1 pb-3 text-center text-[17px]  leading-tight tracking-tight transition sm:text-[20px] ${
            method === "email"
              ? "border-brand-pink text-brand-pink"
              : "border-transparent text-[#4B3B46] hover:text-brand-dark"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod("phone");
            setErrors({});
          }}
          className={`w-1/2 border-b-4 px-1 pb-3 text-center text-[17px]  leading-tight tracking-tight transition sm:text-[20px] ${
            method === "phone"
              ? "border-brand-pink text-brand-pink"
              : "border-transparent text-[#4B3B46] hover:text-brand-dark"
          }`}
        >
          Phone
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {method === "email" ? (
          <>
            <div>
              <BaseInput
                name="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="Email"
              />
              <FieldError message={errors.email} />
            </div>

            <div>
              <BaseInput
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Password"
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-gray-500"
                    aria-label="Toggle password visibility"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                }
              />
              <FieldError message={errors.password} />
            </div>
          </>
        ) : (
          <>
            <div>
              <BaseInput
                name="phone"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                placeholder="Phone Number"
              />
              <FieldError message={errors.phone} />
            </div>

            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_auto] sm:items-stretch sm:gap-3">
              <BaseInput
                name="otp"
                value={form.otp}
                onChange={(e) => setForm((p) => ({ ...p, otp: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                placeholder="Enter OTP"
              />
              <button
                type="button"
                onClick={handleRequestOtp}
                className="h-[48px] shrink-0 rounded-[10px] border border-brand-pink px-3 text-[13px] font-semibold text-brand-pink transition hover:bg-brand-pink/5 sm:px-4 sm:text-sm"
              >
                {otpRequested ? "Resend OTP" : "Request OTP"}
              </button>
            </div>
            <FieldError message={errors.otp} />
          </>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-gray-700 sm:text-sm">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) => setForm((p) => ({ ...p, rememberMe: e.target.checked }))}
              className="h-4 w-4 shrink-0 rounded border-gray-300 text-brand-pink focus:ring-brand-pink"
            />
            Remember me
          </label>
          <button type="button" className="self-start text-left text-[13px] font-medium text-[#F73425] hover:underline sm:self-auto sm:text-sm">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="mt-1 h-[48px] w-full rounded-[10px] bg-brand-pink text-[15px] font-semibold text-white transition hover:bg-brand-pink-hover"
        >
          Login
        </button>
      </form>

      <div className="mt-7">
        <SocialButtons onSocialLogin={handleSocialLogin} />
      </div>

      <p className="mt-6 text-center text-[14px] leading-relaxed text-brand-dark sm:mt-7 sm:text-[16px]">
        Don&apos;t have an account?{" "}
        <button type="button" className="font-semibold text-black underline" onClick={onSwitchToSignup}>
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default function RestyleAuthStandalone() {
  const [activeScreen, setActiveScreen] = useState("signup");

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-brand-light px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-[420px] min-w-0">
        {activeScreen === "signup" ? (
          <SignupView onSwitchToLogin={() => setActiveScreen("login")} />
        ) : (
          <LoginView onSwitchToSignup={() => setActiveScreen("signup")} />
        )}
      </div>
    </div>
  );
}

