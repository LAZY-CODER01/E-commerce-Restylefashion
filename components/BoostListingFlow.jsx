"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readSellerHubState, writeSellerHubState } from "@/lib/sellerHubProfile";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Circle,
  CircleDot,
  CreditCard,
  Flame,
  Landmark,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { formFieldInputBase } from "@/components/Input";

const BOOST_PACKAGES = [
  {
    id: "starter",
    name: "Starter Boost",
    durationHours: 24,
    price: 49,
    icon: Zap,
    iconWrapClass: "bg-purple-600",
    iconClass: "text-white",
    features: [
      "Best for early kickstart",
      "Get initial visibility/views",
      "Build early engagement",
    ],
    ctaClass: "border border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100",
    ctaText: "Boost for ₹49",
  },
  {
    id: "smarter",
    name: "Smarter Boost",
    durationHours: 48,
    price: 99,
    icon: Flame,
    iconWrapClass: "bg-pink-500",
    iconClass: "text-white",
    features: [
      "Recommended for stronger reach and performance",
      "2x–3x more views",
      "Higher search visibility",
    ],
    highlighted: true,
    ctaClass: "bg-pink-500 text-white hover:bg-pink-600",
    ctaText: "Boost for ₹99",
  },
  {
    id: "power",
    name: "Power Boost",
    durationHours: 72,
    price: 199,
    icon: Rocket,
    iconWrapClass: "bg-violet-600",
    iconClass: "text-white",
    features: [
      "Maximum impressions",
      "Highest visibility",
      "Maximum chance of selling faster",
    ],
    ctaClass: "border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100",
    ctaText: "Boost for ₹199",
  },
];

const TOP_UP_AMOUNTS = [200, 500, 1000, 2000];

/** Net banking list: logos in `/public/banks/*.svg` (brand-style marks). */
const NET_BANKING_BANKS = [
  { id: "sbi", label: "SBI", fullName: "State Bank of India", logo: "/banks/sbi.svg", popular: true },
  { id: "hdfc", label: "HDFC", fullName: "HDFC Bank", logo: "/banks/hdfc.svg", popular: true },
  { id: "icici", label: "ICICI", fullName: "ICICI Bank", logo: "/banks/icici.svg", popular: true },
  { id: "axis", label: "AXIS", fullName: "Axis Bank", logo: "/banks/axis.svg", popular: true },
  { id: "bob", label: "BOB", fullName: "Bank of Baroda", logo: "/banks/bob.svg", popular: true },
  { id: "canara", label: "Canara", fullName: "Canara Bank", logo: "/banks/canara.svg", popular: true },
  { id: "kotak", label: "Kotak", fullName: "Kotak Mahindra Bank", logo: "/banks/kotak.svg", popular: false },
  { id: "idfc", label: "IDFC", fullName: "IDFC First Bank", logo: "/banks/idfc.svg", popular: false },
  { id: "indusind", label: "IndusInd", fullName: "IndusInd Bank", logo: "/banks/indusind.svg", popular: false },
  { id: "yes", label: "YES", fullName: "Yes Bank", logo: "/banks/yes.svg", popular: false },
  { id: "pnb", label: "PNB", fullName: "Punjab National Bank", logo: "/banks/pnb.svg", popular: false },
  { id: "union", label: "Union", fullName: "Union Bank of India", logo: "/banks/union.svg", popular: false },
  { id: "boi", label: "BOI", fullName: "Bank of India", logo: "/banks/boi.svg", popular: false },
  { id: "federal", label: "Federal", fullName: "Federal Bank", logo: "/banks/federal.svg", popular: false },
  { id: "rbl", label: "RBL", fullName: "RBL Bank", logo: "/banks/rbl.svg", popular: false },
  { id: "bandhan", label: "Bandhan", fullName: "Bandhan Bank", logo: "/banks/bandhan.svg", popular: false },
  { id: "indian", label: "Indian", fullName: "Indian Bank", logo: "/banks/indian.svg", popular: false },
  { id: "au", label: "AU", fullName: "AU Small Finance Bank", logo: "/banks/au.svg", popular: false },
];

