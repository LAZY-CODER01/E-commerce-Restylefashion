"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Calendar } from "lucide-react";

// Mock Data
const MOCK_DATA = {
  "January 2025": [
    { days: "1-3", value: 3200 },
    { days: "4-6", value: 3800 },
    { days: "7-9", value: 3600 },
    { days: "10-12", value: 4500 },
    { days: "13-15", value: 4200 },
    { days: "16-18", value: 5800 },
    { days: "19-21", value: 3800 },
    { days: "22-24", value: 4800 },
    { days: "25-27", value: 5200 },
    { days: "28-31", value: 6600 },
  ],
  "February 2025": [
    { days: "1-3", value: 4200 },
    { days: "4-6", value: 4800 },
    { days: "7-9", value: 3900 },
    { days: "10-12", value: 5500 },
    { days: "13-15", value: 6100 },
    { days: "16-18", value: 5900 },
    { days: "19-21", value: 7200 },
    { days: "22-24", value: 7800 },
    { days: "25-28", value: 8400 },
  ],
};

const MONTHS = Object.keys(MOCK_DATA);

export default function EarningsChart() {
  const [selectedDate, setSelectedDate] = useState("January 2025");
  const [showDropdown, setShowDropdown] = useState(false);

  const formatYAxis = (tickItem) => {
    if (tickItem === 0) return "₹0";
    return `₹${tickItem / 1000}k`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl flex flex-col gap-1">
          <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
            {label} ({selectedDate.split(' ')[0]})
          </span>
          <span className="text-[16px] font-bold text-brand-pink">
            ₹{payload[0].value.toLocaleString()}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-10 flex flex-col gap-8 shadow-sm h-full font-roboto w-full">
      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <h2 className="text-2xl font-semibold text-brand-dark">Earnings</h2>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] hover:bg-gray-200 rounded-lg text-brand-dark transition-colors"
          >
            <span className="text-[15px] font-medium">{selectedDate}</span>
            <Calendar className="w-4 h-4 text-gray-600" />
          </button>

          {/* Custom Date Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden py-2 animate-fadeIn">
              {MONTHS.map((month) => (
                <button
                  key={month}
                  className={`w-full text-left px-4 py-3 text-[14px] font-medium hover:bg-brand-pink/5 hover:text-brand-pink transition-colors ${
                    selectedDate === month ? "text-brand-pink bg-brand-pink/5 font-bold" : "text-brand-dark"
                  }`}
                  onClick={() => {
                    setSelectedDate(month);
                    setShowDropdown(false);
                  }}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[300px] mt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={MOCK_DATA[selectedDate]}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#E5E7EB" />
            
            <XAxis
              dataKey="days"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 500 }}
              tickFormatter={formatYAxis}
              domain={[0, 10000]}
              ticks={[0, 2000, 4000, 6000, 8000, 10000]}
              dx={-10}
            />
            
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#F7246E", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.2 }}
            />
            
            <Line
              type="monotone"
              dataKey="value"
              stroke="#9CA3AF"
              strokeWidth={2}
              dot={{ r: 4, fill: "#9CA3AF", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#F7246E", strokeWidth: 2, stroke: "#fff" }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
