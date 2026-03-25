"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const ORDER_STATS = [
  { label: "Pending Orders", count: 120, color: "bg-orange-50 text-orange-600" },
  { label: "Pickups Due", count: 118, color: "bg-blue-50 text-blue-600" },
  { label: "In-transit", count: 101, color: "bg-purple-50 text-brand-purple" },
  { label: "Sold", count: 109, color: "bg-green-50 text-green-600" }
];

const FILTERS = ["All Orders", "Pending Orders", "Pickups Due", "Returns", "Completed"];

const MOCK_ORDERS = [
  { id: "#RT-2091", name: "Vintage Denim Jacket", detail: "Size M • Blue", price: "₹845.20", status: "In-transit", statusColor: "text-blue-600 bg-blue-50", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=100&q=80" },
  { id: "#RT-2092", name: "Floral Summer Dress", detail: "Size S • Yellow", price: "₹1,245.00", status: "Delivered", statusColor: "text-green-600 bg-green-50", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=100&q=80" },
  { id: "#RT-2093", name: "Leather Crossbody Bag", detail: "One Size • Brown", price: "₹2,100.00", status: "Completed", statusColor: "text-gray-600 bg-gray-50", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=100&q=80" },
  { id: "#RT-2094", name: "Retro Graphic T-Shirt", detail: "Size L • White", price: "₹450.00", status: "Pending", statusColor: "text-orange-600 bg-orange-50", image: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=100&q=80" },
  { id: "#RT-2095", name: "Nike Air Max 90", detail: "Size 9 • White/Red", price: "₹4,500.00", status: "Pickup Due", statusColor: "text-purple-600 bg-purple-50", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=100&q=80" }
];

export default function SellerOrdersPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [activeFilter, setActiveFilter] = useState("All Orders");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const searchMatch = 
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "All Orders") return searchMatch;

    let filterMatch = false;
    if (activeFilter === "Pending Orders") filterMatch = order.status === "Pending" || order.status === "In-transit";
    else if (activeFilter === "Pickups Due") filterMatch = order.status === "Pickup Due";
    else if (activeFilter === "Returns") filterMatch = order.status === "Returned";
    else if (activeFilter === "Completed") filterMatch = order.status === "Completed" || order.status === "Delivered";

    return searchMatch && filterMatch;
  });

  return (
    <div className="min-h-screen bg-brand-light pb-24 font-roboto">
      
      <main className="max-w-[1400px] mx-auto px-6 pt-8 flex flex-col gap-8 animate-fadeIn">
         
         {/* Heading */}
         <div className="flex flex-col">
            <h2 className="text-[32px] font-bold text-brand-dark leading-tight tracking-tight">Orders</h2>
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mt-1">Transaction History & Status</p>
         </div>

         {/* Search Bar */}
         <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xl flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-3.5 focus-within:border-brand-pink focus-within:shadow-[0_0_0_3px_rgba(247,36,110,0.07)] shadow-sm transition-all duration-200">
               <SearchIcon className="text-gray-400 scale-90" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder='Search "Shirts", "#RT-2091"...'
                 className="flex-1 bg-transparent text-[15px] text-brand-dark placeholder:text-gray-400 outline-none"
               />
            </div>
            <button className="w-14 h-14 rounded-full bg-white border border-gray-100 hover:bg-gray-50 flex items-center justify-center text-brand-dark shadow-sm shrink-0 transition-colors">
               <FilterListIcon />
            </button>
         </div>
         
         {/* Summary Cards */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {ORDER_STATS.map((stat, i) => (
               <div key={i} className={`p-8 rounded-[28px] border border-gray-100 bg-white shadow-sm flex flex-col gap-2`}>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                  <span className={`text-[28px] font-bold ${stat.color.split(' ')[1]}`}>{stat.count}</span>
               </div>
            ))}
         </div>

         {/* Filter Tabs */}
         <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
            {FILTERS.map((filter) => (
               <button
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
                 className={`h-[44px] px-8 rounded-full text-[13px] font-bold whitespace-nowrap transition-all border ${
                   activeFilter === filter 
                    ? "bg-brand-pink border-brand-pink text-white shadow-md shadow-brand-pink/20" 
                    : "bg-white border-gray-100 text-brand-dark hover:border-brand-pink/30 hover:text-brand-pink"
                 }`}
               >
                 {filter}
               </button>
            ))}
         </div>

         {/* Sort & List Container */}
         <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-2">
               <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Order Results</span>
               <div className="flex items-center gap-1 text-brand-dark font-bold text-[13px] cursor-pointer">
                  Sort By <KeyboardArrowRightIcon sx={{ fontSize: 18, transform: 'rotate(90deg)' }} />
               </div>
            </div>

            <div className="flex flex-col gap-5">
               {filteredOrders.length > 0 ? (
                 filteredOrders.map((order) => (
                    <div key={order.id} className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm flex items-center justify-between group hover:border-brand-pink/20 transition-all cursor-pointer">
                       <div className="flex items-center gap-6">
                          <div className="relative w-24 h-24 rounded-[24px] overflow-hidden border border-gray-100">
                             <Image src={order.image} alt={order.name} fill className="object-cover" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                             <div className="flex items-center gap-2">
                               <h4 className="text-[16px] font-bold text-brand-dark">{order.name}</h4>
                               <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${order.statusColor}`}>{order.status}</span>
                             </div>
                             <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest opacity-80">{order.id} • {order.detail}</p>
                             <span className="text-[16px] font-bold text-brand-pink mt-1">{order.price}</span>
                          </div>
                       </div>
                       <div className="hidden sm:flex w-12 h-12 rounded-full border border-gray-100 items-center justify-center text-gray-400 group-hover:bg-brand-pink group-hover:text-white group-hover:border-brand-pink transition-all">
                          <KeyboardArrowRightIcon />
                       </div>
                    </div>
                 ))
               ) : (
                 <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-[32px] border border-gray-100 border-dashed">
                    <SearchIcon className="text-gray-300 scale-150 mb-4" />
                    <h3 className="text-[18px] font-bold text-brand-dark">No orders found</h3>
                    <p className="text-[14px] text-gray-500 font-medium mt-1 text-center">We couldn't find any orders matching your current search or filters.</p>
                 </div>
               )}
            </div>
         </div>
      </main>

      {/* Bottom Navigation (Consistent with Dashboard) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 h-[72px] flex items-center justify-around px-4 z-[100] shadow-[0_-8px_32px_rgba(0,0,0,0.03)]">
         <Link href="/seller/dashboard" className={`flex flex-col items-center gap-1 transition-all ${activeTab === "dashboard" ? "text-brand-pink" : "text-gray-400"}`}>
            <DashboardIcon sx={{ fontSize: 24 }} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Dashboard</span>
         </Link>
         <Link href="/seller/products/new" className="flex flex-col items-center gap-1 text-gray-400">
            <ShoppingBagIcon sx={{ fontSize: 24 }} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Products</span>
         </Link>
         <button onClick={() => setActiveTab("orders")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "orders" ? "text-brand-pink" : "text-gray-400"}`}>
            <TrendingUpIcon sx={{ fontSize: 24 }} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Orders</span>
         </button>
      </nav>
    </div>
  );
}
