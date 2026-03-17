"use client";

import React from "react";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FeaturedPlayListOutlinedIcon from '@mui/icons-material/FeaturedPlayListOutlined';

const PROFILE_MENU_ITEMS = [
  {
    title: "Orders",
    subtitle: "Check your order status",
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 28 }} />,
  },
  {
    title: "Wishlist",
    subtitle: "All your curated product collections",
    icon: <FavoriteBorderOutlinedIcon sx={{ fontSize: 28 }} />,
  },
  {
    title: "Saved Address",
    subtitle: "Edit your saved addresses",
    icon: <HomeOutlinedIcon sx={{ fontSize: 28 }} />,
  },
  {
    title: "Saved Payment Methods",
    subtitle: "Save your payment methods for faster checkout",
    icon: <FeaturedPlayListOutlinedIcon sx={{ fontSize: 28 }} />,
  },
  {
    title: "Profile Details",
    subtitle: "Change your profile details",
    icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 28 }} />,
  },
];

const LEGAL_LINKS = [
  "FAQs",
  "About Us",
  "Terms of Use",
  "Customer Policies"
];

export default function UserProfile() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-10">
      
      {/* Header Section */}
      <div className="bg-[#E0E0E0] h-[260px] relative px-4 pt-12">
        <button className="text-[#2F2F2F] hover:bg-black/5 p-2 rounded-full transition">
          <ArrowBackOutlinedIcon sx={{ fontSize: 26 }} />
        </button>

        {/* Profile Avatar Container */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[138px] flex flex-col items-center">
          <div className="w-[158px] h-[158px] bg-[#9E9E9E] rounded-[24px] border-[5px] border-white flex items-end justify-center overflow-hidden shadow-sm">
             <PersonOutlineOutlinedIcon sx={{ fontSize: 130, color: "white", marginBottom: -2 }} />
          </div>
          <div className="bg-white w-full text-center py-4 mt-[-1px]">
            <h1 className="text-[13px] font-bold text-[#2F2F2F] tracking-wide">Avinash Singh</h1>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto mt-[80px]">
        
        {/* Menu Items List */}
        <div className="bg-white border-t border-b border-gray-200 divide-y divide-gray-200">
          {PROFILE_MENU_ITEMS.map((item, i) => (
            <button key={i} className="w-full flex items-center gap-6 px-6 py-5 hover:bg-gray-50 transition text-left group">
              <span className="text-[#2F2F2F] opacity-80 group-hover:text-brand-pink transition-colors">
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-[17px] font-bold text-[#2F2F2F]">
                  {item.title}
                </span>
                <span className="text-[12px] text-gray-400 font-medium">
                  {item.subtitle}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Separator / Spacer */}
        <div className="h-6 bg-[#F5F5F5]"></div>

        {/* Legal/Preferences Flat List */}
        <div className="bg-white border-t border-b border-gray-200 divide-y divide-gray-200">
          {LEGAL_LINKS.map((link, i) => (
            <button key={i} className="w-full px-6 py-6 text-left hover:bg-gray-50 transition group">
              <span className="text-[15px] font-bold text-gray-400 group-hover:text-brand-pink transition-colors">
                {link}
              </span>
            </button>
          ))}
        </div>

      </main>
    </div>
  );
}
