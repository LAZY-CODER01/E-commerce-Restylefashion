"use client";

import React from "react";
import Button from "@/components/Button";

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-9 max-w-[1400px] mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Seller Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage your listings and orders.</p>
        </div>
        <Button className="py-2.5 px-6 shadow-sm">Add New Product</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stat Widgets */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Sales</span>
          <span className="text-3xl font-bold text-brand-dark">$1,245.00</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Active Listings</span>
          <span className="text-3xl font-bold text-brand-dark">12</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Orders to Fulfill</span>
          <span className="text-3xl font-bold text-brand-pink">4</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-brand-dark">Recent Orders</h2>
        </div>
        <div className="p-6 text-center text-gray-500 py-12">
          No recent orders to show.
        </div>
      </div>

    </div>
  );
}
