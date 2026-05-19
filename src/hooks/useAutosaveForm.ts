"use client";

import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingAnswers } from "@/lib/validation";

export interface AutosaveSnapshot {
  answers: OnboardingAnswers;
  activeSectionId: string;
  screen: "welcome" | "form" | "review" | "success";
}

export const AUTOSAVE_KEY = "amitsells:onboarding:v1";

interface UseAutosaveFormProps {
  form: UseFormReturn<OnboardingAnswers>;
  activeSectionId: string;
  screen: AutosaveSnapshot["screen"];
  enabled: boolean;
}

export function useAutosaveForm({
  form,
  activeSectionId,
  screen,
  enabled,
}: UseAutosaveFormProps) {
  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch((answers) => {
      window.localStorage.setItem(
        AUTOSAVE_KEY,
        JSON.stringify({
          answers,
          activeSectionId,
          screen,
        } satisfies AutosaveSnapshot),
      );
    });

    return () => subscription.unsubscribe();
  }, [activeSectionId, enabled, form, screen]);

  useEffect(() => {
    if (!enabled) return;

    window.localStorage.setItem(
      AUTOSAVE_KEY,
      JSON.stringify({
        answers: form.getValues(),
        activeSectionId,
        screen,
      } satisfies AutosaveSnapshot),
    );
  }, [activeSectionId, enabled, form, screen]);
}
