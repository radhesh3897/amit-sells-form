import {
  getPrimaryTypeLabel,
  getVisibleQuestions,
  type PrimaryType,
} from "@/lib/formSchema";
import {
  appendOnboardingRowToGoogleSheet,
  type GoogleSheetsAppendResult,
} from "@/lib/googleSheets";
import type { OnboardingAnswers } from "@/lib/validation";

export interface OnboardingSubmissionPayload {
  primaryType: PrimaryType | "";
  businessCategory: string;
  otherBusinessCategory: string;
  businessName: string;
  currentDesignation: string;
  currentCity: string;
  currentState: string;
  completedSections: string[];
  progressPercent: number;
  answersBySection: Record<string, Record<string, unknown>>;
  answers: OnboardingAnswers;
  rawJson: unknown;
}

export interface PreparedSubmission {
  timestamp: string;
  primaryType: PrimaryType | "";
  primaryTypeLabel: string;
  businessCategory: string;
  otherBusinessCategory: string;
  businessName: string;
  currentDesignation: string;
  currentCity: string;
  currentState: string;
  flattenedAnswers: Record<string, unknown>;
  googleSheetRow: Record<string, unknown>;
  allAnswersJson: string;
  googleSheets: GoogleSheetsAppendResult;
}

export const googleSheetColumns = [
  "full_name",
  "phone",
  "email",
  "current_city",
  "current_state",
  "business_name",
  "primary_type",
  "business_category",
  "other_business_category",
  "business_registered",
  "business_type",
  "business_trade_name",
  "current_designation",
  "pan_number",
  "has_gst",
  "gstin",
  "firm_pan_number",
  "llpin",
  "llp_pan_number",
  "cin",
  "company_pan_number",
  "certificate_of_incorporation_link",
  "billing_address_line_1",
  "billing_address_line_2",
  "billing_city",
  "billing_state",
  "billing_pincode",
  "billing_country",
  "primary_contact_name",
  "primary_contact_phone",
  "primary_contact_email",
  "business_duration",
  "business_time_type",
  "part_time_income_source",
  "has_website_or_landing_page",
  "website_or_landing_page_url",
  "has_instagram_profile",
  "instagram_profile",
  "has_linkedin_profile",
  "linkedin_profile",
  "b2c_category",
  "other_b2c_category",
  "b2b_category",
  "other_b2b_category",
  "current_monthly_revenue",
  "average_offer_price",
  "six_month_revenue_target",
  "quality_leads_and_calls_status",
  "revenue_goal_blocker",
  "attempted_solutions",
  "why_cannot_hit_target_alone",
  "qualified_leads_per_month",
  "booked_calls_per_day",
  "show_up_ratio",
  "previous_sales_call_owner",
  "appointment_setting_owner",
  "current_closing_rate",
  "prospect_dropoff_stage",
  "after_think_about_it_response",
  "exact_offer",
  "problem_solved",
  "offer_messaging",
  "offer_deliverables",
  "delivery_mode",
  "delivery_support",
  "why_choose_you",
  "bad_fit_client",
  "claims_never_to_make",
  "ideal_buyer_age_range",
  "ideal_buyer_demographic",
  "ideal_buyer_psychographic",
  "ideal_buyer_income_range",
  "ideal_buyer_profession",
  "ideal_buyer_locations",
  "ideal_buyer_reason",
  "buyer_biggest_struggles",
  "promised_transformation",
  "transformation_timeline",
  "buyer_problem_phrases",
  "buyer_biggest_fears",
  "buyer_secretly_wanted_results",
  "common_buyer_objections",
  "buyer_questions_before_buying",
  "what_makes_buyer_say_yes",
  "has_testimonials",
  "testimonial_links",
  "has_proof_assets",
  "proof_asset_links",
  "has_sales_call_recordings",
  "sales_call_recording_links",
  "has_webinar_recordings",
  "webinar_recording_links",
  "has_pitch_deck",
  "pitch_deck_links",
  "has_sales_script",
  "sales_script_links",
  "other_sales_material_links",
  "lead_sources",
  "after_lead_interest_process",
  "uses_crm",
  "crm_name",
  "follow_up_process",
  "post_payment_onboarding",
  "worked_with_closers_or_agencies_before",
  "previous_closer_or_agency_experience",
  "payment_methods",
  "should_share_payment_details_on_calls",
  "account_holder_name",
  "bank_name",
  "bank_account_number",
  "ifsc_code",
  "bank_branch_name",
  "upi_id",
  "razorpay_payment_link",
  "cashfree_payment_link",
  "instamojo_payment_link",
  "stripe_payment_link",
  "other_payment_method",
  "other_payment_details",
  "coupon_or_discount_rules",
  "expected_amitsells_support",
  "collaboration_success_result",
  "start_timeline",
  "additional_notes_for_amitsells",
  "information_accuracy_consent",
] as const;

export function flattenFormAnswers(payload: OnboardingSubmissionPayload) {
  const visibleQuestions = getVisibleQuestions(payload.primaryType, payload.answers);
  const flattened: Record<string, unknown> = {};

  visibleQuestions.forEach((question) => {
    const value = payload.answers[question.id];
    const key = question.googleSheetColumn ?? question.id;

    if (value === undefined || value === "") return;
    flattened[key] = Array.isArray(value) ? value.join(", ") : value;
  });

  return flattened;
}

export function prepareGoogleSheetRow(payload: OnboardingSubmissionPayload) {
  const flattened = flattenFormAnswers(payload);
  const timestamp = new Date().toISOString();
  const row = Object.fromEntries(
    googleSheetColumns.map((column) => [column, flattened[column] ?? ""]),
  ) as Record<string, unknown>;

  return {
    timestamp,
    ...row,
    primary_type: getPrimaryTypeLabel(payload.primaryType),
    business_name: flattened.business_name ?? payload.businessName,
    business_category: flattened.business_category ?? payload.businessCategory,
    other_business_category:
      flattened.other_business_category ?? payload.otherBusinessCategory,
    current_designation:
      flattened.current_designation ?? payload.currentDesignation,
    current_city: flattened.current_city ?? payload.currentCity,
    current_state: flattened.current_state ?? payload.currentState,
    all_answers_json: JSON.stringify(payload.answersBySection),
  };
}

export async function submitOnboardingForm(
  payload: OnboardingSubmissionPayload,
): Promise<PreparedSubmission> {
  const flattenedAnswers = flattenFormAnswers(payload);
  const googleSheetRow = prepareGoogleSheetRow(payload);
  const googleSheets = await appendOnboardingRowToGoogleSheet(
    googleSheetRow,
    googleSheetColumns,
  );

  const prepared = {
    timestamp: String(googleSheetRow.timestamp),
    primaryType: payload.primaryType,
    primaryTypeLabel: getPrimaryTypeLabel(payload.primaryType),
    businessCategory: payload.businessCategory,
    otherBusinessCategory: payload.otherBusinessCategory,
    businessName: payload.businessName,
    currentDesignation: payload.currentDesignation,
    currentCity: payload.currentCity,
    currentState: payload.currentState,
    flattenedAnswers,
    googleSheetRow,
    allAnswersJson: JSON.stringify(payload.rawJson),
    googleSheets,
  };

  if (googleSheets.enabled) {
    console.info("[AmitSells onboarding submission saved]", googleSheets);
  } else {
    console.warn("[AmitSells Google Sheets fallback]", googleSheets.message);
    console.info("[AmitSells mock onboarding submission]", prepared);
  }

  return prepared;
}
