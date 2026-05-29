# JSON Admin: Advantages and Disadvantages

This document describes the current site architecture:

- Astro frontend
- JSON product storage
- password-gated admin panel
- image upload endpoint that saves files in `public/images`
- WhatsApp checkout flow

## Advantages

- Very simple to understand and maintain
- No external database required
- Fast to prototype
- Easy to inspect product data directly in `src/data/products.json`
- Low setup cost
- Good fit for small catalogs
- Admin flow stays lightweight
- Image upload is straightforward because files are written directly to the project structure

## Disadvantages

- Not ideal for multi-user editing
- Product writes are not durable on serverless hosting
- Uploaded images can disappear after redeploys depending on the host
- Harder to scale beyond a small catalog
- No built-in history, audit trail, or rollback per record
- Concurrency is weak if multiple admins edit at the same time
- JSON files can become messy as product counts grow
- The admin panel must manage file writes carefully to avoid corruption

## Current site information

- Brand name: Cavilson Ferreira
- Tagline: Soft Eyewear
- Contact email: `contactocavilsonferreira@gmail.com`
- Default product price: `10700`
- Current product images:
  - `/images/logo.jpg`
  - `/images/produto-castanho.png`
  - `/images/produto-preto.png`
  - `/images/produto-vintage.png`

## Admin and upload flow

1. The user opens `/admin`.
2. The password is checked by the API.
3. The session is stored in a cookie.
4. The admin panel can create or edit products.
5. The upload endpoint saves the image to `public/images`.
6. The product JSON references the uploaded image path.

## Best fit

This approach is best when you want:

- minimal complexity
- a single-owner admin panel
- quick edits without a database
- a small product catalog

It is not the best fit when you need persistent cloud storage, advanced permissions, or a production admin that survives serverless resets.
