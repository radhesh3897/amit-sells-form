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
    const businessType = answers.business_type;

    if (businessType !== "Sole Proprietorship" && isAnswered(answers.pan_number)) {
      fieldsToClear.push("pan_number");
    }

    if (businessType !== "Partnership Firm" && isAnswered(answers.firm_pan_number)) {
      fieldsToClear.push("firm_pan_number");
    }

    if (businessType !== "LLP") {
      if (isAnswered(answers.llpin)) fieldsToClear.push("llpin");
      if (isAnswered(answers.llp_pan_number)) fieldsToClear.push("llp_pan_number");
    }

    if (
      businessType !== "Private Limited" &&
      businessType !== "OPC"
    ) {
      if (isAnswered(answers.cin)) fieldsToClear.push("cin");
      if (isAnswered(answers.company_pan_number)) {
        fieldsToClear.push("company_pan_number");
      }
    }

    if (isAnswered(answers.certificate_of_incorporation_link)) {
      fieldsToClear.push("certificate_of_incorporation_link");
    }

    if (
      ![
        "Sole Proprietorship",
        "Partnership Firm",
        "LLP",
        "Private Limited",
        "OPC",
      ].includes(typeof businessType === "string" ? businessType : "") &&
      isAnswered(answers.has_gst)
    ) {
      fieldsToClear.push("has_gst");
    }

    if (answers.has_gst !== "Yes" && isAnswered(answers.gstin)) {
      fieldsToClear.push("gstin");
    }

    if (answers.business_time_type !== "Part-time" && isAnswered(answers.part_time_income_source)) {
      fieldsToClear.push("part_time_income_source");
    }

    if (
      answers.has_website_or_landing_page !== "Yes" &&
      isAnswered(answers.website_or_landing_page_url)
    ) {
      fieldsToClear.push("website_or_landing_page_url");
    }

    if (answers.has_instagram_profile !== "Yes") {
      if (isAnswered(answers.instagram_profile)) fieldsToClear.push("instagram_profile");
    }

    if (answers.has_linkedin_profile !== "Yes") {
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

    if (
      answers.worked_with_closers_or_agencies_before !== "Yes" &&
      isAnswered(answers.previous_closer_or_agency_experience)
    ) {
      fieldsToClear.push("previous_closer_or_agency_experience");
    }

    if (isAnswered(answers.worked_with_closers_before)) {
      fieldsToClear.push("worked_with_closers_before");
    }

    if (isAnswered(answers.previous_closer_experience)) {
      fieldsToClear.push("previous_closer_experience");
    }

    const paymentMethods = Array.isArray(answers.payment_methods)
      ? answers.payment_methods
      : [];
    const clearUnlessSelected = (method: string, fieldIds: string[]) => {
      if (paymentMethods.includes(method)) return;
      fieldIds.forEach((fieldId) => {
        if (isAnswered(answers[fieldId])) fieldsToClear.push(fieldId);
      });
    };

    clearUnlessSelected("Direct bank transfer", [
      "account_holder_name",
      "bank_name",
      "bank_account_number",
      "ifsc_code",
      "bank_branch_name",
    ]);
    clearUnlessSelected("UPI", ["upi_id"]);
    clearUnlessSelected("Razorpay", ["razorpay_payment_link"]);
    clearUnlessSelected("Cashfree", ["cashfree_payment_link"]);
    clearUnlessSelected("Instamojo", ["instamojo_payment_link"]);
    clearUnlessSelected("Stripe", ["stripe_payment_link"]);
    clearUnlessSelected("Other", ["other_payment_method", "other_payment_details"]);

    ["payment_gateway_name", "payment_link", "checkout_links"].forEach((fieldId) => {
      if (isAnswered(answers[fieldId])) fieldsToClear.push(fieldId);
    });

    fieldsToClear.forEach((fieldId) => {
      form.setValue(fieldId, "", {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: true,
      });
    });
  }, [
    answers,
    answers.business_type,
    answers.business_time_type,
    answers.b2b_category,
    answers.b2c_category,
    answers.certificate_of_incorporation_link,
    answers.cin,
    answers.company_pan_number,
    answers.firm_pan_number,
    answers.gstin,
    answers.has_gst,
    answers.has_instagram_profile,
    answers.has_linkedin_profile,
    answers.has_website_or_landing_page,
    answers.instagram_profile,
    answers.linkedin_profile,
    answers.llpin,
    answers.llp_pan_number,
    answers.other_b2b_category,
    answers.other_b2c_category,
    answers.other_business_category,
    answers.pan_number,
    answers.part_time_income_source,
    answers.payment_methods,
    answers.payment_gateway_name,
    answers.payment_link,
    answers.previous_closer_experience,
    answers.previous_closer_or_agency_experience,
    answers.worked_with_closers_before,
    answers.worked_with_closers_or_agencies_before,
    answers.account_holder_name,
    answers.bank_account_number,
    answers.bank_branch_name,
    answers.bank_name,
    answers.cashfree_payment_link,
    answers.checkout_links,
    answers.ifsc_code,
    answers.instamojo_payment_link,
    answers.other_payment_details,
    answers.other_payment_method,
    answers.razorpay_payment_link,
    answers.stripe_payment_link,
    answers.upi_id,
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
