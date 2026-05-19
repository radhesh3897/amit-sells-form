# AmitSells Onboarding

A premium, schema-driven onboarding form for AmitSells, built with Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod, Framer Motion, localStorage autosave, and a mock submission API.

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

V1 does not need Google credentials. Copy `.env.example` to `.env.local` only when you are ready to add the final Google Sheets integration.

```bash
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SHEETS_SHEET_NAME="Onboarding Responses"
```

## Submission Architecture

The form posts to:

```text
POST /api/submit-onboarding
```

For v1, the route receives the payload, adds the timestamp and category context, flattens important fields, logs the prepared submission on the server, and returns success.

Submission logic lives in:

```text
src/lib/submissionService.ts
```

Google Sheets can be connected later inside `submitOnboardingForm`, `flattenFormAnswers`, or `prepareGoogleSheetRow` without changing the form UI.

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

## Google Sheets Setup Later

When moving beyond the mock submission:

1. Create a Google Cloud service account.
2. Enable the Google Sheets API.
3. Share the target sheet with the service account email.
4. Add credentials to `.env.local`.
5. Replace the mock body of `submitOnboardingForm` in `src/lib/submissionService.ts` with the Sheets append call.

Suggested columns are already prepared by `prepareGoogleSheetRow`: timestamp, full name, email, phone, city, country, business name, primary type, business category, current designation, links, revenue fields, offer description, primary challenge, expectations, and `all_answers_json`.

## Deploy

Deploy as a standard Next.js app. On Vercel, import the repository, keep the build command as `npm run build`, and add Google Sheets environment variables only when the final integration is enabled.
