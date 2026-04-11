"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const EMAIL_RE = /\S+@\S+\.\S+/;
const PHONE_RE = /^[6-9]\d{9}$/;

const PRIMARY_RING = "rgba(247, 36, 104, 0.22)";

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

function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function AppleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
    </svg>
  );
}

/** Matches `components/Navigastion.jsx` center logo: black → magenta gradient, same sizes. */
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
        Community-driven thrift fashion marketplace.
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
  const items = [
    { id: "Google", label: "Google", Icon: GoogleIcon },
    { id: "Facebook", label: "Facebook", Icon: FacebookIcon },
    { id: "Apple", label: "Apple", Icon: AppleIcon },
  ];
  return (
    <div className="space-y-3">
      <DividerWithLabel>Continue with</DividerWithLabel>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
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

function PrimaryGradientButton({ children, loading, type = "submit" }) {
  return (
    <button
      type={type}
      disabled={loading}
      className="relative mt-1 flex h-12 w-full items-center justify-center overflow-hidden rounded-[11px] bg-gradient-to-r from-brand-pink via-[#E91E7A] to-brand-purple font-sans text-[15px] font-bold text-white shadow-pink-md transition duration-200 hover:shadow-pink-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink/50 disabled:cursor-not-allowed disabled:opacity-75"
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

function LoginView({ onSwitchToSignup }) {
  const [method, setMethod] = useState("email");
  const [showPassword, setShowPassword] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
    console.log("Request OTP for:", form.phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    console.log("Login submit payload:", form);
    setSubmitting(false);
  };

  const handleSocialLogin = (provider) => {
    console.log("Login social login:", provider);
  };

  const tabId = method === "email" ? "login-panel-email" : "login-panel-phone";

  return (
    <div className="w-full min-w-0 max-w-[420px] rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:p-9">
      <div className="mb-6 text-center sm:mb-8">
        <RestyleLogoMark />
      </div>

      <MethodTabs
        method={method}
        onChange={(id) => {
          setMethod(id);
          setErrors({});
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-3 sm:mt-6 sm:space-y-4"
        noValidate
        role="tabpanel"
        id={tabId}
        aria-labelledby={`tab-${method}`}
      >
        {method === "email" ? (
          <>
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
          </>
        ) : (
          <>
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
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[1fr_auto] sm:items-stretch">
              <BaseInput
                name="otp"
                value={form.otp}
                onChange={(e) => setForm((p) => ({ ...p, otp: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                placeholder="Enter OTP"
                autoComplete="one-time-code"
              />
              <button
                type="button"
                onClick={handleRequestOtp}
                className="h-12 shrink-0 rounded-[11px] border border-gray-200 bg-white px-4 font-sans text-[13px] font-semibold text-brand-pink shadow-sm transition duration-200 hover:border-brand-pink/50 hover:bg-brand-pink/[0.06] hover:shadow-[0_0_0_3px_rgba(247,36,110,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink/40 sm:text-sm"
              >
                {otpRequested ? "Resend OTP" : "Request OTP"}
              </button>
            </div>
            <FieldError message={errors.otp} />
          </>
        )}

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

      <div className="mt-6 sm:mt-7">
        <SocialButtons onSocialLogin={handleSocialLogin} />
      </div>

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
