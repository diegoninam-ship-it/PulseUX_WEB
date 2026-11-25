import { Router } from "express";
import { consulta } from "../db.js";

const router = Router();

type Opcion = 1 | 2 | 3;

const RANGOS: Record<string, { intervalo: string; dias: number }> = {
  "24h": { intervalo: "24 hours", dias: 1 },
  "7d": { intervalo: "7 days", dias: 7 },
  "30d": { intervalo: "30 days", dias: 30 },
};

function normalizarRango(valor: unknown): keyof typeof RANGOS {
  if (typeof valor === "string" && valor in RANGOS) return valor as keyof typeof RANGOS;
  return "7d";
}

function redondear(valor: number): number {
  return Math.round(valor * 10) / 10;
}

router.get("/", async (req, res, next) => {
  try {
    const rango = normalizarRango(req.query.rango);
    const { intervalo, dias } = RANGOS[rango];
    const dispositivoId = typeof req.query.dispositivo_id === "string" ? req.query.dispositivo_id : null;

    const { rows } = await consulta<{ dia: string; opcion: number; conteo: string }>(
      `SELECT date_trunc('day', creado_en)::date::text AS dia, opcion, count(*)::text AS conteo
       FROM registros
       WHERE creado_en >= now() - $1::interval
         AND ($2::text IS NULL OR dispositivo_id = $2)
       GROUP BY dia, opcion
       ORDER BY dia`,
      [intervalo, dispositivoId],
    );

    const conteoPorOpcion: Record<Opcion, number> = { 1: 0, 2: 0, 3: 0 };
    const conteoPorDia = new Map<string, Record<Opcion, number>>();

    for (const fila of rows) {
      const opcion = fila.opcion as Opcion;
      const conteo = Number(fila.conteo);
      conteoPorOpcion[opcion] += conteo;

      const diaActual = conteoPorDia.get(fila.dia) ?? { 1: 0, 2: 0, 3: 0 };
      diaActual[opcion] += conteo;
      conteoPorDia.set(fila.dia, diaActual);
    }

    const total = conteoPorOpcion[1] + conteoPorOpcion[2] + conteoPorOpcion[3];
    const porcentaje = (conteo: number) => (total === 0 ? 0 : redondear((conteo / total) * 100));

    const distribucion = {
      satisfecho: { conteo: conteoPorOpcion[1], porcentaje: porcentaje(conteoPorOpcion[1]) },
      neutral: { conteo: conteoPorOpcion[2], porcentaje: porcentaje(conteoPorOpcion[2]) },
      insatisfecho: { conteo: conteoPorOpcion[3], porcentaje: porcentaje(conteoPorOpcion[3]) },
    };

    const indiceNeto =
      total === 0 ? 0 : redondear(distribucion.satisfecho.porcentaje - distribucion.insatisfecho.porcentaje);

    const hoy = new Date();
    const serie = Array.from({ length: dias }, (_, indice) => {
      const offset = dias - 1 - indice;
      const fecha = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate() - offset))
        .toISOString()
        .slice(0, 10);
      const conteosDia = conteoPorDia.get(fecha) ?? { 1: 0, 2: 0, 3: 0 };

      return {
        fecha,
        satisfecho: conteosDia[1],
        neutral: conteosDia[2],
        insatisfecho: conteosDia[3],
      };
    });

    res.json({ total, distribucion, indice_neto: indiceNeto, serie });
  } catch (error) {
    next(error);
  }
});

export default router;
