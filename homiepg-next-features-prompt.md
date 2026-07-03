# HomiePG — Next Feature Batch (Build Prompt)

## Context (paste this first so the AI understands the app)

This is **HomiePG**, a solo-owner PG (Paying Guest) management dashboard.
Stack: React (Vite) + Tailwind CSS v3 + Supabase (Postgres, Auth, Storage).
Brand colors: `homie-blue: #3B4DD1`, `homie-green: #1FAE7F`.

**This is NOT a multi-role platform.** There is only ONE role that matters: the
PG Owner, who logs in and manages their own buildings/tenants. Do NOT add
super_admin dashboards, manager roles, subscription plans, audit logs, or
platform analytics — that scope is intentionally out.

Existing structure:
- `src/pages/Dashboard.jsx`, `Buildings.jsx`, `BuildingDetail.jsx`,
  `Tenants.jsx`, `TenantDetail.jsx`, `Expenses.jsx`, `Profile.jsx`, `Login.jsx`
- `src/components/Sidebar.jsx`, `TopBar.jsx`, `FloorCard.jsx`, `BedModal.jsx`
- Tables: `profiles`, `buildings`, `floors`, `rooms`, `beds`, `tenants`,
  `tenant_documents`, `rent_payments`, `expenses`

Implement the following four tasks. Keep existing functionality working —
these are additive changes, not rewrites.

---

## Task 1 — Collapsible Sidebar

`Sidebar.jsx` is currently always full-width (`w-64`) and always visible.
Add a collapse/expand toggle:

- Add a toggle button (hamburger icon or `<<`/`>>` arrow) at the top of the
  sidebar, next to the logo.
- When collapsed: sidebar shrinks to icon-only width (e.g. `w-16`), showing
  just the emoji/icons for Dashboard/Buildings/Tenants/Expenses/Profile with
  no text labels. Tooltips on hover are a nice-to-have.
- When expanded: current full behavior (icon + label).
- Store the collapsed state in local component state (`useState`), no need
  to persist across reloads for now.
- Animate the width transition with a Tailwind `transition-all duration-200`
  class so it doesn't feel jumpy.
- `TopBar.jsx` and the main content area (`flex-1`) should adjust automatically
  since the layout is already flex-based — verify this after collapsing.

---

## Task 2 — Richer Building Details

### Schema changes (run in Supabase SQL Editor)

```sql
alter table buildings
  add column if not exists food_type text check (food_type in ('veg', 'non_veg', 'both', 'not_included')),
  add column if not exists water_supply_timing text,
  add column if not exists wifi_available boolean default false,
  add column if not exists power_backup boolean default false,
  add column if not exists parking_available boolean default false,
  add column if not exists laundry_available boolean default false,
  add column if not exists description text;

-- rename the concept from "unisex" to "co-living" in the UI only —
-- the underlying gender_type column and its values ('unisex','male','female')
-- stay the same in the database. Only change the DISPLAY LABEL in the UI.
```

### UI changes — `Buildings.jsx` (Add Building form)

Add these new fields to the form:
- **Food Type**: dropdown — Veg / Non-Veg / Both / Not Included
- **Water Supply Timing**: text input (e.g. "24x7", "6-9 AM & 6-9 PM")
- **WiFi Available**: checkbox/toggle
- **Power Backup**: checkbox/toggle
- **Parking Available**: checkbox/toggle
- **Laundry Available**: checkbox/toggle
- **Description**: textarea (short paragraph about the property)

### Label change (UI text only, not the DB value)

Wherever the gender_type dropdown or badge currently displays **"Unisex"**,
change the displayed label to **"Co-living"**. Keep `"male"` → "Male Only"
and `"female"` → "Female Only" as-is. This is purely a display-string change:

```jsx
const genderLabel = {
  unisex: 'Co-living',
  male: 'Male Only',
  female: 'Female Only'
}
// use genderLabel[building.gender_type] wherever the raw value was shown
```

