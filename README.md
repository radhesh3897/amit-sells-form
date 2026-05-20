# AmitSells Onboarding

A premium, schema-driven onboarding form for AmitSells, built with Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod, Framer Motion, localStorage autosave, and server-side Google Sheets submission.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Useful Scripts

```bash
npm run lint
npm run build
npm run test
```

## Environment

Copy `.env.example` to `.env.local` and add your Google Sheets service account values.

```bash
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SHEETS_SHEET_NAME="Onboarding Responses"
GOOGLE_APPS_SCRIPT_WEBHOOK_URL=
```

For the simplest setup, use `GOOGLE_APPS_SCRIPT_WEBHOOK_URL`. The app will send submissions to that Apps Script endpoint from the server. If no Apps Script URL is set, it can fall back to service-account Google Sheets credentials.

## Submission Architecture

The form posts to:

```text
POST /api/submit-onboarding
```

The route receives the payload, adds the timestamp and category context, flattens important fields, and sends it to the configured Apps Script webhook from the server. If no Apps Script URL is configured, it can append directly to Google Sheets using service-account credentials. If neither is configured, the route logs the prepared submission on the server and still returns success for development.

Submission logic lives in:

```text
src/lib/submissionService.ts
```

Apps Script submission logic lives in `src/lib/appsScript.ts`. Direct Google Sheets logic lives in `src/lib/googleSheets.ts`; form flattening and row preparation live in `src/lib/submissionService.ts`.

## Editing Questions

Questions and section visibility live in:

```text
src/lib/formSchema.ts
```

Each question supports `id`, `label`, `description`, `placeholder`, `type`, `required`, `section`, `visibleFor`, `options`, `validation`, `longAnswer`, and `googleSheetColumn`.

To add a primary-type-only question, add it to the right section and set:

```ts
visibleFor: ["B2C"]
```

## Logo

Place the AmitSells logo here:

```text
public/logo.png
```

If the file is missing, the UI automatically shows an `AS` placeholder while keeping the code ready for the real logo.

## Google Sheets Setup

### Apps Script Webhook

1. Deploy your Apps Script as a Web App.
2. Put the Web App URL into `GOOGLE_APPS_SCRIPT_WEBHOOK_URL`.
3. Add the same env var in Vercel Project Settings.

### Service Account Fallback

1. Create a Google Cloud service account.
2. Enable the Google Sheets API.
3. Share the target sheet with the service account email.
4. Add credentials to `.env.local`.
5. Put the spreadsheet ID from the Google Sheet URL into `GOOGLE_SHEETS_SPREADSHEET_ID`.
6. Keep the sheet tab name in `GOOGLE_SHEETS_SHEET_NAME`.

On the first submission to an empty tab, the app writes the header row automatically. Every later submission is appended as a new row.

## Deploy

Deploy as a standard Next.js app. On Vercel, import the repository, keep the build command as `npm run build`, and add the Google Sheets environment variables in Project Settings.
