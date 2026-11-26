import { PROBLEMA } from "../contenido/textos";
import { useRevelar } from "./useRevelar";

// Separa "52 %" en número y símbolo para darles peso tipográfico distinto.
function partirCifra(cifra: string) {
  const coincidencia = cifra.match(/^([\d.,]+)\s*(.*)$/);
  return coincidencia ? { numero: coincidencia[1], unidad: coincidencia[2] } : { numero: cifra, unidad: "" };
}

export default function Problema() {
  const ref = useRevelar<HTMLElement>();

  return (
    <section id="problema" className="lp-seccion lp-problema lp-revelar" ref={ref}>
      <div className="lp-contenedor">
        <div className="lp-problema-cabecera">
          <h2 className="lp-h2">{PROBLEMA.titular}</h2>
          <div className="lp-problema-cuerpo">
            {PROBLEMA.parrafos.map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}
          </div>
        </div>

        <ul className="lp-cifras">
          {PROBLEMA.cifras.map((item, i) => {
            const { numero, unidad } = partirCifra(item.cifra);
            const valor = Number.parseFloat(numero) || 0;
            return (
              <li key={item.cifra} className="lp-cifra" style={{ ["--i" as string]: i }}>
                <strong className="lp-cifra-numero">
                  {numero}
                  <span className="lp-cifra-unidad">{unidad}</span>
                </strong>
                <span className="lp-cifra-texto">{item.texto}</span>
                <span className="lp-cifra-medidor" aria-hidden="true">
                  <span style={{ width: `${Math.min(valor, 100)}%` }} />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
