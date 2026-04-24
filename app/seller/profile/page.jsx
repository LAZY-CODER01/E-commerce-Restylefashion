"use client";

import React from "react";
import SellerProfile from "@/components/SellerProfile";
import Link from "next/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function SellerProfilePage() {
  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-8 pb-24 font-sans">
      <SellerProfile />

      {/* Bottom Navigation (same pattern as seller dashboard) */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] flex h-[72px] items-center justify-around border-t border-gray-100 bg-white/95 px-4 shadow-[0_-8px_32px_rgba(0,0,0,0.03)] backdrop-blur-md">
        <Link href="/seller/dashboard" className="flex flex-col items-center gap-1 text-gray-400 hover:text-brand-pink">
          <DashboardIcon sx={{ fontSize: 24 }} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Dashboard</span>
        </Link>
        <Link href="/seller/products/new" className="flex flex-col items-center gap-1 text-gray-400 hover:text-brand-pink">
          <ShoppingBagIcon sx={{ fontSize: 24 }} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Products</span>
        </Link>
        <Link href="/seller/orders" className="flex flex-col items-center gap-1 text-gray-400 hover:text-brand-pink">
          <TrendingUpIcon sx={{ fontSize: 24 }} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Orders</span>
        </Link>
        <Link href="/seller/profile" className="flex flex-col items-center gap-1 text-brand-pink">
          <PersonIcon sx={{ fontSize: 24 }} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
