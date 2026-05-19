import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface BrandedCardProps extends PropsWithChildren {
  className?: string;
}

export function BrandedCard({ children, className }: BrandedCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#E5E7EB]/90 bg-[#FFFEFB] shadow-[0_24px_80px_rgba(8,58,37,0.10)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
