# Loja2

Premium eyewear storefront built with Astro.

The current version uses:

- Astro for the frontend and server routes
- JSON files for product data
- a lightweight password-gated admin panel
- image uploads saved inside `public/images`
- WhatsApp as the main checkout flow

## What is in this project

- Home page with hero, products, trust section, FAQ, and WhatsApp CTA
- Admin login at `/admin`
- Admin dashboard at `/admin-panel`
- Product CRUD through API routes
- Image upload endpoint for product photos

## Local setup

```bash
pnpm install
pnpm dev
```

Environment variables:

- `ADMIN_PASSWORD`
- `SESSION_SECRET`

Copy `.env.example` to `.env` and update both values before using the admin panel in development.

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
```

## Important note

This project currently stores products in JSON and uploads images to the local filesystem. That is simple and fast, but it is not ideal for serverless hosting when writes must persist after a redeploy.

If you want a deployment-ready version for Vercel, use the Supabase plan described in `supabase-version.md`.
