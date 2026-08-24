#!/usr/bin/env node
/**
 * Smoke test post-deploy — PRD docs/requirements/cloudflare-deploy.md §6
 *
 * Uso:
 *   node scripts/smoke-test.mjs [BASE_URL]
 *   pnpm smoke:test https://portfolio-2026.<subdomain>.workers.dev
 *
 * Criterios (cualquier fallo = exit 1):
 *   1. GET  /            -> 200, text/html, cuerpo no vacio
 *   2. POST /api/contact -> 200 con payload valido (success:true)
 *   3. POST /api/contact -> 400 con payload invalido
 */
const BASE = (process.argv[2] || process.env.SMOKE_BASE_URL || 'http://localhost:8787').replace(/\/+$/, '');

let failed = false;
function check(name, ok, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` (${detail})` : ''}`);
  if (!ok) failed = true;
}

async function main() {
  console.log(`\nSmoke test -> ${BASE}\n`);

  // 1. Home SSR
  try {
    const res = await fetch(`${BASE}/`, { redirect: 'manual' });
    const ct = res.headers.get('content-type') || '';
    const body = res.status === 200 ? await res.text() : '';
    check('GET / -> 200', res.status === 200, `status=${res.status}`);
    check('GET / -> text/html', ct.includes('text/html'), `ct=${ct}`);
    check('GET / -> HTML no vacio', body.length > 100, `bytes=${body.length}`);
  } catch (err) {
    check('GET / alcanzable', false, String(err));
  }

  // 2. Contact API valida — prueba runtime server-side real en Workers
  try {
    const res = await fetch(`${BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Smoke Test',
        email: 'smoke@test.dev',
        subject: 'Smoke test',
        message: 'Verificacion automatica post-deploy.',
      }),
    });
    let json = {};
    try { json = await res.json(); } catch {}
    check('POST /api/contact valida -> 200', res.status === 200, `status=${res.status}`);
    check('POST /api/contact valida -> success:true', json.success === true, `body=${JSON.stringify(json)}`);
  } catch (err) {
    check('POST /api/contact alcanzable', false, String(err));
  }

  // 3. Contact API invalida — validacion de negocio intacta
  try {
    const res = await fetch(`${BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', email: 'nope' }),
    });
    check('POST /api/contact invalida -> 400', res.status === 400, `status=${res.status}`);
  } catch (err) {
    check('POST /api/contact invalida alcanzable', false, String(err));
  }

  console.log('');
  if (failed) {
    console.error('Resultado: FALLO — ver criterios arriba.\n');
    process.exit(1);
  }
  console.log('Resultado: OK — deploy vivo y SSR funcional.\n');
}

main();
