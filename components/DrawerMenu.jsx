"use client";

import Link from "next/link";
import Image from "next/image";

import { Roboto } from "next/font/google";

import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";

import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import { usePathname, useRouter } from "next/navigation";

import { DRAWER_CATEGORY_ITEMS } from "@/data/categories";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const SALE_RED = "#EB0010";

const SUPPORT_ITEMS = [
  {
    name: "About Us",
    icon: <InfoOutlinedIcon sx={{ fontSize: 16 }} />,
    link: "/about",
  },
  {
    name: "FAQ",
    icon: <HelpOutlineOutlinedIcon sx={{ fontSize: 16 }} />,
    link: "/faq",
  },
  {
    name: "Contact Us",
    icon: <MailOutlineOutlinedIcon sx={{ fontSize: 16 }} />,
    link: "/contact",
  },
];

const ADMIN_ITEMS = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon sx={{ fontSize: 18 }} />,
  },
  {
    title: "Listings",
    path: "/admin/listings",
    icon: <Inventory2Icon sx={{ fontSize: 18 }} />,
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: <LocalShippingIcon sx={{ fontSize: 18 }} />,
  },
  {
    title: "Sellers",
    path: "/admin/sellers",
    icon: <PeopleIcon sx={{ fontSize: 18 }} />,
  },
];

