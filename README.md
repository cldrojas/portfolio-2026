# Portfolio 2026 — Front End Engineer

Personal portfolio website built with **Astro 6**, **React 19**, and **TailwindCSS 4**.

## 🚀 Tech Stack

- **Framework**: Astro 6 (SSR / server output)
- **UI**: React 19 + TailwindCSS 4
- **Deploy**: Cloudflare Workers (`@astrojs/cloudflare` v13) · Node.js standalone (dev)
- **Package Manager**: pnpm

## 📁 Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/              # Static assets (SVGs, images)
│   ├── components/
│   │   ├── common/          # Navigation, Footer, ThemeToggle
│   │   └── sections/        # Hero, About, Skills, Projects, Contact
│   ├── data/                # Projects & categories data
│   ├── layouts/             # Base layout (Layout.astro)
│   ├── pages/
│   │   ├── index.astro      # Main page
│   │   └── api/contact.ts   # Contact form endpoint
│   └── styles/global.css    # Global styles
├── astro.config.mjs         # Astro config (dual adapter)
├── tailwind.config.mjs      # Tailwind config
└── package.json
```

## 🧞 Commands

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server at `localhost:4321` (adapter Node) |
| `pnpm build` | Build dev-adapter site to `./dist/` |
| `pnpm build:prod` | Build con adapter Cloudflare (usado por CI) |
| `pnpm preview` | Preview build locally |
| `pnpm cf:setup` | Crea KV `SESSION` y registra id en `wrangler.jsonc` (idempotente) |
| `pnpm smoke:test <url>` | Smoke test contra URL deployada |
| `pnpm astro ...` | Run Astro CLI commands |

## 🌐 Deployment

**Producción**: Cloudflare Workers vía `@astrojs/cloudflare` v13 (Workers Static Assets + SSR).
**Desarrollo**: Node.js standalone vía `@astrojs/node`.

El adaptador se selecciona por `NODE_ENV`:
- `production` → Cloudflare (`pnpm build:prod`)
- otro valor → Node.js

> ⚠️ **El build de producción corre en GitHub Actions, no en local.** El binario
> `workerd` (invocado por miniflare durante el build del adapter) requiere
> macOS 13.5+; esta máquina tiene 12.6. En Linux/CI funciona sin problema.
> Local: desarrollar con `pnpm dev`; desplegar = push.

### Pipeline (.github/workflows/deploy.yml)

| Evento | Acción |
|---|---|
| PR | build + `wrangler versions upload -c dist/server/wrangler.json` → preview URL + smoke test |
| push a `main` / manual | build + `wrangler deploy -c dist/server/wrangler.json` → producción + smoke test |

> ℹ️ El build emite su propio `dist/server/wrangler.json` (con `main`, assets y
> bindings completos). Deployar desde la raíz falla: el `wrangler.jsonc` raíz no
> declara `main` por diseño del adaptador v13.

Sin `CLOUDFLARE_API_TOKEN` configurado, el pipeline solo valida el build
(los jobs de deploy se saltan elegantemente).

### Setup único (una vez)

1. Crear API Token en Cloudflare: **My Profile → API Tokens → "Edit Cloudflare Workers"**
   (permisos: Workers Scripts:Edit + Account Settings:Read; añadir *Workers KV Storage:Edit* para el bootstrap del KV).
2. Guardarlo en el repo:
   ```bash
   gh secret set CLOUDFLARE_API_TOKEN
   gh secret set CLOUDFLARE_ACCOUNT_ID   # opcional si el token es de una sola cuenta
   ```
3. Push a `main`. El pipeline crea el KV `SESSION` si falta, deploya y verifica con smoke tests.

### Operación

```bash
# Ver logs en vivo (requiere auth local o token)
npx wrangler tail portfolio-2026

# Listar versiones deployadas
npx wrangler versions list

# Rollback inmediato a versión anterior
gh workflow run rollback.yml            # última versión
gh workflow run rollback.yml -f version=<VERSION_ID>
```

Smoke test post-deploy: `GET /` (200 + HTML), `POST /api/contact` válido (200 +
`success:true`) e inválido (400). Falla cualquier criterio = deploy marcado rojo.

## 📧 Contact Form

The contact form submits to `/api/contact.ts` (Astro API route). Configure your email service in that file.

## 🎨 Features

- Dark/Light theme toggle (persisted in localStorage)
- Responsive navigation with mobile menu
- Project filtering by category (Frontend / Full Stack / Mobile)
- Skills showcase with animated progress bars
- Contact form with validation
- Fully responsive, accessible, SEO-ready

---

Built with ❤️ using Astro