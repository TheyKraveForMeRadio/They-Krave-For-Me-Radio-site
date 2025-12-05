They Krave For Me Radio - Next.js + Supabase + Stripe (Netlify-ready)

How to run locally:
1. npm install
2. Create a .env.local file (see .env.local.example)
3. npm run dev
4. Open http://localhost:3000

Supabase:
- This project uses direct-from-browser uploads to Supabase Storage.
- Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
- Create a PUBLIC bucket named 'mixtapes' in Supabase Storage.

Stripe:
- You can create Stripe Payment Links in the Dashboard, or use the admin UI to create them (requires STRIPE_SECRET).
- If using the automatic create-payment-link API, set STRIPE_SECRET in Netlify env (sensitive).

Deploy to Netlify:
- Push this repo to a Git provider and connect to Netlify, or zip and drag & drop.
- Netlify will run `npm run build`.

Security:
- This scaffold uses public anon keys for Supabase (safe for client uploads).
- For server actions that write to the DB, you'll need to set SUPABASE_SERVICE_ROLE and STRIPE_SECRET in Netlify environment variables (these are sensitive and must be kept secret).
- Set ADMIN_PASS as a secret env var (not NEXT_PUBLIC_) to protect admin server endpoints.
