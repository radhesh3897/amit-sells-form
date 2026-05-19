export type PrimaryType = "B2C" | "B2B";

export type QuestionType =
  | "text"
  | "email"
  | "phone"
  | "url"
  | "textarea"
  | "select"
  | "multi-select"
  | "radio"
  | "checkbox"
  | "number"
  | "currency"
  | "percentage"
  | "file-link";

export type ValidationKind = "email" | "phone" | "url" | "number" | "percentage";

export interface FormQuestion {
  id: string;
  label: string;
  reviewLabel?: string;
  description?: string;
  placeholder?: string;
  type: QuestionType;
  required?: boolean;
  requiredMessage?: string;
  section: string;
  visibleFor?: PrimaryType[];
  visibleWhenAny?: Array<{
    fieldId: string;
    value: string;
  }>;
  options?: string[];
  validation?: ValidationKind;
  longAnswer?: boolean;
  googleSheetColumn?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description: string;
  kind: "welcome" | "common" | "branch" | "review";
  visibleFor?: PrimaryType[];
}

export const primaryTypeOptions: { value: PrimaryType; label: string }[] = [
  { value: "B2C", label: "B2C" },
  { value: "B2B", label: "B2B" },
];

const b2cCategoryOptions = [
  "Stock Market Coach",
  "Life Coach",
  "PCOS Reversal Consultant",
  "Other",
];

const b2bCategoryOptions = [
  "Performance Marketing Agency",
  "Social Media Marketing Agency",
  "Business Coach for Coaches",
  "Other",
];

const yesNoOptions = ["Yes", "No"];

export const sections: FormSection[] = [
  {
    id: "quick_identity",
    title: "Quick Identity",
    description: "Start with the essential details we need to identify your business and category.",
    kind: "common",
  },
  {
    id: "business_profile",
    title: "Business Registration & Billing Details",
    description:
      "These details help AmitSells understand your legal and billing setup before sales calls, invoicing, and payment collection.",
    kind: "common",
  },
  {
    id: "online_presence",
    title: "Business Profile & Online Presence",
    description:
      "Before we understand your sales problem, we need to understand how your business currently operates and where prospects can find you online.",
    kind: "common",
  },
  {
    id: "revenue_reality",
    title: "Current Revenue Reality",
    description:
      "Before we talk about closing more clients, we need to understand where your revenue stands today and what is stopping you from reaching the next level.",
    kind: "common",
  },
  {
    id: "pipeline_diagnosis",
    title: "Sales Pipeline & Call Diagnosis",
    description:
      "Most revenue leaks happen between lead, call booking, show-up, follow-up, and payment. This section helps us diagnose where the sales process is breaking.",
    kind: "common",
  },
  {
    id: "offer_strength",
    title: "Offer Strength",
    description:
      "A closer can scale a strong offer, but cannot save a weak or unclear offer. So we need to understand how clear, valuable, and sellable your offer is.",
    kind: "common",
  },
  {
    id: "buyer_psychology",
    title: "Buyer Psychology",
    description:
      "High-ticket sales is not about explaining features. It is about understanding fear, desire, doubt, urgency, and trust.",
    kind: "common",
  },
  {
    id: "proof_assets",
    title: "Sales Assets & Proof",
    description:
      "The stronger your proof and sales assets are, the faster AmitSells can understand your offer, handle objections, and close with confidence.",
    kind: "common",
  },
  {
    id: "sales_system",
    title: "Current Sales System",
    description:
      "A closer performs best when the pipeline is clean. If leads, follow-ups, CRM, and onboarding are messy, revenue leaks even after good calls.",
    kind: "common",
  },
  {
    id: "payment_setup",
    title: "Payment Collection Setup",
    description:
      "These details help AmitSells understand how payments should be collected when a client is ready to buy. Do not share passwords, OTPs, or login credentials.",
    kind: "common",
  },
  {
    id: "amitsells_fit",
    title: "AmitSells Fit",
    description:
      "Now we need to understand what role you want AmitSells to play in your business - closer, sales system partner, or extended sales team.",
    kind: "common",
  },
];

const q = (question: FormQuestion): FormQuestion => question;

const field = (
  section: string,
  id: string,
  label: string,
  overrides: Partial<FormQuestion> = {},
): FormQuestion =>
  q({
    id,
    label,
    section,
    type: "textarea",
    placeholder: "Write the honest answer here...",
    longAnswer: true,
    googleSheetColumn: id,
    ...overrides,
  });

