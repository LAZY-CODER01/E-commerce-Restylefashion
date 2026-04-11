"use client";

import React, { useState, useRef } from "react";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FeaturedPlayListOutlinedIcon from '@mui/icons-material/FeaturedPlayListOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import { useRouter } from "next/navigation";
import Image from "next/image";
import Accordion_02 from "@/components/ui/ruixen-accordian02";
import { useAuth } from "@/context/AuthContext";

/**
 * Guideline Compliance:
 * - Mobile: 4-column grid, 16px margins (px-4), 16px padding.
 * - Web: 12-column grid, 36px margins (px-9), 36px padding.
 */

const BASE_MENU_ITEMS = [
  {
    title: "Orders",
    subtitle: "Check your order status",
    icon: <LocalShippingOutlinedIcon strokeWidth={1} sx={{ fontSize: 32 }} />,
    path: "/orders"
  },
  {
    title: "Wishlist",
    subtitle: "All your curated product collections",
    icon: <FavoriteBorderOutlinedIcon strokeWidth={1} sx={{ fontSize: 32 }} />,
    path: "/wishlist"
  },
  {
    title: "Saved Address",
    subtitle: "Edit your saved addresses",
    icon: <HomeOutlinedIcon strokeWidth={1} sx={{ fontSize: 32 }} />,
    path: "/profile/address"
  },
  {
    title: "Saved Payment Methods",
    subtitle: "Save your payment methods for faster checkout",
    icon: <FeaturedPlayListOutlinedIcon strokeWidth={1} sx={{ fontSize: 32 }} />,
    path: "/profile/payment-methods"
  },
  {
    title: "Profile Details",
    subtitle: "Change your profile details",
    icon: <PersonOutlineOutlinedIcon strokeWidth={1} sx={{ fontSize: 32 }} />,
    path: "/profile/details"
  },
];

const LISTINGS_MENU_ITEM = {
  title: "My Listings",
  subtitle: "Manage your listed products",
  icon: <ViewModuleOutlinedIcon strokeWidth={1} sx={{ fontSize: 32 }} />,
  path: "/profile/listings"
};

const LEGAL_LINKS = [
  "FAQs",
  "About Us",
  "Terms of Use",
  "Customer Policies"
];

import { toast } from "react-toastify";

export default function UserProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // Build menu: inject Listings for Seller/Influencer roles
  const isSeller = user?.role === "Seller" || user?.role === "Influencer";
  const PROFILE_MENU_ITEMS = isSeller
    ? [LISTINGS_MENU_ITEM, ...BASE_MENU_ITEMS]
    : BASE_MENU_ITEMS;

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        toast.success("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
        toast.success("Cover image updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] font-sans selection:bg-brand-pink/10">
      
      {/* 2. Cover Image (Banner) Section */}
      <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden bg-[#D9D9D9] group/cover">
        {coverImage ? (
          <Image src={coverImage} alt="Cover" fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300" />
        )}
        
        {/* Subtle dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

        {/* Cover Upload Button (Visible on hover) */}
        <button 
          onClick={() => coverInputRef.current?.click()}
          className="absolute right-4 md:right-[36px] top-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-md border border-white/30 text-white p-3 rounded-full opacity-0 group-hover/cover:opacity-100 transition-all z-10 shadow-lg"
        >
          <PhotoCameraOutlinedIcon sx={{ fontSize: 24 }} />
        </button>

        {/* Back Button */}
        <button 
          onClick={() => router.push("/")}
          className="absolute left-4 md:left-[36px] top-8 md:top-10 p-2 text-white hover:bg-white/20 rounded-full transition-all z-30 flex items-center justify-center bg-black/10 backdrop-blur-md border border-white/20 shadow-sm"
          aria-label="Go back"
        >
          <ArrowBackOutlinedIcon sx={{ fontSize: 30 }} />
        </button>

        <input type="file" ref={coverInputRef} onChange={handleCoverImageChange} className="hidden" accept="image/*" />
      </div>

      {/* 1. Layout System - Grid Container */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-[36px]">
        {/* Profile Info Row (Avatar + Name) */}
        <div className="grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-[36px] items-end md:items-center -mt-10 md:-mt-14 relative z-20 pb-10">
          
          {/* 3. Profile Image (Avatar) */}
          <div className="col-span-4 md:col-span-auto flex justify-center md:justify-start">
            <div 
              onClick={() => profileInputRef.current?.click()}
              className="relative w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-[28px] border-[4px] border-white shadow-lg overflow-hidden bg-[#E0E0E0] cursor-pointer group active:scale-95 transition-all"
            >
              {profileImage ? (
                <Image src={profileImage} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PersonOutlineOutlinedIcon sx={{ fontSize: 50, color: "#999" }} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <PhotoCameraOutlinedIcon className="text-white" />
              </div>
            </div>
            <input type="file" ref={profileInputRef} onChange={handleProfileImageChange} className="hidden" accept="image/*" />
          </div>

          {/* 4. User Info (Name + Details) */}
          <div className="col-span-4 md:col-span-8 flex flex-col items-center md:items-start pt-2 md:pt-4">
            <h1 className="text-[28px] md:text-[36px] font-bold text-[#2F2F2F] tracking-tight leading-tight">
              {user?.fullName || "Guest"}
            </h1>
            <p className="text-[14px] md:text-[16px] text-gray-500 font-medium tracking-wide">
              {user?.role ? user.role.toUpperCase() : "MEMBER"}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Menu & Sections Gap */}
      <div className="h-4 md:h-8 bg-[#F5F5F5]" />

      {/* Menu Options Section (Keeping commented as per user's current choice) */}
      
      {/* 6. Menu Options Section */}
      <main className="w-full max-w-[1440px] mx-auto bg-white">
        <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
          {PROFILE_MENU_ITEMS.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => router.push(item.path)}
              className="w-full flex items-center px-4 md:px-[36px] py-5 md:py-8 gap-6 hover:bg-gray-50 transition-all text-left group"
            >
              <div className="text-[#2F2F2F] opacity-90 group-hover:text-brand-pink transition-colors">
                {React.cloneElement(item.icon, { sx: { fontSize: 32 } })}
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-[17px] md:text-[20px] font-bold text-[#2F2F2F]">
                  {item.title}
                </h3>
                <p className="text-[13px] md:text-[15px] font-medium text-gray-500">
                  {item.subtitle}
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-300 group-hover:text-brand-pink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </main>
      
      {/* FAQ Section */}
      <section className="bg-white border-t border-gray-100 pb-20">
        <Accordion_02 />
      </section>

    </div>
  );
}
