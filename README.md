# Opswatch — Real-Time Incident Command Center

An operations team's incident console: sign in, triage what's burning, open an
incident, watch the activity feed update live, post an update without the page
ever flickering.

Built with **Next.js 15 (App Router / React Server Components)** and **Supabase**
(Postgres + Auth + Realtime), in **TypeScript**.

---

## Table of contents

1. [Running it locally](#1-running-it-locally)
2. [Environment variables](#2-environment-variables)
3. [Database setup and seed](#3-database-setup-and-seed)
4. [Architecture](#4-architecture)
   - [Rendering strategy](#41-rendering-strategy)
   - [Server / client boundaries](#42-server--client-boundaries)
   - [Streaming](#43-streaming)
   - [Real-time data](#44-real-time-data)
   - [Authentication](#45-authentication)
   - [Caching and invalidation](#46-caching-and-invalidation)
   - [Hydration risks and mitigations](#47-hydration-risks-and-mitigations)
   - [State management](#48-state-management)
   - [Design principles](#49-design-principles)
   - [Error handling](#410-error-handling)
   - [Accessibility](#411-accessibility)
5. [Testing](#5-testing)
6. [Known limitations and what I'd do next](#6-known-limitations-and-what-id-do-next)
7. [Why this stack](#7-why-this-stack)

---

## 1. Running it locally

```bash
npm install
cp .env.example .env.local     # then fill in your Supabase values
npm run dev                    # http://localhost:3000
```

Other scripts:

| Script | What it does |
|---|---|
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Jest + React Testing Library unit/component suite |
| `npm run test:e2e` | Playwright end-to-end tests |

---

## 2. Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Anon key. Safe to expose — every table is behind RLS |
| `SLOW_STATS_MS` | no (default `600`) | Demo latency on the streamed dashboard stats so the Suspense skeleton is observable. Set `0` for production behaviour |
| `E2E_EMAIL` / `E2E_PASSWORD` | no | Credentials for the authenticated Playwright tests |

No service-role key is used anywhere. Nothing bypasses row level security.
`.env.local` is gitignored; `.env.example` documents the shape.

---

## 3. Database setup and seed

Two SQL files, applied in order.

**With the Supabase CLI:**

```bash
supabase link --project-ref <your-ref>
supabase db push                                    # applies supabase/migrations/
psql "$DATABASE_URL" -f supabase/seed.sql           # or paste into the SQL editor
```

**Without the CLI:** open the Supabase dashboard → SQL Editor, run
`supabase/migrations/20260720000000_init.sql`, then `supabase/seed.sql`.

Then create a user: **Authentication → Users → Add user** (email + password,
"auto confirm"). A `profiles` row is created automatically by the
`on_auth_user_created` trigger.

What the migration creates:

- `profiles`, `incidents`, `incident_updates` + two enums
- triggers that maintain `updated_at` / `resolved_at` in the database, so
  "last updated" can't be forged or forgotten by a client
- **row level security on all three tables** — authenticated users read; a user
  may only insert an update where `author_id = auth.uid()`
- `incidents` and `incident_updates` added to the `supabase_realtime` publication

The seed adds 6 responders and 9 incidents covering every severity and status
(7 active, 2 resolved) with a realistic update history, timestamped relative to
`now()` so the dashboard always looks live.

> `profiles.id` intentionally has **no** foreign key to `auth.users`: the seeded
> incident owners are demo responders, not real login accounts. Real users still
> get a profile from the sign-up trigger.

---

## 4. Architecture

```
                                    ┌───────────────────────────────┐
  request ──▶ middleware.ts         │  Supabase                     │
              (refresh session)     │   Postgres + RLS              │
                    │               │   Auth (httpOnly cookies)     │
                    ▼               │   Realtime (logical repl.)    │
            app/(app)/layout.tsx    └───────────────────────────────┘
            getUser() ── no user ──▶ redirect('/login')   ▲       │
                    │                                     │       │
                    ▼                                     │       │ postgres_changes
    ┌───────── Server Components ─────────┐  queries.ts ──┘       │
    │  incident list · metadata · impact  │                       │
    │  charts · status guide              │                       │
    │                                     │                       │
    │  <Suspense> ── streamed ──▶ stats   │                       │
    │  <Suspense> ── streamed ──▶ feed ───┼──▶ props (snapshot)    │
    └─────────────────────────────────────┘         │             │
                                                    ▼             │
                          ┌──── Client Components ('use client') ──┴──┐
                          │  filters (URL) · status/severity selects  │
                          │  composer (useOptimistic) · feed deltas   │
                          └───────────────────────────────────────────┘
                                                    │
                                       Server Actions ──▶ revalidatePath
```

### 4.1 Rendering strategy

| Route / section | Strategy | Why |
|---|---|---|
| `/status-guide` | **Static** (`force-static`, `revalidate = 3600`) | Public, identical for everyone, no cookies and no database. Prerendered at build time and servable from a CDN; the ISR window lets the copy be edited without a redeploy |
| Severity / status definitions | **Compile-time constants** (`lib/domain.ts`) | They change with a deploy, not with a request. The cheapest cache is the one that is just a module |
| Root layout (nav shell) | **Reused across navigations** | Holds no per-request data, so it is never re-rendered when the page under it changes |
| `/dashboard` | **Dynamic per request** (`force-dynamic`) | Authenticated, filtered by URL state, and must never be shared between users or served stale by a CDN |
| `/incidents/[id]` | **Dynamic per request** | Same |
| Dashboard stats strip | **Dynamic, streamed** | Aggregates over the whole table — slower than the list, and not what the user came for |
| Activity feed | **Dynamic, streamed** | The incident summary is more urgent than its history |

The only client-side JavaScript that matters is on the interactive leaves. The
dashboard ships **~3.9 kB** of route-specific JS; the incident page **~5 kB**.

### 4.2 Server / client boundaries

**The rule:** data flows down from the server; interactivity is pushed to the
smallest possible leaves. Every `'use client'` in this repo is a deliberate,
defensible decision — you can audit them by grepping for the directive.

| Component | Where | Why |
|---|---|---|
| `IncidentRow` | server | Pure output. The whole row is an `<a>`, so it is keyboard-navigable and middle-clickable **without any JavaScript** |
| `Stats`, `Health`, `Impact` | server | Charts are SVG strings. There is nothing to hydrate |
| `Badge`, `Avatar`, `Icon` | server | Presentational |
| `Filters` | **client** | Owns click handlers, writes to the URL, and needs `useTransition` for non-blocking navigation |
| `IncidentControls` | **client** | `useOptimistic` + pending state on a select |
| `ActivityFeed` | **client** | Owns the realtime subscription and the optimistic composer |
| `RelativeTime` | **client** | Progressive enhancement of a server-rendered timestamp (see §4.7) |
| `Nav` | server | Static shell — only its interactive leaves hydrate |
| `NavLink`, `UserMenu` | **client** | Active-link highlighting and the dropdown. The *user identity* is still resolved on the server and passed in as props |
| `ErrorBoundary` | **client** | React error boundaries must be class components on the client |

Stateful client logic is factored into custom hooks (`src/hooks/`):
`useRealtimeInvalidation` (dashboard subscription + debounce), `useIncidentChannel`
(per-incident feed deltas + lifecycle), `useUrlFilters` (URL as filter state),
`useRelativeTime`, `useClickOutside`. Components stay declarative views; the
hooks own the effects, and each is independently testable.

**Project structure** — feature slices under thin routes, built to absorb many
more pages without reshuffling:

```
src/
  app/         → routes only: pages, layouts, loading/error/not-found files
  features/    → one slice per domain area (dashboard, incidents, auth):
                 components + server actions behind a barrel export
  components/  → shared UI: atoms in ui/ (Badge, Icon, Avatar, Logo),
                 then nav/, toast/, RelativeTime, ErrorBoundary…
  hooks/       → reusable client hooks (subscriptions, URL state, timers)
  lib/         → pure logic and data access: domain, queries/, telemetry…
```

Dependency direction is one-way: `app` → `features` → `components`/`hooks` →
`lib`. Shared atoms never import from features, and features never import from
each other — adding a page means a new route plus (at most) a new slice,
touching nothing that exists.

**Where data is fetched:** everything reads through `lib/queries.ts`, which only
runs on the server. The browser never re-fetches the initial payload — that's
what makes duplicate server/client requests structurally impossible rather than
merely avoided. The one exception is documented: `ActivityFeed` looks up a
display name for an author it has never seen, on realtime insert, because the
replication payload carries `author_id` and not the join.

### 4.3 Streaming

Two `<Suspense>` boundaries, each wrapped in its own `ErrorBoundary`.

1. **Dashboard → stats strip.** The shell, the critical-incident banner, the
   filters and the incident list flush first. The stats cards arrive later with
   a four-card skeleton in the meantime. You can filter and open incidents while
   they're still loading.
2. **Incident detail → activity feed.** The id, badges, title, owner,
   description and impact chart render on the first flush; the feed streams in
   behind a three-row skeleton.

`loading.tsx` at each route adds the route-level transition state, so navigation
paints instantly instead of hanging on the server.

**Why an error boundary per streamed section:** once the shell has been flushed,
the response is already on the wire — a section that throws afterwards *cannot*
produce an HTTP error page. React replays the error on the client and the
nearest boundary swaps in a fallback. So a failing stats query degrades that
strip only ("Statistics are unavailable right now. The incident list below is
unaffected"), and a failing feed query leaves the incident summary and the
controls fully usable.

**SEO / accessibility note:** streamed sections still arrive as real HTML in the
same response, so crawlers see them. Every skeleton has an accessible label
(`role="status"` + "Loading activity…"), never a bare spinner, and the visual
placeholders are `aria-hidden` so a screen reader hears one announcement rather
than nine boxes.

### 4.4 Real-time data

Two different strategies, because the two surfaces have different shapes. This
is the most interesting decision in the codebase.

**Dashboard — *notify, don't mirror*** (`components/RealtimeRefresh.tsx`).
The dashboard is a filtered, sorted, aggregated projection. Rebuilding that
projection in the browser from a stream of row deltas would mean shipping the
sort and filter rules to the client and keeping two implementations in sync
forever. Instead the subscription is used purely as an **invalidation signal**:
anything changes → `router.refresh()`. The server stays the single source of
truth. Refreshes are debounced (400ms), so a burst of writes costs one render.

**Incident feed — *snapshot + deltas*** (`ActivityFeed.tsx`).
Here the client *can* cheaply apply a delta, and a server roundtrip would be
felt. So:

1. The Server Component renders the feed and passes it down as `initial`.
2. The client seeds from those props — **it never re-fetches them**.
3. It subscribes to `postgres_changes` on `incident_updates`, filtered by
   `incident_id`, and appends only new rows.
4. Everything is **deduplicated by primary key**. This matters: your own
   optimistic row, the Server Action's `revalidatePath` refresh, and the
   realtime echo of the same insert are the same row arriving from three
   directions.
5. When `initial` catches up, the local copy of a row is pruned, so the client
   buffer can't grow without bound.

**Subscription lifecycle.** One channel per incident, created in a `useEffect`
keyed by `incidentId`, torn down with `supabase.removeChannel()` in the cleanup.
Without that, navigating between incidents leaks a subscription per visit.

**Dropped connections.** `subscribe()`'s status callback drives a "Real-time
connection lost — reconnecting…" banner. On reconnect the client knows it missed
events, so it calls `router.refresh()` and re-seeds from the server rather than
trusting stale local state.

### 4.5 Authentication

Email + password via Supabase Auth, session in **httpOnly cookies**
(`@supabase/ssr`).

- `middleware.ts` refreshes the token on every request **and is the primary
  redirect decision point**: it already paid for the verified user, so it also
  bounces anonymous visitors off protected paths and signed-in visitors off
  `/login` — one verification, one decision, before any rendering starts. The
  refreshed session cookies are copied onto the redirect response so a bounce
  never loses the token refresh.
- `app/(app)/layout.tsx` remains a second, independent guard (defense in
  depth — a middleware matcher edit must not become an auth hole). It calls
  **`getUser()`, not `getSession()`** — `getSession()` merely trusts whatever is
  in the cookie, while `getUser()` revalidates the JWT with Supabase.
- `getUser()` is wrapped in **`React.cache`**, so the layout, the page, and any
  streamed section share a single Auth verification per render pass instead of
  each paying their own network roundtrip.
- No user → `redirect('/login')` **on the server**, before any child renders.
  Protected HTML is never serialised, never streamed, never flashes. There is no
  client-side auth check anywhere in the app, which also eliminates a whole class
  of hydration mismatch by construction.
- **At scale**, the remaining per-request Auth roundtrip (middleware + one per
  render pass) is the next thing to remove: Supabase supports asymmetric JWT
  signing, so verification can happen locally against the public key
  (`getClaims`) with no network call at all. The seam is already in one place —
  `lib/supabase/server.ts` — so that swap touches one function.
- Sign-out is a plain `POST` form to a route handler: it works without
  JavaScript and can't be triggered by a cross-site `GET`.
- The sign-in error message is deliberately generic. Distinguishing "no such
  user" from "wrong password" is a user-enumeration leak.

**Beyond the UI:** RLS is the real boundary. Hiding a row in React protects
nothing — anyone can call PostgREST with the anon key. The insert policy on
`incident_updates` (`auth.uid() = author_id`) means you cannot post as someone
else even with a hand-crafted request.

### 4.6 Caching and invalidation

| What | Freshness | Invalidation |
|---|---|---|
| `/status-guide` | Static, 1h ISR | Time-based, or a redeploy |
| Severity/status definitions | Compile-time | Deploy |
| Nav shell (root layout) | Reused across navigations | n/a — no per-request data |
| Dashboard + incident data | Per request, uncached | n/a |
| Client router cache | Next.js default | `revalidatePath()` from Server Actions, and `router.refresh()` from the realtime subscription |

**Why the authenticated data is deliberately *not* cached:** an incident console
is a coordination tool. A stale severity badge during an outage is worse than a
slow one, and the queries are indexed single-digit-millisecond lookups. Caching
here would buy little and cost correctness.

Where invalidation *does* happen, it is explicit: every Server Action calls
`revalidatePath` for the incident page and the dashboard, so a mutation in one
tab is reflected in the Next.js router cache of that client, while the realtime
subscription handles *other* clients.

> Trade-off, stated plainly: at thousands of concurrent incidents I would tag the
> list query with `unstable_cache` + `revalidateTag('incidents')` and let the
> realtime signal invalidate the tag, so one write invalidates one cache entry
> instead of every connected client re-querying. That is the first thing I'd
> change at scale — see §6.

### 4.7 Hydration risks and mitigations

**The hydration timeline — before, during, after:**

1. **Before hydration** the browser has real HTML streamed from the server —
   including the `'use client'` components, which are *also* server-rendered on
   first load (the directive marks what ships JS, not what skips SSR). The
   dashboard is readable, incident rows are plain `<a>` links so navigation
   works, and sign-in/sign-out work because they are native form posts to a
   Server Action / route handler. Nothing white-screens.
2. **During hydration** React walks the existing markup and attaches to it —
   which is why the first client render must be byte-identical to the server's.
   Every mitigation below exists to protect this step.
3. **After hydration** the effects arm: the realtime channel subscribes, UTC
   timestamps upgrade to relative labels, the dropdown, filters, optimistic
   composer and toasts become interactive.

**If JavaScript is slow or never arrives:** the app degrades to a readable,
navigable, sign-in-able document — the interactive islands (filters, composer,
status selects) are the only things waiting on JS. An e2e spec signs in and
reads the dashboard **with JavaScript disabled** to keep this true.

**Risk 1 — relative timestamps (the one that actually bites).**
"3 min ago" is computed at server render time and recomputed at hydration time.
If a second ticks over between them — or the reader's clock is skewed, or the
HTML sat in a cache — React sees different text and throws away the server HTML.

*Mitigation* (`components/RelativeTime.tsx`): the server renders a deterministic
absolute UTC string inside a semantic `<time dateTime={iso}>`. The first client
render is byte-identical, because the relative label is only computed in a
`useEffect` **after** mount, and refreshed every 30s from there. The result is
progressive enhancement rather than a mismatch: with JavaScript off you get an
exact timestamp, with it on you get "3 min ago", and hydration never disagrees.

**Risk 2 — random values in charts.**
The design calls for sparklines and impact charts. `Math.random()` in a
component would render one polyline on the server and a different one in the
browser — a mismatch on every chart on the page.

*Mitigation* (`lib/telemetry.ts`): every series comes from a **seeded** PRNG
(`mulberry32` over an FNV-1a hash) keyed by a stable string — the incident id,
the metric name, a 30-second time bucket. Same seed in, same numbers out, on
both sides of the wire. The Jest suite asserts exactly this property, because
if it ever regresses, every chart in the app becomes a hydration bug.

**Risk 3 — divergent auth state.**
Prevented structurally: auth is resolved *only* on the server (§4.5). The client
never computes its own session state during the initial render, so it cannot
disagree with the server about who you are.

**Risk 4 — browser-only APIs and viewport.**
No component reads `window`, `localStorage`, `matchMedia` or element dimensions
during render. Layout is CSS grid/flex with `auto-fit`, so responsiveness needs
no measurement. The only `document` access is an outside-click listener inside a
`useEffect`.

### 4.8 State management

No global state library. It was considered and rejected — every category of
state here already has a natural home:

| Kind | Where it lives | Example |
|---|---|---|
| Server state | RSC fetches in `lib/queries.ts` | Incidents, updates, stats |
| URL state | `searchParams` | `?tab=resolved&sev=critical,high` |
| Form state | `useActionState` / `useFormStatus` | Sign-in, composer pending |
| Optimistic state | `useOptimistic` | Posted update, status change |
| Local component state | `useState` | Dropdown open, inline errors |
| Cross-cutting UI state | `ToastProvider` (React context) | Success/failure toasts from any page |
| Real-time data | `useIncidentChannel` hook, merged with props | Live deltas |
| Auth state | Server-side cookies only | Session |

The toast context is the only global client state in the app — notifications are
genuinely cross-cutting (the composer, the status controls and future surfaces
all raise them), which is the one case where context beats prop drilling. Every
other kind of state has a narrower home, so no store library and no further
context: reaching for either would widen state scope without adding capability.

**Filters in the URL** is one decision that satisfies four requirements at once:
shareable, refreshable, preserved through navigation and the back button, and —
crucially — readable by the *server*, which is what actually filters the query.
The `Filters` component is a controller over `searchParams`; it owns no list
state of its own, so the client and server can't disagree about what is shown.

### 4.9 Design principles

How SOLID maps onto a React/RSC codebase here:

- **S** — one reason to change per module: `lib/random.ts` (seeded PRNG),
  `lib/chart.ts` (SVG mapping), `lib/telemetry.ts` (metric semantics),
  `lib/queries/*` (one file per aggregate: incidents, updates, stats, profiles),
  one component per file, effects isolated in `src/hooks/`.
- **O** — extension without modification: adding a severity or status is a new
  entry in the `SEV`/`ST` maps plus the DB enum; every badge, chip, guide row
  and chart picks it up by iteration. No `switch` on severity anywhere. Health
  metrics are data (`METRIC_DEFS`), not code.
- **L** — components accept the base contracts they declare; `ErrorBoundary`
  is a well-behaved `Component` subtype; any `Meta` renders in any badge.
- **I** — narrow props: `Nav` takes `{ name, email }`, not a Supabase `User`;
  `UpdateItem` takes one update; `Badge` takes one `Meta`. No component
  receives data it doesn't render.
- **D** — views depend on abstractions: `UpdateComposer` depends on an
  `onPublish` callback, not on the Server Action; components consume
  `number[]` series, so the simulated generator can be swapped for a real
  metrics query without touching a view; data access goes through
  `lib/queries`, never inline SQL in components. `getProfileName` is wrapped
  in `React.cache`, so the layout and the feed share one lookup per request.

**Design tokens** — no hardcoded colors anywhere in a component:

- `src/lib/tokens.ts` is the single source of truth: a semantic `palette`
  (surface, border, text tiers, accent, severity hues…) plus the avatar hues.
- The root layout emits the palette as `:root` CSS custom properties, so every
  component styles with `var(--surface)`, `var(--text-muted)`, etc.
- SVG charts and hex-alpha compositions (where `var()` cannot resolve) import
  the same `palette` object in JS — one source, two delivery mechanisms.
- Translucent variants derive with `color-mix(in srgb, var(--critical) 35%,
  transparent)` instead of parallel rgba literals.
- Enforceable by grep: `#[0-9a-f]{6}` outside `lib/tokens.ts` returns nothing.
  Re-theming (or adding a light mode) is a one-file change.

**Render performance** — no unnecessary client re-renders, independent of
network or backend behaviour:

- Server sections (incident rows, charts, stats) have **zero** client re-render
  cost — there is nothing mounted to re-render.
- All relative timestamps share **one** 30-second ticker
  (`useSyncExternalStore` with a module-level subscriber set), not one interval
  per timestamp; an unchanged label returns an identical snapshot string, so
  React bails out and only rows whose text actually changed re-render.
- Feed rows are `memo`ized and the merge preserves object identity for
  unchanged rows, so a realtime insert re-renders one new row, not the list.
- The composer is `memo`ized behind a `useCallback` handler and its textarea is
  uncontrolled — neither feed churn nor typing triggers React renders around it.
- `ToastProvider` passes a stable callback as context value and `children` by
  reference: showing a toast re-renders the toast, not the app.
- Realtime dashboard refreshes are debounced (400ms), so a burst of writes
  costs one server render, not one per event.

### 4.10 Error handling

| Failure | Handling |
|---|---|
| Wrong credentials | Generic inline `role="alert"`, no user enumeration |
| Expired session mid-action | Server Action re-verifies `getUser()` and returns a friendly message |
| Failed page load | `app/error.tsx` — a retry button; the raw error is logged, never displayed |
| Failed streamed section | Per-section `ErrorBoundary` — degrades in place |
| Failed mutation | Toast + **the typed text is restored into the textarea**. Losing a paragraph you typed during an outage is the worst possible time to lose a paragraph |
| Failed optimistic update | Automatic rollback — React discards the optimistic row when the action settles. There is no manual rollback path to get wrong |
| Lost realtime connection | Banner + `router.refresh()` on reconnect |
| Missing incident | `notFound()` → a dedicated `not-found.tsx` |
| Unauthorized access | Server-side redirect, plus RLS as the real boundary |

Raw Supabase errors are logged server-side and never surfaced: they leak schema
names, constraint names and identifiers.

### 4.11 Accessibility

- Every form control has an associated `<label>`; the composer, both selects and
  both sign-in fields are labelled.
- Semantic HTML throughout, no div soup: the incident list is a `<ul>` of `<a>`
  rows (not `div role="link"` with a keyboard handler), the activity feed is an
  `<ol>` of `<article>` entries, stats and impact figures are `<dl>`/`<dt>`/`<dd>`
  pairs, the status guide is a definition list, health metrics are a `<ul>`,
  timestamps are `<time dateTime>`, tabs use `role="tablist"` + `aria-selected`,
  filter chips use `aria-pressed` inside labelled `role="group"`s.
- Focus is never suppressed: a global `:focus-visible` outline, and the app is
  fully keyboard-operable.
- **Status is never colour alone** — every severity and status badge carries a
  text label *and* a shape-distinct icon.
- Loading states are announced (`role="status"`, "Loading activity…") and the
  decorative skeleton boxes are `aria-hidden`.
- The activity feed is `aria-live="polite"` with `aria-relevant="additions"`:
  new updates are announced without stealing focus from someone mid-sentence.
- `prefers-reduced-motion: reduce` disables every animation and transition.

---

## 5. Testing

Two layers, each testing what only it can see.

**`npm test`** — Jest + React Testing Library, 22 tests colocated with the code
they pin. Each one asserts a claim this README makes, so a regression breaks a
documented guarantee, not just a snapshot:

| Suite | Claim it pins |
|---|---|
| `RelativeTime.server.test` (node env) | The server emits a deterministic UTC string — never "5 min ago" — so hydration cannot mismatch (§4.7) |
| `RelativeTime.test` (jsdom) | The client upgrades to a relative label only after mount, keeping `<time dateTime>` |
| `telemetry.test` | Chart generators are pure: same seed, same series, bounded values (§4.7) |
| `Badge.test` | Status is never colour alone: text label + `aria-hidden` icon (§4.11) |
| `FilterChip.test` | Toggle state is exposed via `aria-pressed`; counts render; clicks fire |
| `EmptyState.test` | The empty state offers "Clear filters" only when filters caused it |
| `UpdateItem.test` | Optimistic rows show "Sending…", settled rows don't (§4.4) |
| `ToastProvider.test` | Toasts announce via `role="status"` without stealing focus, and auto-dismiss |

**`npm run test:e2e`** — Playwright, five specs on the highest-value paths:

1. `/dashboard` redirects an anonymous visitor to `/login` and never renders the
   protected heading.
2. `/status-guide` renders fully **with JavaScript disabled** — the proof that
   the server-rendered path is real.
3. Signing in and reading the dashboard **with JavaScript disabled** — the
   Server Action form posts natively, so auth is progressive enhancement, not a
   JS dependency.
4. Filters round-trip through the URL and survive a reload.
5. Posting an update appears optimistically within 1s, then persists across a
   reload.

Specs 3–5 need `E2E_EMAIL` / `E2E_PASSWORD` and skip cleanly without them.

---

## 6. Known limitations and what I'd do next

Stated up front rather than discovered in review.

**Simulated telemetry.** The service-health sparklines and the per-incident
impact chart are generated by a seeded PRNG, not measured. The data model has no
metrics table and building one wasn't the point of the exercise. They are
labelled "simulated" in the UI, and `lib/telemetry.ts` is written so the
generator can be swapped for a real metrics query without touching a component —
the callers only need a `number[]`.

**No pagination or virtualisation.** The dashboard query is capped at 200
incidents and the feed at 100 updates. At thousands of active incidents I would
add keyset pagination on `(severity, updated_at, id)`, virtualise the activity
history, and move the counts into a materialised view or a `count` aggregate
rather than fetching rows to count them.

**Realtime fan-out.** Every connected client currently subscribes to all
`incidents` changes. At scale that's O(clients × writes). I'd move to a
per-team channel with an RLS-aware filter, and pair it with the tag-based cache
described in §4.6 so one write invalidates one cache entry instead of waking
every client.

**Single team, no roles.** There is no `organization_id` and everyone who can
sign in can edit any incident. Multi-tenancy is a schema change plus an RLS
predicate (`org_id = auth.jwt() ->> 'org_id'`) rather than an application
change — which is precisely the argument for putting authorization in the
database in the first place.

**No frontend observability.** Errors go to `console.error` with a marker.
Next step is Sentry for exceptions plus `useReportWebVitals` for INP/LCP,
tagged by route, so a regression in the streamed sections is visible rather
than anecdotal.

**Partial Prerendering.** PPR would let the dashboard's static shell be served
from the edge while the dynamic content streams into the same response. It is
still canary-only in Next.js, so this build uses `force-dynamic` plus Suspense —
the same shape, one less optimisation.

**Other things I'd add with more time:** presence indicators (who else is
viewing this incident), draft persistence to `localStorage` before submit rather
than only on failure, debounced full-text search synced to the URL, an audit
log table, and an automated accessibility pass in CI (`axe-core` in Playwright).

---

## 7. Why this stack

The assessment doesn't ask for "an app" — it asks for streaming with Suspense,
explicit server/client boundaries, partial hydration, route-level caching and
cache invalidation. So the question isn't which framework I like; it's which
framework gives each of those requirements a **native primitive with a name**.

| Requirement | Primitive used here |
|---|---|
| Server-rendered initial content | Server Components (the default) |
| Streaming a slower section | `<Suspense>` + HTML streaming |
| Explicit server/client boundary | The `'use client'` directive *is* the boundary, visible in the diff |
| Selective hydration | Only `'use client'` subtrees ship JS |
| Route-level caching | `force-static` / `revalidate` / `force-dynamic` per segment |
| Mutations without reload + optimistic UI | Server Actions + `useOptimistic` + `useFormStatus` |
| Route loading states | `loading.tsx` / `error.tsx` / `not-found.tsx` as file conventions |

The alternatives were considered seriously:

- **Nuxt** was the closest. It has solid SSR and `routeRules` for hybrid
  caching. It lost on two points: it hydrates the whole page by default, so the
  server/client boundary exists but isn't explicit in the code the way
  `'use client'` is, and its server components (`NuxtIsland`) are still
  experimental.
- **Astro** has the purest expression of partial hydration. But this app is
  authenticated and dynamic across nearly its whole surface — the static/dynamic
  ratio that makes Astro shine is inverted here, and almost every region would
  be an island. I applied its philosophy anyway: interactivity only at the
  leaves.
- **Angular** is excellent for large enterprise SPAs, but it is client-first
  with SSR added. `@defer` defers *client loading*, not *server streaming*, and
  incremental hydration is very recent. This assessment rewards the opposite
  posture.

**Why Supabase over Convex/Firebase:** Postgres with row level security answers
"how do you protect sensitive data beyond hiding it in the UI?" directly —
authorization lives in the database, not the client. `@supabase/ssr` gives
httpOnly cookie auth that works inside Server Components and middleware, which
is what makes "never flash protected content" achievable structurally. Convex's
realtime is more elegant but client-centric; Firestore is NoSQL without
relational RLS and its SSR cookie story is more artisanal.

**Honest risks of this choice:** RSC has a real conceptual learning curve and a
new class of mistakes (importing server code into a client component,
non-serialisable props) — mitigated here by keeping client components at the
leaves and all reads in one server-only module. And Next.js is perceived as
Vercel-coupled; nothing in this architecture depends on a Vercel-exclusive
feature, and it self-hosts on any Node runtime.
