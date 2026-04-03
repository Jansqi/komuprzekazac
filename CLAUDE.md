@AGENTS.md

# KomuPrzekazac.pl

Polish civic transparency platform — helps taxpayers choose which OPP (public benefit organization) to direct their 1.5% tax to. 9,671 organizations. Data from NIW PDFs + KRS API + XLSX registry.

**Philosophy:** Transparency model (Candid/GuideStar-inspired), NOT a rating model. Show facts and transparency signals — no scoring, no ranking, no stars, no salary display.

## Stack

- Next.js 16 App Router, static export (`output: 'export'`)
- Tailwind CSS v4 (no config file — uses postcss plugin directly)
- Fuse.js for client-side fuzzy search
- TypeScript throughout
- Data: single static JSON (`public/data/organizations.json`, ~12 MB)
- Deploy: Cloudflare Pages
- UI text in Polish, code/comments in English

## Commands

```bash
npm run dev       # Dev server
npm run build     # Static export (generates ~9,700 pages)
npm run start     # Serve production build
```

## Architecture

- `src/types/organization.ts` — Organization interface + DataFile wrapper
- `src/lib/data.ts` — Build-time data loading (imports JSON directly)
- `src/lib/format.ts` — Polish number formatting, voivodeship formatting
- `src/lib/constants.ts` — Category slugs→names, voivodeship maps, beneficiary tags, scope labels
- `src/components/` — CopyKRS, ShowEmail, FinancialBar, OrgList (reusable)
- `src/app/` — Pages: home, /szukaj, /organizacja/[slug], /kategoria/[slug], /wojewodztwo/[slug], /o-serwisie, /dlaczego-nie-oceniamy, /polityka-prywatnosci

## Data file shape

`public/data/organizations.json` contains `{ meta: { category_averages, ... }, organizations: Organization[] }`. See `src/types/organization.ts` for the full interface.

Key: financial data always shown WITH category context. Never show "admin costs: 15%" alone — always compare to category average from `meta.category_averages`.

## Polish formatting rules

- Thousands separator: non-breaking space ("1 234 567 zł")
- Decimal separator: comma ("7,3 mln zł")
- `<html lang="pl">` on every page
- ASCII-only URLs (no diacritics in slugs)
- KRS number: 10-digit zero-padded, must be copy-able with one click
- Email behind "pokaż" button (spam protection)

## Known bugs (as of 2026-04-03)

1. **Badge CSS classes undefined** — `badge`, `badge-primary`, `badge-secondary` used across OrgList, search results, org profiles, but never defined in globals.css or any Tailwind config. No DaisyUI installed. These elements render unstyled.
2. **Search URL state not persisted** — /szukaj uses only useState for query + filters + pagination. Refresh = reset. Can't share filtered URLs. Needs useSearchParams() sync.

## Known missing features

- Voivodeship pages: no category breakdown (spec requires it)
- OG tags: only on /organizacja/[slug], missing on category/voivodeship/static pages
- No canonical tags on any page
- No ARIA/accessibility attributes on interactive elements
- Schema.org JSON-LD only on org profiles (no BreadcrumbList, no SearchAction)

## Design rules

1. No scoring, ranking, or stars — this is fundamental
2. KRS number copy-able with one click
3. Financial data always with category context
4. Mobile-first responsive
5. Email behind "pokaż" button
6. Transparency signals as badges: website, email, form type, OPP tenure
