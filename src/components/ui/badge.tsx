import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "neutral" | "progress" | "complete";
  className?: string;
}

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" &&
          "border-[#E5E7EB] bg-white text-[#475569]",
        tone === "progress" &&
          "border-[#DACDA6] bg-[#FFF8E1] text-[#7B642C]",
        tone === "complete" &&
          "border-[#B9D8C5] bg-[#EDF7F0] text-[#164732]",
        className,
      )}
    >
      {children}
    </span>
  );
}
