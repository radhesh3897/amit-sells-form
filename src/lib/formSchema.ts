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
  hideWhenEmpty?: boolean;
  googleSheetColumn?: string;
  groupLabel?: string;
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
    id: "buyer_psychology",
    title: "Buyer Psychology",
    description:
      "High-ticket sales is not about explaining features. It is about understanding who the buyer is, what they fear, what they desire, what they doubt, and what makes them take action.",
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
    id: "revenue_reality",
    title: "Current Sales System",
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
    id: "proof_assets",
    title: "Social Assets & Proof",
    description:
      "The stronger your proof and sales assets are, the faster AmitSells can understand your offer, handle objections, and close with confidence.",
    kind: "common",
  },
  {
    id: "sales_system",
    title: "Lead Follow-up & Onboarding System",
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
    visibleWhenAny: [{ fieldId: "business_type", value: "Sole Proprietorship" }],
  }),
  text("business_profile", "firm_pan_number", "Firm PAN Number", {
    required: true,
    placeholder: "Enter firm PAN number",
    visibleWhenAny: [{ fieldId: "business_type", value: "Partnership Firm" }],
  }),
  text("business_profile", "llpin", "LLPIN", {
    required: true,
    placeholder: "Enter LLPIN",
    visibleWhenAny: [{ fieldId: "business_type", value: "LLP" }],
  }),
  text("business_profile", "llp_pan_number", "LLP PAN Number", {
    required: true,
    placeholder: "Enter LLP PAN number",
    visibleWhenAny: [{ fieldId: "business_type", value: "LLP" }],
  }),
  text("business_profile", "cin", "CIN", {
    required: true,
    placeholder: "Enter CIN",
    visibleWhenAny: [
      { fieldId: "business_type", value: "Private Limited" },
      { fieldId: "business_type", value: "OPC" },
    ],
  }),
  text("business_profile", "company_pan_number", "Company PAN Number", {
    required: true,
    placeholder: "Enter company PAN number",
    visibleWhenAny: [
      { fieldId: "business_type", value: "Private Limited" },
      { fieldId: "business_type", value: "OPC" },
    ],
  }),
  radio("business_profile", "has_gst", "Do you have GST registration?", yesNoOptions, {
    required: true,
    visibleWhenAny: [
      { fieldId: "business_type", value: "Sole Proprietorship" },
      { fieldId: "business_type", value: "Partnership Firm" },
      { fieldId: "business_type", value: "LLP" },
      { fieldId: "business_type", value: "Private Limited" },
      { fieldId: "business_type", value: "OPC" },
    ],
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
    "has_instagram_profile",
    "Do you have an Instagram profile for this business?",
    yesNoOptions,
    { required: true },
  ),
  text("online_presence", "instagram_profile", "Instagram Profile", {
    required: true,
    placeholder: "Paste Instagram profile link or handle",
    visibleWhenAny: [{ fieldId: "has_instagram_profile", value: "Yes" }],
  }),
  radio(
    "online_presence",
    "has_linkedin_profile",
    "Do you have a LinkedIn profile for this business?",
    yesNoOptions,
    { required: true },
  ),
  text("online_presence", "linkedin_profile", "LinkedIn Profile", {
    required: true,
    placeholder: "Paste LinkedIn profile link or handle",
    visibleWhenAny: [{ fieldId: "has_linkedin_profile", value: "Yes" }],
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
    "appointment_setting_owner",
    "Do you have an appointment setter, or was your closer setting the appointment too?",
    [
      "We have a separate appointment setter",
      "The closer was also setting appointments",
      "I was setting appointments myself",
      "We do not have a structured appointment-setting process yet",
      "Not sure",
    ],
    { reviewLabel: "Appointment setting owner", required: true },
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

  text("buyer_psychology", "ideal_buyer_age_range", "Age Range", {
    groupLabel: "Who is your ideal buyer?",
    reviewLabel: "Buyer age range",
    required: true,
    placeholder: "Example: 25-40",
  }),
  text("buyer_psychology", "ideal_buyer_demographic", "Demographic", {
    groupLabel: "Who is your ideal buyer?",
    reviewLabel: "Buyer demographic",
    required: true,
    placeholder: "Example: working women, agency founders, salaried professionals",
  }),
  text("buyer_psychology", "ideal_buyer_psychographic", "Psychographic", {
    groupLabel: "Who is your ideal buyer?",
    reviewLabel: "Buyer psychographic",
    required: true,
    placeholder: "Example: ambitious but confused, wants growth, fears failure",
  }),
  text("buyer_psychology", "ideal_buyer_income_range", "Income Range / Paying Capacity", {
    groupLabel: "Who is your ideal buyer?",
    reviewLabel: "Buyer income range / paying capacity",
    required: true,
    placeholder: "Example: Rs. 50,000+/month income or can invest Rs. 1L+",
  }),
  text("buyer_psychology", "ideal_buyer_profession", "Profession", {
    groupLabel: "Who is your ideal buyer?",
    reviewLabel: "Buyer profession",
    required: true,
    placeholder: "Example: coach, trader, agency owner, working professional",
  }),
  text("buyer_psychology", "ideal_buyer_locations", "Targeted Cities / Countries", {
    groupLabel: "Who is your ideal buyer?",
    reviewLabel: "Targeted cities / countries",
    required: true,
    placeholder: "Example: India, UAE, Tier 1 cities, Mumbai, Delhi, Bangalore",
  }),
  textarea(
    "buyer_psychology",
    "ideal_buyer_reason",
    "Why have you chosen the above as your ideal buyer? Why not someone else?",
    { reviewLabel: "Reason for choosing this buyer", required: true },
  ),
  textarea(
    "buyer_psychology",
    "buyer_biggest_struggles",
    "What are their biggest struggles right now?",
    { reviewLabel: "Buyer struggles", required: true },
  ),
  textarea(
    "buyer_psychology",
    "promised_transformation",
    "What transformation are you promising to your ideal buyer?",
    { reviewLabel: "Promised transformation", required: true },
  ),
  text(
    "buyer_psychology",
    "transformation_timeline",
    "How much time do you need to deliver your promised transformation?",
    {
      reviewLabel: "Transformation timeline",
      required: true,
      placeholder: "Example: 30 days, 90 days, 6 months",
    },
  ),
  textarea(
    "buyer_psychology",
    "buyer_problem_phrases",
    "What phrases do they commonly use to describe their problem?",
    { reviewLabel: "Common problem phrases", required: true },
  ),
  textarea(
    "buyer_psychology",
    "buyer_biggest_fears",
    "What are their biggest fears before buying?",
    { reviewLabel: "Biggest fears", required: true },
  ),
  textarea(
    "buyer_psychology",
    "buyer_secretly_wanted_results",
    "What results do they secretly want?",
    { reviewLabel: "Secretly wanted results", required: true },
  ),
  textarea(
    "buyer_psychology",
    "common_buyer_objections",
    "What objections do they commonly give?",
    { reviewLabel: "Common objections", required: true },
  ),
  textarea(
    "buyer_psychology",
    "buyer_questions_before_buying",
    "What questions do they ask before buying?",
    { reviewLabel: "Questions before buying", required: true },
  ),
  textarea(
    "buyer_psychology",
    "what_makes_buyer_say_yes",
    "What usually makes them say yes?",
    { reviewLabel: "What makes them say yes", required: true },
  ),

  textarea("offer_strength", "exact_offer", "What exactly do you sell?", {
    reviewLabel: "Exact offer",
    required: true,
  }),
  textarea("offer_strength", "problem_solved", "What specific problem does your offer solve?", {
    reviewLabel: "Problem solved",
    required: true,
  }),
  textarea("offer_strength", "offer_messaging", "What is the messaging of your offer?", {
    reviewLabel: "Offer messaging",
    required: true,
    placeholder:
      "Example: what promise, positioning, hook, or core message do you use to sell this offer?",
  }),
  textarea("offer_strength", "offer_deliverables", "What are your deliverables?", {
    reviewLabel: "Deliverables",
    required: true,
    placeholder:
      "Example: live calls, recorded modules, templates, audits, reports, implementation support, etc.",
  }),
  text("offer_strength", "delivery_mode", "What is your delivery mode?", {
    reviewLabel: "Delivery mode",
    required: true,
    placeholder:
      "Example: 1:1 calls, group coaching, Zoom, recorded modules, WhatsApp support, DFY service, hybrid, etc.",
  }),
  textarea(
    "offer_strength",
    "delivery_support",
    "What support do you provide during delivery?",
    {
      reviewLabel: "Delivery support",
      required: true,
      placeholder:
        "Example: WhatsApp support, weekly calls, account manager, feedback, implementation reviews, follow-ups, etc.",
    },
  ),
  textarea(
    "offer_strength",
    "why_choose_you",
    "Why should someone choose you over competitors or free content?",
    { reviewLabel: "Why choose you", required: true },
  ),
  textarea("offer_strength", "bad_fit_client", "What type of client is not a good fit?", {
    reviewLabel: "Bad-fit client",
    required: true,
  }),
  textarea(
    "offer_strength",
    "claims_never_to_make",
    "What promises or claims should never be made during sales calls?",
    { reviewLabel: "Claims never to make" },
  ),

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
  radio(
    "sales_system",
    "worked_with_closers_or_agencies_before",
    "Have you worked with closers/agencies before?",
    yesNoOptions,
    { reviewLabel: "Worked with closers/agencies before", required: true },
  ),
  textarea(
    "sales_system",
    "previous_closer_or_agency_experience",
    "If yes, what worked and what did not work?",
    {
      reviewLabel: "Previous closer/agency experience",
      required: true,
      hideWhenEmpty: true,
      visibleWhenAny: [{ fieldId: "worked_with_closers_or_agencies_before", value: "Yes" }],
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
  text("payment_setup", "account_holder_name", "Account Holder Name", {
    required: true,
    visibleWhenAny: [{ fieldId: "payment_methods", value: "Direct bank transfer" }],
  }),
  text("payment_setup", "bank_name", "Bank Name", {
    required: true,
    visibleWhenAny: [{ fieldId: "payment_methods", value: "Direct bank transfer" }],
  }),
  text("payment_setup", "bank_account_number", "Account Number", {
    required: true,
    visibleWhenAny: [{ fieldId: "payment_methods", value: "Direct bank transfer" }],
  }),
  text("payment_setup", "ifsc_code", "IFSC Code", {
    required: true,
    visibleWhenAny: [{ fieldId: "payment_methods", value: "Direct bank transfer" }],
  }),
  text("payment_setup", "bank_branch_name", "Branch Name", {
    required: true,
    visibleWhenAny: [{ fieldId: "payment_methods", value: "Direct bank transfer" }],
  }),
  text("payment_setup", "upi_id", "UPI ID", {
    required: true,
    placeholder: "Example: businessname@upi",
    visibleWhenAny: [{ fieldId: "payment_methods", value: "UPI" }],
  }),
  text("payment_setup", "razorpay_payment_link", "Razorpay Payment Link", {
    required: true,
    type: "url",
    validation: "url",
    placeholder: "Paste Razorpay payment link",
    visibleWhenAny: [{ fieldId: "payment_methods", value: "Razorpay" }],
  }),
  text("payment_setup", "cashfree_payment_link", "Cashfree Payment Link", {
    required: true,
    type: "url",
    validation: "url",
    placeholder: "Paste Cashfree payment link",
    visibleWhenAny: [{ fieldId: "payment_methods", value: "Cashfree" }],
  }),
  text("payment_setup", "instamojo_payment_link", "Instamojo Payment Link", {
    required: true,
    type: "url",
    validation: "url",
    placeholder: "Paste Instamojo payment link",
    visibleWhenAny: [{ fieldId: "payment_methods", value: "Instamojo" }],
  }),
  text("payment_setup", "stripe_payment_link", "Stripe Payment Link", {
    required: true,
    type: "url",
    validation: "url",
    placeholder: "Paste Stripe payment link",
    visibleWhenAny: [{ fieldId: "payment_methods", value: "Stripe" }],
  }),
  text("payment_setup", "other_payment_method", "Please specify other payment method", {
    required: true,
    visibleWhenAny: [{ fieldId: "payment_methods", value: "Other" }],
  }),
  textarea("payment_setup", "other_payment_details", "Other Payment Link / Details", {
    required: true,
    placeholder: "Add payment link, instructions, or details",
    visibleWhenAny: [{ fieldId: "payment_methods", value: "Other" }],
  }),
  textarea(
    "payment_setup",
    "coupon_or_discount_rules",
    "Any coupon/discount rules closer should know?",
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
  field(
    "amitsells_fit",
    "information_accuracy_consent",
    "I hereby confirm that all the information provided in this form is correct to the best of my knowledge, and I allow AmitSells to use this information to understand my business, improve the sales process, and help increase the revenue of my business.",
    {
      type: "checkbox",
      longAnswer: false,
      reviewLabel: "Information accuracy consent",
      required: true,
      requiredMessage: "Please confirm that the information provided is correct.",
    },
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
    (rule) => {
      const answer = answers[rule.fieldId];
      return Array.isArray(answer)
        ? answer.includes(rule.value)
        : answer === rule.value;
    },
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
