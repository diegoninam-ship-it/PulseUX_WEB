import { POR_QUE } from "../contenido/textos";

export default function PorQue() {
  return (
    <section id="por-que">
      <h2>{POR_QUE.titular}</h2>
      {POR_QUE.diferenciadores.map((diferenciador) => (
        <article key={diferenciador.titulo}>
          <h3>{diferenciador.titulo}</h3>
          <p>{diferenciador.texto}</p>
        </article>
      ))}
    </section>
  );
}
