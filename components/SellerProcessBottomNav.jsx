"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import HomeIcon from "@mui/icons-material/Home";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AddIcon from "@mui/icons-material/Add";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AssignmentIcon from "@mui/icons-material/Assignment";

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
  if (pathname === "/seller/profile" || pathname === "/seller/store") return "profile";
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
        <BarChartOutlinedIcon sx={{ fontSize: 24 }} />
        <span className="max-w-full truncate text-[9px] font-bold uppercase tracking-tight sm:text-[10px] sm:tracking-wider">Dashboard</span>
      </Link>
      <Link
        href="/seller/products/new"
        className={clsx(
          "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-center transition-all",
          active === "products"
            ? "text-brand-pink"
            : "text-gray-500"
        )}
        aria-label="Sell"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-pink text-white shadow-[0_3px_8px_rgba(247,36,110,0.25)] transition hover:opacity-90 active:scale-[0.98]">
          <AddIcon sx={{ fontSize: 18 }} />
        </span>
        <span className="max-w-full truncate text-[9px] font-bold uppercase tracking-tight sm:text-[10px] sm:tracking-wider">
          Sell
        </span>
      </Link>
      <Link href="/seller/orders" className={itemClass("orders")}>
        <AssignmentIcon sx={{ fontSize: 24 }} />
        <span className="max-w-full truncate text-[9px] font-bold uppercase tracking-tight sm:text-[10px] sm:tracking-wider">Orders</span>
      </Link>
      <Link href="/seller/profile" className={itemClass("profile")} aria-label="My Store">
        <StorefrontIcon sx={{ fontSize: 24 }} />
        <span className="max-w-full truncate text-[9px] font-bold uppercase tracking-tight sm:text-[10px] sm:tracking-wider">
          My Store
        </span>
      </Link>
    </nav>
  );
}
