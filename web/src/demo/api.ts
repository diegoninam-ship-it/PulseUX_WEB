// Cliente HTTP. Único archivo de web/ que sabe que existe fetch.

const URL_BASE = `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api`;
export const DISPOSITIVO_DEMO: string = import.meta.env.VITE_DISPOSITIVO_DEMO ?? "PX-001";

const TIEMPO_LIMITE_MS = 3000;

export type Opcion = 1 | 2 | 3;

export type Resultado<T> = { ok: true; datos: T } | { ok: false; error: string };

export interface RegistroCreado {
  id: number;
  creado_en: string;
}

export interface ConteoOpcion {
  conteo: number;
  porcentaje: number;
}

export interface Distribucion {
  satisfecho: ConteoOpcion;
  neutral: ConteoOpcion;
  insatisfecho: ConteoOpcion;
}

export interface PuntoSerie {
  fecha: string;
  satisfecho: number;
  neutral: number;
  insatisfecho: number;
}

export interface Metricas {
  total: number;
  distribucion: Distribucion;
  indice_neto: number;
  serie: PuntoSerie[];
}

export interface RegistroReciente {
  opcion: Opcion;
  creado_en: string;
}

export interface RegistrosRecientes {
  registros: RegistroReciente[];
}

export interface Salud {
  estado: string;
}

export type Rango = "24h" | "7d" | "30d";

async function peticion<T>(ruta: string, opciones: RequestInit = {}): Promise<Resultado<T>> {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE_MS);

  try {
    const respuesta = await fetch(`${URL_BASE}${ruta}`, {
      ...opciones,
      signal: controlador.signal,
    });

    if (!respuesta.ok) {
      return { ok: false, error: `respuesta ${respuesta.status}` };
    }

    const datos = (await respuesta.json()) as T;
    return { ok: true, datos };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "error de red" };
  } finally {
    clearTimeout(temporizador);
  }
}

export function registrarPulsacion(opcion: Opcion): Promise<Resultado<RegistroCreado>> {
  return peticion<RegistroCreado>("/registros", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dispositivo_id: DISPOSITIVO_DEMO, opcion }),
  });
}

export function obtenerMetricas(rango: Rango, dispositivoId?: string): Promise<Resultado<Metricas>> {
  const parametros = new URLSearchParams({ rango });
  if (dispositivoId) parametros.set("dispositivo_id", dispositivoId);
  return peticion<Metricas>(`/metricas?${parametros.toString()}`);
}

export function obtenerRecientes(limite: number): Promise<Resultado<RegistrosRecientes>> {
  return peticion<RegistrosRecientes>(`/registros/recientes?limite=${limite}`);
}

export function comprobarSalud(): Promise<Resultado<Salud>> {
  return peticion<Salud>("/salud");
}
