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

10. **Performance** — Keep assets optimized. Lazy-load images. Minimize HTTP requests. No unnecessary dependencies.

## Skills Available

| Skill | Location | Use |
|-------|----------|-----|
| superpowers | ~/.gemini/antigravity/skills/superpowers/ | Planning, debugging, brainstorming, code review |
| stitch-skills | ~/.gemini/antigravity/skills/stitch-skills/ | Design system, prompt enhancement, screen generation |
| ui-ux-pro-max | ~/.gemini/antigravity/skills/ui-ux-pro-max/ | Style/color/typography/UX lookup (searchable DB) |

## Workflow

1. Read PROJECT_CONTEXT.md before any work
2. Check if a skill applies to the current task
3. Propose changes as diff
4. Apply only after approval
5. Test responsiveness across all breakpoints
6. Commit with descriptive messages
7. Push to GitHub
