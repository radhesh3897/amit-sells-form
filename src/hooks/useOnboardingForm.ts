"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  getSectionQuestions,
  getVisibleQuestions,
  getVisibleSections,
  type PrimaryType,
} from "@/lib/formSchema";
import {
  getProgressPercent,
  isAnswered,
  onboardingValidationSchema,
  type OnboardingAnswers,
} from "@/lib/validation";
import { AUTOSAVE_KEY, useAutosaveForm, type AutosaveSnapshot } from "./useAutosaveForm";

export type OnboardingScreen = "welcome" | "form" | "review" | "success";

export function useOnboardingForm() {
  const form = useForm<OnboardingAnswers>({
    resolver: zodResolver(onboardingValidationSchema),
    mode: "onChange",
    defaultValues: {},
  });
  const [screen, setScreen] = useState<OnboardingScreen>("welcome");
  const [activeSectionId, setActiveSectionId] = useState("quick_identity");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const saved = window.localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        try {
          const snapshot = JSON.parse(saved) as Partial<AutosaveSnapshot>;
          if (snapshot.answers) form.reset(snapshot.answers);
          if (snapshot.activeSectionId) setActiveSectionId(snapshot.activeSectionId);
          if (snapshot.screen && snapshot.screen !== "success") setScreen(snapshot.screen);
        } catch {
          window.localStorage.removeItem(AUTOSAVE_KEY);
        }
      }
      setIsHydrated(true);
    });
  }, [form]);

  useAutosaveForm({
    form,
    activeSectionId,
    screen,
    enabled: isHydrated && screen !== "success",
  });

  const primaryType = useWatch({
    control: form.control,
    name: "primary_type",
  }) as PrimaryType | undefined;

  const visibleSections = useMemo(
    () => getVisibleSections(primaryType ?? ""),
    [primaryType],
  );

  const watchedAnswers = useWatch({ control: form.control }) as OnboardingAnswers;
  const answers = useMemo(() => watchedAnswers ?? {}, [watchedAnswers]);

  useEffect(() => {
    if (!isHydrated || isAnswered(answers.billing_country)) return;

    form.setValue("billing_country", "India", {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: true,
    });
  }, [answers.billing_country, form, isHydrated]);

  useEffect(() => {
    if (primaryType === "B2C" && isAnswered(answers.b2b_category)) {
      form.setValue("b2b_category", "", {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: true,
      });
    }

    if (primaryType === "B2B" && isAnswered(answers.b2c_category)) {
      form.setValue("b2c_category", "", {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: true,
      });
    }
  }, [answers.b2b_category, answers.b2c_category, form, primaryType]);

  useEffect(() => {
    const fieldsToClear: string[] = [];

    if (answers.business_time_type !== "Part-time" && isAnswered(answers.part_time_income_source)) {
      fieldsToClear.push("part_time_income_source");
    }

    if (
      answers.has_website_or_landing_page !== "Yes" &&
      isAnswered(answers.website_or_landing_page_url)
    ) {
      fieldsToClear.push("website_or_landing_page_url");
    }

    if (answers.has_instagram_linkedin_profiles !== "Yes") {
      if (isAnswered(answers.instagram_profile)) fieldsToClear.push("instagram_profile");
      if (isAnswered(answers.linkedin_profile)) fieldsToClear.push("linkedin_profile");
    }

    if (primaryType === "B2C") {
      if (isAnswered(answers.b2b_category)) fieldsToClear.push("b2b_category");
      if (isAnswered(answers.other_b2b_category)) fieldsToClear.push("other_b2b_category");
    }

    if (primaryType === "B2B") {
      if (isAnswered(answers.b2c_category)) fieldsToClear.push("b2c_category");
      if (isAnswered(answers.other_b2c_category)) fieldsToClear.push("other_b2c_category");
    }

    if (answers.b2c_category !== "Other" && isAnswered(answers.other_b2c_category)) {
      fieldsToClear.push("other_b2c_category");
    }

    if (answers.b2b_category !== "Other" && isAnswered(answers.other_b2b_category)) {
      fieldsToClear.push("other_b2b_category");
    }

    if (
      primaryType !== "B2C" &&
      primaryType !== "B2B" &&
      isAnswered(answers.other_business_category)
    ) {
      fieldsToClear.push("other_business_category");
    }

    fieldsToClear.forEach((fieldId) => {
      form.setValue(fieldId, "", {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: true,
      });
    });
  }, [
    answers.business_time_type,
    answers.b2b_category,
    answers.b2c_category,
    answers.has_instagram_linkedin_profiles,
    answers.has_website_or_landing_page,
    answers.instagram_profile,
    answers.linkedin_profile,
    answers.other_b2b_category,
    answers.other_b2c_category,
    answers.other_business_category,
    answers.part_time_income_source,
    answers.website_or_landing_page_url,
    form,
    primaryType,
  ]);

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(primaryType ?? "", answers),
    [answers, primaryType],
  );
  const progressPercent = useMemo(
    () => getProgressPercent(visibleQuestions, answers),
    [answers, visibleQuestions],
  );

  const sectionStatuses = useMemo(() => {
    return Object.fromEntries(
      visibleSections.map((section) => {
        const sectionQuestions = getSectionQuestions(
          section.id,
          primaryType ?? "",
          answers,
        );
        const requiredQuestions = sectionQuestions.filter((question) => question.required);
        const anyAnswered = sectionQuestions.some((question) =>
          isAnswered(answers[question.id]),
        );
        const requiredComplete = requiredQuestions.every((question) =>
          isAnswered(answers[question.id]),
        );

        const status =
          !anyAnswered
            ? "Not Started"
            : requiredComplete
              ? "Completed"
              : "In Progress";

        return [section.id, status];
      }),
    ) as Record<string, "Not Started" | "In Progress" | "Completed">;
  }, [answers, primaryType, visibleSections]);

  const completedSections = useMemo(
    () =>
      Object.entries(sectionStatuses)
        .filter(([, status]) => status === "Completed")
        .map(([sectionId]) => sectionId),
    [sectionStatuses],
  );

  const resolvedActiveSectionId = visibleSections.some(
    (section) => section.id === activeSectionId,
  )
    ? activeSectionId
    : visibleSections[0]?.id ?? "quick_identity";

  function getSectionIndex(sectionId: string) {
    return visibleSections.findIndex((section) => section.id === sectionId);
  }

  async function goToNext() {
    const sectionQuestions = getSectionQuestions(
      resolvedActiveSectionId,
      primaryType ?? "",
      answers,
    );
    const isValid = await form.trigger(sectionQuestions.map((question) => question.id));
    if (!isValid) return false;

    const currentIndex = getSectionIndex(resolvedActiveSectionId);
    const nextSection = visibleSections[currentIndex + 1];
    if (nextSection) {
      setActiveSectionId(nextSection.id);
      return true;
    }

    setScreen("review");
    return true;
  }

  function goBack() {
    const currentIndex = getSectionIndex(resolvedActiveSectionId);
    const previousSection = visibleSections[currentIndex - 1];
    if (previousSection) {
      setActiveSectionId(previousSection.id);
    } else {
      setScreen("welcome");
    }
  }

  function start() {
    setScreen("form");
    setActiveSectionId("quick_identity");
  }

  function resetToHome() {
    form.reset({});
    window.localStorage.removeItem(AUTOSAVE_KEY);
    setScreen("welcome");
    setActiveSectionId("quick_identity");
  }

  return {
    form,
    screen,
    setScreen,
    activeSectionId: resolvedActiveSectionId,
    setActiveSectionId,
    visibleSections,
    visibleQuestions,
    answers,
    primaryType,
    progressPercent,
    sectionStatuses,
    completedSections,
    isHydrated,
    goToNext,
    goBack,
    start,
    resetToHome,
  };
}
