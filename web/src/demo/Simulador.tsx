import { useEffect, useRef, useState } from "react";
import { comprobarSalud, registrarPulsacion, type Opcion } from "./api";

const DURACION_LED_MS = 400;
const INTERVALO_REINTENTO_MS = 15_000;

export function IconoSatisfecho() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.3" fill="currentColor" />
      <circle cx="15" cy="10" r="1.3" fill="currentColor" />
      <path
        d="M8 14c1 1.6 2.4 2.4 4 2.4s3-0.8 4-2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconoNeutral() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.3" fill="currentColor" />
      <circle cx="15" cy="10" r="1.3" fill="currentColor" />
      <path d="M8 15h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconoInsatisfecho() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.3" fill="currentColor" />
      <circle cx="15" cy="10" r="1.3" fill="currentColor" />
      <path
        d="M8 16.4c1-1.6 2.4-2.4 4-2.4s3 0.8 4 2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const ETIQUETA_OPCION: Record<Opcion, string> = {
  1: "Satisfecho",
  2: "Neutral",
  3: "Insatisfecho",
};

export const CLASE_COLOR_OPCION: Record<Opcion, string> = {
  1: "color-verde",
  2: "color-amarillo",
  3: "color-rojo",
};

const BOTONES = [
  { opcion: 1 as const, Icono: IconoSatisfecho },
  { opcion: 2 as const, Icono: IconoNeutral },
  { opcion: 3 as const, Icono: IconoInsatisfecho },
];

interface Props {
  // Se llama de forma síncrona, en el mismo gesto de clic: actualiza el estado
  // compartido al instante y devuelve un id para poder confirmar esa pulsación.
  onPulsar: (opcion: Opcion) => number;
  // Se llama cuando el POST que originó esa pulsación se resolvió con éxito.
  onConfirmada: (id: number) => void;
}

export default function Simulador({ onPulsar, onConfirmada }: Props) {
  const [ledActivo, setLedActivo] = useState<Opcion | null>(null);
  const [sinConexion, setSinConexion] = useState(false);
  const temporizadorLed = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervaloReintento = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (temporizadorLed.current) clearTimeout(temporizadorLed.current);
      if (intervaloReintento.current) clearInterval(intervaloReintento.current);
    };
  }, []);

  function iniciarReintentos() {
    if (intervaloReintento.current) return;

    intervaloReintento.current = setInterval(() => {
      comprobarSalud().then((resultado) => {
        if (resultado.ok) {
          setSinConexion(false);
          if (intervaloReintento.current) {
            clearInterval(intervaloReintento.current);
            intervaloReintento.current = null;
          }
        }
      });
    }, INTERVALO_REINTENTO_MS);
  }

  function pulsar(opcion: Opcion) {
    // Respuesta inmediata: LED y contador local, sin esperar al servidor.
    setLedActivo(opcion);
    if (temporizadorLed.current) clearTimeout(temporizadorLed.current);
    temporizadorLed.current = setTimeout(() => setLedActivo(null), DURACION_LED_MS);

    const id = onPulsar(opcion);

    // El POST viaja en segundo plano; nunca bloquea la interfaz.
    registrarPulsacion(opcion).then((resultado) => {
      if (resultado.ok) {
        onConfirmada(id);
      } else {
        setSinConexion(true);
        iniciarReintentos();
      }
    });
  }

  return (
    <div className="simulador">
      <div className="simulador-botones">
        {BOTONES.map(({ opcion, Icono }) => (
          <button
            key={opcion}
            type="button"
            className={`simulador-boton ${CLASE_COLOR_OPCION[opcion]}`}
            onClick={() => pulsar(opcion)}
          >
            <Icono />
            <span>{ETIQUETA_OPCION[opcion]}</span>
          </button>
        ))}
      </div>

      <div
        className={`simulador-led ${ledActivo ? `activo ${CLASE_COLOR_OPCION[ledActivo]}` : ""}`}
        aria-hidden="true"
      />

      {sinConexion && (
        <p className="simulador-aviso">Reconectando con el panel en segundo plano…</p>
      )}
    </div>
  );
}