function bankMatchesSearch(bank, rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  return (
    bank.fullName.toLowerCase().includes(q) ||
    bank.label.toLowerCase().includes(q) ||
    bank.id.toLowerCase().includes(q)
  );
}
/** Wallet sheet — same layout as net-banking list rows; logos in `/public/wallets/*.svg`. */
const WALLET_OPTIONS = [
  { id: "airtel", name: "Airtel Payments Bank", logo: "/wallets/airtel.svg" },
  { id: "bajaj", name: "Bajaj Pay", logo: "/wallets/bajaj.svg" },
  { id: "mobikwik", name: "Mobikwik", logo: "/wallets/mobikwik.svg" },
  { id: "phonepe", name: "PhonePe", logo: "/payment-phonepe.svg" },
];
const WALLET_ROW_LOGO_CLASS =
  "h-9 w-9 shrink-0 rounded-lg border border-gray-100 bg-white object-contain p-0.5";
const PRIMARY_BTN_CLASS =
  "h-12 w-full rounded-xl flex items-center justify-center text-sm font-medium text-white shadow-sm transition-all hover:bg-rose-600 hover:shadow-md active:scale-[0.98] md:text-base bg-rose-500";
/** Backdrop for embedded modal mode (non-fullscreen) */
const OVERLAY_CLASS = "fixed inset-0 z-[100] flex bg-black/40 backdrop-blur-sm";
/**
 * Mobile: bottom sheet (items-end). Desktop: centered modal (md:items-center).
 */
const SUBVIEW_BACKDROP_CLASS =
  "fixed inset-0 z-[110] flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center md:p-4";
/** Panel: mobile sheet / desktop centered card */
const SUBVIEW_PANEL_CLASS =
  "w-full max-h-[min(88vh,800px)] overflow-y-auto rounded-t-3xl border border-gray-100 bg-white p-6 shadow-2xl md:m-auto md:max-h-[min(90vh,720px)] md:max-w-lg md:rounded-2xl md:shadow-xl";
const CENTER_MODAL_CLASS =
  "relative m-auto w-full max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-[520px]";
/** Main flow shell (fullscreen boost page) — slightly wider on desktop */
const MAIN_SHELL_CLASS =
  "relative mx-auto w-full min-h-screen max-w-6xl bg-gray-50/50 p-4 md:px-10 md:py-8";
/** Narrow column for add-money & payment (desktop) */
const NARROW_CARD_CLASS =
  "mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:border-gray-200/80 hover:shadow-lg";
/** Boost package cards — lift + border on hover */
const BOOST_PACKAGE_CARD_HOVER =
  "transition-all duration-200 hover:-translate-y-1 hover:border-pink-200 hover:shadow-lg";

/** Payment options page — circular UPI app buttons. */
const PAYMENT_OPTION_LOGO_BTN_CLASS =
  "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white p-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400";
const PAYMENT_OPTION_LOGO_IMG_CLASS = "h-full w-full object-contain p-1";
const PAYMENT_ROW_LOGO_CLASS =
  "h-9 w-[52px] shrink-0 rounded-lg border border-gray-100 bg-white object-contain object-center p-0.5";

