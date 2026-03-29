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
- Do NOT add SEO metadata designed for ranking or discovery (no meta description, no Open Graph, no schema.org).
- This page must NEVER appear in Google or any other search engine index.

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
- GitHub repository: minorcortes/tedaniel-minorcortes
- FTP deployment to SiteGround (tedaniel.minorcortes.com/public_html/)
- Deploy only when explicitly requested

### Technology Stack
- HTML5 (semantic)
- Vanilla CSS (mobile-first)
- Vanilla JavaScript (no frameworks unless explicitly approved)
- No build tools required

## File Structure
```
tedaniel.minorcortes.com/
├── robots.txt              ← blocks all crawlers
├── index.html
├── css/styles.css
├── js/main.js
├── assets/
│   ├── images/
│   │   └── web/            ← WebP producción (mobile/tablet/desktop/bg)
│   └── videos/
├── images/                  ← Master PNGs (gitignored, no deploy)
├── docs/
│   ├── PROJECT_CONTEXT.md   ← this file
│   └── AGENT_RULES.md       ← agent workflow rules
├── deploy.sh                 ← FTP deploy (git-ignored)
└── .ftp-credentials          ← FTP creds (git-ignored)
```
