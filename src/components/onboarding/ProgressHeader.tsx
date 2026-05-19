"use client";

import { BrandMark } from "@/components/onboarding/BrandMark";

interface ProgressHeaderProps {
  progressPercent: number;
  sectionTitle?: string;
}

export function ProgressHeader({
  progressPercent,
  sectionTitle,
}: ProgressHeaderProps) {
  return (
    <header className="sticky top-0 z-30 rounded-t-2xl border-b border-[#E5E7EB] bg-[#FFFEFB]/95 px-5 py-4 backdrop-blur sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BrandMark />
        <div className="w-full min-w-0 sm:max-w-4xl sm:flex-1">
          <div className="mb-2 flex items-center justify-between gap-4 text-xs font-semibold text-[#475569] sm:text-sm">
            <span className="min-w-0 truncate">{sectionTitle ?? "Onboarding"}</span>
            <span className="shrink-0 whitespace-nowrap text-right">
              {progressPercent}% completed
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDE6D4]"
            aria-label={`${progressPercent}% completed`}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#083A25] via-[#2A674D] to-[#B0985B] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
