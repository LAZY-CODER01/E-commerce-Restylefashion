"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Home, LayoutDashboard, Plus, ClipboardList, Store } from "lucide-react";

function getActiveId(pathname) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/seller/products/new") || pathname.startsWith("/sell")) return "sell";
  if (pathname.startsWith("/seller/orders")) return "orders";
  if (pathname.startsWith("/seller/store")) return "store";
  return null;
}

export default function DashboardBottomNav() {
  const pathname = usePathname();
  const active = getActiveId(pathname);

  const itemClass = (id) =>
    clsx(
      "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-center transition",
      active === id ? "text-[#F7246E]" : "text-gray-400 hover:text-[#F7246E]"
    );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[120] h-[78px] border-t border-gray-100 bg-white/95 px-2 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.05)]"
      aria-label="Dashboard navigation"
    >
      <div className="mx-auto flex h-full max-w-[560px] items-end justify-between pb-2">
        <Link href="/" className={itemClass("home")} aria-label="Home">
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-semibold">Home</span>
        </Link>

        <Link href="/dashboard" className={itemClass("dashboard")} aria-label="Dashboard">
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-[10px] font-semibold">Dashboard</span>
        </Link>

        <Link
          href="/seller/products/new"
          className="relative -top-4 flex flex-col items-center justify-center"
          aria-label="Sell"
        >
          <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#F7246E] text-white shadow-[0_14px_36px_rgba(247,36,110,0.35)]">
            <Plus className="h-7 w-7" />
          </span>
          <span className="mt-1 text-[10px] font-semibold text-gray-500">Sell</span>
        </Link>

        <Link href="/seller/orders" className={itemClass("orders")} aria-label="Orders">
          <ClipboardList className="h-6 w-6" />
          <span className="text-[10px] font-semibold">Orders</span>
        </Link>

        <Link href="/seller/store" className={itemClass("store")} aria-label="My Store">
          <Store className="h-6 w-6" />
          <span className="text-[10px] font-semibold">My Store</span>
        </Link>
      </div>
    </nav>
  );
}

