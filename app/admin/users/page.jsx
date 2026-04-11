"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const NAV_ITEMS = [
  { title: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon sx={{ fontSize: 22 }} /> },
  { title: "Listings",  path: "/admin/listings",  icon: <Inventory2Icon sx={{ fontSize: 22 }} /> },
  { title: "Orders",    path: "/admin/orders",     icon: <LocalShippingIcon sx={{ fontSize: 22 }} /> },
  { title: "Users",     path: "/admin/users",      icon: <PeopleIcon sx={{ fontSize: 22 }} /> },
];

const ROLE_TABS = [
  { label: "All",        value: "all" },
  { label: "Users",      value: "User" },
  { label: "Sellers",    value: "Seller" },
  { label: "Influencers",value: "Influencer" },
  { label: "Admins",     value: "Admin" },
];

const ROLE_CONFIG = {
  User:       { bg: "bg-sky-50",    text: "text-sky-600",    icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 14 }} /> },
  Seller:     { bg: "bg-purple-50", text: "text-purple-600", icon: <StorefrontOutlinedIcon sx={{ fontSize: 14 }} /> },
  Influencer: { bg: "bg-pink-50",   text: "text-pink-600",   icon: <StarOutlineOutlinedIcon sx={{ fontSize: 14 }} /> },
  Admin:      { bg: "bg-amber-50",  text: "text-amber-600",  icon: <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 14 }} /> },
};

