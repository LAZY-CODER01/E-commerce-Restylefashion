"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDraftListing } from "@/lib/draftListing";

const SOCIAL_TYPES = new Set(["influencer", "designer", "thrifter"]);

function profileIncomplete(draft) {
  if (!draft?.sellerType) return true;
  const sp = draft.sellerProfile || {};
  if (!String(sp.fullName || "").trim()) return true;
  if (SOCIAL_TYPES.has(draft.sellerType) && !String(sp.socialMediaName || "").trim()) {
    return true;
  }
  return false;
}

export default function SellPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user?.hasCompletedSellerSetup) {
      router.replace("/seller/products/new");
      return;
    }

    if (typeof window === "undefined") return;

    const draft = getDraftListing();
    if (!draft?.sellerType) {
      router.replace("/seller/onboarding/type");
      return;
    }
    if (profileIncomplete(draft)) {
      router.replace("/seller/onboarding/type");
      return;
    }
    router.replace("/seller/products/new");
  }, [router, user, loading]);

  return (
    <div className="min-h-[calc(100dvh-80px)] flex items-center justify-center bg-brand-light text-[15px] text-gray-500 font-medium">
      Resuming your listing…
    </div>
  );
}
