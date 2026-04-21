"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DrawerMenu from "./DrawerMenu";
import Button from "./Button";
import { useSearch } from "@/context/SearchContext";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

function ProfileNavIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden>
      <circle cx="12" cy="7.5" r="3.2" />
      <path d="M4.5 19v-1.2c0-2.7 3.2-4.9 7.5-4.9s7.5 2.2 7.5 4.9V19H4.5z" />
    </svg>
  );
}

function OrderBagNavIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden>
      <rect x="3.5" y="7.5" width="17" height="12.5" rx="2.5" />
      <path d="M9 7.5V6.6A3 3 0 0 1 12 3.8a3 3 0 0 1 3 2.8v.9" />
    </svg>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const { searchQuery, setSearchQuery } = useSearch();

  // Close drawer when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        drawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target)
      ) {
        setDrawerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drawerOpen, drawerRef]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [drawerOpen]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Only redirect to Home if not on Home AND not on an Influencer page
    const isSearchablePage = pathname === "/" || pathname.startsWith("/influencer");
    if (value.trim() !== "" && !isSearchablePage) {
      router.push("/");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-light border-b border-gray-200 pb-4 pt-3 w-full">
        {/* Row 1: mobile = logo centered; md+ = hamburger + logo left (classic) */}
        <div className="relative flex items-center justify-between h-14 max-w-[1400px] mx-auto px-4 md:px-9 mb-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              aria-label="Open Menu"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center justify-center -ml-2 p-2 rounded-xl hover:bg-gray-200 transition text-brand-dark"
            >
              <MenuOutlinedIcon />
            </button>
            <Link
              href="/"
              className="hidden md:inline font-extrabold text-[26px] sm:text-[28px] tracking-tight bg-gradient-to-b from-black to-[#F7246E] bg-clip-text text-transparent"
            >
              Restyle
            </Link>
          </div>

          <Link
            href="/"
            className="absolute left-[48%] top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 font-extrabold text-[26px] sm:text-[28px] tracking-tight bg-gradient-to-b from-black to-[#F7246E] bg-clip-text text-transparent md:hidden"
          >
            Restyle
          </Link>

          {/* Right Actions */}
          <div className="relative z-10 flex min-w-0 flex-nowrap items-center justify-end gap-1 sm:gap-2">
            {pathname.startsWith("/admin") ? (
              <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition rounded-full pl-2 pr-4 py-1.5 shadow-sm">
                 <div className="w-7 h-7 bg-brand-pink text-white rounded-full flex items-center justify-center">
                    <PersonOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                 </div>
                 <span className="text-[13px] font-bold text-gray-800 tracking-wide hidden sm:block">Admin 1</span>
              </button>
            ) : pathname.startsWith("/seller") ? (
              <Link
                href="/seller/dashboard"
                aria-label="Account"
                className="relative flex items-center justify-center text-brand-dark hover:text-brand-pink transition"
              >
                <ProfileNavIcon />
              </Link>
            ) : (
              <>
                {/* Sell — light green CTA */}
                <button
                  type="button"
                  onClick={() => router.push("/sell")}
                  className="shrink-0 cursor-pointer rounded-full bg-[#22C55E] px-3 py-1 text-[12px] font-extrabold tracking-normal text-[#FFFFFF] ring-1 ring-white/85 transition hover:bg-[#16A34A] active:bg-[#16A34A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] active:scale-[0.98] md:px-4 md:py-1.5 md:text-[14px] md:tracking-wide md:ring-2 md:ring-white/90"
                >
                  Sell
                </button>
{/* 22C55E */}
                {/* Account / Profile */}
                <Link
                  href="/profile"
                  aria-label="Account"
                  className="group relative flex items-center justify-center transition-all duration-300"
                >
                  {user ? (
                    <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm overflow-hidden group-hover:shadow-md group-hover:scale-105 transition-all bg-gray-100">
                      {user.profileImage ? (
                        <Image 
                          src={user.profileImage} 
                          alt="Profile" 
                          fill 
                          className="object-cover"
                          onError={(e) => {
                             // Fallback handling
                             e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-pink/5 text-brand-pink text-[14px] font-bold">
                          {user.name?.charAt(0) || <PersonOutlineOutlinedIcon />}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center text-brand-dark hover:text-brand-pink transition">
                      <ProfileNavIcon />
                    </div>
                  )}
                </Link>

                {/* Wishlist hidden on mobile (available in drawer) */}
                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  aria-current={pathname === "/wishlist" ? "page" : undefined}
                  className={`relative hidden sm:inline-flex items-center justify-center p-1.5 text-brand-dark outline-none transition [-webkit-tap-highlight-color:transparent] focus-visible:outline-none active:opacity-90 sm:p-2 ${
                    pathname === "/wishlist" ? "text-brand-pink" : "hover:text-brand-pink"
                  }`}
                >
                  <FavoriteBorderOutlinedIcon sx={{ fontSize: 24 }} />
                  {!!wishlistCount && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#F7246E] px-1 text-[11px] font-bold text-white">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Bag — same: no circular hit chrome or focus ring */}
                <Link
                  href="/orders"
                  aria-label="Orders Bag"
                  aria-current={pathname === "/orders" ? "page" : undefined}
                  className={`relative inline-flex items-center justify-center p-1 text-brand-dark outline-none transition [-webkit-tap-highlight-color:transparent] focus-visible:outline-none active:opacity-90 sm:p-2 ${
                    pathname === "/orders" ? "text-brand-pink" : "hover:text-brand-pink"
                  }`}
                >
                  <OrderBagNavIcon className="h-6 w-6" />
                  {!!cartCount && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F7246E] text-white text-[11px] font-bold flex items-center justify-center">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Row 2 - Search (Visible on Home and Influencer pages) */}
        {(pathname === "/" || pathname.startsWith("/influencer")) && (
          <div className="px-4 md:px-9 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-3 bg-white rounded-full px-5 py-3.5 border border-gray-200 focus-within:border-brand-pink focus-within:shadow-[0_0_0_3px_rgba(247,36,110,0.07)] shadow-sm transition-all duration-200">
              <input
                type="text"
                placeholder='Search "Puffer Jackets"'
                className="flex-1 bg-transparent text-[15px] text-brand-dark placeholder:text-gray-400 outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <SearchOutlinedIcon className="text-gray-400" />
            </div>
          </div>
        )}
      </header>

      {/* Drawer */}
      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        drawerRef={drawerRef}
      />
    </>
  );
}