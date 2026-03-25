import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Sparkles } from "lucide-react";

const defaultSections = [
  {
    title: "Product",
    links: [
      { name: "Overview", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Marketplace", href: "#" },
      { name: "Features", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Team", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help", href: "#" },
      { name: "Sales", href: "#" },
      { name: "Advertise", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <FaTwitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin className="size-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    src: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=100&q=80",
    alt: "Restyle Logo",
    title: "Restyle",
  },
  sections = defaultSections,
  description = "A community-driven marketplace for thrift fashion, bringing vintage style and sustainable choices to every wardrobe.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2026 Restyle. All rights reserved.",
  legalLinks = defaultLegalLinks,
}) => {
  return (
    <footer className="py-32 bg-brand-light border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center lg:justify-start">
              <a 
                href={logo.url} 
                className="font-extrabold text-[28px] tracking-tight bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent hover:opacity-90 transition-opacity"
              >
                {logo.title}
              </a>
            </div>
            <p className="max-w-[80%] text-[14px] font-medium text-gray-500 leading-relaxed">
              {description}
            </p>
            <ul className="flex items-center space-x-6 text-gray-400">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="font-medium hover:text-brand-pink transition-colors">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 text-[14px] font-bold text-brand-dark uppercase tracking-widest">{section.title}</h3>
                <ul className="space-y-3 text-[14px] text-gray-500">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-brand-pink transition-colors"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-gray-100 pt-8 text-[12px] font-bold text-gray-400 md:flex-row md:items-center md:text-left uppercase tracking-widest">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row md:gap-8">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-brand-pink transition-colors cursor-pointer">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
