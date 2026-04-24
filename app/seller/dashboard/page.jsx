"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Link from "next/link";
import Image from "next/image";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EarningsChart from "../EarningsChart";
import SellerProcessBottomNav from "@/components/SellerProcessBottomNav";

const SUMMARY_CARDS = [
  { label: "Total Earnings", value: "₹1,12,880", icon: <TrendingUpIcon />, color: "bg-brand-pink/5 text-brand-pink" },
  { label: "Total Active Listings", value: "103", icon: <ShoppingBagIcon />, color: "bg-brand-purple/5 text-brand-purple" },
  { label: "Orders Sold", value: "109", icon: <DashboardIcon />, color: "bg-green-50 text-green-600" },
  { label: "Out of Stock", value: "12", icon: <PersonIcon />, color: "bg-orange-50 text-orange-600" }
];

const MOST_SELLING = [
  { id: 1, title: "Product Name", detail: "Product Detail", price: "₹21,123", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=100&q=80" },
  { id: 2, title: "Product Name", detail: "Product Detail", price: "₹15,450", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=100&q=80" },
  { id: 3, title: "Product Name", detail: "Product Detail", price: "₹12,200", image: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=100&q=80" },
  { id: 4, title: "Product Name", detail: "Product Detail", price: "₹9,800", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=100&q=80" },
  { id: 5, title: "Product Name", detail: "Product Detail", price: "₹8,450", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=100&q=80" }
];

export default function SellerDashboard() {
  const [listings, setListings] = useState([]);

  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("seller_products") || "[]");
    setListings([...saved, ...MOST_SELLING.slice(0, 5 - Math.min(saved.length, 5))]);
  }, []);

  return (
    <div className="min-h-screen bg-brand-light pb-24 font-roboto">
      
      <main className="max-w-[1400px] mx-auto px-6 pt-8 flex flex-col gap-8 animate-fadeIn">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div className="flex flex-col">
              <h2 className="text-[24px] font-bold text-brand-dark leading-tight">Overview</h2>
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time Performance Metrics</p>
           </div>
           <Link href="/seller/products/new">
             <Button className="h-[48px] px-8 rounded-full font-bold shadow-lg shadow-brand-pink/20">Add Listing</Button>
           </Link>
        </div>

        {/* 1. Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {SUMMARY_CARDS.map((card, i) => (
              <div key={i} className="p-8 bg-white border border-gray-100 rounded-[28px] shadow-sm flex flex-col gap-4 hover:border-brand-pink/20 transition-all duration-300">
                 <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center`}>
                    {card.icon}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{card.label}</span>
                    <span className="text-[20px] font-bold text-brand-dark">{card.value}</span>
                 </div>
              </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* 2. Earnings Graph */}
           <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Revenue Graph Card */}
              <EarningsChart />
            </div>

           {/* 3. Most Selling Products */}
           <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 flex flex-col gap-8 shadow-sm h-full">
                 <h3 className="text-[18px] font-bold text-brand-dark border-l-4 border-brand-pink pl-4 leading-none">Most Selling Products</h3>
                  <div className="flex flex-col gap-8 scroll-m-2">
                    {listings.map((item) => (
                       <div key={item.id} className="flex items-center gap-5 hover:bg-gray-50 p-3 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-gray-100 group">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                             <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex flex-col flex-1">
                             <h4 className="text-[15px] font-bold text-brand-dark leading-tight">{item.title}</h4>
                             <span className="text-[12px] font-bold text-gray-400 uppercase tracking-tighter opacity-80 mt-1">{item.detail}</span>
                          </div>
                          <span className="text-[15px] font-bold text-brand-pink">{item.price}</span>
                       </div>
                    ))}
                  </div>
                 <button className="w-full py-4 text-[13px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-pink transition-colors">
                    View All Activity
                 </button>
              </div>
           </div>
        </div>
      </main>

      <SellerProcessBottomNav />
    </div>
  );
}