function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.User;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.text}`}>
      {cfg.icon} {role}
    </span>
  );
}

function UserRow({ user, onRoleChange }) {
  const [changing, setChanging] = useState(false);

  const handleRole = async (newRole) => {
    if (newRole === user.role) return;
    setChanging(true);
    try {
      await api.patch(`/auth/users/${user._id}/role`, { role: newRole });
      onRoleChange(user._id, newRole);
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role.");
    } finally { setChanging(false); }
  };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors group">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F7246E]/20 to-[#913CF0]/20 flex items-center justify-center flex-shrink-0 text-[#F7246E] font-bold text-[14px]">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#2F2F2F] leading-tight">{user.fullName}</p>
            <p className="text-[12px] text-gray-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-[13px] text-gray-500">{user.mobile || "—"}</td>
      <td className="py-4 px-4"><RoleBadge role={user.role} /></td>
      <td className="py-4 px-4 text-[12px] text-gray-400">
        {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
      </td>
      <td className="py-4 px-6">
        <select
          value={user.role}
          disabled={changing}
          onChange={(e) => handleRole(e.target.value)}
          className="text-[12px] font-semibold text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 bg-white outline-none focus:border-[#F7246E] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {["User", "Seller", "Influencer", "Admin"].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}

// ── Access Denied banner with one-click promote ────────
function AccessDenied({ onPromote, promoting }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 gap-6 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
        <LockOutlinedIcon sx={{ fontSize: 40, color: "#ef4444" }} />
      </div>
      <div>
        <h2 className="text-[22px] font-extrabold text-[#2F2F2F] mb-2">Admin Access Required</h2>
        <p className="text-[14px] text-gray-500 max-w-sm">
          Your account doesn't have Admin privileges yet. Click below to promote yourself to Admin so you can manage users.
        </p>
      </div>
      <button
        onClick={onPromote}
        disabled={promoting}
        className="flex items-center gap-2 bg-[#F7246E] text-white text-[14px] font-bold px-8 py-3 rounded-full hover:bg-[#F8085A] transition-all shadow-lg shadow-[#F7246E]/30 active:scale-95 disabled:opacity-60"
      >
        {promoting ? (
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 20 }} />
        )}
        {promoting ? "Promoting…" : "Make Me Admin"}
      </button>
    </div>
  );
}

export default function AdminUsersPage() {
  const pathname = usePathname();
  const { setUser }             = useAuth();
  const [users, setUsers]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [activeRole, setActiveRole] = useState("all");
  const [search, setSearch]     = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setForbidden(false);
    try {
      const params = { role: activeRole, limit: 50 };
      if (search) params.search = search;
      const { data } = await api.get("/auth/users", { params });
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      if (err.response?.status === 403) {
        setForbidden(true);
      } else {
        toast.error("Failed to load users.");
      }
    } finally { setLoading(false); }
  }, [activeRole, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: newRole } : u));
  };

  // One-click promote to admin
  const handleMakeAdmin = async () => {
    setPromoting(true);
    try {
      const { data } = await api.post("/auth/make-admin");
      // Update token in localStorage and auth context
      if (data.token) {
        localStorage.setItem("restyle_token", data.token);
      }
      if (setUser) setUser(data);
      toast.success("You are now an Admin! Reloading…");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Promotion failed.");
      setPromoting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-brand-light flex font-roboto w-full overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex w-[240px] bg-brand-light flex-col border-r border-gray-200/50 h-[calc(100vh-80px)] shrink-0 py-8 pr-4 overflow-y-auto">
        <nav className="flex flex-col font-bold text-[14px] gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.title} href={item.path}
                className={`group flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all duration-200 border border-transparent ${
                  isActive
                    ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/20 font-extrabold"
                    : "text-gray-500 bg-transparent hover:bg-white hover:text-brand-pink hover:shadow-md hover:border-gray-100"
                }`}>
                <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-brand-pink"} transition-colors`}>
                  {item.icon}
                </span>
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col px-4 md:px-9 py-6 md:py-8 overflow-y-auto h-[calc(100vh-80px)] w-full">
        {forbidden ? (
          <AccessDenied onPromote={handleMakeAdmin} promoting={promoting} />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-[24px] md:text-[28px] font-extrabold text-brand-dark">Users</h2>
                <p className="text-[13px] text-gray-400 font-medium mt-1">{total} registered users</p>
              </div>
              <button onClick={fetchUsers}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 transition px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-brand-dark text-[13px] font-bold group w-fit">
                <RefreshIcon sx={{ fontSize: 18 }} className="text-gray-400 group-hover:text-brand-pink transition-colors" />
                Refresh
              </button>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 shadow-sm flex-1">
                <SearchOutlinedIcon sx={{ fontSize: 20 }} className="text-gray-400 flex-shrink-0" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name, email or mobile…"
                  className="flex-1 text-[14px] font-medium outline-none bg-transparent text-[#2F2F2F] placeholder:text-gray-300"
                />
                {searchInput && (
                  <button type="button" onClick={() => { setSearchInput(""); setSearch(""); }} className="text-gray-300 hover:text-gray-500 text-[18px] leading-none">×</button>
                )}
              </form>
            </div>

            {/* Role tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              {ROLE_TABS.map((tab) => (
                <button key={tab.value} onClick={() => setActiveRole(tab.value)}
                  className={`px-5 py-2 rounded-full text-[13px] font-bold border transition-all ${
                    activeRole === tab.value
                      ? "bg-[#F7246E] text-white border-[#F7246E] shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#F7246E] hover:text-[#F7246E]"
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex flex-col">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4 items-center px-6 py-4 border-b border-gray-50 animate-pulse">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-1.5" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                      <div className="h-6 w-16 bg-gray-100 rounded-full" />
                      <div className="h-8 w-24 bg-gray-100 rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
                  <PeopleIcon sx={{ fontSize: 48, color: "#e5e7eb" }} />
                  <p className="text-[14px] font-semibold text-gray-400">No users found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest py-3.5 px-6">User</th>
                        <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest py-3.5 px-4">Mobile</th>
                        <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest py-3.5 px-4">Role</th>
                        <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest py-3.5 px-4">Joined</th>
                        <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest py-3.5 px-6">Change Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <UserRow key={user._id} user={user} onRoleChange={handleRoleChange} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
