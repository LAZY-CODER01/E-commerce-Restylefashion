"use client";

import React from "react";
import Button from "@/components/Button";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-brand-light p-4 md:p-9 max-w-[1400px] mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Overview of platform metrics and users.</p>
        </div>
        <Button variant="outlined" className="py-2.5 px-6 shadow-sm">Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Stat Widgets */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Users</span>
          <span className="text-3xl font-bold text-brand-dark">14,204</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Sellers</span>
          <span className="text-3xl font-bold text-brand-dark">842</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Active Listings</span>
          <span className="text-3xl font-bold text-brand-dark">5,892</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Reports</span>
          <span className="text-3xl font-bold text-brand-pink">24</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-brand-dark">Recent Platform Activity</h2>
        </div>
        
        {/* Mock Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="font-semibold text-gray-500 text-sm p-4 tracking-wider uppercase">User</th>
                <th className="font-semibold text-gray-500 text-sm p-4 tracking-wider uppercase">Role</th>
                <th className="font-semibold text-gray-500 text-sm p-4 tracking-wider uppercase">Action</th>
                <th className="font-semibold text-gray-500 text-sm p-4 tracking-wider uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "John Doe", role: "Seller", action: "Added new listing", status: "Active" },
                { name: "Sarah Style", role: "Influencer", action: "Updated Profile", status: "Active" },
                { name: "Mike Tyson", role: "User", action: "Reported an item", status: "Pending Review" }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                  <td className="p-4 text-[15px] font-medium text-brand-dark">{row.name}</td>
                  <td className="p-4 text-[14px] text-gray-500">{row.role}</td>
                  <td className="p-4 text-[14px] text-gray-500">{row.action}</td>
                  <td className="p-4 text-[14px]">
                    <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold ${
                      row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
