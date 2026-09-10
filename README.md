# Contentful + Next.js Demo (GraphQL, with Preview API)

A minimal Next.js (App Router) app showing the Next.js team a working
integration with Contentful:

- Content fetched with the **GraphQL Content API** (no SDK, plain `fetch`)
- **Content Delivery API** (published content) by default
- **Content Preview API** (draft content) via Next.js **Draft Mode**
- A single content type, `carProduct`, with fields `modelName`, `carPrice`,
  `carImage`

## How it fits together

| File | Purpose |
| --- | --- |
| [`src/lib/contentful.ts`](src/lib/contentful.ts) | Thin GraphQL client. Picks the CDA or CPA token and endpoint based on a `preview` flag. |
| [`src/lib/queries.ts`](src/lib/queries.ts) | GraphQL queries for the `carProduct` content type. |
| [`src/lib/types.ts`](src/lib/types.ts) | TypeScript types matching the GraphQL response shape. |
| [`src/app/page.tsx`](src/app/page.tsx) | Lists `carProduct` entries. |
| [`src/app/cars/[id]/page.tsx`](src/app/cars/[id]/page.tsx) | Single `carProduct` entry, looked up by `sys.id`. |
| [`src/app/api/preview/route.ts`](src/app/api/preview/route.ts) | Enables Next.js Draft Mode (switches reads to the Preview API). |
| [`src/app/api/exit-preview/route.ts`](src/app/api/exit-preview/route.ts) | Disables Draft Mode. |
| [`src/components/PreviewBanner.tsx`](src/components/PreviewBanner.tsx) | Banner shown on every page while Draft Mode is on. |

Every page reads `draftMode()` from `next/headers` and passes `isEnabled` as
the `preview` flag into `fetchGraphQL`. That's the entire mechanism: one flag
decides the token and the endpoint used for that request. No separate
"preview build" is needed.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Environment variables

Copy `.env.local.example` to `.env.local` and fill in your space's values
(a working `.env.local` is already included in this demo for convenience —
treat it as a secret file, it is git-ignored):

```
CONTENTFUL_SPACE_ID=
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_CDA_TOKEN=
CONTENTFUL_CPA_TOKEN=
CONTENTFUL_PREVIEW_SECRET=
```

`CONTENTFUL_CMA_TOKEN` (Content Management API) is not used by this app —
it's a read-only demo. Never expose the CMA token to the client; if you add a
use for it, only call it from server-side code (API routes / Server
Components), same as the CDA/CPA tokens here.

### Adding content

The `carProduct` content type currently has no entries. In Contentful, add
an entry with:

- `modelName` (Short text)
- `carPrice` (Integer)
- `carImage` (Media, one image)

Publish it and it will show up on `/` using the Content Delivery API.

## Trying the Preview API

1. Leave a `carProduct` entry **unpublished** (or publish it, then edit a
   field without publishing the change) so the draft differs from what's
   published.
2. Visit:
   ```
   http://localhost:3000/api/preview?secret=YOUR_CONTENTFUL_PREVIEW_SECRET&path=/
   ```
   using the value of `CONTENTFUL_PREVIEW_SECRET` from `.env.local`.
3. You'll be redirected to `/` with a "Preview mode enabled" banner, now
   showing the draft data via the Content Preview API.
4. Click "Exit preview" (or visit `/api/exit-preview`) to go back to
   published-only content.

In a real project, configure this same URL as the **Preview URL** on the
`carProduct` content type in Contentful's web app (Settings → Content model
→ carProduct → Preview panel), typically:

```
https://your-domain/api/preview?secret=YOUR_SECRET&path=/cars/{entry_id}
```

so editors can click "Preview" directly from the entry editor.

## Notes for the Next.js team

- Published reads use `cache: "force-cache"`; preview reads use
  `cache: "no-store"` so drafts are never cached. See `fetchGraphQL` in
  `src/lib/contentful.ts`.
- Calling `draftMode()` in a page automatically opts that route into dynamic
  rendering — no extra config needed for preview to work correctly.
- Images are served through `next/image`, pointed at Contentful's asset CDN
  (`images.ctfassets.net`, allow-listed in `next.config.ts`), with
  Contentful's own image API params (`?w=...&h=...&fit=fill`) applied at the
  URL level.
