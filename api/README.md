# api/

API de PulseUX: Node + Express + TypeScript, cliente `pg` sin ORM.

## 1. Levantar PostgreSQL con Docker

```
docker run --name pulseux-db \
  -e POSTGRES_PASSWORD=pulseux_local \
  -e POSTGRES_DB=pulseux \
  -p 5432:5432 -d postgres:16
```

Esto deja `DATABASE_URL=postgresql://postgres:pulseux_local@localhost:5432/pulseux`.

## 2. Aplicar los archivos SQL, en orden

```
psql postgresql://postgres:pulseux_local@localhost:5432/pulseux -f sql/001_esquema.sql
psql postgresql://postgres:pulseux_local@localhost:5432/pulseux -f sql/002_datos_demo.sql
```

(`002_datos_demo.sql` siembra dos dispositivos y datos de demostración de los últimos 30
días; es opcional para producción, pero necesario para que el dashboard no se vea vacío.)

## 3. Configurar variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```
DATABASE_URL=postgresql://postgres:pulseux_local@localhost:5432/pulseux
PORT=3000
ORIGEN_PERMITIDO=http://localhost:5173
```

## 4. Arrancar la API en local

```
npm install
npm run dev
```

La API queda escuchando en `http://localhost:3000`. Rutas bajo `/api` según la sección 6
de [CONTEXT.md](../CONTEXT.md).
