# Sankalpdham

## Local Supabase and admin

The admin dashboard is at `/admin`; sign in at `/admin/login`. The app uses the
local Supabase stack defined in `supabase/config.jsonc`. Start it with Docker
Desktop running:

```sh
supabase start
supabase migration up
supabase status
```

The current local RBAC migration creates `super_admin` and `admin` roles and
their permissions. The bootstrap process creates a local super admin using
`npm run seed:admin`. In this workspace, its generated password is stored in
the ignored `.env.local` file under `ADMIN_PASSWORD`; use
`admin@sankalpdham.local` to sign in. Do not commit or share `.env.local`.

The app connects to Supabase using `NEXT_PUBLIC_SUPABASE_URL` and a public
publishable/anon key. `SUPABASE_SERVICE_ROLE_KEY` is used only by the local
bootstrap script and must never be exposed in a `NEXT_PUBLIC_` variable.
Supabase Studio is available at `http://127.0.0.1:54323`.

Useful local database commands:

```sh
supabase status              # inspect services and local key names
supabase migration new name  # create a database migration
supabase migration up        # apply pending migrations
supabase stop                # stop local services; data is retained
supabase db reset             # destructive: recreate the local database
```

Run the app with `npm run dev`, then open `http://localhost:3000/admin`.

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
