// Envío del formulario de contacto a POST /api/contactos (CONTEXT.md, sección 6).
// Sigue el mismo patrón que demo/api.ts (tiempo límite y resultado tipado).
// Si Diego agrega una función equivalente en demo/api.ts, este archivo se elimina y
// Contacto.tsx la importa desde allí.

const URL_BASE = `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api`;
const TIEMPO_LIMITE_MS = 8000; // más holgado que el simulador: Render puede estar despertando (R1)

export interface DatosContacto {
  nombre: string;
  empresa: string;
  distrito?: string;
  puntos_atencion?: number;
  correo: string;
}

export type ResultadoEnvio = { ok: true } | { ok: false; estado?: number; error: string };

export async function enviarContacto(datos: DatosContacto): Promise<ResultadoEnvio> {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE_MS);

  try {
    const respuesta = await fetch(`${URL_BASE}/contactos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
      signal: controlador.signal,
    });

    if (!respuesta.ok) {
      const cuerpo = (await respuesta.json().catch(() => ({}))) as { error?: string };
      return { ok: false, estado: respuesta.status, error: cuerpo.error ?? `respuesta ${respuesta.status}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "error de red" };
  } finally {
    clearTimeout(temporizador);
  }
}
