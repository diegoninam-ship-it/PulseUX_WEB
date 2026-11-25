import type { NextFunction, Request, Response } from "express";

type Contador = { cantidad: number; reiniciaEn: number };

// La IP vive solo en este mapa, en memoria, durante la ventana del límite.
// No se persiste en ninguna tabla (invariante I1: eso no es lo que se almacena).
export function limitadorPorIp(maxPeticiones: number, ventanaMs: number) {
  const contadores = new Map<string, Contador>();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip ?? "desconocida";
    const ahora = Date.now();
    const contador = contadores.get(ip);

    if (!contador || contador.reiniciaEn <= ahora) {
      contadores.set(ip, { cantidad: 1, reiniciaEn: ahora + ventanaMs });
      return next();
    }

    if (contador.cantidad >= maxPeticiones) {
      res.status(429).json({ error: "Demasiadas peticiones. Intenta de nuevo en un momento." });
      return;
    }

    contador.cantidad += 1;
    next();
  };
}
