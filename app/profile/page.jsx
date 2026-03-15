"use client";

import React from "react";
import Image from "next/image";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

const PROFILE_MENU_ITEMS = [
  {
    title: "Orders",
    subtitle: "Check your order status",
    icon: <LocalShippingOutlinedIcon />,
  },
  {
    title: "Wishlist",
    subtitle: "All your marked product collections",
    icon: <FavoriteBorderOutlinedIcon />,
  },
  {
    title: "Saved Address",
    subtitle: "Edit your saved addresses",
    icon: <HomeOutlinedIcon />,
  },
  {
    title: "Saved Payment Methods",
    subtitle: "Save your payment methods for faster checkout",
    icon: <PaymentOutlinedIcon />,
  },
  {
    title: "Profile Details",
    subtitle: "Change your profile details",
    icon: <PersonOutlineOutlinedIcon />,
  },
];

const PREFERENCES_LINKS = [
  "FAQs",
  "About Us",
  "Terms of Use",
  "Customer Policies"
];

export default function UserProfile() {
  return (
    <div className="min-h-[100dvh] bg-brand-light pb-20">
      
      {/* Header Space */}
      <div className="bg-[#E2E2E2] pt-8 pb-16 px-4 md:px-9 relative h-[180px]">
        {/* Back Button (mock) */}
        <button className="text-brand-dark mb-4 p-2 -ml-2 hover:bg-black/5 rounded-full transition">
          <ArrowBackOutlinedIcon />
        </button>
      </div>

      <main className="max-w-[768px] mx-auto px-4 md:px-9 relative z-10 -mt-[72px] sm:-mt-[84px] flex flex-col items-center">
        
        {/* Profile Avatar & Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-3xl bg-[#A8A8A8] border-4 border-brand-light flex items-end justify-center overflow-hidden mb-3 shadow-sm">
             <PersonOutlineOutlinedIcon sx={{ fontSize: 90, color: "white", marginBottom: -1.5 }} />
          </div>
          <h1 className="text-[14px] font-bold text-brand-dark">John Doe</h1>
        </div>

        {/* Main Menu Links */}
        <div className="w-full bg-white rounded-card shadow-sm border border-gray-100 flex flex-col mb-8 overflow-hidden">
          {PROFILE_MENU_ITEMS.map((item, i) => (
            <button key={i} className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0 group text-left">
              <div className="flex items-center gap-4 sm:gap-5">
                <span className="text-gray-500 group-hover:text-brand-pink transition-colors">
                  {item.icon}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold text-brand-dark">
                    {item.title}
                  </span>
                  <span className="text-[12px] text-gray-400 font-medium line-clamp-1">
                    {item.subtitle}
                  </span>
                </div>
              </div>
              <KeyboardArrowRightOutlinedIcon className="text-gray-300 group-hover:text-brand-pink transition-colors" />
            </button>
          ))}
        </div>

        {/* Preferences / Legal Links */}
        <div className="w-full bg-white rounded-card shadow-sm border border-gray-100 flex flex-col mb-8 overflow-hidden">
          {PREFERENCES_LINKS.map((link, i) => (
            <button key={i} className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0 group text-left">
             <span className="text-[14px] font-bold text-gray-500 group-hover:text-brand-pink transition-colors">
               {link}
             </span>
             <KeyboardArrowRightOutlinedIcon className="text-gray-300 group-hover:text-brand-pink transition-colors" />
            </button>
          ))}
        </div>

      </main>
    </div>
  );
}
