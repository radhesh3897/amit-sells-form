"use client";

import Image from "next/image";
import { useState } from "react";

export function BrandMark() {
  const [logoMissing, setLogoMissing] = useState(false);

  return (
    <div className="flex min-w-0 items-center">
      {!logoMissing ? (
        <Image
          src="/logo.png"
          alt="AmitSells logo"
          width={626}
          height={507}
          className="h-16 w-auto object-contain sm:h-20"
          onError={() => setLogoMissing(true)}
          priority
        />
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-[#DACDA6] bg-[#F7F4EC] text-sm font-black tracking-wide text-[#083A25] shadow-inner">
            AS
          </div>
          <p className="text-lg font-bold tracking-tight text-[#083A25]">
            AmitSells
          </p>
        </div>
      )}
    </div>
  );
}
