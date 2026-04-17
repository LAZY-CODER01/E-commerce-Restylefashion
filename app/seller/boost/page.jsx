"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BoostListingFlow from "@/components/BoostListingFlow";

export default function SellerBoostPage() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100dvh-80px)]  bg-gray-100">
      <BoostListingFlow
        open
        initialStep="select_package"
        fullscreen
        onClose={() => router.push("/seller/dashboard")}
      />
    </div>
  );
}

