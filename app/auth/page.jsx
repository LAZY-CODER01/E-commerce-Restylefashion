"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const EMAIL_RE = /\S+@\S+\.\S+/;
const PHONE_RE = /^[6-9]\d{9}$/;

const PRIMARY_RING = "rgba(247, 36, 110, 0.22)";

function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function PhoneHandsetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z"
      />
    </svg>
  );
}

function MailIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 8 8 6 8-6" />
    </svg>
  );
}

/** Matches `components/Navigastion.jsx` center logo: black → magenta gradient, same sizes.*/
function RestyleLogoMark() {
  return (
    <div className="mx-auto flex flex-col items-center justify-center ">
      <div className="flex h-[50px] items-center justify-center">
        <Link
          href="/"
          className="inline-block bg-gradient-to-b from-black to-brand-pink bg-clip-text font-extrabold text-[26px] leading-none tracking-tight text-transparent sm:text-[28px]"
        >
          Restyle
        </Link>
      </div>
      <p className="max-w-[280px] px-1 text-center font-sans text-[13px] font-medium leading-snug tracking-tight text-gray-500 sm:max-w-none sm:text-[14px]">
        Get started & grab best offers on top brands
      </p>
    </div>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 1 0 2.8 2.8" />
      <path d="M6.7 6.7C4.4 8.1 3 10 3 12c0 0 3.6 6 9 6 2 0 3.8-.7 5.3-1.7" />
      <path d="M9.9 4.3A11 11 0 0 1 12 4c6.4 0 10 6 10 6a15.8 15.8 0 0 1-2.6 3.4" />
    </svg>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 font-sans text-xs font-medium text-brand-pink/90" role="alert">
      {message}
    </p>
  );
}

function BaseInput({ type = "text", value, onChange, placeholder, rightSlot, name, id, autoComplete }) {
  const inputId = id || name;
  return (
    <div className="relative">
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-12 w-full rounded-[11px] border border-gray-200 bg-white px-3.5 py-2.5 pr-24 font-sans text-[15px] font-normal text-gray-600 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-gray-400 focus:border-brand-pink focus:shadow-[0_0_0_3px_var(--auth-focus)]"
        style={{ "--auth-focus": PRIMARY_RING }}
      />
      {rightSlot ? (
        <div className="absolute inset-y-0 right-3.5 flex items-center text-gray-500">{rightSlot}</div>
      ) : null}
    </div>
  );
}

function DividerWithLabel({ children }) {
  return (
    <div className="relative py-1">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 font-sans text-[13px] font-medium text-gray-500 sm:text-sm">{children}</span>
      </div>
    </div>
  );
}

