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
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
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
        {/* Row 1: Navigation & Actions */}
        <div className="flex items-center justify-between h-14 max-w-[1400px] mx-auto px-4 md:px-9 mb-3 relative">

          {/* Left - Hamburger */}
          <button
            aria-label="Open Menu"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center -ml-2 p-2 rounded-xl hover:bg-gray-200 transition text-brand-dark"
          >
            <MenuOutlinedIcon />
          </button>

          {/* Center Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0 font-extrabold text-[28px] tracking-tight bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent"
          >
            Restyle
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4 sm:gap-6">

            {/* Sell Button */}
            <div className="hidden sm:block">
              <Button className="py-2 px-5 text-[14px]">Sell</Button>
            </div>

            {/* Account */}
            <Link
              href="/auth"
              aria-label="Account"
              className="relative flex items-center justify-center text-brand-dark hover:text-brand-pink transition"
            >
              <PersonOutlineOutlinedIcon />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-pink border-[1.5px] border-white rounded-full"></span>
            </Link>

            {/* Wishlist */}
            <button aria-label="Wishlist" className="flex items-center justify-center text-brand-dark hover:text-brand-pink transition">
              <FavoriteBorderOutlinedIcon />
            </button>

            {/* Bag */}
            <button aria-label="Bag" className="flex items-center justify-center text-brand-dark hover:text-brand-pink transition">
              <ShoppingBagOutlinedIcon />
            </button>
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