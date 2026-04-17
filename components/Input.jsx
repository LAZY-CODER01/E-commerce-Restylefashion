import React, { forwardRef } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/** Single-line fields — same tokens as Boost “Add Card” / payment `INPUT_CLASS`. */
export const formFieldInputBase =
  "h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm font-normal text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-rose-500 focus:ring-1 focus:ring-rose-500";

/** Multi-line — same border/radius/focus as Add Card, taller min-height. */
export const formFieldTextareaBase =
  "min-h-[140px] w-full rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm font-normal text-gray-900 placeholder:text-gray-500 outline-none transition-all resize-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500";

export const formFieldErrorClass =
  "border-red-500 focus:border-red-500 focus:ring-red-500";

const inputErrorClass = formFieldErrorClass;

const Input = forwardRef(
  (
    {
      label,
      error,
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
          className="relative w-full"
        >
          <input
            id={id}
            type={type}
            ref={ref}
            className={twMerge(
              clsx(formFieldInputBase, error && inputErrorClass, className)
            )}
            {...props}
          />
        </div>
        <div className="min-h-[18px]">
          {error ? (
            <span className="text-[12px] text-red-600 font-medium">{error}</span>
          ) : null}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
