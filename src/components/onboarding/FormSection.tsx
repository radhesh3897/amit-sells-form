"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Controller, type FieldErrors, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  primaryTypeOptions,
  type FormQuestion,
  type FormSection as FormSectionType,
} from "@/lib/formSchema";
import type { OnboardingAnswers } from "@/lib/validation";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  section: FormSectionType;
  questions: FormQuestion[];
  form: UseFormReturn<OnboardingAnswers>;
  status: "Not Started" | "In Progress" | "Completed";
  isLast: boolean;
  onBack: () => void;
  onContinue: () => void;
}

function getErrorMessage(errors: FieldErrors<OnboardingAnswers>, id: string) {
  const error = errors[id];
  if (!error || typeof error.message !== "string") return undefined;
  return error.message;
}

function FieldChrome({
  question,
  error,
  children,
}: {
  question: FormQuestion;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-2"
    >
      <label
        htmlFor={question.id}
        className="block text-sm font-semibold text-[#111827]"
      >
        {question.label}
        {question.required ? <span className="text-[#B0985B]"> *</span> : null}
      </label>
      {question.description ? (
        <p className="text-sm leading-6 text-[#475569]">{question.description}</p>
      ) : null}
      {children}
      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </motion.div>
  );
}

export function FormSection({
  section,
  questions,
  form,
  status,
  isLast,
  onBack,
  onContinue,
}: FormSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={section.id}
        layout
        initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
        transition={{
          layout: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.18 },
          y: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
          filter: { duration: 0.18 },
        }}
        className="space-y-7"
      >
        <motion.div
          layout
          className="rounded-2xl border border-[#E5E7EB] bg-[#FFFEFB] p-5 shadow-sm sm:p-7"
        >
          <div className="mb-7 flex flex-col gap-3 border-b border-[#E5E7EB] pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#083A25]">
                {section.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569]">
                {section.description}
              </p>
            </div>
            <Badge
              tone={
                status === "Completed"
                  ? "complete"
                  : status === "In Progress"
                    ? "progress"
                    : "neutral"
              }
            >
              {status}
            </Badge>
          </div>

          <motion.div layout className="space-y-6">
            {questions.map((question) => {
              const error = getErrorMessage(errors, question.id);
              const describedBy = error ? `${question.id}-error` : undefined;

              if (question.id === "primary_type") {
                return (
                  <FieldChrome key={question.id} question={question} error={error}>
                    <Controller
                      name={question.id}
                      control={control}
                      render={({ field }) => (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {primaryTypeOptions.map((option) => (
                            <label
                              key={option.value}
                              className={cn(
                                "focus-within:ring-[#B0985B] flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition duration-200 ease-out active:scale-[0.995] focus-within:ring-2",
                                field.value === option.value
                                  ? "border-[#B0985B] bg-[#F7F4EC]"
                                  : "border-[#E5E7EB] bg-white hover:border-[#DACDA6]",
                              )}
                            >
                              <input
                                type="radio"
                                value={option.value}
                                checked={field.value === option.value}
                                onChange={() => field.onChange(option.value)}
                                className="mt-1 accent-[#083A25]"
                                aria-describedby={describedBy}
                              />
                              <span className="text-sm font-semibold leading-6 text-[#111827]">
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                  </FieldChrome>
                );
              }

              if (question.type === "textarea" || question.longAnswer || question.type === "file-link") {
                return (
                  <FieldChrome key={question.id} question={question} error={error}>
                    <Textarea
                      id={question.id}
                      placeholder={question.placeholder}
                      aria-invalid={Boolean(error)}
                      aria-describedby={describedBy}
                      {...register(question.id)}
                    />
                  </FieldChrome>
                );
              }

              if (question.type === "select") {
                return (
                  <FieldChrome key={question.id} question={question} error={error}>
                    <select
                      id={question.id}
                      className="focus-ring h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] shadow-sm hover:border-[#DACDA6]"
                      aria-invalid={Boolean(error)}
                      aria-describedby={describedBy}
                      {...register(question.id)}
                    >
                      <option value="">Select an option</option>
                      {question.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </FieldChrome>
                );
              }

              if (question.type === "multi-select") {
                return (
                  <FieldChrome key={question.id} question={question} error={error}>
                    <Controller
                      name={question.id}
                      control={control}
                      render={({ field }) => {
                        const currentValue = Array.isArray(field.value)
                          ? field.value
                          : [];

                        return (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {question.options?.map((option) => (
                              <label
                                key={option}
                                className={cn(
                                  "focus-within:ring-[#B0985B] flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition duration-200 ease-out active:scale-[0.995] focus-within:ring-2",
                                  currentValue.includes(option)
                                    ? "border-[#B0985B] bg-[#F7F4EC] text-[#083A25]"
                                    : "border-[#E5E7EB] bg-white text-[#111827] hover:border-[#DACDA6]",
                                )}
                              >
                                <input
                                  type="checkbox"
                                  checked={currentValue.includes(option)}
                                  onChange={(event) => {
                                    if (event.target.checked) {
                                      field.onChange([...currentValue, option]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter((value) => value !== option),
                                      );
                                    }
                                  }}
                                  className="accent-[#083A25]"
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        );
                      }}
                    />
                  </FieldChrome>
                );
              }

              if (question.type === "radio" && question.options) {
                return (
                  <FieldChrome key={question.id} question={question} error={error}>
                    <Controller
                      name={question.id}
                      control={control}
                      render={({ field }) => (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {question.options?.map((option) => (
                            <label
                              key={option}
                              className={cn(
                                "focus-within:ring-[#B0985B] flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition duration-200 ease-out active:scale-[0.995] focus-within:ring-2",
                                field.value === option
                                  ? "border-[#B0985B] bg-[#F7F4EC] text-[#083A25]"
                                  : "border-[#E5E7EB] bg-white text-[#111827] hover:border-[#DACDA6]",
                              )}
                            >
                              <input
                                type="radio"
                                checked={field.value === option}
                                onChange={() => field.onChange(option)}
                                className="accent-[#083A25]"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      )}
                    />
                  </FieldChrome>
                );
              }

              return (
                <FieldChrome key={question.id} question={question} error={error}>
                  <Input
                    id={question.id}
                    type={
                      question.type === "email"
                        ? "email"
                        : question.type === "phone"
                          ? "tel"
                          : question.type === "url"
                            ? "url"
                            : question.type === "number"
                              ? "number"
                              : "text"
                    }
                    inputMode={
                      question.type === "currency" ||
                      question.type === "percentage" ||
                      question.type === "number"
                        ? "decimal"
                        : undefined
                    }
                    placeholder={question.placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    {...register(question.id)}
                  />
                </FieldChrome>
              );
            })}
          </motion.div>
        </motion.div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#E5E7EB] pt-5 sm:flex-row sm:justify-between">
          <Button type="button" variant="secondary" onClick={onBack}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Button>
          <Button type="button" onClick={onContinue}>
            {isLast ? "Review Answers" : "Save & Continue"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
