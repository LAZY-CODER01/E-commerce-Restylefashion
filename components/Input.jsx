import React, { forwardRef } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const Input = forwardRef(
  ({ label, error, className, id, type = "text", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-[14px] font-medium text-brand-dark"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          ref={ref}
          className={twMerge(
            clsx(
              "w-full bg-brand-light border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-brand-dark placeholder:text-gray-400 outline-none transition-all duration-200",
              "focus:border-brand-pink focus:shadow-[0_0_0_3px_rgba(247,36,110,0.1)]",
              error &&
                "border-brand-pink focus:shadow-[0_0_0_3px_rgba(247,36,110,0.1)]",
              className
            )
          )}
          {...props}
        />
        {error && <span className="text-[12px] text-brand-pink">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
