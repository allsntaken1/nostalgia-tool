This is a Next.js app for the Nostalgia.exe archive.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Storage

The app supports two storage modes:

- Local development fallback: `data/archive.json`, `data/submissions.json`, and `public/uploads/pending`.
- Supabase live storage: Postgres tables plus a Storage bucket.

For live deploys, create a Supabase project, run `supabase-schema.sql` in the SQL editor, and create a public Storage bucket named `nostalgia-uploads`.

Set these environment variables in Vercel or `.env.local`:

```bash
SERPAPI_KEY=
ADMIN_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=nostalgia-uploads
```

When the Supabase variables are present, `/api/archive` and `/api/submissions` use Supabase. When they are missing, the app keeps working locally with JSON/files.

## Upload And Admin Safety

Public uploads are accepted only as JPG, PNG, or WebP files up to 8 MB. Community uploads go into the pending queue and do not appear publicly until approved.

Admin-only API actions require `ADMIN_SECRET` through the `x-admin-secret` header. The admin pages send this after the passcode unlock. For production, set `ADMIN_SECRET` to a long random value and set the same value as `NEXT_PUBLIC_ADMIN_PASSCODE` only if you are keeping this simple passcode flow for launch.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
