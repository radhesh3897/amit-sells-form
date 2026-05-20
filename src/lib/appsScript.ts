export interface AppsScriptSubmitResult {
  enabled: boolean;
  ok: boolean;
  message: string;
  status?: number;
}

export interface AppsScriptSubmissionBody {
  row: Record<string, unknown>;
  payload: unknown;
  [key: string]: unknown;
}

function getAppsScriptWebhookUrl() {
  return process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL?.trim() || "";
}

export async function submitToAppsScript(
  body: AppsScriptSubmissionBody,
): Promise<AppsScriptSubmitResult> {
  const webhookUrl = getAppsScriptWebhookUrl();

  if (!webhookUrl) {
    return {
      enabled: false,
      ok: false,
      message: "Google Apps Script webhook URL is missing.",
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(body),
    redirect: "follow",
  });

  const responseText = await response.text();

  if (!response.ok) {
    return {
      enabled: true,
      ok: false,
      status: response.status,
      message:
        responseText ||
        `Google Apps Script returned status ${response.status}.`,
    };
  }

  return {
    enabled: true,
    ok: true,
    status: response.status,
    message: responseText || "Submission sent to Google Apps Script.",
  };
}
