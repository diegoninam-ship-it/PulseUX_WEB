import { Router } from "express";
import { consulta } from "../db.js";
import { limitadorPorIp } from "../middleware/limitador.js";

const router = Router();

// Suficiente para que un visitante de la demo no inunde la base; no se persiste.
const limitadorRegistros = limitadorPorIp(30, 60_000);

function esOpcionValida(valor: unknown): valor is 1 | 2 | 3 {
  return valor === 1 || valor === 2 || valor === 3;
}

router.post("/", limitadorRegistros, async (req, res, next) => {
  try {
    const cuerpo = req.body ?? {};
    const { dispositivo_id, opcion } = cuerpo as { dispositivo_id?: unknown; opcion?: unknown };

    if (typeof dispositivo_id !== "string" || dispositivo_id.trim() === "") {
      res.status(400).json({ error: "dispositivo_id es obligatorio" });
      return;
    }

    if (!esOpcionValida(opcion)) {
      res.status(400).json({ error: "opcion debe ser 1, 2 o 3" });
      return;
    }

    const dispositivo = await consulta("SELECT 1 FROM dispositivos WHERE id = $1", [dispositivo_id]);
    if (dispositivo.rowCount === 0) {
      res.status(400).json({ error: "el dispositivo no existe" });
      return;
    }

    const { rows } = await consulta<{ id: number; creado_en: string }>(
      "INSERT INTO registros (dispositivo_id, opcion) VALUES ($1, $2) RETURNING id, creado_en",
      [dispositivo_id, opcion],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get("/recientes", async (req, res, next) => {
  try {
    const limiteCrudo = Number(req.query.limite ?? 10);
    const limite = Number.isInteger(limiteCrudo) && limiteCrudo > 0 ? Math.min(limiteCrudo, 100) : 10;

    const { rows } = await consulta<{ opcion: number; creado_en: string }>(
      "SELECT opcion, creado_en FROM registros ORDER BY creado_en DESC LIMIT $1",
      [limite],
    );

    res.json({ registros: rows });
  } catch (error) {
    next(error);
  }
});

export default router;
