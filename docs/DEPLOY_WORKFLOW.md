# Deploy Workflow — tedaniel.minorcortes.com

> Última actualización: 2026-04-01

---

## 1. Fuente de verdad

**GitHub es la fuente oficial del proyecto.**

- Repo: https://github.com/minorcortes/tedaniel-minorcortes
- Branch de producción: `main`
- Toda modificación debe pasar por Git antes de llegar a producción.

---

## 2. Flujo de publicación

```
Desarrollo local
    ↓
git add + git commit
    ↓
git push origin main
    ↓
GitHub Actions (automático)
    ↓
FTP Deploy → ftp.minorcortes.com
    ↓
https://tedaniel.minorcortes.com (producción)
```

---

## 3. Deploy automático (GitHub Actions)

**Mecanismo principal.** Configurado en `.github/workflows/deploy.yml`.

| Aspecto | Detalle |
|---|---|
| Trigger | Push a `main` + dispatch manual |
| Action | `SamKirkland/FTP-Deploy-Action@v4.3.5` |
| Credenciales | GitHub Secrets (`FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_PORT`) |
| Destino | `/` (root del subdominio) |

### Archivos excluidos del deploy automático:
- `.git*`, `.gitignore`
- `deploy.sh`, `.ftp-credentials`
- `docs/`, `backend/`
- `.tmp/`, `node_modules/`
- `images/` (masters locales)
- Source CSS/JS (`styles.css`, `main.js`, `rsvp.js`, `*.original.*`)
- Scripts auxiliares (`capture_*.js`, `convert_*.sh`)
- `.github/`

### Solo se suben a producción:
- `index.html`
- `robots.txt`
- `css/styles.min.css`
- `js/main.min.js`, `js/rsvp.min.js`
- `assets/` (imágenes, videos, favicons, logos)

---

## 4. Deploy manual (fallback)

**Solo en emergencias.** Usar `deploy.sh` con credenciales locales.

```bash
bash deploy.sh
```

Requiere:
- `lftp` instalado (`brew install lftp`)
- `.ftp-credentials` configurado localmente

---

## 5. Reglas de assets

### Regla principal
**TODOS los assets de producción deben vivir dentro de `assets/images/web/`.**

### Estructura oficial

```
assets/
└── images/
    └── web/
        ├── hero/           ← Fondos del hero
        ├── mobile/         ← Assets responsive (móvil)
        ├── tablet/         ← Assets responsive (tablet)
        ├── desktop/        ← Assets responsive (desktop)
        ├── decor/          ← Elementos decorativos (3 breakpoints)
        ├── daniel/         ← Sección Daniel (video, overlays)
        ├── bg/             ← Fondos de secciones
        ├── nosotros/       ← Slides carrusel fotos
        ├── logo/           ← Logos del sitio
        ├── favicon/        ← Favicons e iconos
        └── seccion_dani/   ← Fondo sección cuenta regresiva
```

### Prohibido
- NO usar rutas fuera de `assets/` (ej: `images/seccion_dani/`)
- NO poner assets en el root del proyecto
- NO referenciar rutas absolutas en CSS/HTML
- NO subir masters/originales a producción (viven en `/images/` local)

---

## 6. Reglas de seguridad

| Regla | Implementación |
|---|---|
| Credenciales FTP | Solo en GitHub Secrets + `.ftp-credentials` local |
| `.ftp-credentials` | Excluido por `.gitignore` |
| `deploy.sh` | Excluido por `.gitignore` |
| Si se rotan credenciales | Actualizar GitHub Secrets + `.ftp-credentials` |
| Si se exponen credenciales | Rotar inmediatamente en hosting + GitHub |

---

## 7. Lecciones aprendidas (incidentes)

### Incidente 2026-04-01: Deploy FTP directo subió basura
- **Causa:** `mirror --reverse --delete` sin exclusiones adecuadas
- **Impacto:** `node_modules/`, `.tmp/`, scripts de trabajo subidos al servidor
- **Resolución:** Limpieza manual del servidor + reescritura del script
- **Prevención:** Migración a GitHub Actions con lista de exclusión explícita

### Incidente 2026-04-01: Asset legacy fuera del pipeline
- **Causa:** `images/seccion_dani/fondo_contador_nacimiento.webp` referenciado directamente
- **Impacto:** Dependencia de la carpeta `images/` que no pasa por el pipeline
- **Resolución:** Asset copiado a `assets/images/web/seccion_dani/`, referencia actualizada
- **Prevención:** Regla permanente: todo asset en `assets/images/web/`

---

## 8. Checklist pre-deploy

Antes de hacer push a `main`:

- [ ] CSS minificado regenerado (`npx clean-css-cli`)
- [ ] JS minificados regenerados (`npx terser`)
- [ ] No hay rutas legacy en CSS/HTML
- [ ] No hay credenciales en archivos versionados
- [ ] Assets nuevos están dentro de `assets/images/web/`
- [ ] `git status` limpio
- [ ] Prueba local verificada
