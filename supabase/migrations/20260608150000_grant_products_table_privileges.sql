-- Fix "permission denied for table products" in the admin console.
--
-- Postgres checks table-level GRANTs *before* evaluating row-level security
-- policies. The original migration enabled RLS and added policies allowing
-- authenticated users to manage products, but never GRANTed the underlying
-- INSERT/UPDATE/DELETE/SELECT privileges on the table to the `anon` and
-- `authenticated` roles that PostgREST uses — so every write from the admin
-- (and even reads, for `anon`) was rejected at the privilege check, before
-- the RLS policy was ever consulted.

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
