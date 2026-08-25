# PRD — Deploy en Cloudflare Workers

| Campo | Valor |
|---|---|
| Proyecto | portfolio-2026 |
| Fecha | 2026-08-24 |
| Estado | Draft |
| Owner | TBD |

---

## 1. Objetivo

Desplegar el portafolio (Astro 6 SSR) en **Cloudflare Workers** con pipeline reproducible, entornos separados (preview/production), dominio propio y observabilidad mínima. Un deploy debe ser: un push a `main`, cero pasos manuales.

## 2. Contexto actual

Lo que ya existe (no rehacer):

- **Stack**: Astro 6 · React 19 · Tailwind 4
- **Modo**: SSR (`output: 'server'`)
- **Adaptadores**: dual — `@astrojs/node` (dev/local) y `@astrojs/cloudflare` v13 (producción, activado vía `NODE_ENV=production`)
- **Image service**: `cloudflare` ya configurado en el adaptador
- **Wrangler**: v4 instalado como dependencia

Lo que falta (este PRD):

- Config de Wrangler (`wrangler.jsonc`)
- Scripts de build/deploy correctos en `package.json`
- CI/CD (GitHub Actions)
- Entornos y secrets
- Dominio custom
- Verificación post-deploy

### 2.1 Contrato real del adaptador v13 (verificado en código fuente)

El adaptador `@astrojs/cloudflare@13.7.0` cambió su arquitectura respecto a versiones anteriores. Datos verificados en `node_modules/@astrojs/cloudflare/dist/wrangler.js`:

- **No genera `dist/_worker.js`**. El entrypoint por defecto es el paquete mismo: `main = "@astrojs/cloudflare/entrypoints/server"`.
- **Inyecta bindings automáticamente** vía `cloudflareConfigCustomizer`:
  - `kv_namespaces: [{ binding: "SESSION" }]` — almacenamiento de sesiones.
  - `images: { binding: "IMAGES" }` — transformaciones de imagen.
  - `assets: { binding: "ASSETS" }` — assets estáticos.
- **Compatibilidad por defecto**: `compatibility_date = "2026-04-15"` si no se define.
- El directorio de assets (`assets.directory`) lo resuelve el propio adaptador durante el build; la config raíz solo declara el binding.

Consecuencia práctica: el `wrangler.jsonc` debe ser mínimo y dejar que el adaptador complete el resto en build time.

## 3. Alcance

### In scope

1. Configuración de Wrangler para Workers (no Pages — el adaptador v13 es Workers-first).
2. Creación del KV namespace para sesiones (`wrangler kv namespace create SESSION`) — requisito previo al primer deploy.
3. Script `build:prod` que garantice `NODE_ENV=production` antes de compilar.
4. Workflow de GitHub Actions: build → deploy preview en PRs → deploy production en `main`.
5. Gestión de secrets vía `wrangler secret put`.
6. Dominio custom + SSL automático.
7. Smoke test post-deploy (healthcheck del endpoint raíz).

### Out of scope (explícito)

- D1, R2, Queues — el sitio no los necesita hoy. La única excepción es el KV de sesiones, que exige el propio adaptador v13 (infraestructura, sin modelo de datos).
- Cualquier almacén persistente futuro con esquema exige su archivo de migración descriptivo en `docs/migrations/<fecha>-<change-id>.md` (schema previo, schema nuevo, estrategia de datos, rollback). Sin migración, el cambio de modelo no está completo. Fallback si no hay tooling SQL: markdown.
- Migración desde Pages (no hay nada que migrar).
- CDN/caching fino más allá de defaults de Cloudflare.

## 4. Requisitos técnicos

