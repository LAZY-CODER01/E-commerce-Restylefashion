"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BoostListingFlow from "@/components/BoostListingFlow";
import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";

export default function SellerBoostPage() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100dvh-80px)] bg-gray-100 pb-24">
      <BoostListingFlow
        open
        initialStep="select_package"
        fullscreen
        onClose={() => router.push("/seller/dashboard")}
      />
      <SellerProcessBottomNav />
    </div>
  );
}

