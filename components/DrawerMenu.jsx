"use client";

import Link from "next/link";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";

const CATEGORY_ITEMS = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Co-ords",
  "Outerwear",
  "Shop by Influencers"
];

const SECONDARY_ITEMS = [
  {
    name: "Account",
    icon: <PersonOutlineOutlinedIcon />,
  },
  {
    name: "Wishlist",
    icon: <FavoriteBorderOutlinedIcon />,
  },
  {
    name: "Orders",
    icon: <LocalMallOutlinedIcon />,
  },
  {
    name: "Contact Us",
    icon: <MailOutlineOutlinedIcon />,
  },
  {
    name: "FAQs",
    highlight: true,
    icon: <HelpOutlineOutlinedIcon />,
  },
];

const ADMIN_ITEMS = [
  { title: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon sx={{ fontSize: 22 }} /> },
  { title: "Orders", path: "/admin/orders", icon: <LocalShippingIcon sx={{ fontSize: 22 }} /> },
  { title: "Inventory", path: "/admin/inventory", icon: <Inventory2Icon sx={{ fontSize: 22 }} /> },
  { title: "Sellers", path: "/admin/sellers", icon: <PeopleIcon sx={{ fontSize: 22 }} /> },
];

export default function DrawerMenu({ open, onClose, drawerRef }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed left-0 top-0 z-50 h-[100dvh] w-[85vw] max-w-[360px] bg-white 
          flex flex-col overflow-hidden shadow-drawer rounded-br-3xl
          transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 pt-8 border-b border-gray-100">
          <Link
            href="/"
            onClick={onClose}
            className="font-extrabold text-[28px] tracking-tight bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent"
          >
            Restyle
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 text-gray-400 hover:text-brand-pink transition-colors"
          >
            <CloseOutlinedIcon />
          </button>
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto pb-8">

          {/* Categories/Admin Section */}
          <div className="px-6 py-6 border-b border-gray-100">
            <h3 className="text-[14px] font-bold text-gray-400 tracking-wider mb-6">
              {isAdminRoute ? "ADMIN PANEL" : "CATEGORIES"}
            </h3>
            <div className="flex flex-col gap-6">
              {isAdminRoute ? (
                ADMIN_ITEMS.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.title}
                      href={item.path}
                      onClick={onClose}
                      className={`group flex items-center gap-4 px-6 py-4 rounded-[20px] text-[17px] font-semibold transition-all duration-200 border border-transparent ${
                        isActive 
                        ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/20" 
                        : "text-brand-dark bg-transparent hover:bg-white hover:text-brand-pink hover:shadow-md hover:border-gray-100"
                      }`}
                    >
                      <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-brand-pink"} transition-colors`}>
                        {item.icon}
                      </span>
                      {item.title}
                    </Link>
                  )
                })
              ) : (
                CATEGORY_ITEMS.map((item) => (
                  <Link
                    key={item}
                    href="#"
                    onClick={onClose}
                    className="group flex items-center justify-between text-[17px] font-semibold text-brand-dark hover:text-brand-pink transition-colors"
                  >
                    {item}
                    <KeyboardArrowRightOutlinedIcon className="text-gray-300 transition-colors group-hover:text-brand-pink" />
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Secondary Links Section */}
          <div className="px-6 py-8">
            <div className="flex flex-col gap-7">
              {SECONDARY_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href="#"
                  onClick={onClose}
                  className={`flex items-center gap-4 text-[17px] font-medium transition-colors hover:text-brand-pink ${item.highlight ? "text-brand-pink" : "text-brand-dark"
                    }`}
                >
                  <span className={item.highlight ? "text-brand-pink" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}

              {/* Authentication Actions */}
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex items-center gap-4 text-[17px] font-medium text-red-500 hover:text-red-600 transition-colors mt-4 text-left"
                >
                  <span className="text-red-400">
                    <PersonOutlineOutlinedIcon />
                  </span>
                  Logout ({user.fullName?.split(" ")[0]})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center gap-4 text-[17px] font-medium text-brand-pink hover:text-brand-pink transition-colors mt-4"
                >
                  <span className="text-brand-pink">
                    <PersonOutlineOutlinedIcon />
                  </span>
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>

        </nav>
      </aside>
    </>
  );
}