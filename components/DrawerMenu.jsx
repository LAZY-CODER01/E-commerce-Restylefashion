"use client";

import Link from "next/link";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

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

export default function DrawerMenu({ open, onClose, drawerRef }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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
          
          {/* Categories Section */}
          <div className="px-6 py-6 border-b border-gray-100">
            <h3 className="text-[14px] font-bold text-gray-400 tracking-wider mb-6">
              CATEGORIES
            </h3>
            <div className="flex flex-col gap-6">
              {CATEGORY_ITEMS.map((item) => (
                <Link
                  key={item}
                  href="#"
                  onClick={onClose}
                  className="group flex items-center justify-between text-[17px] font-semibold text-brand-dark hover:text-brand-pink transition-colors"
                >
                  {item}
                  <KeyboardArrowRightOutlinedIcon className="text-gray-300 transition-colors group-hover:text-brand-pink" />
                </Link>
              ))}
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
                  className={`flex items-center gap-4 text-[17px] font-medium transition-colors hover:text-brand-pink ${
                    item.highlight ? "text-brand-pink" : "text-brand-dark"
                  }`}
                >
                  <span className={item.highlight ? "text-brand-pink" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
        </nav>
      </aside>
    </>
  );
}