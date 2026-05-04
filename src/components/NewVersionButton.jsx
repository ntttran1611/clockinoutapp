import React from "react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind classes without style conflicts
 */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center font-regular cursor-pointer transition-colors focus:outline-none disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      intent: {
        primary: "bg-sky-mist-100 text-white hover:bg-sky-mist-80",
        secondary: "bg-mocha text-white hover:bg-mocha-80",
        text: "bg-transparent underline font-medium",
        icon: "bg-transparent text-white",
      },
      size: {
        xs: "px-0 py-0 text-xs",
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-lg",
        icon: "p-2",
      },
      corner: {
        rounded: "rounded-sm",
        sharp: "rounded-none",
        roundedFull: "rounded-full",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
      corner: "rounded",
    },
  },
);

export const NewVersionButton = ({
  className,
  intent,
  size,
  corner,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ intent, size, corner }), className)}
      {...props}
    />
  );
};
