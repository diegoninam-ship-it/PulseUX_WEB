import { useCallback, useEffect, useRef, useState } from "react";
import {
  obtenerMetricas,
  obtenerRecientes,
  type Distribucion,
  type Metricas,
  type Opcion,
  type PuntoSerie,
  type RegistroReciente,
} from "./api";
import { CLASE_COLOR_OPCION, ETIQUETA_OPCION, IconoInsatisfecho, IconoNeutral, IconoSatisfecho } from "./Simulador";

export interface EntradaOverlay {
  id: number;
  opcion: Opcion;
  // null mientras el POST que la originó sigue en vuelo o falló.
  confirmadaEn: number | null;
}

interface Props {
  overlay: EntradaOverlay[];
  disparoActualizacion: number;
  onMetricasActualizadas: (inicioPeticion: number) => void;
}

const INTERVALO_ACTUALIZACION_MS = 10_000;
const LIMITE_RECIENTES = 8;

const ENTRADAS_DISTRIBUCION = [
  { opcion: 1 as const, Icono: IconoSatisfecho },
  { opcion: 2 as const, Icono: IconoNeutral },
  { opcion: 3 as const, Icono: IconoInsatisfecho },
];

function conteoDeOpcion(distribucion: Distribucion, opcion: Opcion) {
  if (opcion === 1) return distribucion.satisfecho;
  if (opcion === 2) return distribucion.neutral;
  return distribucion.insatisfecho;
}

function redondear(valor: number): number {
  return Math.round(valor * 10) / 10;
}

// El incremento local es una superposición temporal sobre los datos del servidor:
// se suma aquí para la pantalla, y se descarta en Dashboard en cuanto una
// actualización de métricas posterior a su confirmación ya la incluye.
function combinarConOverlay(metricas: Metricas, overlay: EntradaOverlay[]): Metricas {
  if (overlay.length === 0) return metricas;

  const extra: Record<Opcion, number> = { 1: 0, 2: 0, 3: 0 };
  for (const entrada of overlay) extra[entrada.opcion] += 1;
  const extraTotal = extra[1] + extra[2] + extra[3];
  if (extraTotal === 0) return metricas;

  const conteos = {
    satisfecho: metricas.distribucion.satisfecho.conteo + extra[1],
    neutral: metricas.distribucion.neutral.conteo + extra[2],
    insatisfecho: metricas.distribucion.insatisfecho.conteo + extra[3],
  };
  const total = metricas.total + extraTotal;
  const porcentaje = (conteo: number) => (total === 0 ? 0 : redondear((conteo / total) * 100));

  const distribucion: Distribucion = {
    satisfecho: { conteo: conteos.satisfecho, porcentaje: porcentaje(conteos.satisfecho) },
    neutral: { conteo: conteos.neutral, porcentaje: porcentaje(conteos.neutral) },
    insatisfecho: { conteo: conteos.insatisfecho, porcentaje: porcentaje(conteos.insatisfecho) },
  };

  const indiceNeto = total === 0 ? 0 : redondear(distribucion.satisfecho.porcentaje - distribucion.insatisfecho.porcentaje);

  const hoy = new Date().toISOString().slice(0, 10);
  const serie = metricas.serie.map((punto) =>
    punto.fecha === hoy
      ? {
          ...punto,
          satisfecho: punto.satisfecho + extra[1],
          neutral: punto.neutral + extra[2],
          insatisfecho: punto.insatisfecho + extra[3],
        }
      : punto,
  );

  return { total, distribucion, indice_neto: indiceNeto, serie };
}

function formatearHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

