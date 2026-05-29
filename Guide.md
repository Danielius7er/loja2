# Guide for Vercel

This project can be deployed to Vercel, but the current JSON-based admin flow has an important limitation: image uploads are written to the local filesystem in `public/images`.

That works well for local development and persistent servers, but Vercel deployments are serverless and do not preserve local writes between invocations or redeploys.

## Recommended use on Vercel

Use Vercel for:

- the public storefront
- preview deployments
- static marketing pages
- testing the UI

Avoid depending on it for:

- persistent product storage in JSON files
- long-term image uploads saved on disk
- admin workflows that must survive redeploys without external storage

## Build settings

- Framework preset: Astro
- Build command: `pnpm build`
- Output directory: `dist`
- Install command: `pnpm install`

## Environment variables

Set these in the Vercel project settings:

- `ADMIN_PASSWORD`
- `SESSION_SECRET`

## Deployment steps

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Set the framework preset to Astro if Vercel does not detect it automatically.
4. Add the environment variables.
5. Deploy.

## Operational warning

If you keep the current admin and upload system on Vercel, new uploaded images and JSON changes should be treated as temporary. For a production-grade setup, move storage to Supabase or another persistent backend.
