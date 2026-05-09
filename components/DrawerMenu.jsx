"use client";

import Link from "next/link";
import Image from "next/image";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";
import { useSearch } from "@/context/SearchContext";
import { useCart } from "@/context/CartContext";
import { DRAWER_CATEGORY_ITEMS } from "@/data/categories";

const SECONDARY_ITEMS = [
  {
    name: "My Store",
    icon: <PersonOutlineOutlinedIcon />,
    link: "/profile"
  },
  {
    name: "About Us",
    icon: <InfoOutlinedIcon />,
    link: "#"
  },
  {
    name: "Wishlist",
    icon: <FavoriteBorderOutlinedIcon />,
    link: "/wishlist"
  },
  {
    name: "My Orders",
    icon: <LocalMallOutlinedIcon />,
    link: "/my-orders"
  },
  {
    name: "Contact Us",
    icon: <MailOutlineOutlinedIcon />,
    link: "#"
  },
  {
    name: "FAQs",
    highlight: true,
    icon: <HelpOutlineOutlinedIcon />,
    link: "#"
  },
];

const ADMIN_ITEMS = [
  { title: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon sx={{ fontSize: 22 }} /> },
  { title: "Listings", path: "/admin/listings", icon: <Inventory2Icon sx={{ fontSize: 22 }} /> },
  { title: "Orders", path: "/admin/orders", icon: <LocalShippingIcon sx={{ fontSize: 22 }} /> },
  { title: "Sellers", path: "/admin/sellers", icon: <PeopleIcon sx={{ fontSize: 22 }} /> },
];

const SALE_RED = "#EB0010";

