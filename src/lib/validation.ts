import { z } from "zod";
import { type FormQuestion, type PrimaryType, getVisibleQuestions } from "@/lib/formSchema";

export type FieldValue = string | string[] | boolean | undefined;
export type OnboardingAnswers = Record<string, FieldValue>;

const phonePattern = /^[+\d][\d\s().-]{6,22}$/;

export const onboardingValidationSchema = z
  .record(z.string(), z.union([z.string(), z.array(z.string()), z.boolean()]).optional())
  .superRefine((answers, ctx) => {
    const primaryType = answers.primary_type as PrimaryType | undefined;
    const visibleQuestions = getVisibleQuestions(primaryType ?? "", answers);

    visibleQuestions.forEach((question) => {
      const value = answers[question.id];
      const isEmpty =
        value === undefined ||
        value === false ||
        (typeof value === "string" && value.trim().length === 0) ||
        (Array.isArray(value) && value.length === 0);

      if (question.required && isEmpty) {
        ctx.addIssue({
          code: "custom",
          path: [question.id],
          message: question.requiredMessage ?? "This field is required.",
        });
        return;
      }

      if (isEmpty || typeof value !== "string") return;

      if (question.validation === "email" && !z.email().safeParse(value).success) {
        ctx.addIssue({
          code: "custom",
          path: [question.id],
          message: "Enter a valid email address.",
        });
      }

      if (question.validation === "phone" && !phonePattern.test(value.trim())) {
        ctx.addIssue({
          code: "custom",
          path: [question.id],
          message: "Enter a valid Indian or international phone number.",
        });
      }

      if (question.validation === "url") {
        try {
          new URL(value);
        } catch {
          ctx.addIssue({
            code: "custom",
            path: [question.id],
            message: "Enter a valid URL including https://",
          });
        }
      }

      if (
        (question.validation === "number" || question.type === "number") &&
        Number.isNaN(Number(value))
      ) {
        ctx.addIssue({
          code: "custom",
          path: [question.id],
          message: "Enter a number.",
        });
      }
    });
  });

export function isAnswered(value: FieldValue) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.trim().length > 0;
  return false;
}

export function getQuestionError(
  question: FormQuestion,
  answers: OnboardingAnswers,
) {
  const result = onboardingValidationSchema.safeParse(answers);
  if (result.success) return undefined;

  return result.error.issues.find((issue) => issue.path[0] === question.id)?.message;
}

export function getProgressPercent(questions: FormQuestion[], answers: OnboardingAnswers) {
  const requiredQuestions = questions.filter((question) => question.required);
  if (requiredQuestions.length === 0) return 0;

  const answered = requiredQuestions.filter((question) =>
    isAnswered(answers[question.id]),
  ).length;

  return Math.round((answered / requiredQuestions.length) * 100);
}

export function validateSection(
  sectionId: string,
  questions: FormQuestion[],
  answers: OnboardingAnswers,
) {
  const sectionQuestionIds = new Set(
    questions
      .filter((question) => question.section === sectionId)
      .map((question) => question.id),
  );
  const result = onboardingValidationSchema.safeParse(answers);
  if (result.success) return true;

  return !result.error.issues.some((issue) => sectionQuestionIds.has(String(issue.path[0])));
}
