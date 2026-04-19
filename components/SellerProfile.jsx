"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  BadgeCheck,
  Eye,
  Info,
  LayoutGrid,
  Megaphone,
  Pencil,
  Settings,
  Share2,
  Star,
  Layers,
} from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify";
import CustomAvatar from "@/components/CustomAvatar";
import Input from "@/components/Input";
import {
  getSellerProfileSsrPlaceholder,
  getSellerStoreId,
  mergeSellerProfileFromStorage,
  readSellerHubState,
  saveSellerProfileEdits,
  writeSellerHubState,
} from "@/lib/sellerHubProfile";

const TOOLTIP_TEXT =
  "Holiday Mode temporarily hides your account while you're unavailable. Your account stays paused and won't receive orders until you turn it off and start selling again.";

const TABS = [
  { id: "premium", label: "Premium", icon: Award },
  { id: "manage", label: "Manage", icon: LayoutGrid },
  { id: "settings", label: "Settings", icon: Settings },
];

const SELLER_TYPE_OPTIONS = [
  { value: "", label: "Select seller type" },
  { value: "individual", label: "Individual" },
  { value: "influencer", label: "Influencer Shop" },
  { value: "thrifter", label: "Thrifter" },
  { value: "designer", label: "Designer" },
];

function formatAddress(addr) {
  if (!addr || typeof addr !== "object") return "";
  const parts = [
    addr.line1,
    addr.line2,
    addr.city,
    addr.state,
    addr.postalCode || addr.pincode || addr.pin,
  ].filter(Boolean);
  return parts.join(", ");
}

