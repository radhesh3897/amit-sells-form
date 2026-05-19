"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getPrimaryTypeLabel,
  getSectionQuestions,
  type FormSection,
  type PrimaryType,
} from "@/lib/formSchema";
import { isAnswered, type OnboardingAnswers } from "@/lib/validation";

interface ReviewScreenProps {
  sections: FormSection[];
  answers: OnboardingAnswers;
  primaryType?: PrimaryType;
  isSubmitting: boolean;
  submitError?: string;
  onEdit: (sectionId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

function formatAnswer(value: unknown) {
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "Not answered";
  if (typeof value === "boolean") return value ? "Yes" : "Not answered";
  if (typeof value === "string") return value.trim() || "Not answered";
  return "Not answered";
}

export function ReviewScreen({
  sections,
  answers,
  primaryType,
  isSubmitting,
  submitError,
  onEdit,
  onBack,
  onSubmit,
}: ReviewScreenProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div className="rounded-2xl border border-[#E5E7EB] bg-[#FFFEFB] p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#B0985B]">
              Final review
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#083A25]">
              Review your answers
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#475569]">
              Check the details before sending this to the AmitSells team.
            </p>
          </div>
          {primaryType ? <Badge tone="complete">{getPrimaryTypeLabel(primaryType)}</Badge> : null}
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const sectionQuestions = getSectionQuestions(
            section.id,
            primaryType ?? "",
            answers,
          );
          if (sectionQuestions.length === 0) return null;

          const missingRequired = sectionQuestions.some(
            (question) => question.required && !isAnswered(answers[question.id]),
          );

          return (
            <details
              key={section.id}
              open
              className="group rounded-2xl border border-[#E5E7EB] bg-[#FFFEFB] p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  {missingRequired ? (
                    <AlertCircle className="size-5 shrink-0 text-red-600" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="size-5 shrink-0 text-[#2A674D]" aria-hidden="true" />
                  )}
                  <div>
                    <h2 className="font-semibold text-[#111827]">{section.title}</h2>
                    <p className="text-xs text-[#475569]">
                      {missingRequired ? "Required answers missing" : "Ready"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={(event) => {
                      event.preventDefault();
                      onEdit(section.id);
                    }}
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                    Edit
                  </Button>
                  <ChevronDown
                    className="size-4 text-[#475569] transition group-open:rotate-180"
                    aria-hidden="true"
                  />
                </div>
              </summary>
              <div className="mt-5 divide-y divide-[#E5E7EB]">
                {sectionQuestions.map((question) => {
                  const answer = formatAnswer(answers[question.id]);
                  const missing = question.required && !isAnswered(answers[question.id]);

                  return (
                    <div
                      key={question.id}
                      className="grid gap-2 py-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
                    >
                      <p className="text-sm font-semibold text-[#111827]">
                        {question.reviewLabel ?? question.label}
                        {question.required ? (
                          <span className="text-[#B0985B]"> *</span>
                        ) : null}
                      </p>
                      <p
                        className={
                          missing
                            ? "text-sm font-semibold text-red-600"
                            : answer === "Not answered"
                              ? "text-sm italic text-[#64748B]"
                              : "whitespace-pre-wrap text-sm leading-6 text-[#475569]"
                        }
                      >
                        {missing ? "Required missing" : answer}
                      </p>
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>

      {submitError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {submitError}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-[#E5E7EB] pt-5 sm:flex-row sm:justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Onboarding Form"}
        </Button>
      </div>
    </motion.section>
  );
}