### 4.1 Wrangler (`wrangler.jsonc`)

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "portfolio-2026",
  "compatibility_date": "2026-04-15",
  "compatibility_flags": ["nodejs_compat"]
  // main, kv_namespaces[SESSION], images[IMAGES] y assets[ASSETS]
  // los completa el adaptador en build time (cloudflareConfigCustomizer).
}
```

Notas:

- **NO definir `main: "dist/_worker.js"`** — ese artefacto no existe en v13; el entrypoint real es `@astrojs/cloudflare/entrypoints/server`.
- `nodejs_compat` obligatorio: el runtime server-side de Astro lo requiere.
- El binding `SESSION` apunta a un KV namespace real: crearlo antes del primer deploy (`wrangler kv namespace create SESSION`). Sin él, rutas con estado fallan en runtime aunque el deploy pase.

### 4.2 Build

- Nuevo script: `"build:prod": "NODE_ENV=production astro build"`.
- El adaptador se selecciona por `NODE_ENV`; un build sin esa variable genera artefacto Node inútil para Workers. Este fue y será el error clásico — automatizarlo.

### 4.3 CI/CD (GitHub Actions)

- **PRs** → build + `wrangler versions upload` (preview URL por versión, sin tocar producción).
- **Push a `main`** → build + `wrangler deploy`.
- Secret requerido: `CLOUDFLARE_API_TOKEN`. Permisos mínimos: **Account · Workers Scripts:Edit**, **Account · Workers KV Storage:Edit** (necesario: `cf-setup.sh` crea el namespace SESSION desde CI), **Account · Account Settings:Read**. `CLOUDFLARE_ACCOUNT_ID` como variable.
- Cache de dependencias pnpm entre runs.

### 4.4 Imágenes

- `imageService: 'cloudflare'` usa el binding `IMAGES`, que requiere suscripción a Cloudflare Images. En `*.workers.dev` las transformaciones pueden fallar.
- Decisión: mantener el servicio Cloudflare solo cuando haya dominio propio; verificar comportamiento en preview. Fallback documentado: `imageService: 'passthrough'` si no se contrata Images.

## 5. Entornos

| Entorno | Trigger | URL | Datos sensibles |
|---|---|---|---|
| Local | `pnpm dev` | localhost:4321 | ninguno (adapter Node) |
| Preview | cada PR | `<version>-<name>.workers.dev` | secrets de staging si aplican |
| Production | push a `main` | dominio custom | secrets de prod vía `wrangler secret` |

Regla: producción solo desde `main`. Nada se deploya a mano desde laptops — eso es cómo nacen los "pero funciona en mi máquina".

## 6. Criterios de aceptación

- [ ] KV namespace `SESSION` creado y accesible por la cuenta de Cloudflare
- [ ] `pnpm build:prod` compila sin errores y produce el worker + assets estáticos
- [ ] `wrangler dev` sirve el sitio localmente contra el runtime de Workers (no Node)
- [ ] PR abre preview URL funcional (SSR + assets cargando)
- [ ] Merge a `main` deploya a producción automáticamente en < 5 min
- [ ] Sitio responde 200 en `/` y en una ruta dinámica de ejemplo
- [ ] Logs visibles en dashboard Cloudflare
- [ ] Documentación breve en README: cómo deployar manual y cómo ver logs

## 7. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Build sin `NODE_ENV=production` genera artefacto equivocado | Alto | Script dedicado `build:prod`; CI usa solo ese script |
| KV `SESSION` inexistente rompe rutas con estado en runtime | Alto | Crear namespace en Fase 1; smoke test incluye ruta con sesión |
| Transformaciones de imagen fallan sin suscripción Images | Medio | Verificar en preview; fallback `passthrough` documentado |
| `compatibility_date` desactualizada rompe runtime tras updates | Medio | Fijar `2026-04-15` (default del adaptador); revisar en upgrades |
| API token con permisos excesivos | Medio | Token mínimo: solo Workers Scripts del account |

## 8. Rollback

- `wrangler rollback [version]` restaura la versión anterior del worker en segundos.
- Los deploys son inmutables por versión: revertir = redeploy de versión previa, sin rebuild.
- En CI: workflow manual `workflow_dispatch` con input `rollback_to=<version>`.

## 9. Fases

1. **Fase 1 — Fundaciones** (~medio día): `wrangler.jsonc`, KV `SESSION`, scripts npm, deploy manual exitoso a workers.dev.
2. **Fase 2 — Pipeline** (~medio día): GitHub Actions preview + production, secrets.
3. **Fase 3 — Producción seria** (~1-2 h): dominio custom, imágenes verificadas, smoke tests, README.

Total estimado: ~1 día hábil.

---

## Historial de cambios

| Fecha | Cambio |
|---|---|
| 2026-08-24 | Reubicado desde `docs/prd/` → `docs/requirements/`. Corregido contrato del adaptador v13: entrypoint real (`@astrojs/cloudflare/entrypoints/server`, no `dist/_worker.js`), bindings automáticos (SESSION/IMAGES/ASSETS), KV de sesiones como prerequisito, typo en comando rollback. |
| 2026-08-24 | Corregidos permisos del API token: se agrega Workers KV Storage:Edit (cf-setup.sh crea el KV SESSION desde CI). |
