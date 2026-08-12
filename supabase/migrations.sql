-- ==========================================
-- LCPH Realty Inc. — INCREMENTAL MIGRATIONS
-- ==========================================
-- schema.sql is the full, from-scratch definition — run it only on a brand new database.
-- This file holds ONLY the changes made after the initial schema was deployed.
-- Run the newest block(s) you have not applied yet; every statement is safe to re-run.
--
-- Applied so far:
--   [ ] 2026-08-11 — Updates status pill
-- ------------------------------------------------------------------------------


-- ─── 2026-08-11 — Updates status pill ────────────────────────────────────────
-- Adds the editable label shown in the outlined chip on the Updates page cards
-- ("Under Construction", "Completed", "Turnover Ready", …). Existing rows fall
-- back to the default, so nothing breaks before an admin edits them.

ALTER TABLE development_updates
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Under Construction';
