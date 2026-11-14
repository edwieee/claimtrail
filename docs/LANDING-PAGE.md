# Dashboard landing-style hero

## Surface contract

- The existing `/` dashboard route is preserved. No separate homepage or dashboard route is introduced.
- A full-viewport, borderless hero precedes the existing console on the same scrollable page. The console retains its own viewport height and internal scrolling.
- The old small hero card in `OverviewDashboard` is removed; assessment data, sidebar, top bar, review, uploads, checks and exports remain below the hero.
- `Start Your Journey` and `How It Works` select the existing Questionnaire Catalog and move focus into the assessment workspace. `Features` selects Evidence Sources. `FAQs` opens accessible contextual help. `Home` returns to the hero.
- No assessment state, API endpoints, server logic or persistence behavior is changed.

## Visual direction

**Mode:** Persuade for the first viewport; Operate for the existing console below it.

The supplied Axial.ai reference pins the direction: a spacious monochrome field, centered headline and website navigation directly over the artwork. Keep ClaimTrail’s Geist typography, CT mark, neutral palette and copper-orange interactive accents. No bordered hero, dashboard chrome in the first viewport, additional marketing sections or decorative animation.

`components/LandingHero.tsx` owns the same-page navigation. Its CSS module uses minimum `100vh` / `100svh`, responsive type, cover cropping of the real raster asset, and a quiet readability fade. Native mobile disclosure supports Escape and closes when selecting a destination. Dialogs make both the hero and console inert while open.

## Asset provenance

- **Asset:** `public/images/claimtrail-hero-background.png` (1536 × 1024, PNG).
- **Source:** user-supplied background image `Designer (2).png`.
- **Method:** The exact supplied image is used as the full-bleed background with no extraction, redrawing, cropping or filtering. A soft central fade keeps the headline readable.
- The reference is user-provided; no separate license or redistribution rights are asserted.
- The earlier `public/world-map.svg` remains untouched but is not used by this hero.

## Verification

- `npm run build`: passed with the original route set, including `/` and all existing API routes; no `/dashboard` route.
- `npm test`: 3 files, 7 tests passed.
- Production Playwright review at 1440×900, 1280×800, 768×1024, 390×844 and 320×568: hero and console each fill one viewport, console starts immediately after the hero, and hero content is vertically centered.
- No horizontal document overflow, runtime/hydration errors, or axe WCAG A/AA violations in the tested hero and FAQ states.
- Both desktop and mobile navigation reach the existing Questionnaire and Evidence Sources workspaces without changing route. The CTA scrolls to and focuses `#assessment`.
- FAQ disclosure, Escape dismissal and background inert restoration passed at all five widths.
- Reviewed desktop/mobile screenshots: original artwork visible without reference text, no card or dashboard chrome around the hero, readable copy and intact console layout below.

**Verdict:** ready. Responsive cover cropping intentionally shows less artwork on narrow portrait screens; no replacement pattern is introduced to fill the crop. Backend and mutation flows were not changed; browser checks exercised navigation without uploading, exporting or altering assessment data.