const text = (
  section: string,
  id: string,
  label: string,
  overrides: Partial<FormQuestion> = {},
) =>
  field(section, id, label, {
    type: "text",
    longAnswer: false,
    placeholder: "",
    ...overrides,
  });

const radio = (
  section: string,
  id: string,
  label: string,
  options: string[],
  overrides: Partial<FormQuestion> = {},
) =>
  field(section, id, label, {
    type: "radio",
    longAnswer: false,
    options,
    ...overrides,
  });

const textarea = (
  section: string,
  id: string,
  label: string,
  overrides: Partial<FormQuestion> = {},
) => field(section, id, label, overrides);

export const questions: FormQuestion[] = [
  text("quick_identity", "full_name", "Full Name", {
    required: true,
    placeholder: "Your full name",
  }),
  text("quick_identity", "phone", "Phone / WhatsApp Number", {
    required: true,
    type: "phone",
    placeholder: "+91 98765 43210",
    validation: "phone",
  }),
  text("quick_identity", "email", "Email", {
    required: true,
    type: "email",
    placeholder: "you@example.com",
    validation: "email",
  }),
  text("quick_identity", "current_city", "Current City", {
    required: true,
    placeholder: "Example: Jaipur",
  }),
  text("quick_identity", "current_state", "Current State", {
    required: true,
    placeholder: "Example: Rajasthan",
  }),
  text("quick_identity", "business_name", "Business Name", {
    required: false,
    visibleFor: [],
    placeholder: "Your business name",
  }),
  text("quick_identity", "current_designation", "Current Designation", {
    required: false,
    visibleFor: [],
    placeholder: "Founder, coach, agency owner...",
  }),
  radio("quick_identity", "primary_type", "Who do you primarily sell to?", ["B2C", "B2B"], {
    reviewLabel: "Primary Type",
    required: false,
    visibleFor: [],
  }),
  radio(
    "quick_identity",
    "b2c_category",
    "Which B2C category best describes your business?",
    b2cCategoryOptions,
    {
      reviewLabel: "Business Category",
      required: false,
      visibleFor: [],
      googleSheetColumn: "business_category",
    },
  ),
  radio(
    "quick_identity",
    "b2b_category",
    "Which B2B category best describes your business?",
    b2bCategoryOptions,
    {
      reviewLabel: "Business Category",
      required: false,
      visibleFor: [],
      googleSheetColumn: "business_category",
    },
  ),
  text("quick_identity", "other_business_category", "Please specify your business category", {
    reviewLabel: "Specified Business Category",
    required: false,
    requiredMessage: "Please specify your business category.",
    visibleFor: [],
    visibleWhenAny: [
      { fieldId: "b2c_category", value: "Other" },
      { fieldId: "b2b_category", value: "Other" },
    ],
    placeholder: "Example: career coach, legal consultant, SaaS agency, finance educator, etc.",
  }),

  radio(
    "business_profile",
    "business_registered",
    "Is your business currently registered?",
    ["Yes", "No", "In process"],
    { required: true },
  ),
  radio(
    "business_profile",
    "business_type",
    "What is your business type?",
    ["Sole Proprietorship", "Partnership Firm", "LLP", "Private Limited", "OPC"],
    {
      required: true,
      type: "select",
      visibleWhenAny: [{ fieldId: "business_registered", value: "Yes" }],
    },
  ),
  text("business_profile", "business_trade_name", "Business / Trade Name", {
    required: true,
    placeholder: "Enter your registered business name or trade name",
  }),
  text("business_profile", "current_designation", "Current Designation", {
    required: true,
    placeholder: "Example: Founder, Coach, Director, Partner",
  }),
  text("business_profile", "pan_number", "PAN Number", {
    required: true,
    placeholder: "Enter PAN number",
  }),
  radio("business_profile", "has_gst", "Do you have GST registration?", yesNoOptions, {
    required: true,
  }),
  text("business_profile", "gstin", "GSTIN", {
    required: true,
    placeholder: "Enter GSTIN",
    visibleWhenAny: [{ fieldId: "has_gst", value: "Yes" }],
  }),
  text("business_profile", "billing_address_line_1", "Billing Address Line 1", {
    required: true,
  }),
  text("business_profile", "billing_address_line_2", "Billing Address Line 2"),
  text("business_profile", "billing_city", "City", { required: true }),
  text("business_profile", "billing_state", "State", { required: true }),
  text("business_profile", "billing_pincode", "PIN Code", { required: true }),
  text("business_profile", "billing_country", "Country", {
    required: true,
    placeholder: "India",
  }),
  text("business_profile", "primary_contact_name", "Primary Contact Person Name", {
    required: true,
  }),
  text("business_profile", "primary_contact_phone", "Primary Contact Person Phone Number", {
    required: true,
    type: "phone",
    validation: "phone",
  }),
  text("business_profile", "primary_contact_email", "Primary Contact Person Email", {
    required: true,
    type: "email",
    validation: "email",
  }),

  radio(
    "online_presence",
    "business_duration",
    "How long have you been running your business?",
    ["Less than 6 months", "6–12 months", "1–2 years", "2–5 years", "5+ years"],
    { required: true, type: "select" },
  ),
  radio(
    "online_presence",
    "business_time_type",
    "Is this your full-time business or part-time business?",
    ["Full-time", "Part-time"],
    { required: true },
  ),
  textarea(
    "online_presence",
    "part_time_income_source",
    "If part-time, what is your main source of income?",
    {
      required: true,
      placeholder: "Example: job, freelancing, family business, consulting, etc.",
      visibleWhenAny: [{ fieldId: "business_time_type", value: "Part-time" }],
    },
  ),
  radio(
    "online_presence",
    "has_website_or_landing_page",
    "Do you currently have a website or landing page?",
    yesNoOptions,
    { required: true },
  ),
  text("online_presence", "website_or_landing_page_url", "Website / Landing Page URL", {
    required: true,
    type: "url",
    validation: "url",
    placeholder: "https://example.com",
    visibleWhenAny: [{ fieldId: "has_website_or_landing_page", value: "Yes" }],
  }),
  radio(
    "online_presence",
    "has_instagram_linkedin_profiles",
    "Do you have Instagram and LinkedIn profiles for this business?",
    yesNoOptions,
    { required: true },
  ),
  text("online_presence", "instagram_profile", "Instagram Profile", {
    required: true,
    placeholder: "Paste Instagram profile link or handle",
    visibleWhenAny: [{ fieldId: "has_instagram_linkedin_profiles", value: "Yes" }],
  }),
  text("online_presence", "linkedin_profile", "LinkedIn Profile", {
    required: true,
    placeholder: "Paste LinkedIn profile link or handle",
    visibleWhenAny: [{ fieldId: "has_instagram_linkedin_profiles", value: "Yes" }],
  }),
  radio("online_presence", "primary_type", "Who do you primarily sell to?", ["B2C", "B2B"], {
    reviewLabel: "Primary Type",
    required: true,
  }),
  radio(
    "online_presence",
    "b2c_category",
    "Which B2C category best describes your business?",
    b2cCategoryOptions,
    {
      reviewLabel: "B2C Category",
      required: true,
      visibleFor: ["B2C"],
    },
  ),
  text("online_presence", "other_b2c_category", "Please specify your B2C business category", {
    required: true,
    placeholder: "Example: fitness coach, career coach, relationship coach, etc.",
    visibleFor: ["B2C"],
    visibleWhenAny: [{ fieldId: "b2c_category", value: "Other" }],
  }),
  radio(
    "online_presence",
    "b2b_category",
    "Which B2B category best describes your business?",
    b2bCategoryOptions,
    {
      reviewLabel: "B2B Category",
      required: true,
      visibleFor: ["B2B"],
    },
  ),
  text("online_presence", "other_b2b_category", "Please specify your B2B business category", {
    required: true,
    placeholder: "Example: SaaS agency, recruitment agency, legal consultant, etc.",
    visibleFor: ["B2B"],
    visibleWhenAny: [{ fieldId: "b2b_category", value: "Other" }],
  }),

  radio(
    "legacy_business_profile",
    "business_duration",
    "How long have you been running this business?",
    ["Less than 6 months", "6–12 months", "1–2 years", "2–5 years", "5+ years"],
    { required: true, type: "select" },
  ),
  radio(
    "legacy_business_profile",
    "business_time_type",
    "Is this your full-time business or part-time business?",
    ["Full-time", "Part-time"],
    { required: true },
  ),
  textarea("legacy_business_profile", "part_time_income_source", "If part-time, what is your main source of income?", {
    required: true,
    visibleWhenAny: [{ fieldId: "business_time_type", value: "Part-time" }],
  }),
  radio(
    "legacy_business_profile",
    "has_website",
    "Do you currently have a working website or landing page?",
    yesNoOptions,
    { required: true },
  ),
  text("legacy_business_profile", "website_url", "If yes, please share your website/landing page URL.", {
    required: true,
    type: "url",
    validation: "url",
    placeholder: "https://yourwebsite.com",
    visibleWhenAny: [{ fieldId: "has_website", value: "Yes" }],
  }),
  radio(
    "legacy_business_profile",
    "has_instagram",
    "Do you have an Instagram profile for this business?",
    yesNoOptions,
    { required: true },
  ),
  text("legacy_business_profile", "instagram_url", "If yes, please share your Instagram profile link.", {
    type: "url",
    validation: "url",
    placeholder: "https://instagram.com/yourhandle",
    visibleWhenAny: [{ fieldId: "has_instagram", value: "Yes" }],
  }),
  radio(
    "legacy_business_profile",
    "has_linkedin",
    "Do you have a LinkedIn profile/page for this business?",
    yesNoOptions,
    { required: true },
  ),
  text("legacy_business_profile", "linkedin_url", "If yes, please share your LinkedIn profile/page link.", {
    type: "url",
    validation: "url",
    placeholder: "https://linkedin.com/company/yourpage",
    visibleWhenAny: [{ fieldId: "has_linkedin", value: "Yes" }],
  }),

  radio(
    "registration_billing",
    "business_registered",
    "Is your business currently registered?",
    ["Yes", "No", "In process"],
    { required: true },
  ),
  radio(
    "registration_billing",
    "registration_type",
    "If registered, what is your business registration type?",
    ["Sole Proprietorship", "Partnership Firm", "LLP", "Private Limited", "OPC"],
    {
      required: true,
      type: "select",
      visibleWhenAny: [{ fieldId: "business_registered", value: "Yes" }],
    },
  ),
  text("registration_billing", "pan_number", "PAN Number", {
    required: true,
    placeholder: "Enter business/owner PAN number",
  }),
  radio("registration_billing", "has_gst", "Do you have GST registration?", yesNoOptions, {
    required: true,
  }),
  text("registration_billing", "gstin", "GSTIN", {
    required: true,
    visibleWhenAny: [{ fieldId: "has_gst", value: "Yes" }],
  }),
  text("registration_billing", "proprietor_pan", "Proprietor PAN", {
    visibleWhenAny: [{ fieldId: "registration_type", value: "Sole Proprietorship" }],
  }),
  text(
    "registration_billing",
    "partnership_document_link",
    "Partnership deed / registration document link",
    {
      type: "url",
      validation: "url",
      visibleWhenAny: [{ fieldId: "registration_type", value: "Partnership Firm" }],
    },
  ),
  text("registration_billing", "llpin", "LLPIN", {
    required: true,
    visibleWhenAny: [{ fieldId: "registration_type", value: "LLP" }],
  }),
  text("registration_billing", "cin", "CIN", {
    required: true,
    visibleWhenAny: [
      { fieldId: "registration_type", value: "Private Limited" },
      { fieldId: "registration_type", value: "OPC" },
    ],
  }),
  text("registration_billing", "billing_address_line_1", "Address Line 1", {
    required: true,
  }),
  text("registration_billing", "billing_address_line_2", "Address Line 2"),
  text("registration_billing", "billing_city", "City", { required: true }),
  text("registration_billing", "billing_state", "State", { required: true }),
  text("registration_billing", "billing_pincode", "PIN Code", { required: true }),
  text("registration_billing", "billing_country", "Country", { required: true }),
  text("registration_billing", "billing_contact_name", "Contact Person Name", {
    required: true,
  }),
  text("registration_billing", "billing_contact_phone", "Contact Person Phone Number", {
    required: true,
    type: "phone",
    validation: "phone",
  }),
  text("registration_billing", "billing_contact_email", "Contact Person Email", {
    type: "email",
    validation: "email",
  }),

  text("revenue_reality", "current_monthly_revenue", "What is your current monthly revenue?", {
    type: "currency",
    required: true,
  }),
  text("revenue_reality", "average_offer_price", "What is your average offer price / ticket size?", {
    type: "currency",
    required: true,
  }),
  text(
    "revenue_reality",
    "six_month_revenue_target",
    "What monthly revenue target are you trying to reach in the next 6 months?",
    { type: "currency", required: true },
  ),
  radio(
    "revenue_reality",
    "quality_leads_and_calls_status",
    "Are you getting enough quality leads and sales calls every month?",
    [
      "Yes, consistently",
      "Some months yes, some months no",
      "We get leads, but quality is poor",
      "We are not getting enough leads",
      "We get calls, but they don't convert",
      "Not sure yet",
    ],
    { required: true },
  ),
  textarea(
    "revenue_reality",
    "revenue_goal_blocker",
    "What do you think is stopping you from reaching your revenue goal right now?",
    {
      required: true,
      placeholder:
        "Example: low-quality leads, weak closing, inconsistent follow-ups, not enough sales calls, pricing objections, etc.",
    },
  ),
  textarea("revenue_reality", "attempted_solutions", "What have you already tried to fix this problem?", {
    required: true,
  }),
  textarea(
    "revenue_reality",
    "why_cannot_hit_target_alone",
    "Why do you feel you cannot hit your revenue target alone right now?",
    { required: true },
  ),

  text("pipeline_diagnosis", "qualified_leads_per_month", "How many qualified leads do you currently get per month?", {
    type: "number",
    required: true,
    validation: "number",
  }),
  text("pipeline_diagnosis", "booked_calls_per_day", "How many booked sales calls do you currently get per day?", {
    type: "number",
    required: true,
    validation: "number",
  }),
  radio(
    "pipeline_diagnosis",
    "show_up_ratio",
    "What is your current sales call show-up ratio?",
    ["Below 30%", "30-50%", "50-70%", "70%+", "Not tracking"],
    { required: true },
  ),
  radio(
    "pipeline_diagnosis",
    "previous_sales_call_owner",
    "Who was taking your sales calls before signing up with AmitSells?",
    [
      "I was taking the calls myself",
      "Co-founder/team member",
      "Internal sales person",
      "External closer",
      "No structured sales calls yet",
    ],
    { required: true },
  ),
  radio(
    "pipeline_diagnosis",
    "current_closing_rate",
    "What is your current closing rate?",
    ["Below 5%", "5-10%", "10-20%", "20-30%", "30%+", "Not tracking"],
    { required: true },
  ),
  radio(
    "pipeline_diagnosis",
    "prospect_dropoff_stage",
    "At what stage do most prospects drop off?",
    [
      "Before booking call",
      "After booking but no-show",
      "During the call",
      "After price discussion",
      "During follow-up",
      "After payment link is shared",
      "Not sure",
    ],
    { required: true },
  ),
  textarea(
    "pipeline_diagnosis",
    "after_think_about_it_response",
    "What usually happens after someone says, \"I'll think about it\"?",
    { required: true },
  ),

  textarea("offer_strength", "exact_offer", "What exactly do you sell?", { required: true }),
  textarea(
    "offer_strength",
    "client_transformation",
    "What transformation or outcome does your client get after buying?",
    { required: true },
  ),
  textarea("offer_strength", "problem_solved", "What specific problem does your offer solve?", {
    required: true,
  }),
  textarea("offer_strength", "offer_inclusions", "What is included inside your offer?", {
    required: true,
  }),
  textarea(
    "offer_strength",
    "why_choose_you",
    "Why should someone choose you over competitors or free content?",
    { required: true },
  ),
  textarea("offer_strength", "bad_fit_client", "What type of client is not a good fit?", {
    required: true,
  }),
  textarea(
    "offer_strength",
    "claims_never_to_make",
    "What promises or claims should never be made during sales calls?",
  ),

  textarea("buyer_psychology", "ideal_buyer", "Who is your ideal buyer?", { required: true }),
  textarea("buyer_psychology", "buyer_struggles", "What are their biggest struggles right now?", {
    required: true,
  }),
  textarea(
    "buyer_psychology",
    "buyer_problem_phrases",
    "What phrases do they commonly use to describe their problem?",
    { required: true },
  ),
  textarea("buyer_psychology", "buyer_fears", "What are their biggest fears before buying?", {
    required: true,
  }),
  textarea(
    "buyer_psychology",
    "buyer_desired_result",
    "What result do they secretly want the most?",
    { required: true },
  ),
  textarea("buyer_psychology", "common_objections", "What objections do they commonly give?", {
    required: true,
  }),
  textarea("buyer_psychology", "buyer_questions", "What questions do they ask before buying?", {
    required: true,
  }),
  textarea("buyer_psychology", "what_makes_them_say_yes", "What usually makes them say yes?"),

  radio("proof_assets", "has_testimonials", "Do you have testimonials or case studies?", yesNoOptions, {
    required: true,
  }),
  textarea("proof_assets", "testimonial_links", "If yes, paste testimonial/case study links.", {
    type: "file-link",
    visibleWhenAny: [{ fieldId: "has_testimonials", value: "Yes" }],
  }),
  radio(
    "proof_assets",
    "has_proof_assets",
    "Do you have screenshots, results, video testimonials, or proof assets?",
    yesNoOptions,
    { required: true },
  ),
  textarea("proof_assets", "proof_asset_links", "If yes, paste proof asset links.", {
    type: "file-link",
    visibleWhenAny: [{ fieldId: "has_proof_assets", value: "Yes" }],
  }),
  radio("proof_assets", "has_sales_call_recordings", "Do you have sales call recordings?", yesNoOptions, {
    required: true,
  }),
  textarea("proof_assets", "sales_call_recording_links", "If yes, paste sales call recording links.", {
    type: "file-link",
    visibleWhenAny: [{ fieldId: "has_sales_call_recordings", value: "Yes" }],
  }),
  radio("proof_assets", "has_webinar_recordings", "Do you have webinar recordings?", yesNoOptions, {
    required: true,
  }),
  textarea("proof_assets", "webinar_recording_links", "If yes, paste webinar recording links.", {
    type: "file-link",
    visibleWhenAny: [{ fieldId: "has_webinar_recordings", value: "Yes" }],
  }),
  radio("proof_assets", "has_pitch_deck", "Do you have a pitch deck or offer PDF?", yesNoOptions, {
    required: true,
  }),
  textarea("proof_assets", "pitch_deck_links", "If yes, paste pitch deck/offer PDF links.", {
    type: "file-link",
    visibleWhenAny: [{ fieldId: "has_pitch_deck", value: "Yes" }],
  }),
  radio(
    "proof_assets",
    "has_sales_script",
    "Do you have a sales script or objection-handling document?",
    yesNoOptions,
    { required: true },
  ),
  textarea("proof_assets", "sales_script_links", "If yes, paste sales script/objection document links.", {
    type: "file-link",
    visibleWhenAny: [{ fieldId: "has_sales_script", value: "Yes" }],
  }),
  textarea("proof_assets", "other_sales_material_links", "Paste links to any other useful sales materials.", {
    type: "file-link",
  }),

  field("sales_system", "lead_sources", "Where do your leads currently come from?", {
    type: "multi-select",
    longAnswer: false,
    required: true,
    options: [
      "Instagram",
      "YouTube",
      "LinkedIn",
      "Facebook",
      "Meta Ads",
      "Google Ads",
      "Webinars",
      "Referrals",
      "Email marketing",
      "Cold outreach",
      "WhatsApp community",
      "Telegram community",
      "Other",
    ],
  }),
  textarea("sales_system", "after_lead_interest_process", "What happens after a lead shows interest?", {
    required: true,
  }),
  radio("sales_system", "uses_crm", "Do you use a CRM or tracker?", yesNoOptions, {
    required: true,
  }),
  text("sales_system", "crm_name", "If yes, what CRM/tracker do you use?", {
    visibleWhenAny: [{ fieldId: "uses_crm", value: "Yes" }],
  }),
  textarea("sales_system", "follow_up_process", "How do you currently follow up with prospects?", {
    required: true,
  }),
  textarea(
    "sales_system",
    "post_payment_onboarding",
    "What does the onboarding process look like after payment?",
    { required: true },
  ),
  radio("sales_system", "worked_with_closers_before", "Have you worked with closers before?", yesNoOptions, {
    required: true,
  }),
  textarea(
    "sales_system",
    "previous_closer_experience",
    "If yes, what worked and what did not work?",
    {
      required: true,
      visibleWhenAny: [{ fieldId: "worked_with_closers_before", value: "Yes" }],
    },
  ),

  field("payment_setup", "payment_methods", "How do you currently collect payments?", {
    type: "multi-select",
    longAnswer: false,
    required: true,
    options: [
      "Direct bank transfer",
      "UPI",
      "Razorpay",
      "Cashfree",
      "Instamojo",
      "Stripe",
      "Other",
    ],
  }),
  radio(
    "payment_setup",
    "should_share_payment_details_on_calls",
    "Do you want AmitSells to share bank details or payment links during sales calls?",
    ["Yes", "No", "Not sure yet"],
    { required: true },
  ),
  text("payment_setup", "account_holder_name", "Account Holder Name"),
  text("payment_setup", "bank_name", "Bank Name"),
  text("payment_setup", "bank_account_number", "Account Number"),
  text("payment_setup", "ifsc_code", "IFSC Code"),
  text("payment_setup", "bank_branch_name", "Branch Name"),
  text("payment_setup", "upi_id", "UPI ID"),
  text("payment_setup", "payment_gateway_name", "Payment Gateway Name"),
  text("payment_setup", "payment_link", "Payment Link", {
    type: "url",
    validation: "url",
  }),
  textarea("payment_setup", "checkout_links", "Plan/checkout links"),
  textarea(
    "payment_setup",
    "coupon_or_discount_rules",
    "Any coupon/discount rules closer should know",
  ),

  field("amitsells_fit", "expected_amitsells_support", "What exactly do you want AmitSells to help you with?", {
    type: "multi-select",
    longAnswer: false,
    required: true,
    options: [
      "Take over sales calls",
      "Improve sales scripts",
      "Build objection-handling system",
      "Improve follow-up process",
      "Help with sales positioning",
      "Build complete sales system",
      "All of the above",
    ],
  }),
  textarea(
    "amitsells_fit",
    "collaboration_success_result",
    "What result would make this collaboration successful for you?",
    { required: true },
  ),
  field(
    "amitsells_fit",
    "sales_call_tone",
    "What kind of tone should AmitSells maintain on sales calls?",
    {
      type: "multi-select",
      longAnswer: false,
      required: true,
      options: [
        "Direct",
        "Premium",
        "Consultative",
        "Mentor-like",
        "Emotional",
        "Professional",
        "Calm authority",
      ],
    },
  ),
  radio(
    "amitsells_fit",
    "start_timeline",
    "How soon do you want to start?",
    ["Immediately", "Within 7 days", "Within 15 days", "Within 30 days", "Not sure yet"],
    { required: true },
  ),
  textarea(
    "amitsells_fit",
    "additional_notes_for_amitsells",
    "Is there anything AmitSells must know before taking calls on your behalf?",
  ),
];

