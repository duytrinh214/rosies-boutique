# Rosie's Boutique — web

Production implementation of the "Rosie's Boutique" e-commerce design (artificial flowers & gifts), built with Vite + React + React Router + Supabase.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your Supabase project credentials
npm run dev
```

## Configuration

Copy `.env.example` to `.env` and fill in:

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — your Supabase project credentials (Project Settings → API). Until these are set, the shop and admin dashboard fall back to `localStorage` so the UI can still be previewed.
- `VITE_DEMO_ADMIN_EMAIL` / `VITE_DEMO_ADMIN_PASSWORD` — demo admin login used only when Supabase isn't configured.
- `VITE_STRIPE_PUBLISHABLE_KEY` — TODO: wire up real Stripe Elements at checkout (currently a clearly-marked mock Payment Element with no real charges).
- `VITE_GOOGLE_PLACES_API_KEY` — TODO: wire up real address autocomplete at checkout (currently uses a small mock AU address database).

The Supabase table schema and Storage bucket setup SQL are shown in the admin dashboard's **Settings** tab once you're logged in.

## Known TODOs before launch

- Replace placeholder business info (address, phone, opening hours, Google Maps embed, shipping rates) — search the codebase for `TODO` comments, particularly in `src/pages/ContactPage.jsx` and `src/pages/ShippingPage.jsx`.
- Replace the placeholder TikTok link in the footer.
- Set real Google Business Profile details in `GOOGLE_BUSINESS` (`src/pages/ReviewsPage.jsx`).
- Configure Supabase and Stripe before going live.
