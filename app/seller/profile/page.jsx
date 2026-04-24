"use client";

import React from "react";
import SellerProfile from "@/components/SellerProfile";
import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";

export default function SellerProfilePage() {
  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-8 pb-24 font-sans">
      <SellerProfile />
      <SellerProcessBottomNav />
    </div>
  );
}
