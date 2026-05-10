"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import {
  Mail,
  MessageCircle,
  Package,
  Phone,
  Truck,
  Undo2,
  User,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const SUPPORT_EMAIL = "support@example.com";
const SUPPORT_PHONE = "+91 98765 43210";

function IconWrap({ children }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#F7246E]/35 text-[#F7246E] md:h-12 md:w-12">
      {children}
    </span>
  );
}

function HelpListRow({
  icon: Icon,
  title,
  subtitle,
  onClick,
  href,
}) {
  const base =
    "group flex w-full cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-[14px] text-left transition-colors last:border-b-0 hover:bg-[#FFF5F8]/80 active:bg-gray-50 md:gap-4 md:px-5 md:py-[17px]";
  const body = (
    <>
      <IconWrap>
        <Icon className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
      </IconWrap>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[15px] font-bold leading-snug tracking-tight text-[#111] md:text-[16px]">
          {title}
        </span>
        {subtitle ? (
          <span className="text-[13px] leading-snug text-gray-500 md:text-[14px]">{subtitle}</span>
        ) : null}
      </div>
      <KeyboardArrowRightOutlinedIcon
        className="shrink-0 text-gray-400 transition group-hover:text-gray-600"
        sx={{ fontSize: 22 }}
        aria-hidden
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={base}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={base}>
      {body}
    </button>
  );
}

export default function ProfileHelpPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const needHelpRef = useRef(null);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth?next=/profile/help");
  }, [loading, user, router]);

  const scrollToContact = () => {
    needHelpRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#F5F5F5] font-sans">
        <p className="text-[14px] font-medium text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#F5F5F5] font-sans selection:bg-brand-pink/15">
      <main className="mx-auto max-w-[720px] px-4 pb-28 pt-4 md:px-8 md:pb-36 md:pt-6 lg:max-w-[800px]">
        <header className="relative mb-6 flex min-h-[52px] items-center justify-between md:mb-8">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="-ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#2F2F2F] transition hover:bg-black/5 md:h-12 md:w-12"
            aria-label="Back to profile"
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 26 }} />
          </button>
          <h1 className="absolute left-1/2 top-1/2 max-w-[80%] -translate-x-1/2 -translate-y-1/2 truncate text-center text-[17px] font-bold tracking-tight text-[#111] md:text-[19px]">
            Help &amp; Support
          </h1>
          <span className="h-11 w-11 shrink-0 md:h-12 md:w-12" aria-hidden />
        </header>

        {/* Hero */}
        <section className="mb-6 rounded-[20px] border border-[#F7246E]/10 bg-[#FFF5F8] px-4 py-4 shadow-sm md:mb-7 md:flex md:items-center md:justify-between md:gap-6 md:rounded-3xl md:px-6 md:py-5">
          <div className="min-w-0 flex-1 pr-2">
            <p className="text-[17px] font-bold leading-snug text-[#111] md:text-[18px]">
              We&apos;re here to help!
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600 md:text-[14px]">
              Get quick answers or reach out to our support team.
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToContact}
            className="mt-4 shrink-0 whitespace-nowrap text-[14px] font-bold text-[#F7246E] underline-offset-4 transition hover:underline md:mt-0"
          >
            Contact Us ›
          </button>
        </section>

        {/* Quick Help — Offers & Discounts intentionally omitted */}
        <section className="mb-6 md:mb-7">
          <h2 className="mb-2.5 px-1 text-[15px] font-bold text-[#111] md:text-[16px]">Quick Help</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] md:rounded-3xl">
            <HelpListRow icon={Package} title="My Orders" href="/my-orders" />
            <HelpListRow
              icon={Undo2}
              title="Returns &amp; Refunds"
              subtitle="Policies and how to raise a request"
              onClick={() => toast.info("Returns & refunds help is coming soon.")}
            />
            <HelpListRow
              icon={Truck}
              title="Shipping &amp; Delivery"
              subtitle="Track parcels and delivery timelines"
              onClick={() => toast.info("Shipping & delivery guides are coming soon.")}
            />
            <HelpListRow
              icon={Wallet}
              title="Payments"
              subtitle="UPI, cards and refunds to your wallet"
              onClick={() => toast.info("Payment help topics are coming soon.")}
            />
            <HelpListRow icon={User} title="Account &amp; Profile" href="/profile/details" />
          </div>
        </section>

        {/* Need more help? */}
        <section ref={needHelpRef} className="scroll-mt-20">
          <h2 className="mb-2.5 px-1 text-[15px] font-bold text-[#111] md:text-[16px]">Need more help?</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] md:rounded-3xl">
            <HelpListRow
              icon={MessageCircle}
              title="Chat with us"
              subtitle="Chat live with our support team"
              onClick={() => toast.info("Live chat will be available soon.")}
            />
            <HelpListRow
              icon={Mail}
              title="Email us"
              subtitle={SUPPORT_EMAIL}
              href={`mailto:${SUPPORT_EMAIL}`}
            />
            <HelpListRow
              icon={Phone}
              title="Call us"
              subtitle={SUPPORT_PHONE}
              href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
