"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CalendarDays, ChevronDown } from "lucide-react";

function formatK(v) {
  const n = Number(v) || 0;
  if (n >= 100000) return `${Math.round(n / 100000)} Lac`;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return `${n}`;
}

export default function EarningsAreaChart({
  seriesByMonth,
  monthOptions,
  defaultMonthKey,
}) {
  const [mounted, setMounted] = useState(false);
  const [monthKey, setMonthKey] = useState(defaultMonthKey || monthOptions?.[0]?.key || "2025-01");

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeLabel =
    monthOptions?.find((m) => m.key === monthKey)?.label || monthOptions?.[0]?.label || "January 2025";

  const data = useMemo(() => {
    const map = seriesByMonth && typeof seriesByMonth === "object" ? seriesByMonth : {};
    const fallback = Array.isArray(map[monthOptions?.[0]?.key]) ? map[monthOptions?.[0]?.key] : [];
    const series = Array.isArray(map[monthKey]) ? map[monthKey] : fallback;
    return series;
  }, [monthKey, monthOptions, seriesByMonth]);

  return (
    <div className="rounded-2xl bg-white shadow-sm">
      <div className="px-4 pt-4">
        <div className="flex items-end justify-between gap-3">
          <p className="text-[16px] font-semibold text-gray-900">Earnings</p>
          <div className="relative">
            <div className="pointer-events-none flex items-center gap-2 text-[12px] font-medium text-gray-500">
              <span>{activeLabel}</span>
              <CalendarDays className="h-4 w-4 text-gray-500" aria-hidden />
              <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden />
            </div>
            <select
              value={monthKey}
              onChange={(e) => setMonthKey(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Select month and year"
            >
              {(monthOptions || []).map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="h-[210px] px-1 pb-3 pt-2 min-w-0 md:h-[260px]">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 14, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsPink" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F7246E" stopOpacity={0.35} />
                <stop offset="70%" stopColor="#F7246E" stopOpacity={0.07} />
                <stop offset="100%" stopColor="#F7246E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }}
              tickFormatter={formatK}
              width={32}
            />
            <Tooltip
              cursor={{ stroke: "#FBCFE8", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #F3F4F6",
                boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
              }}
              labelStyle={{ fontWeight: 700, color: "#111827" }}
              formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Earnings"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#F7246E"
              strokeWidth={3}
              fill="url(#earningsPink)"
              dot={{ r: 4, strokeWidth: 2, stroke: "#F7246E", fill: "#fff" }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "#F7246E", fill: "#fff" }}
            />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full rounded-2xl bg-gradient-to-b from-[#F7246E]/10 to-transparent" />
        )}
      </div>
    </div>
  );
}

