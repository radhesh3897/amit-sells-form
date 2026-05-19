"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/onboarding/BrandMark";
import { Button } from "@/components/ui/button";
import { BrandedCard } from "@/components/ui/BrandedCard";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="min-w-0 w-full max-w-[min(48rem,calc(100vw-2rem))]"
      >
        <BrandedCard className="max-w-full overflow-hidden">
          <div className="border-b border-[#E5E7EB] bg-gradient-to-r from-[#FFFEFB] to-[#F7F4EC] px-6 py-5 sm:px-10">
            <BrandMark />
          </div>
          <div className="px-6 py-12 sm:px-10 sm:py-16">
            <div className="max-w-2xl">
              <h1 className="max-w-full break-words text-3xl font-semibold leading-tight tracking-tight text-[#083A25] sm:text-6xl">
                Welcome to AmitSells
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#475569]">
                Let&apos;s understand your business, offer, sales process, and
                growth goals so our team can evaluate the best way to support
                you.
              </p>
              <Button
                size="lg"
                className="mt-9 w-full sm:w-auto"
                onClick={onStart}
              >
                Start Onboarding
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </BrandedCard>
      </motion.div>
    </main>
  );
}
