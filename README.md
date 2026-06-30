# GymSpot — Landing Page

Marketing landing page for the GymSpot fitness marketplace. Shares the exact
design language of the `gym-web` app (dark theme, primary-green `#22C55E`,
Geist/Almarai fonts) and links visitors into the app ("the system").

## Stack

- **Next.js 16** (App Router, React 19)
- **Tailwind CSS v4** (tokens via `@theme` in `app/globals.css`)
- **shadcn/ui** (`components/ui/button.tsx`, `components.json`)
- **Framer Motion** (animations, lazy-loaded + memoized — see Performance)
- **next-intl** (bilingual `en` / `ar` with full RTL)

## Sections

1. **Hero** — about GymSpot + CTA into the platform (`hero-section.tsx`)
2. **Gyms** — features + video + "Go to Gyms" button (`gyms-section.tsx`)
3. **Coaches** — features + video + "Go to Coaches" button (`coaches-section.tsx`)
4. **Clients** — features for clients (`clients-section.tsx`)
5. **CTA** — final call-to-action into the system (`cta-section.tsx`)

## Configuration

Copy `.env.example` → `.env` and set:

- `NEXT_PUBLIC_APP_URL` — base URL of the gym-web app the CTAs link to
  (default `http://localhost:3000`). Buttons resolve to
  `${NEXT_PUBLIC_APP_URL}/{locale}/...` via `lib/utils.ts#appUrl`.
- `NEXT_PUBLIC_SITE_URL` — public URL of this landing page (metadata/OG).

## Animation performance

The whole point of the motion layer is "nice, but never janky":

- **Lazy-loaded runtime** — `MotionProvider` uses `LazyMotion` + `domAnimation`,
  so only the small DOM-animation bundle ships and we use the lightweight `m.*`
  components instead of `motion.*` (enforced with `strict`).
- **Memoized variants** — every variant/transition lives at module scope in
  `lib/motion.ts`, keeping a stable reference across renders. Reveal/feature/
  video components are wrapped in `React.memo`.
- **GPU-only properties** — animations touch only `opacity` and `transform`,
  which never trigger layout/paint.
- **Run once** — scroll reveals use `viewport={{ once: true }}` so they never
  re-fire while scrolling.
- **Reduced motion** — `MotionConfig reducedMotion="user"` plus CSS
  `prefers-reduced-motion` guards disable animation for users who ask for it.

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve the build
npm run lint    # eslint
```