export default function DrawerMenu({ open, onClose, drawerRef }) {
  const { user, logout } = useAuth();
  const { wishlistCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const { activeCategory, setActiveCategory } = useSearch();
  const isAdminRoute = pathname.startsWith("/admin");

  const handleCategoryClick = (id) => {
    if (id === "influencers") {
      onClose();
      // Scroll to influencers section
      if (pathname === "/") {
        const element = document.getElementById("influencers");
        element?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/#influencers");
      }
      return;
    }

    setActiveCategory(id);
    onClose();
    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[220] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed left-0 top-0 z-[230] h-[100dvh] w-[85vw] max-w-[360px] bg-white 
          flex flex-col overflow-hidden shadow-drawer rounded-br-3xl
          transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 pt-8 border-b border-gray-100">
          <Link href="/" onClick={onClose} className="inline-block font-extrabold text-[28px] tracking-tight bg-gradient-to-b from-black to-[#F7246E] bg-clip-text text-transparent">
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
          {!isAdminRoute && (
            <div className="px-6 pt-6 pb-6 border-b border-gray-100">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="w-[60px] h-[60px] rounded-full border border-brand-pink p-[2px] shrink-0">
                    <div className="relative w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-[22px] font-medium text-gray-500 overflow-hidden">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.fullName || "User avatar"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        user.fullName?.charAt(0)?.toUpperCase() || "U"
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-[17px] text-gray-800 font-medium leading-snug">
                      Hey, {user.fullName?.split(' ')[0] || "User"} <span className="inline-block ml-0.5">💕</span>
                    </h2>
                    <p className="text-[14px] text-gray-500 mt-0.5 leading-snug">Buy pre-loved. Style better.</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/auth"
                    onClick={onClose}
                    className="flex-1 py-2.5 text-center bg-brand-pink text-white rounded-xl font-medium text-[16px] transition-opacity hover:opacity-90"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth"
                    onClick={onClose}
                    className="flex-1 py-2.5 text-center border border-brand-pink text-brand-pink bg-white rounded-xl font-medium text-[16px] transition-colors hover:bg-gray-50"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Sell with us banner */}
              <div className="mt-6 w-full min-h-[132px] rounded-[16px] bg-[#FFF5F8] overflow-hidden flex relative border border-pink-100">
                <div className="p-4 py-5 z-10 flex flex-col justify-center w-[60%]">
                  <h3 className="text-[17px] font-bold text-gray-900 leading-tight">Sell with us</h3>
                  <p className="text-[13px] text-gray-600 mt-1 mb-3">Earn more. Empower style.</p>
                  <Link href="/seller/auth" onClick={onClose} className="bg-brand-pink text-white text-[13px] font-semibold px-4 py-1.5 rounded-lg self-start transition-opacity hover:opacity-90 shadow-sm shadow-brand-pink/20">
                    Start Selling
                  </Link>
                </div>
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[52%] overflow-hidden" aria-hidden>
                  <Image
                    src="/drawer-sell-banner.png"
                    alt=""
                    fill
                    sizes="188px"
                    className="object-cover object-[88%_center]"
                    priority={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Categories/Admin Section */}
          <div className="px-6 py-6 border-b border-gray-100">
            {isAdminRoute ? (
              <>
                <h3 className="text-[14px] font-bold text-gray-400 tracking-wider mb-6">ADMIN PANEL</h3>
                <div className="flex flex-col gap-6">
                  {ADMIN_ITEMS.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.title}
                        href={item.path}
                        onClick={onClose}
                        className={`group flex items-center gap-4 px-6 py-4 rounded-[20px] text-[17px] font-semibold transition-all duration-200 border border-transparent ${isActive
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
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col">
                <h3 className="text-[13px] font-bold text-gray-500 tracking-widest mb-4">
                  SHOP BY CATEGORY
                </h3>
                <div className="flex flex-col gap-5">
                  {DRAWER_CATEGORY_ITEMS.filter(item => item.section === "shop").map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleCategoryClick(item.id)}
                      className="group flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-[52px] h-[64px] bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.label || "Category image"}
                              fill
                              className="object-cover"
                              sizes="52px"
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[16px] font-semibold text-gray-800 group-hover:text-brand-pink transition-colors flex items-center">
                            {item.label}
                            {item.labelAccent === "new" && (
                              <span className="ml-2 text-[11px] font-bold tracking-wider" style={{ color: SALE_RED }}>NEW</span>
                            )}
                          </span>
                          <span className="text-[13px] text-gray-500 mt-0.5">{item.subtitle}</span>
                        </div>
                      </div>
                      <KeyboardArrowRightOutlinedIcon className="text-gray-300 group-hover:text-brand-pink transition-colors" />
                    </button>
                  ))}
                </div>

                <h3 className="text-[13px] font-bold text-gray-500 tracking-widest mt-8 mb-4">
                  DISCOVER MORE
                </h3>
                <div className="flex flex-col gap-5">
                  {DRAWER_CATEGORY_ITEMS.filter(item => item.section === "discover").map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleCategoryClick(item.id)}
                      className="group flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-[52px] h-[64px] rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-gray-100">
                          {item.image === "flame-icon" ? (
                            <div className="w-full h-full bg-[#FFE5ED] flex items-center justify-center">
                              <LocalFireDepartmentIcon style={{ color: SALE_RED, fontSize: 32 }} />
                            </div>
                          ) : (
                            item.image && (
                              <Image
                                src={item.image}
                                alt={item.label || "Discover image"}
                                fill
                                className="object-cover"
                                sizes="52px"
                              />
                            )
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[16px] font-semibold transition-colors flex items-center" style={item.labelAccent === "hot" ? { color: SALE_RED } : { color: "#1F2937" }}>
                            {item.label}
                            {item.labelAccent === "hot" && (
                              <span className="ml-2 text-[11px] font-bold tracking-wider" style={{ color: SALE_RED }}>HOT</span>
                            )}
                          </span>
                          <span className="text-[13px] text-gray-500 mt-0.5">{item.subtitle}</span>
                        </div>
                      </div>
                      <KeyboardArrowRightOutlinedIcon className="text-gray-300 group-hover:text-brand-pink transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Secondary Links Section */}
          <div className="px-6 py-8">
            <div className="flex flex-col gap-7">
              {SECONDARY_ITEMS.map((item) => {
                const href =
                  item.link === "/profile" && !user ? "/auth?next=/profile" : item.link;
                const active = pathname === item.link && item.link !== "#";
                const isFaq = item.name === "FAQs";
                return (
                  <Link
                    key={item.name}
                    href={href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-4 text-[17px] font-medium transition-colors ${active || item.highlight ? "text-brand-pink" : "text-brand-dark"
                      }`}
                    style={isFaq ? { color: SALE_RED } : undefined}
                  >
                    <span
                      className={active || item.highlight ? "text-brand-pink" : "text-gray-400"}
                      style={isFaq ? { color: SALE_RED } : undefined}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.name}</span>
                    {item.name === "Wishlist" ? (
                      <span className="text-[13px] font-bold" style={{ color: SALE_RED }}>
                        {wishlistCount}
                      </span>
                    ) : null}
                    {item.name === "My Orders" ? null : null}
                  </Link>
                );
              })}

              {/* Authentication Actions */}
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="mt-4 flex items-center gap-4 text-left text-[17px] font-medium transition-colors"
                  style={{ color: SALE_RED }}
                >
                  <span style={{ color: SALE_RED }}>
                    <PersonOutlineOutlinedIcon />
                  </span>
                  Logout ({user.fullName?.split(" ")[0]})
                </button>
              ) : null}

              {/* Start Selling Link for Mobile */}
              {/* <Link
                href="/seller/login"
                onClick={onClose}
                className="flex items-center gap-4 text-[17px] font-medium text-brand-purple hover:text-brand-pink transition-colors mt-2"
              >
                <span className="text-brand-purple">
                  <StorefrontOutlinedIcon />
                </span>
                Start Selling
              </Link> */}
            </div>
          </div>

        </nav>
      </aside>
    </>
  );
}