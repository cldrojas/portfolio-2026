# Portfolio 2026 — Front End Engineer

Personal portfolio website built with **Astro 6**, **React 19**, and **TailwindCSS 4**.

## 🚀 Tech Stack

- **Framework**: Astro 6 (SSR / server output)
- **UI**: React 19 + TailwindCSS 4
- **Deploy**: Cloudflare Pages (production) · Node.js standalone (dev)
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
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview build locally |
| `pnpm astro ...` | Run Astro CLI commands |

## 🌐 Deployment

**Production**: Cloudflare Pages (via `@astrojs/cloudflare` adapter)  
**Development**: Node.js standalone server (via `@astrojs/node` adapter)

The adapter is selected automatically based on `NODE_ENV`:
- `production` → Cloudflare Pages
- `development` → Node.js

Connect your repository to Cloudflare Pages for automatic deployments on push to `main`.

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