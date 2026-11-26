import { POR_QUE } from "../contenido/textos";
import { IconoEscudo, IconoReloj, IconoSinApp } from "./Iconos";
import { useRevelar } from "./useRevelar";

const ICONOS = [IconoEscudo, IconoSinApp, IconoReloj];

export default function PorQue() {
  const ref = useRevelar<HTMLElement>();

  return (
    <section id="por-que" className="lp-seccion lp-revelar" ref={ref}>
      <div className="lp-contenedor">
        <h2 className="lp-h2 lp-centrado">{POR_QUE.titular}</h2>
        <div className="lp-tarjetas">
          {POR_QUE.diferenciadores.map((diferenciador, i) => {
            const Icono = ICONOS[i] ?? IconoEscudo;
            return (
              <article key={diferenciador.titulo} className="lp-tarjeta" style={{ ["--i" as string]: i }}>
                <span className="lp-tarjeta-icono"><Icono /></span>
                <h3>{diferenciador.titulo}</h3>
                <p>{diferenciador.texto}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
