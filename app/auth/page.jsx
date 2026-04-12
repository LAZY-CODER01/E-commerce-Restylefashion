"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

/** Matches `components/Navigastion.jsx` center logo: black → magenta gradient, same sizes.*/
function RestyleLogoMark() {
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-1.5">
      <div className="flex h-[50px] items-center justify-center">
        <Link
          href="/"
          className="inline-block bg-gradient-to-b from-black to-brand-pink bg-clip-text font-extrabold text-[26px] leading-none tracking-tight text-transparent sm:text-[28px]"
        >
          Restyle
        </Link>
      </div>
      <p className="max-w-[280px] px-1 text-center font-sans text-[12px] font-medium leading-snug tracking-tight text-gray-500 sm:max-w-none sm:text-[13px]">
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
        className="h-12 w-full rounded-[11px] border border-gray-200 bg-white px-3.5 py-2.5 pr-11 font-sans text-[15px] font-normal text-gray-600 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-gray-400 focus:border-brand-pink focus:shadow-[0_0_0_3px_var(--auth-focus)]"
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
function EmailAlternateLoginRow({ onGoogleLogin, onPhoneLogin }) {
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
          onClick={onPhoneLogin}
          className="flex h-[52px] min-h-[44px] flex-col items-center justify-center gap-1 rounded-[11px] border border-gray-200 bg-white px-2 font-sans text-[11px] font-semibold text-gray-700 shadow-sm transition duration-200 hover:border-brand-pink/40 hover:text-brand-pink hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink/40 sm:h-14 sm:text-xs"
        >
          <PhoneHandsetIcon className="h-[18px] w-[18px] shrink-0 text-gray-600 sm:h-5 sm:w-5" />
          <span className="leading-tight text-center">Login with phone number</span>
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

function MethodTabs({ method, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Login method"
      className="mb-1 flex gap-0 border-b border-gray-200"
    >
      {[
        { id: "email", label: "Email" },
        { id: "phone", label: "Phone" },
      ].map(({ id, label }) => {
        const active = method === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            id={`tab-${id}`}
            onClick={() => onChange(id)}
            className={`relative w-1/2 pb-3 pt-1 font-sans text-[15px] transition-colors duration-200 sm:text-base ${
              active
                ? "font-semibold text-brand-pink"
                : "font-normal text-gray-500 hover:text-gray-600"
            }`}
            style={{ fontWeight: active ? 600 : 400 }}
          >
            {label}
            <span
              className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200 ${
                active ? "bg-brand-pink opacity-100" : "bg-transparent opacity-0"
              }`}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}

function SignupView({ onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    console.log("Signup submit payload:", form);
    setSubmitting(false);
  };

  const handleSocialLogin = (provider) => {
    console.log("Signup social login:", provider);
  };

  return (
    <div className="w-full min-w-0 max-w-[420px] rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:p-9">
      <div className="mb-6 text-center sm:mb-8">
        <RestyleLogoMark />
      </div>

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
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
            placeholder="Phone number"
            autoComplete="tel"
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
    </div>
  );
}

function formatIndiaMobileDisplay(digits) {
  const d = digits.replace(/\D/g, "");
  if (d.length !== 10) return digits;
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
}

function LoginView({ onSwitchToSignup }) {
  const [method, setMethod] = useState("email");
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
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
    if (!sessionPayload.token || !sessionPayload.expiresAt) return;
    const ms = new Date(sessionPayload.expiresAt).getTime() - Date.now();
    if (ms <= 0) return;
    const timerId = window.setTimeout(() => {
      console.log("Auto logout triggered.");
    }, ms);
    return () => window.clearTimeout(timerId);
  }, [sessionPayload]);

  const resetPhoneOtpFlow = () => {
    setStep(1);
    setOtp("");
    setError("");
    setOtpSuccess(false);
    setIsLoading(false);
    setPhoneNumber("");
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
    resetPhoneOtpFlow();
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
    console.log("Request OTP for:", form.phone);
  };

  const handleVerifyOtp = () => {
    setError("");
    setOtpSuccess(false);
    setIsLoading(true);
    window.setTimeout(() => {
      if (otp === "123456") {
        setOtpSuccess(true);
        setIsLoading(false);
        console.log("Phone OTP login success for:", phoneNumber);
      } else {
        setError("Incorrect OTP");
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleChangeMobileNumber = () => {
    setStep(1);
    setOtp("");
    setError("");
    setOtpSuccess(false);
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (method !== "email") return;
    if (!validateEmail()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    console.log("Login submit payload:", form);
    setSubmitting(false);
  };

  const handleSocialLogin = (provider) => {
    console.log("Login social login:", provider);
  };

  const tabId = method === "email" ? "login-panel-email" : "login-panel-phone";

  const showPhoneOtpStep2 = method === "phone" && step === 2;

  return (
    <div className="w-full min-w-0 max-w-[420px] rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:p-9">
      <div className="mb-6 text-center sm:mb-8">
        <RestyleLogoMark />
      </div>

      {!showPhoneOtpStep2 ? (
        <MethodTabs method={method} onChange={handleMethodChange} />
      ) : null}

      {method === "email" ? (
        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-3 sm:mt-6 sm:space-y-4"
          noValidate
          role="tabpanel"
          id={tabId}
          aria-labelledby={`tab-${method}`}
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
          aria-labelledby={`tab-${method}`}
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
          aria-labelledby="tab-phone"
        >
          <div className="w-full space-y-2">
            <h2 className="font-sans text-lg font-bold text-gray-900 sm:text-xl">Verify your number</h2>
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
              Verify &amp; Login
            </PrimaryGradientButton>
          </div>

          <button
            type="button"
            onClick={handleChangeMobileNumber}
            className="font-sans text-[14px] font-medium text-brand-pink transition hover:text-brand-pink-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink/40 sm:text-[15px]"
          >
            Change mobile number
          </button>
        </div>
      )}

      {method === "email" ? (
        <div className="mt-6 sm:mt-7">
          <EmailAlternateLoginRow
            onGoogleLogin={handleSocialLogin}
            onPhoneLogin={() => handleMethodChange("phone")}
          />
        </div>
      ) : step === 1 ? (
        <div className="mt-6 sm:mt-7">
          <SocialButtons onSocialLogin={handleSocialLogin} />
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

export default function RestyleAuthStandalone() {
  const [activeScreen, setActiveScreen] = useState("login");
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setShowSkeleton(false), 380);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-white px-4 py-8 font-sans sm:px-9 sm:py-12">
      <div className="mx-auto w-full max-w-[420px] min-w-0">
        {showSkeleton ? (
          <AuthCardSkeleton />
        ) : activeScreen === "signup" ? (
          <SignupView onSwitchToLogin={() => setActiveScreen("login")} />
        ) : (
          <LoginView onSwitchToSignup={() => setActiveScreen("signup")} />
        )}
      </div>
    </div>
  );
}
