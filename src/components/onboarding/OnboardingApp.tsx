"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getSectionQuestions } from "@/lib/formSchema";
import { isAnswered } from "@/lib/validation";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { AUTOSAVE_KEY } from "@/hooks/useAutosaveForm";
import { BrandedCard } from "@/components/ui/BrandedCard";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { ProgressHeader } from "@/components/onboarding/ProgressHeader";
import { SectionChecklist } from "@/components/onboarding/SectionChecklist";
import { FormSection } from "@/components/onboarding/FormSection";
import { ReviewScreen } from "@/components/onboarding/ReviewScreen";
import { SuccessScreen } from "@/components/onboarding/SuccessScreen";

export function OnboardingApp() {
  const onboarding = useOnboardingForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const contentRef = useRef<HTMLDivElement>(null);
  const hasMountedFormRef = useRef(false);

  const {
    form,
    screen,
    setScreen,
    activeSectionId,
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
  } = onboarding;

  const currentSection = visibleSections.find(
    (section) => section.id === activeSectionId,
  );
  const activeQuestions = useMemo(
    () => getSectionQuestions(activeSectionId, primaryType ?? "", answers),
    [activeSectionId, answers, primaryType],
  );
  const activeIndex = visibleSections.findIndex(
    (section) => section.id === activeSectionId,
  );
  const isLastSection = activeIndex === visibleSections.length - 1;

  useEffect(() => {
    if (!isHydrated || screen === "welcome" || screen === "success") return;

    if (!hasMountedFormRef.current) {
      hasMountedFormRef.current = true;
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (typeof contentRef.current?.scrollIntoView !== "function") return;

      contentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeSectionId, isHydrated, screen]);

  function buildAnswersBySection() {
    const values = form.getValues();

    return Object.fromEntries(
      visibleSections.map((section) => {
        const sectionAnswers = Object.fromEntries(
          getSectionQuestions(section.id, primaryType ?? "", values).map((question) => [
            question.reviewLabel ?? question.label,
            values[question.id] ?? "",
          ]),
        );

        return [section.title, sectionAnswers];
      }),
    );
  }

  async function handleSubmit() {
    setSubmitError(undefined);
    const isValid = await form.trigger(visibleQuestions.map((question) => question.id));

    if (!isValid) {
      setSubmitError("Please complete the highlighted required fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const values = form.getValues();
      const businessCategory =
        primaryType === "B2C" ? values.b2c_category : values.b2b_category;
      const otherBusinessCategory =
        businessCategory === "Other"
          ? primaryType === "B2C" && typeof values.other_b2c_category === "string"
            ? values.other_b2c_category
            : primaryType === "B2B" && typeof values.other_b2b_category === "string"
              ? values.other_b2b_category
              : ""
          : "";
      const payload = {
        primaryType: primaryType ?? "",
        businessCategory: typeof businessCategory === "string" ? businessCategory : "",
        otherBusinessCategory,
        businessName: typeof values.business_name === "string" ? values.business_name : "",
        businessTradeName:
          typeof values.business_trade_name === "string"
            ? values.business_trade_name
            : "",
        currentDesignation:
          typeof values.current_designation === "string"
            ? values.current_designation
            : "",
        currentCity:
          typeof values.current_city === "string"
            ? values.current_city
            : "",
        currentState:
          typeof values.current_state === "string"
            ? values.current_state
            : "",
        completedSections,
        progressPercent,
        answersBySection: buildAnswersBySection(),
        answers: values,
        rawJson: {
          primaryType: primaryType ?? "",
          businessCategory,
          otherBusinessCategory,
          progressPercent,
          answers: values,
          requiredCompletion: visibleQuestions
            .filter((question) => question.required)
            .map((question) => ({
              id: question.id,
              label: question.label,
              answered: isAnswered(values[question.id]),
            })),
        },
      };

      const response = await fetch("/api/submit-onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      window.localStorage.removeItem(AUTOSAVE_KEY);
      setScreen("success");
    } catch {
      setSubmitError("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <BrandedCard className="w-full max-w-md p-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#B0985B]">
            Loading onboarding
          </p>
        </BrandedCard>
      </main>
    );
  }

  if (screen === "welcome") {
    return <WelcomeScreen onStart={start} />;
  }

  if (screen === "success") {
    return <SuccessScreen onHome={resetToHome} />;
  }

  return (
    <main className="min-h-screen p-0">
      <BrandedCard className="min-h-screen w-full overflow-hidden rounded-none">
        <ProgressHeader
          progressPercent={progressPercent}
          sectionTitle={screen === "review" ? "Review" : currentSection?.title}
        />
        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[310px_minmax(0,1fr)] lg:p-8">
          {screen === "form" ? (
            <SectionChecklist
              sections={visibleSections}
              activeSectionId={activeSectionId}
              statuses={sectionStatuses}
              onSelect={setActiveSectionId}
            />
          ) : (
            <div className="hidden lg:block">
              <div className="sticky top-28 rounded-2xl border border-[#E5E7EB] bg-[#F7F4EC] p-5">
                <p className="text-sm font-semibold text-[#083A25]">Review mode</p>
                <p className="mt-2 text-sm leading-6 text-[#475569]">
                  Use Edit beside any section to jump back and refine an answer.
                </p>
              </div>
            </div>
          )}

          <div ref={contentRef} className="min-w-0 scroll-mt-28">
            {screen === "form" && currentSection ? (
              <FormSection
                section={currentSection}
                questions={activeQuestions}
                form={form}
                status={sectionStatuses[currentSection.id] ?? "Not Started"}
                isLast={isLastSection}
                onBack={goBack}
                onContinue={goToNext}
              />
            ) : (
              <ReviewScreen
                sections={visibleSections}
                answers={answers}
                primaryType={primaryType}
                isSubmitting={isSubmitting}
                submitError={submitError}
                onEdit={(sectionId) => {
                  setActiveSectionId(sectionId);
                  setScreen("form");
                }}
                onBack={() => setScreen("form")}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </BrandedCard>
    </main>
  );
}
