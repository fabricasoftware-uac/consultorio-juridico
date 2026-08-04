/**
 * Copia todos los objetos del bucket `documentos-casos` desde un proyecto
 * Supabase ORIGEN (Cloud) hacia un DESTINO (self-hosted).
 *
 * Recrea las filas de storage.objects al re-subir cada archivo con la API.
 * Ejecutar DESPUÉS de crear el bucket en el destino (crear-bucket.sql).
 *
 * Uso:
 *   SRC_SUPABASE_URL=https://xxxx.supabase.co \
 *   SRC_SERVICE_ROLE_KEY=<service_role Cloud> \
 *   DST_SUPABASE_URL=https://api.midominio.com \
 *   DST_SERVICE_ROLE_KEY=<service_role self-host> \
 *   npx tsx deploy/scripts/migrar-storage.ts
 */
import { createClient } from "@supabase/supabase-js";

const SRC_URL = process.env.SRC_SUPABASE_URL!;
const SRC_KEY = process.env.SRC_SERVICE_ROLE_KEY!;
const DST_URL = process.env.DST_SUPABASE_URL!;
const DST_KEY = process.env.DST_SERVICE_ROLE_KEY!;
const BUCKET = process.env.BUCKET ?? "documentos-casos";

for (const [k, v] of Object.entries({ SRC_URL, SRC_KEY, DST_URL, DST_KEY })) {
  if (!v) {
    console.error(`Falta variable de entorno: ${k}`);
    process.exit(1);
  }
}

const src = createClient(SRC_URL, SRC_KEY, { auth: { persistSession: false } });
const dst = createClient(DST_URL, DST_KEY, { auth: { persistSession: false } });

/** Lista recursivamente todas las rutas de archivo del bucket (las carpetas tienen id=null). */
async function listAll(prefix = ""): Promise<string[]> {
  const out: string[] = [];
  const { data, error } = await src.storage
    .from(BUCKET)
    .list(prefix, { limit: 1000, sortBy: { column: "name", order: "asc" } });
  if (error) throw error;
  for (const item of data ?? []) {
    const path = prefix ? `${prefix}/${item.name}` : item.name;
    if ((item as { id: string | null }).id === null) {
      out.push(...(await listAll(path))); // es una carpeta
    } else {
      out.push(path);
    }
  }
  return out;
}

async function main() {
  console.log(`Listando objetos en "${BUCKET}" del origen...`);
  const paths = await listAll();
  console.log(`${paths.length} objetos por migrar.`);

  let ok = 0;
  let fail = 0;
  for (const p of paths) {
    try {
      const { data: blob, error: dErr } = await src.storage.from(BUCKET).download(p);
      if (dErr || !blob) throw dErr ?? new Error("descarga vacía");
      const buf = Buffer.from(await blob.arrayBuffer());
      const { error: uErr } = await dst.storage.from(BUCKET).upload(p, buf, {
        contentType: blob.type || "application/octet-stream",
        upsert: true,
      });
      if (uErr) throw uErr;
      ok++;
      console.log(`✓ ${p}`);
    } catch (e) {
      fail++;
      console.error(`✗ ${p}: ${(e as Error).message ?? e}`);
    }
  }
  console.log(`\nListo. OK=${ok}  FAIL=${fail}  TOTAL=${paths.length}`);
  if (fail > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
