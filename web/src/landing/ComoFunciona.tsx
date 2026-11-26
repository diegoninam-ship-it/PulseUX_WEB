import { COMO_FUNCIONA } from "../contenido/textos";
import { IconoLuz, IconoPanel, IconoToque } from "./Iconos";
import { useRevelar } from "./useRevelar";

const ICONOS = [IconoToque, IconoLuz, IconoPanel];

export default function ComoFunciona() {
  const ref = useRevelar<HTMLElement>();

  return (
    <section id="como-funciona" className="lp-seccion lp-revelar" ref={ref}>
      <div className="lp-contenedor">
        <h2 className="lp-h2 lp-centrado">{COMO_FUNCIONA.titular}</h2>
        <ol className="lp-pasos">
          {COMO_FUNCIONA.pasos.map((paso, i) => {
            const Icono = ICONOS[i] ?? IconoToque;
            return (
              <li key={paso.titulo} className="lp-paso" style={{ ["--i" as string]: i }}>
                <div className="lp-paso-cabeza">
                  <span className="lp-paso-icono"><Icono /></span>
                  <span className="lp-paso-numero">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3>{paso.titulo}</h3>
                <p>{paso.texto}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
