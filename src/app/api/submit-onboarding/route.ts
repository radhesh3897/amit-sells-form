import { NextResponse } from "next/server";
import { z } from "zod";
import {
  submitOnboardingForm,
  type OnboardingSubmissionPayload,
} from "@/lib/submissionService";

const payloadSchema = z.object({
  primaryType: z.union([z.enum(["B2C", "B2B"]), z.literal("")]),
  businessCategory: z.string(),
  otherBusinessCategory: z.string(),
  businessName: z.string(),
  currentDesignation: z.string(),
  currentCity: z.string(),
  currentState: z.string(),
  completedSections: z.array(z.string()),
  progressPercent: z.number().min(0).max(100),
  answersBySection: z.record(z.string(), z.record(z.string(), z.unknown())),
  answers: z.record(z.string(), z.unknown()),
  rawJson: z.unknown(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = payloadSchema.parse(body) as OnboardingSubmissionPayload;
    const prepared = await submitOnboardingForm(parsed);

    return NextResponse.json({
      ok: true,
      message: "Mock onboarding submission received.",
      submission: prepared,
    });
  } catch (error) {
    console.error("[AmitSells onboarding submission error]", error);

    return NextResponse.json(
      {
        ok: false,
        message: "We could not submit the onboarding form. Please try again.",
      },
      { status: 400 },
    );
  }
}
