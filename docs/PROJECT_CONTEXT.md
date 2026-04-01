# Project Context — tedaniel.minorcortes.com

## Domain
tedaniel.minorcortes.com

## Project Type
Single-page interactive baby shower landing page

## Permanent Requirements

### Privacy & Discoverability (CRITICAL)
- This landing page is strictly personal — only accessible via direct link.
- Must include `<meta name="robots" content="noindex, nofollow, noarchive, noimageindex, nosnippet">`.
- Must include a strict `robots.txt` blocking all crawlers (`Disallow: /`).
- ✅ Open Graph IS allowed strictly for link preview generation (WhatsApp, iMessage, email, social sharing previews).
- ❌ Open Graph must NOT be used for SEO or discoverability.
- The site must remain fully non-indexable and must NEVER appear in Google or any other search engine index.

### Architecture
- Single landing page only — NO multi-page architecture
- Internal anchor navigation (section scrolling)
- Sticky top navigation (always visible while scrolling)
- Smooth scrolling between sections
- Back-to-top button always accessible

### Design
- Elegant, warm, premium baby shower aesthetic
- Mobile-first responsive design
- Touch-friendly UI (minimum 48px tap targets)
- Lightweight performance (no heavy frameworks)
- Custom generated visual assets (future integration)

### Responsive Breakpoints
| Device | Min Width |
|--------|-----------|
| Phone portrait | default (< 480px) |
| Phone landscape | 480px |
| Tablet portrait | 768px |
| Tablet landscape | 1024px |
| Desktop | 1280px |

### Infrastructure
- **Source of truth**: GitHub (https://github.com/minorcortes/tedaniel-minorcortes)
- **Deploy**: GitHub Actions (push to `main` → FTP to SiteGround)
- **Fallback deploy**: `deploy.sh` (manual FTP, local only)
- **Deploy docs**: See `docs/DEPLOY_WORKFLOW.md`
- **Production URL**: https://tedaniel.minorcortes.com/
- **Asset pipeline**: All production assets must live in `assets/images/web/`
- **Credentials**: GitHub Secrets (never in code). Local `.ftp-credentials` for manual fallback.

### Technology Stack
- HTML5 (semantic)
- Vanilla CSS (mobile-first)
- Vanilla JavaScript (no frameworks unless explicitly approved)
- No build tools required
- CSS minified via `clean-css-cli`
- JS minified via `terser`

## File Structure
```
tedaniel.minorcortes.com/
├── robots.txt               ← blocks all crawlers
├── index.html
├── css/
│   ├── styles.css           ← source styles (mobile-first)
│   └── styles.min.css       ← minified production styles
├── js/
│   ├── main.js              ← source slider/logic
│   ├── main.min.js          ← minified production logic
│   ├── rsvp.js              ← source form/rsvp logic
│   └── rsvp.min.js          ← minified production rsvp
├── assets/
│   └── images/
│       └── web/
│           ├── hero/        ← Hero parallax layers
│           ├── mobile/      ← Responsive assets (mobile)
│           ├── tablet/      ← Responsive assets (tablet)
│           ├── desktop/     ← Responsive assets (desktop)
│           ├── decor/       ← Decorative elements (3 breakpoints)
│           ├── daniel/      ← Daniel section (video, overlays)
│           ├── bg/          ← Section backgrounds
│           ├── nosotros/    ← Photo slider (16 WebP slides)
│           ├── logo/        ← Site logos
│           ├── favicon/     ← Favicons & app icons
│           └── seccion_dani/ ← Birth countdown background
├── backend/
│   └── APPS_SCRIPT.js       ← Google Apps Script (RSVP form)
├── images/                   ← Internal library (masters, hi-res, work files)
│                                NOT deployed, NOT migrated wholesale.
│                                Assets promoted selectively to assets/images/web/
│                                only when user explicitly instructs it.
├── docs/
│   ├── PROJECT_CONTEXT.md    ← this file
│   ├── AGENT_RULES.md        ← agent workflow rules
│   └── DEPLOY_WORKFLOW.md    ← deploy pipeline & rules
├── .github/
│   └── workflows/
│       └── deploy.yml        ← GitHub Actions CI/CD
├── deploy.sh                 ← Manual FTP fallback (git-ignored)
└── .ftp-credentials          ← FTP creds (git-ignored)
```

## Implemented Features

### Photo Slider — Sección "Nosotros"
- **16 photos** (slide-00.webp to slide-15.webp) in `assets/images/web/nosotros/`
- **Crossfade** (1.2s opacity transition) + **Ken Burns** (6.2s transform zoom 1→1.04)
- **IntersectionObserver** autoplay: starts when section is 30% visible, pauses when off-screen
- **State persistence**: resumes from current slide and remaining time, never resets
- **Accessibility**: respects `prefers-reduced-motion` (static first photo, no animation)
- **Implementation**: Vanilla CSS transitions + Vanilla JS (~50 lines in `main.js` / run via `main.min.js`)

### Performance & Asset Optimization (2026-04-01)
- Complete refactoring of image payload, reducing total transfer weight by ~49% (~8.3 MB → ~4.2 MB).
- 16 JPG slides converted to WebP (70% reduction).
- Hardcoded `/images/` assets migrated to `/assets/images/web/` and resized.
- CSS/JS minified and referenced properly.
- Animated hero bear confirmed as an exception: permitted to be heavier (up to 1MB desktop) to preserve smooth 76-frame playback.

## Lessons Learned

### Ken Burns: Use `transition`, never `@keyframes`
- **Problem**: Using `animation: ken-burns 6.2s forwards` causes a visible "snap-back" when the `--active` class is removed (transform instantly resets to scale(1)).
- **Solution**: Use `transition: transform 6.2s ease-in-out` on the base class + `transform: scale(1.04)` on the active class. The de-zoom happens through the same transition and is invisible because opacity drops to 0 in only 1.2s.
- **Rule**: For effects toggled by class addition/removal, always use CSS `transition`. Reserve `@keyframes` for continuous/infinite loops only.

### Visual Regressions in Asset Optimization
- **Incident**: Aggressive optimization of `bear-animated.webp` (76 → 25 frames) caused a severe visual regression (choppy animation, altered scale, degraded hero experience).
- **Resolution**: Restored original version via Git. Asset marked as "crítico no degradable".
- **Rule**: Optimizing without visual context can break UX. Not everything must be compressed overzealously. Animations require special treatment. Git is a mandatory safety net for graphic assets. Visual validation is strictly mandatory in frontend tasks.