export default function BoostListingFlow({
  open = true,
  onClose,
  initialStep = "modal",
  fullscreen = false,
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [activeSubView, setActiveSubView] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const canSubmitCard =
    cardNumber.replace(/\D/g, "").length >= 12 &&
    cardExpiry.replace(/\D/g, "").length >= 4 &&
    cardCvv.replace(/\D/g, "").length >= 3;

  const canSubmitUpi = upiId.trim().length > 3 && upiId.includes("@");

  const closePaymentSubView = () => {
    setActiveSubView("");
    setBankSearchQuery("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setUpiId("");
  };

  const payableAmount = useMemo(() => {
    if (selectedPaymentMethod === "wallet-topup" || currentStep === "amount_selection") {
      return selectedAmount;
    }
    return selectedPackage?.price ?? 99;
  }, [currentStep, selectedAmount, selectedPackage, selectedPaymentMethod]);

  /** Mock payment success: persist boost + open seller profile. */
  const finalizeBoostPurchase = () => {
    const hub = readSellerHubState();
    const prevCount =
      typeof hub.activePremiumPlansCount === "number" ? hub.activePremiumPlansCount : 0;
    const label =
      selectedPaymentMethod === "wallet-topup"
        ? `Wallet top-up ₹${selectedAmount}`
        : selectedPackage?.name || "Boost package";
    const prevHistory = Array.isArray(hub.boostHistory) ? hub.boostHistory : [];
    writeSellerHubState({
      boostLabel: label,
      activePremiumPlansCount: prevCount + 1,
      boostCompletedAt: Date.now(),
      boostHistory: [
        ...prevHistory,
        {
          label,
          amount: payableAmount,
          method: selectedPaymentMethod || "card",
          at: Date.now(),
        },
      ],
    });
    closePaymentSubView();
    router.push("/seller/profile");
  };

  const openNetBanking = () => {
    setBankSearchQuery("");
    setActiveSubView("net_banking");
  };

  const netBankingLists = useMemo(() => {
    const matched = NET_BANKING_BANKS.filter((b) => bankMatchesSearch(b, bankSearchQuery));
    return {
      popular: matched.filter((b) => b.popular),
      other: matched.filter((b) => !b.popular),
      hasAny: matched.length > 0,
    };
  }, [bankSearchQuery]);

  if (!open) return null;

  const openPaymentStep = (method) => {
    setSelectedPaymentMethod(method);
    setCurrentStep("payment_options");
  };

  const selectPackage = (pkg) => {
    setSelectedPackage(pkg);
    openPaymentStep("package");
  };

  const renderModalStep = () => (
    <div className={CENTER_MODAL_CLASS}>
      <div className="relative bg-gradient-to-b from-rose-100/90 via-violet-100/50 to-white px-6 pb-2 pt-10 sm:px-8 sm:pt-12">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/60 hover:text-slate-800"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
        <div className="flex justify-center">
          <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-white shadow-lg shadow-rose-200/40 ring-1 ring-white/80 sm:h-[100px] sm:w-[100px]">
            <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-[#d23284] shadow-md sm:h-[62px] sm:w-[62px]">
              <Check className="h-8 w-8 text-white sm:h-9 sm:w-9" strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
        <h2 className="text-center font-manrope text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">
          Your Product is Live!
        </h2>
        <p className="mt-3 text-center font-inter text-sm leading-relaxed text-slate-500 sm:text-base">
          Your listing has been successfully live and is now visible to buyers on the platform.
        </p>

        <div className="relative mt-6 overflow-hidden rounded-2xl bg-slate-50 p-5 transition-shadow duration-200 hover:bg-slate-100/80 hover:shadow-md sm:p-6">
          <Rocket
            className="pointer-events-none absolute -right-1 -top-1 h-24 w-24 text-rose-200/35 sm:h-28 sm:w-28"
            strokeWidth={1.25}
            aria-hidden
          />
          <div className="relative z-[1] flex items-center gap-2">
            <Sparkles className="h-5 w-5 shrink-0 text-[#d23284]" strokeWidth={2} />
            <p className="font-manrope text-base font-bold text-slate-900 sm:text-lg">Maximize your reach</p>
          </div>
          <p className="relative z-[1] mt-3 font-inter text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            Want to reach more buyers faster? Boost your listing to increase visibility, appear higher
            in search results and attract more views.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentStep("select_package")}
          className="mt-6 h-12 w-full rounded-xl bg-gradient-to-r from-rose-500 to-[#d23284] font-inter text-sm font-semibold text-white shadow-md shadow-rose-500/25 transition hover:brightness-105 active:scale-[0.98] sm:h-14 sm:text-base"
        >
          Boost Listing
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full text-center font-inter text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          Maybe Later
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50/90 px-4 py-3">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} />
        <p className="text-center font-inter text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
          Verified marketplace transaction
        </p>
      </div>
    </div>
  );

  const renderPackageCard = (pkg) => {
    const Icon = pkg.icon;
    const wrap = pkg.iconWrapClass || "bg-gray-100";
    return (
      <article
        key={pkg.id}
        className={[
          "relative flex h-full min-h-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6",
          BOOST_PACKAGE_CARD_HOVER,
          pkg.highlighted
            ? "ring-2 ring-pink-400 shadow-[0_4px_20px_rgba(225,29,72,0.08)] hover:shadow-[0_8px_28px_rgba(225,29,72,0.14)] hover:ring-pink-500"
            : "",
        ].join(" ")}
      >
        {pkg.highlighted ? (
          <div className="absolute -top-2.5 right-3 rounded-full bg-pink-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
            MOST POPULAR
          </div>
        ) : null}
        <div
          className={[
            "inline-flex h-10 w-10 items-center justify-center rounded-full shadow-sm",
            wrap,
          ].join(" ")}
        >
          <Icon className={["h-5 w-5", pkg.iconClass].join(" ")} />
        </div>
        <h3 className="mt-4 text-base font-bold text-gray-900 md:text-lg">{pkg.name}</h3>
        <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wide text-pink-500 md:text-xs">
          {pkg.durationHours}H VISIBILITY
        </p>
        <ul className="mt-4 flex-1 space-y-2.5">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm leading-relaxed text-gray-600">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => selectPackage(pkg)}
          className={[
            "mt-auto h-12 w-full rounded-full text-sm font-semibold transition-all hover:brightness-105 active:scale-[0.98]",
            pkg.ctaClass,
            pkg.highlighted ? "shadow-md hover:shadow-lg" : "",
          ].join(" ")}
        >
          {pkg.ctaText}
        </button>
      </article>
    );
  };

  const renderSelectPackage = () => (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:border-gray-200/90 hover:shadow-md md:p-10">
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (initialStep === "modal") {
              setCurrentStep("modal");
              return;
            }
            onClose?.();
          }}
          className="absolute left-0 top-0 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 md:-left-1"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="px-10 pt-1 text-center text-xl font-bold tracking-tight text-gray-900 md:px-14 md:pt-0 md:text-3xl">
          Select Your Boost Package
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 md:text-base">
          Boost Smarter. Sell Faster.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6">
        {BOOST_PACKAGES.map((pkg) => renderPackageCard(pkg))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-1 border-t border-gray-100 pt-6">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400 md:text-xs">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          Secure payments via bank grade encryption
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedPaymentMethod("wallet-topup");
            setCurrentStep("amount_selection");
          }}
          className="mt-1 text-sm font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 transition hover:text-indigo-700"
        >
          Prefer wallet top-up? Add money first
        </button>
      </div>
    </div>
  );

  const renderAmountSelection = () => (
    <div className={`${NARROW_CARD_CLASS} mt-4 sm:mt-6`}>
      <div className="flex items-center border-b border-gray-100 px-4 pb-4 pt-5 md:px-6 md:pb-5 md:pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep("select_package")}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="flex-1 text-center text-xl font-bold text-gray-900 md:text-2xl">Add Money</h2>
        <span className="h-9 w-9 shrink-0" aria-hidden />
      </div>

      <div className="px-4 pb-6 pt-2 md:px-6 md:pb-8 md:pt-4">
      <p className="mt-2 text-center text-sm text-gray-500 md:text-base">Available Balance : ₹0</p>
      <p className="my-4 text-center text-4xl font-bold text-gray-900 md:text-5xl">₹{selectedAmount}</p>

      <div className="flex flex-wrap justify-center gap-3">
        {TOP_UP_AMOUNTS.map((amount) => {
          const active = selectedAmount === amount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => setSelectedAmount(amount)}
              className={[
                "relative rounded-lg border py-2 px-4 text-sm transition-all duration-200",
                active
                  ? "border-rose-500 bg-rose-50 text-rose-700 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:border-rose-300 hover:bg-rose-50/50 hover:shadow-sm",
              ].join(" ")}
            >
              {amount === 500 ? (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-rose-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                  POPULAR
                </span>
              ) : null}
              ₹{amount}
            </button>
          );
        })}
      </div>

      <button type="button" className="mt-5 w-full text-center text-sm text-gray-500 underline">
        Have a coupon code?
      </button>

      <button
        type="button"
        onClick={() => setCurrentStep("payment_options")}
        className={[PRIMARY_BTN_CLASS, "mt-6"].join(" ")}
      >
        Continue
      </button>
      </div>
    </div>
  );

  const PaymentRow = ({ icon: Icon, label, onClick, logoSrc }) => (
    <button
      type="button"
      onClick={onClick}
      className="mb-3 flex w-full items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-rose-200/80 hover:bg-rose-50/35 hover:shadow-md active:scale-[0.99]"
    >
      <span className="flex min-w-0 flex-1 items-center gap-3">
        {logoSrc ? (
          <img src={logoSrc} alt="" className={PAYMENT_ROW_LOGO_CLASS} width={52} height={36} />
        ) : (
          <Icon className="h-5 w-5 shrink-0 text-gray-500" />
        )}
        <span className="truncate text-sm font-medium text-gray-800">{label}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
    </button>
  );

  const renderPaymentOptions = () => (
    <div className={`${NARROW_CARD_CLASS} mt-4 min-h-[65vh] md:min-h-0`}>
      <header className="sticky top-0 z-10 flex items-center border-b border-gray-100 bg-white px-4 py-4 md:px-6 md:py-5">
        <button
          type="button"
          onClick={() => setCurrentStep(selectedPaymentMethod === "wallet-topup" ? "amount_selection" : "select_package")}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="flex-1 text-center text-xl font-bold text-gray-900 md:text-2xl">
          Payment options
        </h2>
        <span className="inline-block h-8 w-8 shrink-0" aria-hidden />
      </header>
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 md:px-6">
        <span>To Pay</span>
        <span className="text-base font-semibold text-gray-900">₹{payableAmount}</span>
      </div>

      <div className="px-4 py-6 md:px-6 md:py-8">
        <section>
          <p className="text-sm font-semibold text-gray-700">Pay via any UPI app</p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveSubView("upi_id")}
              className={PAYMENT_OPTION_LOGO_BTN_CLASS}
              aria-label="Pay with Google Pay"
            >
              <img
                src="/payment-gpay.svg"
                alt=""
                className={PAYMENT_OPTION_LOGO_IMG_CLASS}
                width={44}
                height={44}
              />
            </button>
            <button
              type="button"
              onClick={() => setActiveSubView("upi_id")}
              className={PAYMENT_OPTION_LOGO_BTN_CLASS}
              aria-label="Pay with PhonePe"
            >
              <img
                src="/payment-phonepe.svg"
                alt=""
                className={PAYMENT_OPTION_LOGO_IMG_CLASS}
                width={44}
                height={44}
              />
            </button>
            <button
              type="button"
              onClick={() => setActiveSubView("upi_id")}
              className={PAYMENT_OPTION_LOGO_BTN_CLASS}
              aria-label="Pay with Paytm"
            >
              <img
                src="/payment-paytm.svg"
                alt=""
                className={PAYMENT_OPTION_LOGO_IMG_CLASS}
                width={44}
                height={44}
              />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setActiveSubView("upi_id")}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-rose-400 bg-white text-sm font-medium text-rose-600 transition-all duration-200 hover:border-rose-500 hover:bg-rose-50 hover:shadow-md"
          >
            <img
              src="/payment-upi.svg"
              alt=""
              className="h-7 w-11 shrink-0 object-contain"
              width={44}
              height={28}
            />
            <span>More UPI options &gt;</span>
          </button>
        </section>

        <section className="mt-6">
          <p className="mb-3 text-sm font-semibold text-gray-700">Credit &amp; Debit Cards</p>
          <PaymentRow
            icon={CreditCard}
            label="Add New Card"
            logoSrc="/payment-visa.svg"
            onClick={() => setActiveSubView("add_card")}
          />
        </section>

        <section className="mt-3">
          <p className="mb-3 text-sm font-semibold text-gray-700">Other options</p>
          <PaymentRow
            icon={Wallet}
            label="Wallet"
            logoSrc="/payment-wallet.svg"
            onClick={() => setActiveSubView("wallet")}
          />
          <PaymentRow
            icon={Landmark}
            label="Net Banking"
            logoSrc="/banks/sbi.svg"
            onClick={openNetBanking}
          />
        </section>
      </div>
    </div>
  );

  const OverlayRadio = ({ checked }) =>
    checked ? <CircleDot className="h-4 w-4 text-pink-500" /> : <Circle className="h-4 w-4 text-gray-400" />;

  const renderNetBanking = () => (
    <div className={SUBVIEW_BACKDROP_CLASS}>
      <div className={SUBVIEW_PANEL_CLASS}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Net Banking</h3>
          <button type="button" onClick={closePaymentSubView} className="p-1 text-gray-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="search"
            value={bankSearchQuery}
            onChange={(e) => setBankSearchQuery(e.target.value)}
            placeholder="Search banks"
            autoComplete="off"
            className="w-full min-w-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
          />
        </label>
        {!netBankingLists.hasAny ? (
          <p className="mt-6 text-center text-sm text-gray-500">No banks match your search.</p>
        ) : (
          <>
            {netBankingLists.popular.length > 0 ? (
              <>
                <p className="mt-3 text-xs font-semibold text-gray-500">Popular Banks</p>
                <div className="mt-2 flex flex-wrap items-center gap-2.5">
                  {netBankingLists.popular.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => {
                        setSelectedBank(bank.fullName);
                        finalizeBoostPurchase();
                      }}
                      title={bank.fullName}
                      className="flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl border border-gray-100 bg-white p-1 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md active:scale-[0.98]"
                    >
                      <img
                        src={bank.logo}
                        alt={bank.fullName}
                        className="h-9 w-9 rounded-lg object-cover"
                        width={36}
                        height={36}
                      />
                      <span className="max-w-[52px] truncate text-[8px] font-bold leading-none text-gray-700">
                        {bank.label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : null}
            {netBankingLists.other.length > 0 ? (
              <>
                <p
                  className={`text-xs font-semibold text-gray-500 ${netBankingLists.popular.length > 0 ? "mt-4" : "mt-3"}`}
                >
                  {netBankingLists.popular.length > 0 ? "More banks" : "All banks"}
                </p>
                <div className="mt-2 space-y-1">
                  {netBankingLists.other.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => {
                        setSelectedBank(bank.fullName);
                        finalizeBoostPurchase();
                      }}
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-transparent py-2 pl-1 pr-2 text-left text-sm text-gray-700 transition-all duration-200 hover:border-rose-100 hover:bg-rose-50/50 hover:shadow-sm"
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-3">
                        <img
                          src={bank.logo}
                          alt={bank.fullName}
                          className="h-9 w-9 shrink-0 rounded-lg object-cover"
                          width={36}
                          height={36}
                        />
                        <span className="truncate">{bank.fullName}</span>
                      </span>
                      <OverlayRadio checked={selectedBank === bank.fullName} />
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className={SUBVIEW_BACKDROP_CLASS}>
      <div className={SUBVIEW_PANEL_CLASS}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Wallet</h3>
          <button type="button" onClick={closePaymentSubView} className="p-1 text-gray-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-1">
          {WALLET_OPTIONS.map((wallet) => (
            <button
              key={wallet.id}
              type="button"
              onClick={() => {
                setSelectedWallet(wallet.name);
                finalizeBoostPurchase();
              }}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-transparent py-2 pl-1 pr-2 text-left text-sm text-gray-700 transition-all duration-200 hover:border-rose-100 hover:bg-rose-50/50 hover:shadow-sm"
            >
              <span className="flex min-w-0 flex-1 items-center gap-3">
                <img
                  src={wallet.logo}
                  alt={wallet.name}
                  className={WALLET_ROW_LOGO_CLASS}
                  width={36}
                  height={36}
                />
                <span className="truncate">{wallet.name}</span>
              </span>
              <OverlayRadio checked={selectedWallet === wallet.name} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAddCard = () => (
    <div className={SUBVIEW_BACKDROP_CLASS}>
      <div className={SUBVIEW_PANEL_CLASS}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Add Card</h3>
          <button type="button" onClick={closePaymentSubView} className="p-1 text-gray-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <label className="relative block">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className={`${formFieldInputBase} pr-10`}
            />
            <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="Expiry (MM/YY)"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
              className={formFieldInputBase}
            />
            <input
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="CVV"
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value)}
              className={formFieldInputBase}
            />
          </div>
          <button
            type="button"
            disabled={!canSubmitCard}
            onClick={() => canSubmitCard && finalizeBoostPurchase()}
            className={
              canSubmitCard
                ? PRIMARY_BTN_CLASS
                : "h-12 w-full cursor-not-allowed rounded-xl bg-gray-200 text-sm font-medium text-gray-500"
            }
          >
            Pay ₹{payableAmount}
          </button>
        </div>
      </div>
    </div>
  );

  const renderUpiId = () => (
    <div className={SUBVIEW_BACKDROP_CLASS}>
      <div className={SUBVIEW_PANEL_CLASS}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Pay via UPI ID</h3>
          <button type="button" onClick={closePaymentSubView} className="p-1 text-gray-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        <input
          type="text"
          inputMode="email"
          autoComplete="off"
          placeholder="username@bankname"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className={formFieldInputBase}
        />
        <p className="mt-3 flex items-center gap-2 text-xs text-gray-600">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Your UPI ID will be 100% safe with us
        </p>
        <button
          type="button"
          disabled={!canSubmitUpi}
          onClick={() => canSubmitUpi && finalizeBoostPurchase()}
          className={
            canSubmitUpi
              ? [PRIMARY_BTN_CLASS, "mt-4"].join(" ")
              : "mt-4 h-12 w-full cursor-not-allowed rounded-xl bg-gray-200 text-sm font-medium text-gray-500"
          }
        >
          Verify and Pay ₹{payableAmount}
        </button>
      </div>
    </div>
  );

  const contentShell = fullscreen ? MAIN_SHELL_CLASS : `${OVERLAY_CLASS} p-0`;

  return (
    <div className={contentShell}>
      {!fullscreen ? (
        <div
          className="pointer-events-none mx-auto min-h-screen w-full max-w-6xl bg-gray-50/50"
          aria-hidden
        />
      ) : null}
      <div
        className={
          fullscreen
            ? ""
            : "pointer-events-auto absolute inset-0 z-[51] mx-auto w-full max-w-6xl"
        }
      >
      {currentStep === "modal" ? renderModalStep() : null}
      {currentStep === "select_package" ? renderSelectPackage() : null}
      {currentStep === "amount_selection" ? renderAmountSelection() : null}
      {currentStep === "payment_options" ? renderPaymentOptions() : null}
      </div>

      {activeSubView === "net_banking" ? renderNetBanking() : null}
      {activeSubView === "wallet" ? renderWallet() : null}
      {activeSubView === "add_card" ? renderAddCard() : null}
      {activeSubView === "upi_id" ? renderUpiId() : null}

      {/* Feed styling guidance for boosted cards:
          Use: border border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]
          Add small Zap/Flame icon on product image top-left.
          Sort boosted items higher in feed by boost expiry timestamp.
          Revert to normal card style automatically once 24h/48h/72h boost expires. */}
      <div className="hidden border border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]" />
    </div>
  );
}

