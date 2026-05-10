"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function getActiveId(pathname) {
  if (pathname === "/") {
    return "home";
  }
  if (pathname.startsWith("/dashboard") || pathname === "/seller/dashboard") {
    return "dashboard";
  }
  /* Wallet is its own flow — do not mark Dashboard (or any tab) active here */
  if (pathname === "/seller/wallet" || pathname.startsWith("/seller/wallet/")) {
    return null;
  }
  if (pathname.startsWith("/seller/products")) return "products";
  if (pathname === "/seller/orders") return "orders";
  if (pathname === "/seller/profile") return "profile";
  if (pathname.startsWith("/seller/boost")) {
    return "products";
  }
  return null;
}

export default function SellerProcessBottomNav() {
  const pathname = usePathname();
  const active = getActiveId(pathname);
  const itemClass = (id) =>
    clsx(
      "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-center transition-all",
      active === id ? "text-brand-pink" : "text-gray-400 hover:text-brand-pink"
    );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[115] flex h-[72px] min-w-0 items-center justify-between gap-0.5 border-t border-gray-100 bg-white/95 px-1 sm:px-3 shadow-[0_-8px_32px_rgba(0,0,0,0.03)] backdrop-blur-md"
      aria-label="Seller hub"
    >
      <Link href="/" className={itemClass("home")}>
        <HomeIcon sx={{ fontSize: 24 }} />
        <span className="max-w-full truncate text-[9px] font-bold uppercase tracking-tight sm:text-[10px] sm:tracking-wider">Home</span>
      </Link>
      <Link href="/dashboard" className={itemClass("dashboard")}>
        <DashboardIcon sx={{ fontSize: 24 }} />
        <span className="max-w-full truncate text-[9px] font-bold uppercase tracking-tight sm:text-[10px] sm:tracking-wider">Dashboard</span>
      </Link>
      <Link href="/seller/products/new" className={itemClass("products")}>
        <ShoppingBagIcon sx={{ fontSize: 24 }} />
        <span className="max-w-full truncate text-[9px] font-bold uppercase tracking-tight sm:text-[10px] sm:tracking-wider">Products</span>
      </Link>
      <Link href="/seller/orders" className={itemClass("orders")}>
        <TrendingUpIcon sx={{ fontSize: 24 }} />
        <span className="max-w-full truncate text-[9px] font-bold uppercase tracking-tight sm:text-[10px] sm:tracking-wider">Orders</span>
      </Link>
      <Link href="/seller/profile" className={itemClass("profile")}>
        <PersonIcon sx={{ fontSize: 24 }} />
        <span className="max-w-full truncate text-[9px] font-bold uppercase tracking-tight sm:text-[10px] sm:tracking-wider">Profile</span>
      </Link>
    </nav>
  );
}
