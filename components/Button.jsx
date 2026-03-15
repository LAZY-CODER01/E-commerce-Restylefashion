import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  type = "button",
  ...props
}) {
  const baseStyles =
    "flex items-center justify-center rounded-full px-6 py-3 text-[15px] font-semibold transition-all duration-200 outline-none";

  const variants = {
    primary:
      "bg-brand-pink text-white hover:bg-brand-pink-hover shadow-pink-md hover:shadow-pink-lg",
    secondary: "bg-brand-purple text-white hover:opacity-90",
    outlined:
      "bg-transparent border-2 border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white",
    ghost: "bg-transparent text-brand-dark hover:bg-brand-light",
  };

  return (
    <button
      type={type}
      className={twMerge(
        clsx(baseStyles, variants[variant], fullWidth && "w-full", className)
      )}
      {...props}
    >
      {children}
    </button>
  );
}
