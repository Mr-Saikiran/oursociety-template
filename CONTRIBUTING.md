# Contributing

Thanks for helping make OurSociety better for more communities.

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000 with the Green Meadows demo data. Local data is stored in `.data/`, and the setup code for the first admin is `dev-setup`.

Before you open a pull request, run these checks:

```bash
npx tsc --noEmit
npm run build
```

## Guidelines

- **Keep society details out of app code.** Names, terms (Plot/Flat, Road/Tower), currency and dates must come from `society/config.ts`. A feature should work for any community with only a config change.
- **Use only fictional data.** The demo data must stay fictional. Never add real people's names, phone numbers or dues.
- **Follow the patterns already in the code.** Server components load data with `lib/repo.ts`. Edits go through server actions in `app/actions/`, which check the user's role. UI components come from `components/ui` (shadcn/ui).
- **Keep pull requests small.** One feature or fix per pull request is easier to review.

## Ideas we'd welcome

- Make the remaining static modules editable in the app (committee, meetings, documents, contacts, rentals).
- Send bills and notices by email, SMS or WhatsApp.
- Upload files for documents and notice attachments.
- Let residents sign in to see their own dues.
- Translate the interface into more languages.
