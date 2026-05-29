# Supabase Version

This is the recommended production upgrade path for the current store.

## Target architecture

- Astro frontend on Vercel
- Supabase Postgres for products and metadata
- Supabase Storage for product images
- Admin auth handled by Supabase Auth or a secure session layer backed by the database
- WhatsApp still used for checkout

## What changes

### Product data

Replace the JSON file with database tables such as:

- `products`
- `product_images`
- `product_variants`
- `admin_sessions` or an auth table depending on the chosen login model

### Image upload

Instead of writing to `public/images`, upload images to Supabase Storage and save the public URL in the database.

### Admin panel

The admin panel keeps the same user experience but now reads and writes through API routes that talk to Supabase.

## Benefits of the Supabase version

- Persistent data on all deployments
- Safer uploads
- Better scaling for more products
- Easier future features like analytics, roles, and inventory tracking
- Cleaner separation between frontend and data storage
- Better fit for Vercel and other serverless hosts

## Tradeoffs

- More setup than JSON
- Requires a database schema
- Needs storage bucket configuration
- Adds external dependency management
- Slightly more code in the API layer

## Suggested migration path

1. Create a Supabase project.
2. Define the product and image tables.
3. Move existing product JSON into the database.
4. Move image uploads to Supabase Storage.
5. Update the admin APIs to read/write from Supabase.
6. Keep the same storefront UI so the customer experience does not change.

## Result

The Supabase version keeps the same brand and layout, but it becomes production-ready for Vercel because the content is no longer tied to local files.
