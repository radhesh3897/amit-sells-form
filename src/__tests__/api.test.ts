import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/submit-onboarding/route";

describe("POST /api/submit-onboarding", () => {
  it("receives a full payload and returns a mock success response", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});

    const request = new Request("http://localhost/api/submit-onboarding", {
      method: "POST",
      body: JSON.stringify({
        primaryType: "B2C",
        businessCategory: "Stock Market Coach",
        otherBusinessCategory: "",
        businessName: "AmitSells",
        currentDesignation: "Founder",
        currentCity: "Jaipur",
        currentState: "Rajasthan",
        completedSections: ["quick_identity"],
        progressPercent: 42,
        answersBySection: {
          "Basic Details": {
            "Full name": "Amit Test",
          },
        },
        answers: {
          full_name: "Amit Test",
          email: "amit@example.com",
          phone: "+91 98765 43210",
          current_city: "Jaipur",
          current_state: "Rajasthan",
          business_registered: "Yes",
          business_type: "Sole Proprietorship",
          business_trade_name: "AmitSells",
          current_designation: "Founder",
          pan_number: "ABCDE1234F",
          has_gst: "No",
          billing_address_line_1: "A 101, Green Street",
          billing_city: "Mumbai",
          billing_state: "Maharashtra",
          billing_pincode: "400001",
          billing_country: "India",
          primary_contact_name: "Amit Test",
          primary_contact_phone: "+91 98765 43210",
          primary_contact_email: "contact@example.com",
          business_duration: "1–2 years",
          business_time_type: "Full-time",
          has_website_or_landing_page: "No",
          has_instagram_profile: "No",
          has_linkedin_profile: "No",
          primary_type: "B2C",
          b2c_category: "Stock Market Coach",
        },
        rawJson: {
          source: "test",
        },
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.submission.googleSheetRow.full_name).toBe("Amit Test");
    expect(json.submission.googleSheetRow.current_city).toBe("Jaipur");
    expect(json.submission.googleSheetRow.current_state).toBe("Rajasthan");
    expect(json.submission.googleSheetRow.business_trade_name).toBe("AmitSells");
    expect(json.submission.googleSheetRow.primary_contact_email).toBe(
      "contact@example.com",
    );
    expect(json.submission.googleSheetRow.business_duration).toBe("1–2 years");
    expect(json.submission.googleSheetRow.b2c_category).toBe("Stock Market Coach");
    expect(info).toHaveBeenCalled();

    info.mockRestore();
  });
});
