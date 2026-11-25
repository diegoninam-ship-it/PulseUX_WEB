import { Pool, type QueryResultRow } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL no está definida. Revisa api/.env.");
}

function esLocal(url: string): boolean {
  const host = new URL(url).hostname;
  return host === "localhost" || host === "127.0.0.1";
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: esLocal(databaseUrl) ? false : { rejectUnauthorized: false },
});

export async function consulta<T extends QueryResultRow = QueryResultRow>(
  texto: string,
  parametros: unknown[] = [],
) {
  return pool.query<T>(texto, parametros);
}

export async function verificarConexion(): Promise<void> {
  try {
    await pool.query("SELECT 1");
  } catch (error) {
    console.error(
      "No se pudo conectar a PostgreSQL. Revisa DATABASE_URL y que la base esté corriendo.",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}
