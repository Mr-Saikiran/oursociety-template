# OurSociety

A free, open-source app for housing societies, resident welfare associations and gated communities. It gives residents one place for dues, notices, requests and committee information. Committee members get a simple admin area to keep it up to date.

It runs as a website, and it installs on Android and iPhone from the same code.

**Live demo:** [techswitch.in/oursociety](https://techswitch.in/oursociety/). It is read-only and shows the fictional demo data.

## Features

| Area | What it does |
| --- | --- |
| Dashboard | Collection status, latest notices, open requests and the next meeting |
| Maintenance | Paid and pending dues for each unit; record payments |
| Bills | Generate a maintenance bill run for every unit |
| Accounting | Income and expense ledger with category totals |
| Finances & Audit | Monthly, annual and festival balance sheets |
| Requests | Resident complaints with tickets, status and update history |
| Visitors | Expected visitors and gate status |
| Notices | Announcements for everyone or for specific blocks |
| Polls | Online votes with one vote per member |
| Amenities | Facilities and slot booking |
| Committee, Meetings, Documents, Contacts, Rentals, Layout Plan | Reference information about the society |
| Search and notifications | Search across everything with Ctrl K; unread notification badge |
| Admin and roles | Visitors can only read. Signed-in committee members can edit. Admins manage members in Settings |
| Dark mode | Light, dark or system theme |

## Make it yours in 5 steps

1. **Create your copy.** Select **Use this template** on GitHub (or fork the repository).
2. **Describe your society.** Edit [`society/config.ts`](society/config.ts): name, address, number of units, maintenance rate, currency, and what you call your units and blocks (for example Flat / Tower or Plot / Road).
3. **Add your data.** Replace the demo records in [`society/data.ts`](society/data.ts) and [`society/data-extra.ts`](society/data-extra.ts), or start with empty lists and add everything in the app. See [docs/CUSTOMIZE.md](docs/CUSTOMIZE.md).
4. **Deploy to Vercel.** Follow the steps in [Deploy](#deploy). The free Hobby plan is enough for most societies.
5. **Create the first admin.** Open `/login` on your site, enter your `SETUP_CODE`, and create the admin account. Then add committee members in **Settings**.

The demo data describes **Green Meadows**, a made-up community. Every name and phone number in it is fictional.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMr-Saikiran%2Foursociety-template&project-name=oursociety&env=SESSION_SECRET,SETUP_CODE&envDescription=SESSION_SECRET%20signs%20sign-in%20cookies%20(any%20long%20random%20string).%20SETUP_CODE%20is%20a%20one-time%20code%20to%20create%20the%20first%20admin.&stores=%5B%7B%22type%22%3A%22blob%22%7D%5D)

The button copies the repository, asks for the two secrets, and creates a Blob store. If you deploy another way:

1. Import the repository in Vercel.
2. In **Storage**, create a **Blob** store and connect it to the project. Vercel adds `BLOB_READ_WRITE_TOKEN` for you.
3. In **Settings → Environment Variables**, add:
   - `SESSION_SECRET`: a long random string. You can generate one with `openssl rand -base64 32`.
   - `SETUP_CODE`: a one-time code that you choose. You enter it to create the first admin.
4. Redeploy.

To give the site a name such as `greenmeadows.vercel.app`, rename the project or add a domain under **Settings → Domains**.

## Run it on your computer

You need Node.js 22 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000. On your computer, the app stores data in `.data/*.json`, and the setup code is `dev-setup`. To start again from the seed data, delete the `.data` folder.

## Static read-only demo

To show the app on any static host, such as GitHub Pages, Cloudflare or an existing website, export a read-only copy of the seed data:

```bash
npm run build:static -- --base /oursociety
```

This writes plain HTML, CSS and JavaScript to `out/`. Upload the files to the `/oursociety/` folder of your site. To serve the demo from the root of a domain, leave out `--base`. The static demo has no sign-in or database, so the edit controls are replaced by a read-only notice.

## Mobile apps

The Android and iOS apps are thin shells around your website. When you deploy a website update, the apps show it the next time they open. You don't need to rebuild them. See [docs/MOBILE.md](docs/MOBILE.md) to build an APK for Android or an IPA for iOS with your society's name and address.

## How it works

- **Next.js 16** (App Router) with React 19, Tailwind CSS 4 and shadcn/ui.
- **Storage:** each collection is one private JSON document in [Vercel Blob](https://vercel.com/docs/storage/vercel-blob). If two people save at the same moment, neither change overwrites the other (optimistic concurrency with ETags). See [`lib/db.ts`](lib/db.ts).
- **Accounts:** passwords are hashed with scrypt. Sessions use a signed, HTTP-only cookie. There are two roles: *admin* (manages members) and *editor* (edits data). Everyone else has read-only access.
- **Society-specific details** are all in `society/`. The rest of the code is the same for every community. To get improvements from this template later, merge it into your copy; your `society/` folder rarely conflicts.

## Contributing

Bug reports, ideas and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). If you run OurSociety for your community, please open a discussion and tell us. It helps us decide what to build next.

## License

[MIT](LICENSE). You can use it, change it and run it for any community, free of charge.