function SocialButtons({ onSocialLogin }) {
  const items = [{ id: "Google", label: "Google", Icon: GoogleIcon }];
  return (
    <div className="space-y-3">
      <DividerWithLabel>Continue with</DividerWithLabel>
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        {items.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSocialLogin(id)}
            className="flex h-11 min-h-[44px] flex-col items-center justify-center gap-1 rounded-[11px] border border-gray-200 bg-white font-sans text-[11px] font-medium text-gray-600 shadow-sm transition duration-200 hover:border-brand-pink/40 hover:text-brand-pink hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink/40 sm:h-12 sm:text-xs"
          >
            <Icon className="h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5" />
            <span className="leading-none">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Shown under email/password login: Google and phone entry side by side. */
function EmailAlternateLoginRow({ onGoogleLogin, isPhoneMode, onToggleMethod }) {
  return (
    <div className="space-y-3">
      <DividerWithLabel>or Login via</DividerWithLabel>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onGoogleLogin("Google")}
          className="flex h-[52px] min-h-[44px] flex-col items-center justify-center gap-1 rounded-[11px] border border-gray-200 bg-white px-2 font-sans text-[11px] font-semibold text-gray-700 shadow-sm transition duration-200 hover:border-brand-pink/40 hover:text-brand-pink hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink/40 sm:h-14 sm:text-xs"
        >
          <GoogleIcon className="h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5" />
          <span className="leading-tight text-center">Login with Google</span>
        </button>
        <button
          type="button"
          onClick={onToggleMethod}
          className="flex h-[52px] min-h-[44px] flex-col items-center justify-center gap-1 rounded-[11px] border border-gray-200 bg-white px-2 font-sans text-[11px] font-semibold text-gray-700 shadow-sm transition duration-200 hover:border-brand-pink/40 hover:text-brand-pink hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink/40 sm:h-14 sm:text-xs"
        >
          {isPhoneMode ? (
            <MailIcon className="h-[18px] w-[18px] shrink-0 text-gray-600 sm:h-5 sm:w-5" />
          ) : (
            <PhoneHandsetIcon className="h-[18px] w-[18px] shrink-0 text-gray-600 sm:h-5 sm:w-5" />
          )}
          <span className="leading-tight text-center">
            {isPhoneMode ? "Login with email" : "Login with phone number"}
          </span>
        </button>
      </div>
    </div>
  );
}

function PrimaryGradientButton({ children, loading, type = "submit", onClick, disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="relative mt-1 flex h-12 w-full items-center justify-center overflow-hidden rounded-[11px] bg-[#F7246E] font-sans text-[15px] font-bold text-white shadow-pink-md transition duration-200 hover:bg-brand-pink-hover hover:shadow-pink-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink/50 disabled:cursor-not-allowed disabled:opacity-75"
    >
      {loading ? (
        <span className="flex items-center gap-2" aria-live="polite">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
            aria-hidden
          />
          <span>Please wait…</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

function AuthCardSkeleton() {
  return (
    <div
      className="w-full min-w-0 max-w-[420px] animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.05)] sm:p-9"
      aria-hidden
    >
      <div className="mx-auto mb-8 h-8 w-32 rounded-lg bg-gray-100" />
      <div className="mb-6 flex gap-2">
        <div className="h-10 flex-1 rounded-lg bg-gray-100" />
        <div className="h-10 flex-1 rounded-lg bg-gray-100" />
      </div>
      <div className="space-y-3">
        <div className="h-12 rounded-[11px] bg-gray-100" />
        <div className="h-12 rounded-[11px] bg-gray-100" />
        <div className="h-12 rounded-[11px] bg-gray-100" />
      </div>
      <div className="mt-6 h-12 rounded-[11px] bg-gray-200/80" />
    </div>
  );
}

function SignupView({ onSwitchToLogin, onAuthSuccess }) {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [signupOtp, setSignupOtp] = useState("");
  const [signupOtpError, setSignupOtpError] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
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
    else if (!phoneVerified) next.phone = "Please verify your phone number.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (!form.confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleVerifyClick = () => {
    const phoneError = !PHONE_RE.test(form.phone) ? "Enter a valid 10-digit phone." : "";
    if (phoneError) {
      setErrors((prev) => ({ ...prev, phone: phoneError }));
      return;
    }
    setErrors((prev) => ({ ...prev, phone: "" }));
    setIsOtpSending(true);
    window.setTimeout(() => {
      setSignupOtp("");
      setSignupOtpError("");
      setShowOtpModal(true);
      setIsOtpSending(false);
    }, 400);
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setSignupOtp("");
    setSignupOtpError("");
  };

  const handleResendSignupOtp = () => {
    if (isResendingOtp) return;
    setIsResendingOtp(true);
    setSignupOtp("");
    setSignupOtpError("");
    window.setTimeout(() => {
      setIsResendingOtp(false);
    }, 500);
  };

  useEffect(() => {
    if (!showOtpModal || signupOtp.length !== 6) return;
    if (signupOtp === "123456") {
      setPhoneVerified(true);
      setSignupOtpError("");
      window.setTimeout(() => {
        setShowOtpModal(false);
      }, 200);
      return;
    }
    setSignupOtpError("Incorrect OTP. Try 123456.");
  }, [signupOtp, showOtpModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setGlobalError("");
    setSubmitting(true);
    const result = await register(
      { fullName: form.fullName, email: form.email, mobile: form.phone, password: form.password },
      { skipRedirect: true }
    );
    setSubmitting(false);
    if (!result.success) {
      setGlobalError(result.message || "Registration failed. Please try again.");
      return;
    }
    onAuthSuccess();
  };

  const handleSocialLogin = (provider) => {
    console.log("Signup social login:", provider);
  };

  return (
    <div className="w-full min-w-0 max-w-[420px] rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:p-9">
      <div className="mb-6 text-center sm:mb-8">
        <RestyleLogoMark />
      </div>

      {globalError && (
        <div className="mb-4 rounded-[10px] bg-red-50 px-4 py-3 font-sans text-[13px] font-medium text-red-600 border border-red-100">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" noValidate>
        <div>
          <BaseInput
            name="fullName"
            value={form.fullName}
            onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            placeholder="Full name"
            autoComplete="name"
          />
          <FieldError message={errors.fullName} />
        </div>

        <div>
          <BaseInput
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Email"
            autoComplete="email"
          />
          <FieldError message={errors.email} />
        </div>

        <div>
          <BaseInput
            name="phone"
            value={form.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setForm((p) => ({ ...p, phone: value }));
              setPhoneVerified(false);
            }}
            placeholder="Phone number"
            autoComplete="tel"
            rightSlot={
              <button
                type="button"
                onClick={handleVerifyClick}
                disabled={isOtpSending}
                className="font-sans text-[13px] font-semibold text-[#F7246E] transition hover:text-brand-pink-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {phoneVerified ? "Verified" : isOtpSending ? "Sending..." : "Verify"}
              </button>
            }
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
            autoComplete="new-password"
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="rounded-md p-1 text-gray-500 transition hover:text-brand-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-pink/40"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            placeholder="Confirm password"
            autoComplete="new-password"
            rightSlot={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="rounded-md p-1 text-gray-500 transition hover:text-brand-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-pink/40"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            }
          />
          <FieldError message={errors.confirmPassword} />
        </div>

        <PrimaryGradientButton loading={submitting}>Sign up</PrimaryGradientButton>
      </form>

      <div className="mt-6 sm:mt-7">
        <SocialButtons onSocialLogin={handleSocialLogin} />
      </div>

      <p className="mt-6 text-center font-sans text-[14px] font-normal leading-relaxed text-gray-600 sm:mt-7 sm:text-[15px]">
        Already have an account?{" "}
        <button
          type="button"
          className="font-semibold text-brand-pink underline decoration-brand-pink/30 underline-offset-2 transition hover:decoration-brand-pink"
          style={{ fontWeight: 600 }}
          onClick={onSwitchToLogin}
        >
          Log in
        </button>
      </p>

      {showOtpModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.14)] sm:p-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCloseOtpModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-lg font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close OTP modal"
              >
                ×
              </button>
            </div>
            <h3 className="text-center font-sans text-lg font-semibold text-gray-900">Verify phone number</h3>
            <p className="mt-1 text-center font-sans text-[13px] text-gray-500">
              Enter OTP sent to +91 {form.phone}
            </p>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              maxLength={6}
              value={signupOtp}
              onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="mt-4 h-12 w-full rounded-[11px] border border-gray-200 px-3 text-center font-sans text-lg tracking-[0.2em] text-gray-800 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-gray-300 focus:border-brand-pink focus:shadow-[0_0_0_3px_var(--auth-focus)]"
              style={{ "--auth-focus": PRIMARY_RING }}
            />
            {signupOtpError ? (
              <p className="mt-2 text-center font-sans text-xs font-medium text-brand-pink/90">{signupOtpError}</p>
            ) : (
              <p className="mt-2 text-center font-sans text-xs text-gray-500">Use demo OTP: 123456</p>
            )}
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={handleResendSignupOtp}
                disabled={isResendingOtp}
                className="font-sans text-[13px] font-semibold text-[#F7246E] transition hover:text-brand-pink-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isResendingOtp ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatIndiaMobileDisplay(digits) {
  const d = digits.replace(/\D/g, "");
  if (d.length !== 10) return digits;
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
}

function LoginView({ onSwitchToSignup, onAuthSuccess }) {
  const { login } = useAuth();
  const [method, setMethod] = useState("email");
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [error, setError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (method !== "phone" || step !== 2 || resendCountdown <= 0) return;
    const timer = window.setTimeout(() => {
      setResendCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [method, step, resendCountdown]);

  const resetPhoneOtpFlow = () => {
    setStep(1);
    setOtp("");
    setError("");
    setOtpSuccess(false);
    setIsLoading(false);
    setPhoneNumber("");
    setResendCountdown(60);
    setIsResendingOtp(false);
  };

  const validateEmail = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleMethodChange = (id) => {
    setMethod(id);
    setErrors({});
    setGlobalError("");
    if (id === "phone") {
      resetPhoneOtpFlow();
    }
  };

  const handleSendOtp = () => {
    const phoneError = !PHONE_RE.test(form.phone) ? "Enter a valid 10-digit phone." : "";
    setErrors((prev) => ({ ...prev, phone: phoneError }));
    if (phoneError) return;
    setPhoneNumber(form.phone);
    setOtp("");
    setError("");
    setOtpSuccess(false);
    setErrors({});
    setStep(2);
    setResendCountdown(60);
  };

  const handleVerifyOtp = () => {
    setError("");
    setOtpSuccess(false);
    setIsLoading(true);
    window.setTimeout(() => {
      if (otp === "123456") {
        setOtpSuccess(true);
        setIsLoading(false);
        onAuthSuccess();
      } else {
        setError("Incorrect OTP");
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleResendOtp = () => {
    if (resendCountdown > 0 || isResendingOtp) return;
    setIsResendingOtp(true);
    setError("");
    setOtpSuccess(false);
    setOtp("");
    window.setTimeout(() => {
      setResendCountdown(60);
      setIsResendingOtp(false);
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (method !== "email") return;
    if (!validateEmail()) return;
    setGlobalError("");
    setSubmitting(true);
    const result = await login(form.email, form.password, { skipRedirect: true });
    setSubmitting(false);
    if (!result.success) {
      setGlobalError(result.message || "Login failed. Please check your credentials.");
      return;
    }
    onAuthSuccess();
  };

  const handleSocialLogin = (provider) => {
    console.log("Social login:", provider);
  };

  const tabId = method === "email" ? "login-panel-email" : "login-panel-phone";

  const showPhoneOtpStep2 = method === "phone" && step === 2;
  const countdownLabel = `00:${String(resendCountdown).padStart(2, "0")}`;

  return (
    <div className="w-full min-w-0 max-w-[420px] rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:p-9">
      <div className="mb-6 text-center sm:mb-8">
        <RestyleLogoMark />
      </div>

      {globalError && (
        <div className="mb-4 rounded-[10px] bg-red-50 px-4 py-3 font-sans text-[13px] font-medium text-red-600 border border-red-100">
          {globalError}
        </div>
      )}

      {method === "email" ? (
        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-3 sm:mt-6 sm:space-y-4"
          noValidate
          role="tabpanel"
          id={tabId}
        >
          <div>
            <BaseInput
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="Email"
              autoComplete="email"
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
              autoComplete="current-password"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="rounded-md p-1 text-gray-500 transition hover:text-brand-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-pink/40"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              }
            />
            <FieldError message={errors.password} />
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <label className="flex cursor-pointer select-none items-center gap-2.5 font-sans text-[13px] font-normal text-gray-600 sm:text-[14px]">
              <input
                type="checkbox"
                checked={form.rememberMe}
                onChange={(e) => setForm((p) => ({ ...p, rememberMe: e.target.checked }))}
                className="h-4 w-4 shrink-0 rounded border-gray-300 text-brand-pink transition focus:ring-2 focus:ring-brand-pink/25 focus:ring-offset-0"
              />
              Remember me
            </label>
            <button
              type="button"
              className="self-start text-left font-sans text-[13px] font-medium text-brand-pink underline decoration-brand-pink/25 underline-offset-2 transition hover:decoration-brand-pink sm:self-auto sm:text-[14px]"
            >
              Forgot password?
            </button>
          </div>

          <PrimaryGradientButton loading={submitting}>Log in</PrimaryGradientButton>
        </form>
      ) : step === 1 ? (
        <div
          className="mt-5 space-y-3 sm:mt-6 sm:space-y-4"
          role="tabpanel"
          id={tabId}
        >
          <div>
            <BaseInput
              name="phone"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
              placeholder="Phone number"
              autoComplete="tel"
            />
            <FieldError message={errors.phone} />
          </div>
          <PrimaryGradientButton type="button" onClick={handleSendOtp}>
            Send OTP
          </PrimaryGradientButton>
        </div>
      ) : (
        <div
          className="mt-5 flex flex-col items-center space-y-5 text-center sm:mt-6 sm:space-y-6"
          role="tabpanel"
          id="login-panel-phone-otp"
        >
          <div className="w-full space-y-2">
            <h2 className="font-sans text-lg font-bold text-gray-900 sm:text-xl">Login with number</h2>
            <p className="font-sans text-[14px] font-normal leading-relaxed text-gray-500 sm:text-[15px]">
              OTP sent to{" "}
              <span className="font-medium text-gray-800">{formatIndiaMobileDisplay(phoneNumber)}</span>
            </p>
          </div>

          {error ? (
            <p className="w-full font-sans text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          {otpSuccess ? (
            <p className="w-full font-sans text-sm font-semibold text-emerald-600" role="status">
              You&apos;re in! Login successful.
            </p>
          ) : null}

          <div className="w-full max-w-[280px]">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              aria-label="One-time password"
              className="h-14 w-full rounded-[11px] border border-gray-200 bg-white px-3 text-center font-sans text-2xl font-semibold tracking-[0.35em] text-gray-800 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-gray-300 placeholder:tracking-normal focus:border-brand-pink focus:shadow-[0_0_0_3px_var(--auth-focus)] disabled:opacity-60 sm:h-[52px] sm:text-[26px]"
              style={{ "--auth-focus": PRIMARY_RING }}
              disabled={isLoading || otpSuccess}
            />
          </div>

          <div className="w-full">
            <PrimaryGradientButton
              type="button"
              loading={isLoading}
              disabled={otpSuccess}
              onClick={handleVerifyOtp}
            >
              Login
            </PrimaryGradientButton>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCountdown > 0 || isResendingOtp}
              className="font-sans text-[14px] font-semibold text-[#F7246E] transition hover:text-brand-pink-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink/40 disabled:cursor-not-allowed disabled:opacity-65 sm:text-[15px]"
            >
              {isResendingOtp ? "Resending..." : "Resend OTP"}
            </button>
            <p className="font-sans text-xs text-gray-500">
              {resendCountdown > 0 ? `Resend available in ${countdownLabel}` : "You can resend OTP now"}
            </p>
          </div>
        </div>
      )}

      {!showPhoneOtpStep2 ? (
        <div className="mt-6 sm:mt-7">
          <EmailAlternateLoginRow
            onGoogleLogin={handleSocialLogin}
            isPhoneMode={method === "phone"}
            onToggleMethod={() => handleMethodChange(method === "phone" ? "email" : "phone")}
          />
        </div>
      ) : null}

      <p className="mt-6 text-center font-sans text-[14px] font-normal leading-relaxed text-gray-600 sm:mt-7 sm:text-[15px]">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="font-semibold text-brand-pink underline decoration-brand-pink/30 underline-offset-2 transition hover:decoration-brand-pink"
          style={{ fontWeight: 600 }}
          onClick={onSwitchToSignup}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}

function AuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [activeScreen, setActiveScreen] = useState("login");
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Where to go after successful auth (default: home)
  const nextPath = searchParams.get("next") || "/";

  // If already logged in, redirect immediately
  useEffect(() => {
    if (!loading && user) {
      router.replace(nextPath);
    }
  }, [user, loading, nextPath, router]);

  useEffect(() => {
    const t = window.setTimeout(() => setShowSkeleton(false), 380);
    return () => window.clearTimeout(t);
  }, []);

  const handleAuthSuccess = () => {
    router.replace(nextPath);
  };

  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center bg-white px-4 py-8 font-sans sm:px-9 sm:py-12"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <div className="mx-auto w-full max-w-[420px] min-w-0">
        {showSkeleton ? (
          <AuthCardSkeleton />
        ) : activeScreen === "signup" ? (
          <SignupView
            onSwitchToLogin={() => setActiveScreen("login")}
            onAuthSuccess={handleAuthSuccess}
          />
        ) : (
          <LoginView
            onSwitchToSignup={() => setActiveScreen("signup")}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default function RestyleAuthStandalone() {
  return (
    <Suspense fallback={<div className="flex min-h-[100dvh] items-center justify-center"><AuthCardSkeleton /></div>}>
      <AuthPageInner />
    </Suspense>
  );
}
