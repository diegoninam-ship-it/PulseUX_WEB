import "dotenv/config";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { verificarConexion } from "./db.js";
import contactosRouter from "./rutas/contactos.js";
import metricasRouter from "./rutas/metricas.js";
import registrosRouter from "./rutas/registros.js";
import saludRouter from "./rutas/salud.js";

const app = express();
const puerto = Number(process.env.PORT ?? 3000);
const esProduccion = process.env.NODE_ENV === "production";

const origenesPermitidos = (process.env.ORIGEN_PERMITIDO ?? "")
  .split(",")
  .map((origen) => origen.trim())
  .filter(Boolean);

if (!esProduccion && !origenesPermitidos.includes("http://localhost:5173")) {
  origenesPermitidos.push("http://localhost:5173");
}

app.use(cors({ origin: origenesPermitidos }));
app.use(express.json({ limit: "100kb" }));

app.use("/api/registros", registrosRouter);
app.use("/api/metricas", metricasRouter);
app.use("/api/contactos", contactosRouter);
app.use("/api/salud", saludRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "ruta no encontrada" });
});

// Manejador final: nunca filtra trazas de pila ni mensajes de PostgreSQL al cliente.
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "error interno del servidor" });
});

async function iniciar() {
  await verificarConexion();
  app.listen(puerto, () => {
    console.log(`API escuchando en el puerto ${puerto}`);
  });
}

iniciar();
