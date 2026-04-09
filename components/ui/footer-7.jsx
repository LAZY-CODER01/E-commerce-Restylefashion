import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const paymentItems = [
  {
    name: "security",
    icon: "/logooo.png",
    href: "#",
  },
  {
    name: "Google Pay",
    icon: "/gpayy.png",
    href: "#",
  },
  {
    name: "VISA",
    icon: "/vissa.png",
    href: "#",
  },
  {
    name: "UPI",
    icon: "/upi.png",
    href: "#",
  },
  {
    name: "Paytm",
    icon: "/paytm.png",
    href: "#",
  },
  {
    name: "Delhivery",
    icon: "/delivery.png",
    href: "#",
  },
];

const socialLinks = [
  { label: "Facebook", src: "/social/facebook.png", href: "#" },
  { label: "Instagram", src: "/social/instagram.png", href: "#" },
  { label: "X", src: "/social/x.png", href: "#" },
  { label: "YouTube", src: "/social/youtube.png", href: "#" },
  // { label: "Secure shopping", src: "/social/trust.png", href: "#" },
];

const linkColumns = [
  {
    title: "Collection",
    links: [
      "New Arrivals",
      "Hot Picks",
      "Return & Refund Policy",
    ],
  },
  {
    title: "Vendors",
    links: ["How to sell", "Terms & Conditions", "Shipping"],
  },
  { title: "Company", links: ["About Us"] },
  { title: "Support", links: ["Privacy Policies", "FAQs"] },
];

export const Footer7 = () => {
  return (
    <footer className="w-full flex flex-col font-['Roboto'] border-t border-gray-200">
      {/* SECTION 1: Links & Contact (Off-White) */}
      <div className="bg-[#FAFAFA] px-4 md:px-9 py-10 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between gap-10 md:gap-8 md:items-start">

            {/* Links: mobile = 4 cols + light vertical rules; md+ = section titles + list */}
            <div className="flex flex-col flex-1 text-left w-full min-w-0">
              <div
                className="grid grid-cols-4 md:hidden w-full gap-0 items-start"
                aria-label="Footer links"
              >
                {linkColumns.map((col, colIndex) => (
                  <div
                    key={col.title}
                    className={`flex flex-col gap-2 min-w-0 py-0.5 pr-1 ${colIndex > 0 ? "border-l border-gray-300/80 pl-2" : "pl-0"}`}
                  >
                    {col.links.map((name) => (
                      <Link
                        key={name}
                        href="#"
                        className="text-[13px] font-normal text-[#2F2F2F]/70 leading-snug hover:text-[#F7246E] transition-colors"
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>

              <div className="hidden md:flex flex-row flex-wrap gap-12 flex-1">
                {linkColumns.map((col) => (
                  <div key={col.title} className="min-w-[120px] flex flex-col items-start">
                    <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#2F2F2F] mb-3">
                      {col.title}
                    </h4>
                    <ul className="flex flex-col gap-2 items-start">
                      {col.links.map((name) => (
                        <li key={name}>
                          <Link
                            href="#"
                            className="text-[14px] leading-6 text-[#2F2F2F]/70 hover:text-[#F7246E] transition-colors duration-300"
                          >
                            {name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Us — after link blocks on mobile, full-width centered */}
            <div className="flex flex-col shrink-0 w-full md:w-auto max-md:pt-8 max-md:border-t max-md:border-gray-200/90 max-md:items-center max-md:text-center md:items-start md:text-left md:border-t-0 md:pt-0">
              <h4 className="text-sm md:text-[11px] font-bold tracking-[0.08em] md:tracking-[0.1em] uppercase text-[#2F2F2F] mb-3">
                Contact Us
              </h4>
              <div className="flex flex-col gap-3 w-full max-w-md mx-auto md:mx-0 md:max-w-none">
                <div className="flex items-start gap-2.5 justify-center md:justify-start">
                  <FaMapMarkerAlt className="text-[#F7246E] text-[14px] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-[14px] text-[#2F2F2F]/70 text-center md:text-left">
                    A-1064, 2nd Floor, DLF Phase 1, Gurugram 122009
                  </span>
                </div>
                <div className="flex items-center gap-2.5 justify-center md:justify-start">
                  <FaPhoneAlt className="text-[#F7246E] text-[13px] shrink-0" aria-hidden="true" />
                  <a
                    href="tel:+918882888832"
                    className="text-[14px] text-[#2F2F2F]/70 hover:text-[#F7246E] transition-colors"
                  >
                    +91 8882888832
                  </a>
                </div>
                <div className="flex items-center gap-2.5 justify-center md:justify-start">
                  <FaEnvelope className="text-[#F7246E] text-[13px] shrink-0" aria-hidden="true" />
                  <a
                    href="mailto:Restylefashion2026@gmail.com"
                    className="text-[14px] text-[#2F2F2F]/70 hover:text-[#F7246E] transition-colors break-all md:break-normal text-center md:text-left"
                  >
                    Restylefashion2026@gmail.com
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SECTION 2: Identity & Social */}
      <div className="bg-white px-4 md:px-9 py-10 md:py-16 border-t border-black/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink-hover focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label="Restyle Home"
            >
              <span
                className="inline-block font-extrabold bg-gradient-to-b from-black to-[#F7246E] bg-clip-text text-transparent tracking-tight leading-none text-[28px]"
              >
                Restyle
              </span>
            </Link>
            <p className="text-[#2F2F2F]/60 font-light text-sm">
              Curating the Future of Thrift
            </p>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-[11px] font-bold tracking-[0.2em] text-[#2F2F2F]/50 uppercase">
              Follow Us On:
            </div>
            <div className="flex gap-3 sm:gap-4 flex-wrap justify-center items-center">
              {socialLinks.map((item) => {
                const external = item.href.startsWith("http");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gray-200/80 transition-transform hover:scale-105 hover:ring-brand-pink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink-hover focus-visible:ring-offset-2 sm:size-9"
                  >
                    <Image
                      src={item.src}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 object-contain sm:size-9"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Copyright & Payments */}
      <div className="bg-white px-4 md:px-14 py-8 border-t border-black/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#2F2F2F] text-sm font-light">
            © Restyle 2025 | All rights reserved
          </p>

          {/* Payment Icons */}
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
            {paymentItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="flex items-center justify-center w-[52px] h-[34px] bg-white rounded-md border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden"
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={40}
                  height={26}
                  className="object-contain p-[3px]"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
