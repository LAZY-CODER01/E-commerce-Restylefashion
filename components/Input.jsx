import React, { forwardRef } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import ValidationTooltip from "@/components/ValidationTooltip";

const Input = forwardRef(
  (
    {
      label,
      error,
      /** Seller flows: show tooltip bubble instead of red border + inline text */
      tooltipError = false,
      className,
      id,
      type = "text",
      ...props
    },
    ref
  ) => {
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
        <div
          className={clsx("relative w-full", tooltipError && "isolate")}
        >
          <input
            id={id}
            type={type}
            ref={ref}
            className={twMerge(
              clsx(
                "w-full bg-brand-light border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-brand-dark placeholder:text-gray-400 outline-none transition-all duration-200",
                "focus:border-brand-pink focus:shadow-[0_0_0_3px_rgba(247,36,110,0.1)]",
                error &&
                  !tooltipError &&
                  "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]",
                className
              )
            )}
            {...props}
          />
          {error && tooltipError && (
            <ValidationTooltip message={error} floating />
          )}
        </div>
        {error && !tooltipError && (
          <span className="text-[12px] text-red-600 font-medium">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
