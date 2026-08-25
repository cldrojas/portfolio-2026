#!/usr/bin/env bash
# cf-setup.sh — Bootstrap de infraestructura (PRD Fase 1)
# Garantiza que exista un KV namespace con binding SESSION y su id quede
# registrado en wrangler.jsonc. Idempotente: seguro en local y en CI.
#
# Auth: `wrangler login` previo o CLOUDFLARE_API_TOKEN en el entorno.
set -euo pipefail

CONFIG="wrangler.jsonc"
BINDING="SESSION"

command -v npx >/dev/null || { echo "ERROR: npx no disponible" >&2; exit 1; }

if grep -q "\"binding\": \"${BINDING}\", \"id\"" "$CONFIG"; then
  echo "OK: ${BINDING} ya tiene id en ${CONFIG}. Nada que hacer."
  exit 0
fi

echo "Creando KV namespace ${BINDING} (si no existe)..."
CREATE_OUT="$(npx wrangler kv namespace create "${BINDING}" 2>&1)" || CREATE_FAILED=1

ID=""
if [ -z "${CREATE_FAILED:-}" ]; then
  ID="$(printf '%s\n' "$CREATE_OUT" | grep -oE '[a-f0-9]{32}' | head -1)"
fi

if [ -z "$ID" ]; then
  # Ya existe (u otro fallo): buscar id por título en la lista.
  # Visibilidad: mostrar el motivo real del fallo del create (antes se tragaba).
  echo "Create falló o ya existe; buscando namespace existente..."
  printf '  motivo: %s\n' "${CREATE_OUT:-desconocido}" >&2
  ID="$(printf '%s\n' "$(npx wrangler kv namespace list 2>/dev/null)" \
    | BINDING="$BINDING" node -e '
let d = "";
process.stdin.on("data", c => d += c);
process.stdin.on("end", () => {
  try {
    const ns = JSON.parse(d);
    const b = process.env.BINDING;
    const m = ns.find(n => (n.title || "").endsWith("-" + b) || (n.title || "") === b);
    console.log(m ? m.id : "");
  } catch { console.log(""); }
});')"
fi

if [ -z "$ID" ]; then
  echo "ERROR: no se pudo obtener el id del KV namespace ${BINDING}." >&2
  printf '%s\n' "${CREATE_OUT:-}" >&2
  exit 1
fi
echo "KV ${BINDING} id: ${ID}"

NODE_LINE="  \"kv_namespaces\": [{ \"binding\": \"${BINDING}\", \"id\": \"${ID}\" }],"
node -e '
const fs = require("fs");
const [config, binding, line] = process.argv.slice(1);
let src = fs.readFileSync(config, "utf8");
if (!src.includes(`"binding": "${binding}", "id"`)) {
  src = src.replace(/(  "compatibility_flags": \[[^\]]*\],\n)/, `$1${line}\n`);
  fs.writeFileSync(config, src);
}
' "$CONFIG" "$BINDING" "$NODE_LINE"

echo "OK: ${CONFIG} actualizado con binding ${BINDING}."
