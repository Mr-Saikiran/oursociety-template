# Customizing OurSociety for your community

Everything that is specific to one society is in the `society/` folder:

| File | What to change |
| --- | --- |
| `society/config.ts` | Name, address, registration number, number of units, maintenance rate, currency and locale, unit and block terms, layout, landmarks, gates, map location, request categories |
| `society/data.ts` | Committee, meetings and minutes, balance sheets, maintenance records, amenities, rentals, sample requests |
| `society/data-extra.ts` | Ledger, visitors, notices, documents, contacts, polls |

The record shapes are defined in [`lib/types.ts`](../lib/types.ts). Your editor shows an error if a field is missing or misspelled.

## Words: units and blocks

Societies use different words for their homes and the groups they sit in. Set them once in `terms`, and the whole app uses them:

```ts
// Apartment complex
terms: { unit: 'Flat', units: 'flats', block: 'Tower', blocks: 'towers' }

// Plotted layout
terms: { unit: 'Plot', units: 'plots', block: 'Road', blocks: 'lanes' }
```

In the data files, the fields are always named `plotNo` (the unit number) and `road` (the block it is in), whatever words you choose.

## Layout

`layout` lists every block in groups. The Layout Plan page draws these groups, and `landmarks` highlights the blocks that have common facilities:

```ts
layout: [
  { group: 'Phase 1', blocks: ['T1', 'T2', 'T3'] },
  { group: 'Phase 2', blocks: ['T4', 'T5'] },
],
landmarks: { T1: 'Clubhouse', T4: 'Pool' },
```

## Money and dates

Set `currency` to an ISO 4217 code (`INR`, `USD`, `GBP`, `AED`, …) and `locale` to a language tag (`en-IN`, `en-US`, `en-GB`, …). When the currency is INR, large amounts show as lakh and crore (₹3.51 L). Other currencies use compact notation ($35K).

## Which data is editable in the app

When the database is empty, these collections start from your seed data. After that, members edit them in the app, and changing the seed data has no effect:

- Requests, visitors, notices, ledger, polls, amenity bookings, maintenance records and bill runs.

These are read straight from the seed files. To change them, edit the file and redeploy:

- Committee, meetings, finances, documents, contacts, amenities, rentals, and the association-wide totals in `maintenanceSummary`.

To start with an empty list, set it to `[]`.

## Starting over

- **Locally:** delete the `.data` folder.
- **On Vercel:** delete the `db/` files in your Blob store from the Vercel dashboard (**Storage → your store → Browser**). The app then starts again from the seed data, and the first admin must be created again.

## Branding

- **App name:** `appName` in `society/config.ts`.
- **Sidebar logo:** put a square image in `public/` and set `logo` to its path.
- **App icons:** replace `public/icon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` and `apple-icon.png`.
- **Colors:** edit the CSS variables at the top of `app/globals.css`. `--primary` is the main brand color, and the `.dark` block holds the dark theme.

## Privacy

If your repository is public, everything in `society/` is public too. Do not commit residents' phone numbers, dues or other personal details to a public repository. Either keep your copy private, or keep the seed files minimal and enter real records in the app. Records entered in the app are stored in your private Blob store, not in Git.
