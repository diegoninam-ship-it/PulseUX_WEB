import { useRef, useState } from "react";
import { PRUEBALO } from "../contenido/textos";
import "./demo.css";
import Dashboard, { type EntradaOverlay } from "./Dashboard";
import Simulador from "./Simulador";
import type { Opcion } from "./api";

export default function Pruebalo() {
  const [overlay, setOverlay] = useState<EntradaOverlay[]>([]);
  const [disparoActualizacion, setDisparoActualizacion] = useState(0);
  const siguienteId = useRef(0);

  function manejarPulsar(opcion: Opcion): number {
    const id = siguienteId.current++;
    setOverlay((previo) => [...previo, { id, opcion, confirmadaEn: null }]);
    return id;
  }

  function manejarConfirmada(id: number) {
    const ahora = Date.now();
    setOverlay((previo) => previo.map((entrada) => (entrada.id === id ? { ...entrada, confirmadaEn: ahora } : entrada)));
    setDisparoActualizacion((n) => n + 1);
  }

  function manejarMetricasActualizadas(inicioPeticion: number) {
    setOverlay((previo) =>
      previo.filter((entrada) => entrada.confirmadaEn === null || entrada.confirmadaEn > inicioPeticion),
    );
  }

  return (
    <section id="pruebalo">
      <h2>{PRUEBALO.titular}</h2>
      {PRUEBALO.aclaracion.map((parrafo) => (
        <p key={parrafo}>{parrafo}</p>
      ))}
      <div className="pruebalo-panel">
        <Simulador onPulsar={manejarPulsar} onConfirmada={manejarConfirmada} />
        <Dashboard
          overlay={overlay}
          disparoActualizacion={disparoActualizacion}
          onMetricasActualizadas={manejarMetricasActualizadas}
        />
      </div>
    </section>
  );
}
