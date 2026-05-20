import { google } from "googleapis";

type SheetRow = Record<string, unknown>;

interface GoogleSheetsConfig {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
  sheetName: string;
}

export interface GoogleSheetsAppendResult {
  enabled: boolean;
  message: string;
  spreadsheetId?: string;
  sheetName?: string;
}

function getGoogleSheetsConfig(): GoogleSheetsConfig | null {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME?.trim() || "Onboarding Responses";

  if (!clientEmail || !privateKey || !spreadsheetId) return null;

  return {
    clientEmail,
    privateKey,
    spreadsheetId,
    sheetName,
  };
}

function toCellValue(value: unknown) {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function quoteSheetName(sheetName: string) {
  return `'${sheetName.replace(/'/g, "''")}'`;
}

function columnLetter(columnNumber: number) {
  let value = columnNumber;
  let letters = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    value = Math.floor((value - 1) / 26);
  }

  return letters;
}

async function ensureHeaderRow(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  sheetName: string,
  headers: readonly string[],
) {
  const quotedSheetName = quoteSheetName(sheetName);
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${quotedSheetName}!1:1`,
  });

  const firstRow = existing.data.values?.[0] ?? [];
  const hasHeaders = firstRow.some((cell) => String(cell).trim().length > 0);
  if (hasHeaders) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${quotedSheetName}!A1:${columnLetter(headers.length)}1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [Array.from(headers)],
    },
  });
}

export async function appendOnboardingRowToGoogleSheet(
  row: SheetRow,
  columns: readonly string[],
): Promise<GoogleSheetsAppendResult> {
  const config = getGoogleSheetsConfig();

  if (!config) {
    return {
      enabled: false,
      message:
        "Google Sheets credentials are missing. Submission was logged on the server only.",
    };
  }

  const headers = ["timestamp", ...columns, "all_answers_json"];
  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const quotedSheetName = quoteSheetName(config.sheetName);

  await ensureHeaderRow(sheets, config.spreadsheetId, config.sheetName, headers);

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: `${quotedSheetName}!A:${columnLetter(headers.length)}`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [headers.map((header) => toCellValue(row[header]))],
    },
  });

  return {
    enabled: true,
    message: "Submission saved to Google Sheets.",
    spreadsheetId: config.spreadsheetId,
    sheetName: config.sheetName,
  };
}
