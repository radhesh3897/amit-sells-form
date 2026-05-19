"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandedCard } from "@/components/ui/BrandedCard";
import { BrandMark } from "@/components/onboarding/BrandMark";

interface SuccessScreenProps {
  onHome: () => void;
}

export function SuccessScreen({ onHome }: SuccessScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <BrandedCard className="p-6 sm:p-10">
          <BrandMark />
          <div className="mt-12">
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#EDF7F0]">
              <CheckCircle2 className="size-7 text-[#2A674D]" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#083A25] sm:text-4xl">
              Your onboarding form has been submitted.
            </h1>
            <p className="mt-4 text-base leading-7 text-[#475569]">
              Our team will review your responses and get back to you with the
              next steps.
            </p>
            <Button className="mt-8 w-full sm:w-auto" onClick={onHome}>
              <Home className="size-4" aria-hidden="true" />
              Back to Home
            </Button>
          </div>
        </BrandedCard>
      </motion.div>
    </main>
  );
}
