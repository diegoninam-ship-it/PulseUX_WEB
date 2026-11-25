import { Router } from "express";
import { consulta } from "../db.js";
import { limitadorPorIp } from "../middleware/limitador.js";

const router = Router();

// 5 envíos cada 10 minutos por IP: el formulario de contacto no necesita más.
const limitadorContactos = limitadorPorIp(5, 10 * 60_000);

const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", limitadorContactos, async (req, res, next) => {
  try {
    const cuerpo = req.body ?? {};
    const { nombre, empresa, distrito, puntos_atencion, correo } = cuerpo as {
      nombre?: unknown;
      empresa?: unknown;
      distrito?: unknown;
      puntos_atencion?: unknown;
      correo?: unknown;
    };

    if (typeof nombre !== "string" || nombre.trim() === "") {
      res.status(400).json({ error: "nombre es obligatorio" });
      return;
    }

    if (typeof empresa !== "string" || empresa.trim() === "") {
      res.status(400).json({ error: "empresa es obligatorio" });
      return;
    }

    if (typeof correo !== "string" || !CORREO_RE.test(correo)) {
      res.status(400).json({ error: "correo no tiene un formato válido" });
      return;
    }

    if (distrito !== undefined && distrito !== null && typeof distrito !== "string") {
      res.status(400).json({ error: "distrito debe ser texto" });
      return;
    }

    if (
      puntos_atencion !== undefined &&
      puntos_atencion !== null &&
      (!Number.isInteger(puntos_atencion) || (puntos_atencion as number) <= 0)
    ) {
      res.status(400).json({ error: "puntos_atencion debe ser un entero positivo" });
      return;
    }

    await consulta(
      "INSERT INTO contactos (nombre, empresa, distrito, puntos_atencion, correo) VALUES ($1, $2, $3, $4, $5)",
      [nombre, empresa, distrito ?? null, puntos_atencion ?? null, correo],
    );

    res.status(201).json({ recibido: true });
  } catch (error) {
    next(error);
  }
});

export default router;
