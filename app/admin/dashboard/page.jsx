"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// --- MOCK DYNAMIC DATA PER MONTH ---
const DASHBOARD_DATA = {
  "January 2025": {
    widgets: [
      { id: "w1", label: "Total GMV", value: "₹2,45,80,930" },
      { id: "w2", label: "Platform Earnings", value: "₹1,60,32,418" },
      { id: "w3", label: "Total Active Listings", value: "8,589" },
      { id: "w4", label: "Orders Sold", value: "97,326" },
      { id: "w5", label: "Average Order Value", value: "₹990" },
      { id: "w6", label: "Repeat Purchase Rate", value: "37%" },
      { id: "w7", label: "Sell Through Rate", value: "82%" },
      { id: "w8", label: "Conversion Rate", value: "31%" },
      { id: "w9", label: "Return Rate", value: "8%" },
      { id: "w10", label: "Inventory Age", value: "14 Days" },
    ],
    earnings: [
      { days: "1-3", value1: 3200 }, { days: "4-6", value1: 4600 }, { days: "7-9", value1: 3400 },
      { days: "10-12", value1: 6500 }, { days: "13-15", value1: 5100 }, { days: "16-18", value1: 7800 },
      { days: "19-21", value1: 4800 }, { days: "22-24", value1: 6800 }, { days: "25-27", value1: 5200 }, { days: "28-31", value1: 8700 },
    ],
    traffic: [
      { days: "1-3", value1: 12000 }, { days: "4-6", value1: 15600 }, { days: "7-9", value1: 13400 },
      { days: "10-12", value1: 18500 }, { days: "13-15", value1: 15100 }, { days: "16-18", value1: 22800 },
      { days: "19-21", value1: 14800 }, { days: "22-24", value1: 16800 }, { days: "25-27", value1: 19200 }, { days: "28-31", value1: 28700 },
    ],
    listings: [
      { days: "1-3", value1: 8500, value2: 2400 }, { days: "4-6", value1: 8100, value2: 3200 },
      { days: "7-9", value1: 9200, value2: 2600 }, { days: "10-12", value1: 7600, value2: 4300 },
      { days: "13-15", value1: 11100, value2: 3100 }, { days: "16-18", value1: 9300, value2: 2900 },
      { days: "19-21", value1: 10400, value2: 4800 }, { days: "22-24", value1: 8600, value2: 3400 },
      { days: "25-27", value1: 9800, value2: 4500 }, { days: "28-31", value1: 12400, value2: 5200 },
    ],
    orders: [
      { days: "1-3", value1: 4500, value2: 1400 }, { days: "4-6", value1: 4100, value2: 2200 },
      { days: "7-9", value1: 5200, value2: 1600 }, { days: "10-12", value1: 3600, value2: 3300 },
      { days: "13-15", value1: 7100, value2: 2100 }, { days: "16-18", value1: 6300, value2: 1900 },
      { days: "19-21", value1: 8400, value2: 3800 }, { days: "22-24", value1: 5600, value2: 2400 },
      { days: "25-27", value1: 7800, value2: 3500 }, { days: "28-31", value1: 9400, value2: 4200 },
    ],
    categories: [
      { name: "Vintage Denim", details: "7,824 orders • High Demand", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=200&q=80" },
      { name: "Streetwear", details: "5,430 orders • Trending Now", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=200&q=80" },
      { name: "Formal Blazers", details: "3,102 orders • Steady Sales", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=200&q=80" },
    ]
  },
  "February 2025": {
    widgets: [
      { id: "w1", label: "Total GMV", value: "₹3,15,40,200" },
      { id: "w2", label: "Platform Earnings", value: "₹1,88,29,150" },
      { id: "w3", label: "Total Active Listings", value: "9,214" },
      { id: "w4", label: "Orders Sold", value: "112,400" },
      { id: "w5", label: "Average Order Value", value: "₹1,050" },
      { id: "w6", label: "Repeat Purchase Rate", value: "41%" },
      { id: "w7", label: "Sell Through Rate", value: "85%" },
      { id: "w8", label: "Conversion Rate", value: "34%" },
      { id: "w9", label: "Return Rate", value: "6%" },
      { id: "w10", label: "Inventory Age", value: "11 Days" },
    ],
    earnings: [
      { days: "1-3", value1: 4200 }, { days: "4-6", value1: 5600 }, { days: "7-9", value1: 4400 },
      { days: "10-12", value1: 7500 }, { days: "13-15", value1: 6100 }, { days: "16-18", value1: 8800 },
      { days: "19-21", value1: 5800 }, { days: "22-24", value1: 7800 }, { days: "25-28", value1: 9700 },
    ],
    traffic: [
      { days: "1-3", value1: 14000 }, { days: "4-6", value1: 17600 }, { days: "7-9", value1: 15400 },
      { days: "10-12", value1: 20500 }, { days: "13-15", value1: 17100 }, { days: "16-18", value1: 24800 },
      { days: "19-21", value1: 16800 }, { days: "22-24", value1: 18800 }, { days: "25-28", value1: 30700 },
    ],
    listings: [
      { days: "1-3", value1: 9500, value2: 3400 }, { days: "4-6", value1: 9100, value2: 4200 },
      { days: "7-9", value1: 10200, value2: 3600 }, { days: "10-12", value1: 8600, value2: 5300 },
      { days: "13-15", value1: 12100, value2: 4100 }, { days: "16-18", value1: 10300, value2: 3900 },
      { days: "19-21", value1: 11400, value2: 5800 }, { days: "22-24", value1: 9600, value2: 4400 },
      { days: "25-28", value1: 13400, value2: 6200 },
    ],
    orders: [
      { days: "1-3", value1: 5500, value2: 2400 }, { days: "4-6", value1: 5100, value2: 3200 },
      { days: "7-9", value1: 6200, value2: 2600 }, { days: "10-12", value1: 4600, value2: 4300 },
      { days: "13-15", value1: 8100, value2: 3100 }, { days: "16-18", value1: 7300, value2: 2900 },
      { days: "19-21", value1: 9400, value2: 4800 }, { days: "22-24", value1: 6600, value2: 3400 },
      { days: "25-28", value1: 10400, value2: 5200 },
    ],
    categories: [
      { name: "Sneakers", details: "8,211 orders • Massive Spike", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=200&q=80" },
      { name: "Summer Tops", details: "6,302 orders • Trending Fast", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80" },
      { name: "Caps & Hats", details: "4,192 orders • High Growth", image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=200&q=80" },
    ]
  }
};


// --- REUSABLE CHART COMPONENT ---
function AdminChart({ title, data, lines, selectedMonth, height = 240 }) {
  const [isMounted, setIsMounted] = React.useState(false);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const monthAbbr = selectedMonth.split(' ')[0].substring(0, 3);
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md px-4 py-3 border border-gray-100 shadow-xl rounded-xl flex flex-col items-start gap-1 min-w-[120px] animate-fadeIn">
          <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{label} {monthAbbr}</span>
          <div className="w-full flex justify-between items-center gap-4 mt-1">
             <span className="text-[11px] text-gray-500 font-bold uppercase">{title.includes("Earnings") ? "Earnings" : title.includes("Traffic") ? "Users" : lines === 1 ? "Value" : "Primary"}</span>
             <span className="text-[14px] font-extrabold text-brand-pink">
               {title.includes("Earnings") ? "₹" : ""}{payload[0].value.toLocaleString()}
             </span>
          </div>
          {payload[1] && (
            <div className="w-full flex justify-between items-center gap-4 mt-0.5">
               <span className="text-[11px] text-gray-500 font-bold uppercase">Secondary</span>
               <span className="text-[14px] font-extrabold text-brand-purple">
                 {title.includes("Earnings") ? "₹" : ""}{payload[1].value.toLocaleString()}
               </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (tickItem) => {
    if (tickItem === 0) return "0";
    return `${tickItem / 1000}k`;
  };

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col gap-8 group hover:border-brand-pink/20 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-bold text-brand-dark">{title}</h3>
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-light rounded-full text-brand-dark h-[36px]">
          <span className="text-[13px] font-bold">{selectedMonth}</span>
          <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-400" />
        </div>
      </div>

      <div className="w-full relative" style={{ height: `${height}px` }}>
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" strokeWidth={1} />
              <XAxis
                dataKey="days"
                axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }}
              dy={15}
              minTickGap={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }}
              tickFormatter={formatYAxis}
              dx={-10}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#F7246E", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.3 }}
            />
            
            <Line
              type="monotone"
              dataKey="value1"
              stroke="#F7246E"
              strokeWidth={3}
              dot={{ r: 4, fill: "#F7246E", strokeWidth: 0 }}
              activeDot={{ r: 7, fill: "#F7246E", strokeWidth: 3, stroke: "#fff" }}
              animationDuration={800}
            />
            
            {lines > 1 && (
              <Line
                type="monotone"
                dataKey="value2"
                stroke="#8B1DDF"
                strokeWidth={3}
                dot={{ r: 4, fill: "#8B1DDF", strokeWidth: 0 }}
                activeDot={{ r: 7, fill: "#8B1DDF", strokeWidth: 3, stroke: "#fff" }}
                animationDuration={800}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        ) : null}
      </div>
    </div>
  );
}


// --- MAIN DASHBOARD PAGE ---
export default function AdminDashboardPage() {
  const pathname = usePathname();
  const [selectedMonth, setSelectedMonth] = useState("January 2025");
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Widget Management States
  const allWidgetIds = DASHBOARD_DATA["January 2025"].widgets.map(w => w.id);
  const [visibleWidgets, setVisibleWidgets] = useState(allWidgetIds);
  const [showWidgetManager, setShowWidgetManager] = useState(false);

  const activeData = DASHBOARD_DATA[selectedMonth];

  // Close dropdowns on outside click (Basic simplified implementation for visual)
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    setShowWidgetManager(false);
  };
  
  const toggleWidgetManager = () => {
    setShowWidgetManager(!showWidgetManager);
    setShowCalendar(false);
  };

  const handleWidgetToggle = (id) => {
    setVisibleWidgets(prev => 
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-brand-light flex font-roboto w-full overflow-hidden">
      
      {/* SIDEBAR - HIDDEN ON MOBILE */}
      <aside className="hidden lg:flex w-[240px] bg-brand-light flex-col border-r border-gray-200/50 h-[calc(100vh-80px)] shrink-0 py-8 pr-4 overflow-y-auto">
        <nav className="flex flex-col font-bold text-[14px] gap-2">
          {[{ title: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon sx={{ fontSize: 22 }} /> },
            { title: "Listings", path: "/admin/listings", icon: <Inventory2Icon sx={{ fontSize: 22 }} /> },
            { title: "Orders", path: "/admin/orders", icon: <LocalShippingIcon sx={{ fontSize: 22 }} /> },
            { title: "Sellers", path: "/admin/sellers", icon: <PeopleIcon sx={{ fontSize: 22 }} /> },
          ].map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.title} 
                href={item.path} 
                className={`group flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all duration-200 border border-transparent ${
                  isActive 
                  ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/20 font-extrabold" 
                  : "text-gray-500 bg-transparent hover:bg-white hover:text-brand-pink hover:shadow-md hover:border-gray-100"
                }`}
              >
                 <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-brand-pink"} transition-colors`}>
                   {item.icon}
                 </span>
                 {item.title}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col px-4 md:px-9 py-6 md:py-8 overflow-y-auto h-[calc(100vh-80px)] w-full max-w-[1400px] mx-auto">
        
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 relative">
           <h2 className="text-[24px] md:text-[28px] font-extrabold text-brand-dark">Platform Overview</h2>
           <div className="flex flex-wrap items-center gap-2 sm:gap-4 relative">
              
              {/* Calendar Control */}
              <div className="relative">
                 <button onClick={toggleCalendar} className="flex items-center gap-2 bg-white hover:bg-gray-50 transition px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-brand-dark group">
                    <span className="text-[13px] font-bold">{selectedMonth}</span>
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-400 group-hover:text-brand-pink transition-colors" />
                 </button>
                 
                 {/* Calendar Dropdown */}
                 {showCalendar && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-[20px] shadow-xl overflow-hidden py-2 animate-fadeIn z-50">
                       {Object.keys(DASHBOARD_DATA).map((month) => (
                         <button
                           key={month}
                           className={`w-full text-left px-5 py-3 text-[14px] font-bold hover:bg-brand-pink/5 hover:text-brand-pink transition-colors ${
                             selectedMonth === month ? "text-brand-pink bg-brand-pink/5" : "text-brand-dark"
                           }`}
                           onClick={() => { setSelectedMonth(month); setShowCalendar(false); }}
                         >
                           {month}
                         </button>
                       ))}
                    </div>
                 )}
              </div>

              {/* Configure Widgets Control */}
              <div className="relative">
                 <button onClick={toggleWidgetManager} className="flex items-center gap-2 bg-white hover:bg-gray-50 transition px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-brand-dark group">
                    <span className="text-[13px] font-bold">Manage Widgets</span>
                    <TuneIcon sx={{ fontSize: 18 }} className="text-gray-400 group-hover:text-brand-pink transition-colors" />
                 </button>
                 
                 {/* Widgets Dropdown */}
                 {showWidgetManager && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-[24px] shadow-xl overflow-hidden py-3 animate-fadeIn z-50">
                       <h4 className="text-[11px] font-extrabold uppercase text-gray-400 tracking-widest px-5 mb-2">Visible Widgets</h4>
                       <div className="max-h-[300px] overflow-y-auto flex flex-col">
                          {activeData.widgets.map((widget) => (
                             <label key={widget.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="accent-brand-pink w-4 h-4 cursor-pointer"
                                  checked={visibleWidgets.includes(widget.id)}
                                  onChange={() => handleWidgetToggle(widget.id)}
                                />
                                <span className="text-[13px] font-bold text-brand-dark">{widget.label}</span>
                             </label>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
           {activeData.widgets.filter(w => visibleWidgets.includes(w.id)).map((widget) => (
             <div key={widget.id} className="bg-white border border-gray-100 p-6 rounded-[28px] shadow-sm hover:shadow-xl hover:border-brand-pink/30 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest relative z-10">{widget.label}</span>
                <span className="text-[22px] font-extrabold text-brand-dark tracking-tight leading-none relative z-10 mt-1 group-hover:text-brand-pink transition-colors">{widget.value}</span>
                <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-brand-pink/5 rounded-full blur-[20px] group-hover:bg-brand-pink/10 transition-colors pointer-events-none"></div>
             </div>
           ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <AdminChart selectedMonth={selectedMonth} title="Platform Earnings" data={activeData.earnings} lines={1} />
          <AdminChart selectedMonth={selectedMonth} title="Traffic" data={activeData.traffic} lines={1} />
        </div>

        {/* Charts & Categories Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-20">
           {/* Left Double Charts */}
           <div className="xl:col-span-2 flex flex-col gap-8">
              <AdminChart selectedMonth={selectedMonth} title="Total Listings & New Listings" data={activeData.listings} lines={2} height={200} />
              <AdminChart selectedMonth={selectedMonth} title="Total Orders & New Orders" data={activeData.orders} lines={2} height={200} />
           </div>

           {/* Right Most Selling Categories */}
           <div className="col-span-1 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[16px] font-bold text-brand-dark">Top Categories</h3>
                 <button className="text-[12px] font-bold text-brand-pink uppercase tracking-widest hover:underline">View All</button>
              </div>
              
              <div className="flex flex-col gap-6 flex-1 justify-center">
                 {activeData.categories.map((item, index) => (
                    <div key={index} className="flex items-center gap-5 group cursor-pointer p-3 -m-3 rounded-2xl hover:bg-brand-light transition-colors">
                       <div className="relative w-[80px] h-[80px] rounded-[20px] shrink-0 border border-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                          <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                       </div>
                       <div className="flex flex-col flex-1 gap-1">
                          <span className="text-[16px] font-bold text-brand-dark group-hover:text-brand-pink transition-colors">{item.name}</span>
                          <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{item.details}</span>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-brand-pink group-hover:text-white group-hover:border-brand-pink transition-all shadow-sm">
                          <ChevronRightIcon />
                       </div>
                    </div>
                 ))}
                 
                 <button className="w-full mt-4 py-3.5 rounded-full border border-gray-200 text-[14px] font-bold text-brand-dark hover:border-brand-pink hover:text-brand-pink transition-colors">
                    Explore Inventory
                 </button>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}
