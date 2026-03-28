# Project Context — tedaniel.minorcortes.com

## Domain
tedaniel.minorcortes.com

## Project Type
Single-page interactive baby shower landing page

## Permanent Requirements

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
├── index.html
├── css/styles.css
├── js/main.js
├── assets/
│   ├── images/
│   └── videos/
├── docs/
│   ├── PROJECT_CONTEXT.md   ← this file
│   └── AGENT_RULES.md       ← agent workflow rules
├── deploy.sh                 ← FTP deploy (git-ignored)
└── .ftp-credentials          ← FTP creds (git-ignored)
```
