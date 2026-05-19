import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "focus-ring h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] shadow-sm transition duration-200 ease-out placeholder:text-slate-400 hover:border-[#DACDA6]",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
