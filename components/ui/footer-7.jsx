import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const paymentItems = [
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
          <div className="flex flex-col md:flex-row md:justify-between gap-10 md:gap-8">

            {/* Link Columns Wrapper */}
            <div className="flex flex-wrap gap-8 md:gap-12 flex-1">
              {linkColumns.map((col) => (
                <div key={col.title} className="min-w-[120px]">
                  <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#2F2F2F] mb-3">
                    {col.title}
                  </h4>
                  <ul className="flex flex-col gap-2">
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

            {/* Contact Us */}
            <div className="flex flex-col shrink-0">
              <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#2F2F2F] mb-3">
                Contact Us
              </h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <FaMapMarkerAlt className="text-[#F7246E] text-[14px] shrink-0" aria-hidden="true" />
                  <span className="text-[14px] text-[#2F2F2F]/70">Gurugram 122009</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FaPhoneAlt className="text-[#F7246E] text-[13px] shrink-0" aria-hidden="true" />
                  <a
                    href="tel:+8882888832"
                    className="text-[14px] text-[#2F2F2F]/70 hover:text-[#F7246E] transition-colors"
                  >
                    +8882 8888 32
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <FaEnvelope className="text-[#F7246E] text-[13px] shrink-0" aria-hidden="true" />
                  <a
                    href="mailto:Restylefashion2026@gmail.com"
                    className="text-[14px] text-[#2F2F2F]/70 hover:text-[#F7246E] transition-colors break-all md:break-normal"
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
            <div className="flex gap-6 flex-wrap justify-center">
              <Link
                href="#"
                aria-label="Facebook"
                className="inline-flex items-center justify-center text-[#2F2F2F]/70 transition-colors hover:text-[#F7246E] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink-hover focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-full p-2"
              >
                <FaFacebook className="text-[22px]" aria-hidden="true" />
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="inline-flex items-center justify-center text-[#2F2F2F]/70 transition-colors hover:text-[#F7246E] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink-hover focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-full p-2"
              >
                <FaInstagram className="text-[22px]" aria-hidden="true" />
              </Link>
              <Link
                href="#"
                aria-label="YouTube"
                className="inline-flex items-center justify-center text-[#2F2F2F]/70 transition-colors hover:text-[#F7246E] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink-hover focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-full p-2"
              >
                <FaYoutube className="text-[22px]" aria-hidden="true" />
              </Link>
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
