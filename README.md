# Granite-shop-inventory

A local-first inventory dashboard for a granite, quartz, and countertop shop. This is an employee tool, not an online store.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To check a production build:

```bash
npm run build
npm start
```

## Current status

The home page (`/`) is a public, read-only catalogue of available demonstration records. The employee overview (`/admin`) and editable inventory (`/inventory`) require the shop account (`Info@ottawagraniteshop.ca`) and a Supabase user with the server-managed `app_metadata.role` set to `admin` when Supabase settings are configured. Adding, editing, or deleting a record still saves in this browser only. The public catalogue is not connected to a live shared database; do not enter real business data or use this as a production inventory system.

The inventory form supports slab and remnant measurements, locations, material, and Kitchen/Vanity sink and faucet types. Product images are illustrative demo photos, not photographs of shop stock. Photo upload, shared database storage, inventory movement history, and CSV import/export are not implemented yet.

## Next setup step

1. Create a Supabase project and enable email/password sign-in.
2. In Supabase, create the Auth user for `Info@ottawagraniteshop.ca` and set its password directly in Supabase. The app does not have public sign-up, and its login form accepts only this account.
3. Give that user `app_metadata.role = "admin"` using a trusted Supabase admin method. For a single local setup, the Supabase SQL Editor can run the following:

	```sql
	update auth.users
	set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
	where email = 'Info@ottawagraniteshop.ca';
	```

	Sign out and back in after changing the role so the user's session refreshes. Do not use editable `user_metadata` for authorization.
4. Ensure `.env.local` contains the project URL and public anon key named in `.env.example`. Do not overwrite an existing `.env.local`.
5. In Supabase Auth URL Configuration, allow the app's origin as a redirect URL for password recovery. The **Forgot password?** link sends a reset email to the account's registered email address; opening it returns to `/login` to choose a new password.
6. Restart with `npm run dev`. Visitors can use `/`; the employee login is in the top-right corner, and the authorized account is sent to `/admin`.

Never put the Supabase service-role key or employee passwords in frontend code or commit them to the repository. Supabase login protects access, but inventory records still live only in each browser until the database and row-level security policies are implemented.