export default function DrawerMenu({ open, onClose, drawerRef }) {
  const { user, logout } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const { setActiveCategory } = useSearch();

  const isAdminRoute = pathname.startsWith("/admin");

  const handleCategoryClick = (id) => {
    if (id === "influencers") {
      onClose();

      if (pathname === "/") {
        const element = document.getElementById("influencers");

        element?.scrollIntoView({
          behavior: "smooth",
        });
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
        className={`fixed inset-0 z-[220] bg-black/30 transition-opacity duration-300 ${open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`${roboto.className} fixed left-0 top-0 z-[230] h-screen w-screen bg-white flex flex-col overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 flex-shrink-0">
          <Link
            href="/"
            onClick={onClose}
            className="inline-block"
          >
            <Image
              src="/restyle-wordmark.png"
              alt="Restyle"
              width={80}
              height={20}
              className="object-contain"
            />
          </Link>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-gray-400"
          >
            <CloseOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 min-h-0 overflow-y-scroll pb-0 scrolling-touch">
          {/* USER */}
          {/* USER */}
          {!isAdminRoute && (
            <div className="px-3 py-2 border-b border-gray-100">

              {/* Logged In */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-[40px] h-[40px] rounded-full border border-pink-400 p-[1.5px] shrink-0">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-[14px] text-gray-500">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt="avatar"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        user.fullName?.charAt(0)?.toUpperCase() || "U"
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-[13px] font-normal text-gray-900 leading-none">
                      Hey, {user.fullName?.split(" ")[0]}💕
                    </h2>

                    <p className="text-[10px] text-gray-500 mt-1 leading-none">
                      Buy pre-loved. Style better.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/auth"
                    onClick={onClose}
                    className="flex-1 py-1.5 rounded-md bg-[#FF0066] text-white text-center text-[12px] font-medium"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth"
                    onClick={onClose}
                    className="flex-1 py-1.5 rounded-md border border-[#FF0066] text-[#FF0066] text-center text-[12px] font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* SELL BANNER ALWAYS VISIBLE */}
              <div className="mt-2 rounded-xl overflow-hidden relative h-[135px]">
                <Image
                  src="/image.png"
                  alt="Sell Banner"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          {/* MAIN */}
          <div className="px-3 py-2">
            {/* ADMIN */}
            {isAdminRoute ? (
              <>
                <h3 className="text-[9px] tracking-[0.2em] text-gray-400 mb-1 uppercase">
                  Admin Panel
                </h3>

                <div className="flex flex-col gap-2">
                  {ADMIN_ITEMS.map((item) => {
                    const active = pathname === item.path;

                    return (
                      <Link
                        key={item.title}
                        href={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-2 px-2 py-2 rounded-md text-[12px] ${active
                          ? "bg-[#F7246E] text-white"
                          : "text-gray-700"
                          }`}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {/* SHOP */}
                <h3 className="text-[9px] tracking-[0.2em] text-gray-800 font-bold mb-1 uppercase">
                  Shop By Category
                </h3>

                <div className="flex flex-col gap-[8px]">
                  {DRAWER_CATEGORY_ITEMS.filter(
                    (item) => item.section === "shop"
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleCategoryClick(item.id)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative w-[70px] h-[42px] rounded-md overflow-hidden bg-gray-100 shrink-0">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.label}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>

                        <div className="text-left">
                          <div className="flex items-center">
                            <span className="text-[12px] font-normal text-gray-900 leading-none">
                              {item.label}
                            </span>

                            {item.labelAccent === "new" && (
                              <span className="ml-1 text-[8px] text-red-500">
                                NEW
                              </span>
                            )}
                          </div>

                          <p className="text-[9px] text-gray-500 mt-1 leading-none">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <KeyboardArrowRightOutlinedIcon
                        sx={{
                          fontSize: 16,
                          color: "#C4C4C4",
                        }}
                      />
                    </button>
                  ))}
                </div>

                {/* DISCOVER */}
                <h3 className="text-[9px] tracking-[0.2em] text-gray-800 font-bold mt-3 mb-1 uppercase">
                  Discover More
                </h3>

                <div className="flex flex-col gap-[8px]">
                  {DRAWER_CATEGORY_ITEMS.filter(
                    (item) => item.section === "discover"
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleCategoryClick(item.id)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative w-[70px] h-[42px] rounded-md overflow-hidden bg-gray-100 shrink-0">
                          {item.image === "flame-icon" ? (
                            <div className="w-full h-full flex items-center justify-center bg-[#FFE5ED]">
                              <LocalFireDepartmentIcon
                                style={{
                                  color: SALE_RED,
                                  fontSize: 18,
                                }}
                              />
                            </div>
                          ) : (
                            item.image && (
                              <Image
                                src={item.image}
                                alt={item.label}
                                fill
                                className="object-cover"
                              />
                            )
                          )}
                        </div>

                        <div className="text-left">
                          <div className="flex items-center">
                            <span className="text-[12px] font-normal text-gray-900 leading-none">
                              {item.label}
                            </span>

                            {item.labelAccent === "hot" && (
                              <span className="ml-1 text-[8px] text-red-500">
                                HOT
                              </span>
                            )}
                          </div>

                          <p className="text-[9px] text-gray-500 mt-1 leading-none">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <KeyboardArrowRightOutlinedIcon
                        sx={{
                          fontSize: 16,
                          color: "#C4C4C4",
                        }}
                      />
                    </button>
                  ))}
                </div>

                {/* SUPPORT */}
                <h3 className="text-[9px] tracking-[0.2em] text-gray-800 font-bold mt-3 mb-1 uppercase">
                  Support
                </h3>

                <div className="flex flex-col gap-[6px]">
                  {SUPPORT_ITEMS.map((item) => (
                    <Link
                      key={item.name}
                      href={item.link}
                      onClick={onClose}
                      className="flex items-center gap-2 text-[12px] font-normal text-gray-700"
                    >
                      <span className="text-gray-400 scale-75">
                        {item.icon}
                      </span>

                      <span className="flex-1">{item.name}</span>

                      <KeyboardArrowRightOutlinedIcon
                        sx={{
                          fontSize: 16,
                          color: "#C4C4C4",
                        }}
                      />
                    </Link>
                  ))}

                  {/* LOGOUT */}
                  {user && (
                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="flex items-center gap-2 text-[12px] font-normal text-gray-700"
                    >
                      <PersonOutlineOutlinedIcon
                        sx={{
                          fontSize: 16,
                          color: "#9CA3AF",
                        }}
                      />

                      <span className="flex-1 text-left">
                        Logout ({user.fullName?.split(" ")[0]})
                      </span>

                      <KeyboardArrowRightOutlinedIcon
                        sx={{
                          fontSize: 16,
                          color: "#C4C4C4",
                        }}
                      />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}