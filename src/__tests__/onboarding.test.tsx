import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OnboardingApp } from "@/components/onboarding/OnboardingApp";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ""} />;
  },
}));

async function startOnboarding(user: ReturnType<typeof userEvent.setup>) {
  render(<OnboardingApp />);
  await user.click(await screen.findByRole("button", { name: /start onboarding/i }));
}

function setField(label: Parameters<typeof screen.getByLabelText>[0], value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function fillQuickIdentity() {
  setField(/full name/i, "Amit Buyer");
  setField(/phone/i, "+91 98765 43210");
  setField(/^email/i, "buyer@example.com");
  setField(/current city/i, "Jaipur");
  setField(/current state/i, "Rajasthan");
}

async function fillSection2(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole("heading", { name: /business registration & billing details/i });
  await user.click(screen.getAllByRole("radio", { name: "Yes" })[0]);
  await user.selectOptions(screen.getByLabelText(/what is your business type/i), "Sole Proprietorship");
  setField(/business \/ trade name/i, "AmitSells");
  setField(/current designation/i, "Founder");
  setField(/pan number/i, "ABCDE1234F");
  await user.click(screen.getAllByRole("radio", { name: "No" })[1]);
  setField(/billing address line 1/i, "A 101, Green Street");
  setField(/^city/i, "Mumbai");
  setField(/^state/i, "Maharashtra");
  setField(/pin code/i, "400001");
  setField(/^country/i, "India");
  setField(/primary contact person name/i, "Amit Buyer");
  setField(/primary contact person phone/i, "+91 98765 43210");
  setField(/primary contact person email/i, "contact@example.com");
}

async function fillSection3(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole("heading", { name: /business profile & online presence/i });
  await user.selectOptions(
    screen.getByLabelText(/how long have you been running your business/i),
    "1–2 years",
  );
  await user.click(screen.getByRole("radio", { name: "Full-time" }));
  await user.click(screen.getAllByRole("radio", { name: "No" })[0]);
  await user.click(screen.getAllByRole("radio", { name: "No" })[1]);
  await user.click(screen.getAllByRole("radio", { name: "No" })[2]);
  await user.click(screen.getByRole("radio", { name: "B2C" }));
  await user.click(await screen.findByRole("radio", { name: /stock market coach/i }));
}

describe("AmitSells onboarding app", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("loads the welcome screen and starts onboarding", async () => {
    const user = userEvent.setup();
    await startOnboarding(user);

    expect(await screen.findByRole("heading", { name: /quick identity/i })).toBeInTheDocument();
  });

  it("shows required validation before continuing", async () => {
    const user = userEvent.setup();
    await startOnboarding(user);

    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    expect(await screen.findAllByText("This field is required.")).toHaveLength(5);
  });

  it("moves into Section 2 and updates autosave/progress", async () => {
    const user = userEvent.setup();
    await startOnboarding(user);

    fillQuickIdentity();
    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    expect(
      await screen.findByRole("heading", { name: /business registration & billing details/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/% completed/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(window.localStorage.getItem("amitsells:onboarding:v1")).toContain(
        "Amit Buyer",
      );
    });
  });

  it("shows only the requested Quick Identity fields", async () => {
    const user = userEvent.setup();
    await startOnboarding(user);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current state/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/business name/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/who do you primarily sell to/i)).not.toBeInTheDocument();
  });

  it("shows review answers and calls the mock API on submit", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    await startOnboarding(user);
    fillQuickIdentity();
    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    await fillSection2(user);
    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    await fillSection3(user);
    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    fireEvent.change(await screen.findByLabelText(/age range/i), {
      target: { value: "25-40" },
    });
    setField(/demographic/i, "High-ticket service founders");
    setField(/psychographic/i, "Ambitious but unclear on sales systems");
    setField(/income range/i, "Can invest Rs. 1L+");
    setField(/^profession/i, "Coach or agency owner");
    setField(/targeted cities/i, "India, UAE, Mumbai, Delhi");
    setField(/why have you chosen/i, "They have urgency, capacity, and a clear revenue gap.");
    setField(/biggest struggles/i, "Low conversion and inconsistent follow-up.");
    setField(/transformation are you promising/i, "A predictable sales conversion system.");
    setField(/how much time/i, "90 days");
    setField(/phrases/i, "Leads are coming but not buying.");
    setField(/biggest fears/i, "Wasting money.");
    setField(/secretly want/i, "Predictable clients.");
    setField(/objections/i, "Price and timing.");
    setField(/questions/i, "Will this work for me?");
    setField(/usually makes them say yes/i, "Trust, urgency, and proof.");
    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    fireEvent.change(await screen.findByLabelText(/what exactly do you sell/i), {
      target: { value: "Premium coaching program." },
    });
    setField(/specific problem/i, "Revenue leakage.");
    setField(/messaging of your offer/i, "Build a predictable high-ticket sales system.");
    setField(/deliverables/i, "Live calls, templates, reviews.");
    setField(/delivery mode/i, "Zoom calls and WhatsApp support.");
    setField(/support do you provide/i, "Weekly calls and implementation feedback.");
    setField(/choose you/i, "Strong proof and sharper positioning.");
    setField(/not a good fit/i, "People who will not implement.");
    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    fireEvent.change(await screen.findByLabelText(/what is your current monthly revenue/i), {
      target: { value: "500000" },
    });
    setField(/average offer price/i, "50000");
    setField(/next 6 months/i, "2000000");
    await user.click(screen.getByRole("radio", { name: /not sure yet/i }));
    setField(/stopping you from reaching your revenue goal/i, "Weak closing and inconsistent follow-ups.");
    setField(/already tried/i, "Scripts and manual follow-ups.");
    setField(/cannot hit your revenue target alone/i, "I am too founder-dependent.");
    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    fireEvent.change(await screen.findByLabelText(/qualified leads/i), {
      target: { value: "100" },
    });
    setField(/booked sales calls/i, "5");
    await user.click(screen.getByRole("radio", { name: "50-70%" }));
    await user.click(screen.getByRole("radio", { name: /i was taking the calls myself/i }));
    await user.click(screen.getByRole("radio", { name: /i was setting appointments myself/i }));
    await user.click(screen.getByRole("radio", { name: "10-20%" }));
    await user.click(screen.getByRole("radio", { name: /during follow-up/i }));
    setField(/i'll think about it/i, "Follow-up becomes inconsistent.");
    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    for (const option of await screen.findAllByRole("radio", { name: "No" })) {
      await user.click(option);
    }
    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    await user.click(await screen.findByRole("checkbox", { name: "Instagram" }));
    setField(/after a lead shows interest/i, "They are invited to book a call.");
    await user.click(screen.getAllByRole("radio", { name: "No" })[0]);
    setField(/follow up with prospects/i, "Manual WhatsApp follow-ups.");
    setField(/onboarding process/i, "Payment, welcome message, onboarding form.");
    await user.click(screen.getAllByRole("radio", { name: "No" })[1]);
    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    await user.click(await screen.findByRole("checkbox", { name: "UPI" }));
    setField(/upi id/i, "amitsells@upi");
    await user.click(screen.getByRole("radio", { name: /not sure yet/i }));
    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    await user.click(await screen.findByRole("checkbox", { name: /all of the above/i }));
    setField(
      /result would make this collaboration successful/i,
      "Higher closing rate and cleaner follow-up.",
    );
    await user.click(screen.getByRole("radio", { name: /within 7 days/i }));
    await user.click(screen.getByRole("checkbox", { name: /i hereby confirm/i }));
    await user.click(screen.getByRole("button", { name: /review answers/i }));

    expect(await screen.findByRole("heading", { name: /review your answers/i })).toBeInTheDocument();
    expect(screen.getAllByText("Amit Buyer").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /submit onboarding form/i }));

    expect(await screen.findByText("Your onboarding form has been submitted.")).toBeInTheDocument();
    expect(window.fetch).toHaveBeenCalledWith(
      "/api/submit-onboarding",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