### Building card / detail view

Show the new amenity fields as small icon badges on the building card
(e.g. 🍽️ Veg, 📶 WiFi, 🔌 Power Backup, 🚗 Parking, 🧺 Laundry) — only show
badges for amenities that are `true`/set, skip the rest instead of showing
"No" badges everywhere (keeps cards clean).

---

## Task 3 — Full Tenant Detail from Dashboard

Currently the owner has to go Dashboard → Buildings → open a building →
click a bed to see tenant info. Add a fast path:

- On `Dashboard.jsx`, the existing stat cards stay as-is.
- Add a new section below Quick Actions: **"Recent Tenants"** — a small table
  (last 5 tenants by `created_at`) with columns: Name, Building, Status,
  Monthly Rent, and a **"View Full Details"** button per row.
- Clicking "View Full Details" navigates to `/tenants/:id` (the existing
  `TenantDetail.jsx` page — no new page needed, just a new entry point).
- On `Tenants.jsx` list page, make sure every row's "View →" button already
  does this (it should, verify it still works after other changes).

No new tables needed — this reuses the existing `tenants` query pattern
already used in `Tenants.jsx`, just add `.limit(5)` and reuse in Dashboard.

---

## Task 4 — Payments Section Improvement

On `TenantDetail.jsx`, the Rent Payments section currently just lists past
payments. Improve it:

- Add a **"Payment Status This Month"** badge at the top of the Rent
  Payments card: check if there's a `rent_payments` row for the current
  month (`YYYY-MM` format comparison on the `month` field) with
  `status = 'paid'`. Show a green "Paid" badge or a red "Due" badge
  accordingly.
- Add a **quick-action button** "Mark This Month as Paid" that pre-fills
  the existing add-payment form with the current month and the tenant's
  `monthly_rent`, so the owner just needs to pick a date and submit —
  reduces repetitive typing for the common case.
- On `Dashboard.jsx`, add a 5th stat card: **"Pending Rent This Month"** —
  count of active tenants who do NOT have a paid `rent_payments` row for
  the current month. This requires comparing `tenants` (status = 'active')
  against `rent_payments` (month = current month, status = 'paid') and
  counting the difference.

---

## Task 5 — Simple, Professional Landing Page (NOT the login page)

Create a new public route `/` (separate from `/login`) with a clean,
single-page marketing homepage. Keep it simple — no analytics dashboards,
no fake user/server counts, no SEO copy walls. Just:

1. **Hero section**: HomiePG logo, tagline "Find Your Homie. Find Your Stay.",
   one sentence describing the app, two buttons: "Owner Login" (→ `/login`)
   and a disabled/coming-soon "Find a PG" button (tenant-facing search is a
   future phase, not built yet — just show it visually for now, don't wire
   it up).
2. **Features section**: 3-4 cards describing what the owner dashboard does
   (Real-time Vacancy, KYC & Document Management, Rent Collection, Expense
   Tracking) — reuse copy style similar to what's already in your brand
   diagram, but keep it to 1 short sentence per card.
3. **Footer**: logo, tagline, copyright line. Nothing else — no links to
   pages that don't exist yet (no Blog, no Careers, no Pricing).

Use the `homie-blue`/`homie-green` palette. This page should take
30-45 minutes to build, not become its own project — resist the urge to
add sections that don't have real functionality behind them yet.

Update `App.jsx` routing:
```jsx
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
```

---

## What NOT to build right now (explicitly out of scope)

- Super Admin / Manager roles or dashboards
- Subscription plans / billing tiers
- Audit logs / security logs
- Platform-wide analytics or AI price recommendations
- SEO copy, blog, "About Us" style content pages
- Tenant-facing public search & booking flow (that's a separate future phase)
- Real payment gateway integration (still manual "mark as paid" for now)

Keep the app scoped to: **one owner, managing their own PGs, end to end.**