function ToggleSwitch({ checked, onChange, disabled, labelledBy }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative inline-flex h-7 w-11 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        checked ? "bg-neutral-900" : "bg-neutral-400"
      )}
    >
      <span
        className={clsx(
          "pointer-events-none inline-block h-6 w-6 translate-y-0.5 rounded-full bg-white shadow transition",
          checked ? "translate-x-[1.375rem]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function InfoTooltip({ text }) {
  const [pinned, setPinned] = useState(false);
  const [hover, setHover] = useState(false);
  const show = pinned || hover;
  const tipId = useId();

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-800 transition hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400"
        aria-describedby={tipId}
        aria-expanded={show}
        onClick={() => setPinned((p) => !p)}
      >
        <Info className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      {show ? (
        <div
          id={tipId}
          role="tooltip"
          className="absolute right-0 top-full z-20 mt-2 w-[min(100vw-2rem,18rem)] rounded-xl border border-neutral-200 bg-white p-3 text-left text-xs leading-relaxed text-neutral-600 shadow-lg sm:w-72"
        >
          {text}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Isolated seller hub profile — no outer dashboard chrome.
 *
 * @param {object} [props.seller] — overrides for a particular seller (e.g. public profile by id)
 * @param {boolean} [props.hydrateFromStorage=true] — merge onboarding + listings from localStorage
 * @param {string} [props.activeTabId] — controlled tab
 * @param {(id: string) => void} [props.onTabChange]
 * @param {() => void} [props.onShare]
 * @param {() => void} [props.onStorePreview]
 * @param {() => void} [props.onEditAvatar]
 */
export default function SellerProfile({
  seller: sellerProp,
  hydrateFromStorage = true,
  activeTabId: activeTabProp,
  onTabChange,
  onShare,
  onStorePreview,
  onEditAvatar,
  onOnlineStoreChange,
}) {
  const router = useRouter();
  /** Avoid hydration mismatch: localStorage differs between server HTML and client first paint. */
  const [mounted, setMounted] = useState(false);
  const [stored, setStored] = useState(null);
  const [internalTab, setInternalTab] = useState("premium");
  const [onlineStore, setOnlineStore] = useState(true);

  const [profileForm, setProfileForm] = useState({
    displayName: "",
    fullName: "",
    businessName: "",
    gstNumber: "",
    socialMediaName: "",
    sellerType: "",
  });

  useEffect(() => {
    setMounted(true);
    if (hydrateFromStorage) {
      getSellerStoreId();
      setStored(mergeSellerProfileFromStorage());
    }
    const hub = readSellerHubState();
    setOnlineStore(hub.onlineStore !== false);
  }, [hydrateFromStorage]);

  useEffect(() => {
    const bump = () => {
      if (hydrateFromStorage) setStored(mergeSellerProfileFromStorage());
    };
    window.addEventListener("seller-products-updated", bump);
    window.addEventListener("focus", bump);
    return () => {
      window.removeEventListener("seller-products-updated", bump);
      window.removeEventListener("focus", bump);
    };
  }, [hydrateFromStorage]);

  const merged = useMemo(() => {
    if (!mounted) {
      const placeholder = getSellerProfileSsrPlaceholder();
      if (sellerProp && typeof sellerProp === "object") {
        return { ...placeholder, ...sellerProp };
      }
      return placeholder;
    }
    const base = stored ?? mergeSellerProfileFromStorage();
    if (sellerProp && typeof sellerProp === "object") {
      return { ...base, ...sellerProp };
    }
    return base;
  }, [mounted, stored, sellerProp]);

  useEffect(() => {
    if (sellerProp && typeof sellerProp.onlineStore === "boolean") {
      setOnlineStore(sellerProp.onlineStore);
    }
  }, [sellerProp?.onlineStore]);

  const activeTab = activeTabProp ?? internalTab;
  const setTab = (id) => {
    if (onTabChange) onTabChange(id);
    else setInternalTab(id);
  };

  useEffect(() => {
    if (activeTab !== "settings") return;
    const m = mergeSellerProfileFromStorage();
    const hub = readSellerHubState();
    setProfileForm({
      displayName: (hub.displayName && String(hub.displayName).trim()) || m.name || "",
      fullName: m.fullName || "",
      businessName: m.businessName || "",
      gstNumber: m.gstNumber || "",
      socialMediaName: m.socialMediaName || "",
      sellerType: m.sellerType || "",
    });
  }, [activeTab, stored]);

  const handleOnlineToggle = (next) => {
    setOnlineStore(next);
    writeSellerHubState({ onlineStore: next });
    onOnlineStoreChange?.(next);
  };

  /** Holiday Mode on = store paused (same as onlineStore false). */
  const holidayModeOn = !onlineStore;
  const handleHolidayToggle = (nextHolidayOn) => {
    handleOnlineToggle(!nextHolidayOn);
  };

  const openStorePreview = () => {
    if (onStorePreview) {
      onStorePreview();
      return;
    }
    router.push("/seller/store");
  };

  const goToProfileSettings = () => setTab("settings");

  const handleProfileSave = (e) => {
    e.preventDefault();
    saveSellerProfileEdits({
      displayName: profileForm.displayName,
      fullName: profileForm.fullName,
      businessName: profileForm.businessName,
      gstNumber: profileForm.gstNumber,
      socialMediaName: profileForm.socialMediaName,
      sellerType: profileForm.sellerType,
    });
    toast.success("Profile saved");
    setStored(mergeSellerProfileFromStorage());
  };

  const displayName = merged.name || "Seller";
  const subtitle = merged.subtitle || "Pro Merchant • Verified";
  const followers = merged.followers ?? 0;
  const followings = merged.followings ?? 0;
  const liveProducts = merged.liveProducts ?? 0;

  const stat = (n) => (typeof n === "number" ? n.toLocaleString() : String(n ?? "0"));

  const addressLine = formatAddress(merged.pickupAddress);
  const hasDetails =
    merged.businessName ||
    merged.fullName ||
    merged.gstNumber ||
    merged.socialMediaName ||
    addressLine ||
    (merged.bankDetails && Object.keys(merged.bankDetails).length > 0);

  const premiumPlansCount = merged.activePremiumPlansCount ?? 0;

  const toggleLabelId = useId();

  return (
    <div className="w-full max-w-[1200px] text-neutral-900">
      {/* Header card */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: avatar + identity */}
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
            <CustomAvatar
              name={merged.avatarName || displayName}
              duplicateIndex={merged.duplicateIndex}
              size="lg"
              verified={merged.verified}
              onEditClick={onEditAvatar ?? goToProfileSettings}
            />
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
                  {displayName}
                </h1>
                {/* <button
                  type="button"
                  onClick={goToProfileSettings}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit profile
                </button> */}
              </div>
              <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
            </div>
          </div>

          {/* Right: stats then actions (desktop); stacked on mobile after identity block */}
          <div className="flex w-full min-w-0 flex-col gap-5 lg:w-auto lg:max-w-xl lg:items-end">
            <div className="grid w-full grid-cols-3 gap-4 sm:gap-8 lg:w-full lg:max-w-md">
              <div className="flex flex-col items-center text-center lg:items-end lg:text-right">
                <span className="text-xl font-bold tabular-nums text-neutral-950 sm:text-2xl">
                  {stat(followers)}
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 sm:text-[11px]">
                  Followers
                </span>
              </div>
              <div className="flex flex-col items-center text-center lg:items-end lg:text-right">
                <span className="text-xl font-bold tabular-nums text-neutral-950 sm:text-2xl">
                  {stat(followings)}
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 sm:text-[11px]">
                  Followings
                </span>
              </div>
              <div className="flex flex-col items-center text-center lg:items-end lg:text-right">
                <span className="text-xl font-bold tabular-nums text-neutral-950 sm:text-2xl">
                  {stat(liveProducts)}
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 sm:text-[11px]">
                  Live products
                </span>
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-3 lg:max-w-xl">
              {/* Share + Store Preview: one row, side-by-side on all breakpoints */}
              <div className="flex w-full min-w-0 flex-row items-stretch gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={onShare}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-900 transition hover:bg-neutral-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400"
                  aria-label="Share profile"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={openStorePreview}
                  className="inline-flex h-11 min-h-[44px] min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 lg:flex-initial lg:min-w-[168px] lg:px-5"
                >
                  <Eye className="h-4 w-4 shrink-0" />
                  <span className="truncate">Store Preview</span>
                </button>
              </div>

              {/* Holiday Mode: label, info, and toggle grouped — no space-between */}
              <div className="flex w-full justify-start lg:justify-end">
                <div className="inline-flex items-center gap-2">
                  <span
                    id={toggleLabelId}
                    className="whitespace-nowrap text-sm font-medium tracking-tight text-neutral-900"
                  >
                    Holiday Mode
                  </span>
                  <InfoTooltip text={TOOLTIP_TEXT} />
                  <ToggleSwitch
                    labelledBy={toggleLabelId}
                    checked={holidayModeOn}
                    onChange={handleHolidayToggle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav
        className="mt-6 flex gap-2 border-b border-neutral-200 sm:gap-8"
        aria-label="Seller hub sections"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={clsx(
                "relative flex items-center gap-2 px-1 pb-3 text-sm font-semibold transition",
                isActive
                  ? "text-neutral-950"
                  : "text-neutral-500 hover:text-neutral-800"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
              {label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-neutral-950" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Premium grid */}
      {activeTab === "premium" && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            <article className="flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Megaphone className="h-5 w-5" />
                </span>
                {merged.boostLabel ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                    Active
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-950">My Promotion</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Boost visibility
              </p>
              <p className="mt-3 text-sm text-neutral-600">
                {merged.boostLabel || "Run ads to reach more buyers in search and feeds."}
              </p>
              <Link
                href="/seller/boost"
                className="mt-4 inline-flex text-left text-xs font-bold uppercase tracking-wide text-emerald-600 hover:underline"
              >
                Manage ads
              </Link>
            </article>

            <article className="flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-neutral-950">Verified Badge</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Build customer trust
              </p>
              <p className="mt-3 text-sm text-neutral-600">
                Show buyers you&apos;re a trusted seller with a verified checkmark.
              </p>
              <button
                type="button"
                className="mt-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-900 hover:underline"
              >
                Get verified
              </button>
            </article>

            <article className="flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              <h3 className="mt-4 text-base font-bold text-neutral-950">Link WhatsApp</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Instant customer support
              </p>
              <p className="mt-3 text-sm text-neutral-600">
                Let shoppers reach you on WhatsApp for sizing and delivery questions.
              </p>
              <button
                type="button"
                className="mt-4 text-left text-xs font-bold uppercase tracking-wide text-emerald-600 hover:underline"
              >
                Connect
              </button>
            </article>

            <article className="flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Layers className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-bold tabular-nums text-neutral-800">
                  {String(premiumPlansCount).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-950">Active Premium Plans</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                Subscriptions &amp; add-ons
              </p>
              <p className="mt-3 text-sm text-neutral-600">
                View renewals, invoices, and plan benefits in one place.
              </p>
              <Link
                href="/seller/boost/plans"
                className="mt-4 inline-flex text-left text-xs font-bold uppercase tracking-wide text-violet-700 hover:underline"
              >
                View plans
              </Link>
            </article>

            <article className="col-span-1 rounded-2xl border-2 border-amber-300/90 bg-gradient-to-br from-amber-50 via-white to-amber-50/80 p-5 shadow-sm sm:col-span-2 md:col-span-2 xl:col-span-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Elite tier</span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-950">VIP Plan</h3>
                  <p className="max-w-md text-sm text-neutral-600">
                    Exclusive seller perks: priority placement, insights, and dedicated support.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-6 py-3 text-sm font-bold text-neutral-900 shadow-sm transition hover:opacity-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  Upgrade now
                </button>
              </div>
            </article>
          </div>

          {/* Saved seller details (onboarding + hub) */}
          {hasDetails && (
            <section className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-neutral-950">Seller details</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Information from your onboarding and listings for this profile.
              </p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {merged.businessName ? (
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Business name
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">{merged.businessName}</dd>
                  </div>
                ) : null}
                {merged.fullName ? (
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Full name
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">{merged.fullName}</dd>
                  </div>
                ) : null}
                {merged.gstNumber ? (
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      GST
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">{merged.gstNumber}</dd>
                  </div>
                ) : null}
                {merged.socialMediaName ? (
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Social / brand name
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">{merged.socialMediaName}</dd>
                  </div>
                ) : null}
                {merged.sellerType ? (
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Seller type
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900 capitalize">
                      {String(merged.sellerType).replace(/_/g, " ")}
                    </dd>
                  </div>
                ) : null}
                {addressLine ? (
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Pickup address
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">{addressLine}</dd>
                  </div>
                ) : null}
                {merged.bankDetails && merged.bankDetails.accountHolder ? (
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Bank
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">
                      {merged.bankDetails.bankName || "Bank on file"}
                      {merged.bankDetails.accountNumber
                        ? ` • ****${String(merged.bankDetails.accountNumber).slice(-4)}`
                        : ""}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>
          )}
        </>
      )}

      {activeTab === "manage" && (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/80 p-10 text-center text-sm text-neutral-500">
          Manage tools plug in here (listings, orders, inventory).
        </div>
      )}

      {activeTab === "settings" && (
        <form
          onSubmit={handleProfileSave}
          className="mt-6 space-y-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <h2 className="text-lg font-bold text-neutral-950">Edit seller profile</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Update how your store appears to buyers. Changes are saved on this device.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="sp-display-name"
              label="Public store name"
              value={profileForm.displayName}
              onChange={(e) => setProfileForm((f) => ({ ...f, displayName: e.target.value }))}
              placeholder="Shown on your storefront"
            />
            <Input
              id="sp-full-name"
              label="Full name"
              value={profileForm.fullName}
              onChange={(e) => setProfileForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="Legal / account name"
            />
            <Input
              id="sp-business"
              label="Business name"
              value={profileForm.businessName}
              onChange={(e) => setProfileForm((f) => ({ ...f, businessName: e.target.value }))}
              placeholder="Optional brand or label"
            />
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sp-seller-type"
                className="text-[14px] font-medium text-neutral-900"
              >
                Seller type
              </label>
              <select
                id="sp-seller-type"
                value={profileForm.sellerType}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, sellerType: e.target.value }))
                }
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm text-neutral-900 outline-none transition focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              >
                {SELLER_TYPE_OPTIONS.map((o) => (
                  <option key={o.value || "empty"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              id="sp-gst"
              label="GST number"
              value={profileForm.gstNumber}
              onChange={(e) => setProfileForm((f) => ({ ...f, gstNumber: e.target.value }))}
              placeholder="If registered"
            />
            <Input
              id="sp-social"
              label="Social / brand handle"
              value={profileForm.socialMediaName}
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, socialMediaName: e.target.value }))
              }
              placeholder="@yourbrand"
            />
          </div>

          {/* <div className="flex flex-col gap-2 rounded-xl border border-neutral-100 bg-neutral-50/80 px-4 py-3 text-sm text-neutral-600">
            <span className="font-semibold text-neutral-800">Pickup &amp; payouts</span>
            <p>
              Update pickup address on the{" "}
              <Link
                href="/seller/onboarding/pickup"
                className="font-semibold text-rose-600 underline decoration-rose-300 underline-offset-2 hover:text-rose-700"
              >
                pickup details
              </Link>{" "}
              page and bank info on{" "}
              <Link
                href="/seller/onboarding/bank"
                className="font-semibold text-rose-600 underline decoration-rose-300 underline-offset-2 hover:text-rose-700"
              >
                bank details
              </Link>
              .
            </p>
          </div> */}

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-6">
            <button
              type="submit"
              className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
            >
              Save changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
