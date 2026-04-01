# Agent Rules — tedaniel.minorcortes.com

## Mandatory Rules

1. **Single page only** — Do NOT split this project into multiple HTML pages. All content lives in index.html with section-based navigation.

2. **Show diff before changes** — Always show the proposed diff and wait for approval before applying any code change.

3. **Semantic HTML** — Use proper HTML5 elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<figure>`, `<figcaption>`, etc.

4. **Maintainable CSS** — Use CSS custom properties for design tokens. Organize styles by component. Mobile-first with progressive enhancement via media queries.

5. **Maintainable JavaScript** — Vanilla JS only. Use IIFE or module pattern. Keep it lightweight. No jQuery, no heavy frameworks.

6. **Mobile first** — Default styles target phones. Use `min-width` media queries to enhance for larger screens.

7. **No heavy frameworks** — Do not add React, Vue, Angular, Bootstrap, Tailwind, or similar unless the user explicitly approves.

8. **No visual design without instruction** — Do not start designing sections, choosing colors, or adding visual elements until explicitly instructed.

9. **No deployment without instruction** — Do not run deploy.sh or upload any files unless the user explicitly requests it.

10. **Performance** — Keep assets optimized. Lazy-load images. Minimize HTTP requests. No unnecessary dependencies. (See Rule 12 for critical exceptions).

## Skills Available

| Skill | Location | Use |
|-------|----------|-----|
| superpowers | ~/.gemini/antigravity/skills/superpowers/ | Planning, debugging, brainstorming, code review |
| stitch-skills | ~/.gemini/antigravity/skills/stitch-skills/ | Design system, prompt enhancement, screen generation |
| ui-ux-pro-max | ~/.gemini/antigravity/skills/ui-ux-pro-max/ | Style/color/typography/UX lookup (searchable DB) |

## Workflow

1. Read PROJECT_CONTEXT.md before any work
2. Read DEPLOY_WORKFLOW.md if task involves deploy or assets
3. Check if a skill applies to the current task
4. Propose changes as diff
5. Apply only after approval
6. Test responsiveness using Puppeteer (see Rule 11 below)
7. Regenerate minified CSS/JS if source was modified
8. Commit with descriptive messages
9. Push to GitHub (triggers automatic deploy)

---

## Rule 11 — Responsive Validation Protocol (MANDATORY)

> **Established 2026-03-30 after bear/flex-basis bug in Nosotros section.**

### ❌ NEVER use these methods to validate responsive layout:
- Browser agent DOM screenshots
- `browser_resize_window` tool
- Any screenshot taken at the native Mac display resolution

**Reason:** The browser agent cannot reduce below the physical display resolution (~1728px on this Mac). All screenshots will appear as desktop — false positives guaranteed.

### ✅ ALWAYS use Puppeteer for responsive validation:

Use `capture_bear_responsive.js` as the base script (or adapt it). Run:

```bash
node capture_bear_responsive.js
```

**Mandatory checkpoints for ANY responsive fix:**

| Viewport | Why |
|---|---|
| 415px | iPhone SE / portrait |
| 700px | Critical intermediate zone |
| 768px | Tablet portrait breakpoint boundary |
| 1024px | Tablet landscape |
| 1280px | Desktop breakpoint boundary |
| 1440px | Desktop standard |

### ✅ Mandatory JS measurements per breakpoint:

```js
const bear = document.querySelector('.selector');
const rect = bear.getBoundingClientRect();
const cs = window.getComputedStyle(bear);
// Report: rect.width, rect.height, cs.position, cs.flexBasis, cs.display
```

Report must include: **width px + position (static/absolute) + layout row/column**.

---

## Rule 12 — Asset Optimization & Visual Validation Protocol (CRITICAL)

> **Established 2026-04-01 after destructive optimization of the hero bear animation.**

### Asset Classification
- **CRÍTICOS:** Hero (oso animado), Logo principal, Elementos centrales above-the-fold.
- **IMPORTANTES:** Slider “Nosotros”, Sección Daniel, Sección Evento.
- **SECUNDARIOS:** Decoraciones, Fondos, Elementos pequeños.

### Mandatory Rules for Optimizations
1. **PROTECCIÓN DE ASSETS CRÍTICOS:** Assets dentro del hero NO pueden ser degradados agresivamente. Cualquier optimización debe mantener fluidez, timing, proporción y calidad visual.
2. **PROHIBIDO REDUCIR FRAMES SIN VALIDACIÓN:** No reducir frames automáticamente, no alterar FPS sin aprobación, no re-encodear animaciones críticas agresivamente.
3. **VALIDACIÓN VISUAL OBLIGATORIA:** Antes de finalizar cambios visuales, verificar que no hay regresión (especialmente en hero y animaciones).
4. **OPTIMIZACIÓN INTELIGENTE:** Priorizar peso SOLO cuando no afecte la percepción visual. Gana calidad visual en zonas críticas sobre el ahorro de KB.
5. **EXCEPCIONES:** Assets críticos pueden ser pesados si son clave para branding y UX.

### Protocolo de Optimización
1. Identificar clasificación del asset.
2. Aplicar optimización proporcional.
3. NO tocar animaciones sin validación.
4. Verificar visualmente que no haya pérdida de calidad/fluidez.
5. Confirmar antes de cerrar tarea.

---

## CSS Gotchas (learned in production)

### 1. `flex-basis` overrides `width`
When an element is a flex child, `flex-basis` takes priority over `width`.
**Always pair with `max-width` to cap the rendered size:**
```css
/* ❌ Wrong — width ignored by flex */
.el { flex-basis: 100%; width: 150px; }

/* ✅ Correct — max-width enforces the cap */
.el { flex-basis: 100%; width: 150px; max-width: 150px; }
```

### 2. Responsive bear layout strategy
- `<768px` → `position: static`, `clamp(100px, 28vw, 150px)`, below text
- `768px–1279px` → `position: static`, `max-width: 150px`, flex row or second row
- `≥1280px` → `position: absolute`, `width: 175px`, decorative bottom-right

### 3. Transitions vs @keyframes
- **State changes (toggled):** Use `transition` only
- **Infinite loops:** Use `@keyframes`
- Mixing both on the same property causes snap-back bugs

---

## Rule 13 — Deploy Workflow (MANDATORY)

> **Established 2026-04-01 after FTP deploy incident.**

### Source of Truth
- **GitHub** is the single source of truth for this project.
- All changes must be committed and pushed before deployment.

### Deploy Flow
```
git push origin main → GitHub Actions → FTP → Production
```

### Rules
1. **Never attempt direct FTP deploy** without using the official script or GitHub Actions.
2. **Never use `mirror --delete` without explicit exclusions** — this can destroy server files.
3. **GitHub Actions** is the primary deploy mechanism. Manual `deploy.sh` is fallback only.
4. **Deploy docs**: See `docs/DEPLOY_WORKFLOW.md` for full reference.

---

## Rule 14 — Asset Pipeline (MANDATORY)

> **Established 2026-04-01 after legacy asset incident.**

### ALL production assets MUST live in:
```
assets/images/web/
```

### Prohibited:
- ❌ `images/seccion_dani/` or any path outside `assets/`
- ❌ Putting new assets in root or `images/`
- ❌ Referencing `../images/` in CSS (must be `../assets/images/web/`)
- ❌ Absolute URLs for local assets

### When adding new assets:
1. Place in the correct subdirectory under `assets/images/web/`
2. Provide mobile/tablet/desktop variants if applicable
3. Use WebP format (unless PNG required for transparency quality)
4. Reference with relative paths from CSS (`../assets/images/web/...`)