function GraficaSerie({ serie }: { serie: PuntoSerie[] }) {
  const ancho = 600;
  const alto = 180;
  const baseY = 160;
  const anchoBarra = ancho / Math.max(serie.length, 1);
  const maxTotal = Math.max(1, ...serie.map((p) => p.satisfecho + p.neutral + p.insatisfecho));
  const escala = (valor: number) => (valor / maxTotal) * baseY;

  return (
    <svg
      viewBox={`0 0 ${ancho} ${alto}`}
      className="dashboard-grafica"
      role="img"
      aria-label="Serie de registros de los últimos 30 días, apilada por opción"
    >
      <line x1="0" y1={baseY} x2={ancho} y2={baseY} className="dashboard-grafica-eje" />
      {serie.map((punto, indice) => {
        const x = indice * anchoBarra + 1;
        const anchoReal = Math.max(anchoBarra - 2, 1);
        let y = baseY;

        const segmentos: { valor: number; clase: string }[] = [
          { valor: punto.satisfecho, clase: "barra-satisfecho" },
          { valor: punto.neutral, clase: "barra-neutral" },
          { valor: punto.insatisfecho, clase: "barra-insatisfecho" },
        ];

        return (
          <g key={punto.fecha}>
            <title>
              {`${punto.fecha} — satisfecho ${punto.satisfecho}, neutral ${punto.neutral}, insatisfecho ${punto.insatisfecho}`}
            </title>
            {segmentos.map((segmento) => {
              const altura = escala(segmento.valor);
              y -= altura;
              return <rect key={segmento.clase} x={x} y={y} width={anchoReal} height={altura} className={segmento.clase} />;
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function Dashboard({ overlay, disparoActualizacion, onMetricasActualizadas }: Props) {
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [recientes, setRecientes] = useState<RegistroReciente[]>([]);
  const esPrimerDisparo = useRef(true);

  const actualizar = useCallback(async () => {
    const inicioPeticion = Date.now();
    const [resultadoMetricas, resultadoRecientes] = await Promise.all([
      obtenerMetricas("30d"),
      obtenerRecientes(LIMITE_RECIENTES),
    ]);

    if (resultadoMetricas.ok) {
      setMetricas(resultadoMetricas.datos);
      onMetricasActualizadas(inicioPeticion);
    }
    if (resultadoRecientes.ok) {
      setRecientes(resultadoRecientes.datos.registros);
    }
  }, [onMetricasActualizadas]);

  useEffect(() => {
    actualizar();
    const intervalo = setInterval(actualizar, INTERVALO_ACTUALIZACION_MS);
    return () => clearInterval(intervalo);
  }, [actualizar]);

  useEffect(() => {
    if (esPrimerDisparo.current) {
      esPrimerDisparo.current = false;
      return;
    }
    actualizar();
  }, [disparoActualizacion, actualizar]);

  const metricasVisibles = metricas ? combinarConOverlay(metricas, overlay) : null;

  return (
    <div className="dashboard">
      <p className="dashboard-etiqueta-demo">Datos de demostración</p>

      {metricasVisibles ? (
        <>
          <div className="dashboard-indice">
            <span className="dashboard-indice-numero">{metricasVisibles.indice_neto}</span>
            <span className="dashboard-indice-etiqueta">
              Índice neto: porcentaje de satisfecho menos porcentaje de insatisfecho
            </span>
          </div>

          <ul className="dashboard-distribucion">
            {ENTRADAS_DISTRIBUCION.map(({ opcion, Icono }) => {
              const dato = conteoDeOpcion(metricasVisibles.distribucion, opcion);
              return (
                <li key={opcion} className={`dashboard-distribucion-item ${CLASE_COLOR_OPCION[opcion]}`}>
                  <Icono />
                  <span className="dashboard-distribucion-etiqueta">{ETIQUETA_OPCION[opcion]}</span>
                  <span className="dashboard-distribucion-valor">{dato.conteo}</span>
                  <span className="dashboard-distribucion-porcentaje">{dato.porcentaje}%</span>
                </li>
              );
            })}
          </ul>

          <GraficaSerie serie={metricasVisibles.serie} />
        </>
      ) : (
        <p className="dashboard-cargando">Cargando métricas…</p>
      )}

      <ul className="dashboard-recientes">
        {recientes.map((registro, indice) => (
          <li
            key={`${registro.creado_en}-${indice}`}
            className={`dashboard-recientes-item ${CLASE_COLOR_OPCION[registro.opcion]}`}
          >
            <span>{ETIQUETA_OPCION[registro.opcion]}</span>
            <time dateTime={registro.creado_en}>{formatearHora(registro.creado_en)}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}