export function getPrimaryTypeLabel(primaryType?: string) {
  return primaryTypeOptions.find((option) => option.value === primaryType)?.label ?? "";
}

export function getVisibleSections(primaryType?: PrimaryType | "") {
  return sections.filter((section) => {
    if (!section.visibleFor) return true;
    return primaryType ? section.visibleFor.includes(primaryType) : false;
  });
}

type AnswerLookup = Record<string, unknown>;

function matchesVisibilityRule(question: FormQuestion, answers?: AnswerLookup) {
  if (!question.visibleWhenAny || question.visibleWhenAny.length === 0) return true;
  if (!answers) return false;

  return question.visibleWhenAny.some(
    (rule) => answers[rule.fieldId] === rule.value,
  );
}

export function getVisibleQuestions(primaryType?: PrimaryType | "", answers?: AnswerLookup) {
  const sectionIds = new Set(sections.map((section) => section.id));

  return questions.filter((question) => {
    if (!sectionIds.has(question.section)) return false;

    const primaryTypeMatches = !question.visibleFor
      ? true
      : primaryType
        ? question.visibleFor.includes(primaryType)
        : false;

    return primaryTypeMatches && matchesVisibilityRule(question, answers);
  });
}

export function getSectionQuestions(
  sectionId: string,
  primaryType?: PrimaryType | "",
  answers?: AnswerLookup,
) {
  return getVisibleQuestions(primaryType, answers).filter(
    (question) => question.section === sectionId,
  );
}
