import { PROBLEMA } from "../contenido/textos";

export default function Problema() {
  return (
    <section id="problema">
      <h2>{PROBLEMA.titular}</h2>
      {PROBLEMA.parrafos.map((parrafo) => (
        <p key={parrafo}>{parrafo}</p>
      ))}
      <ul>
        {PROBLEMA.cifras.map((item) => (
          <li key={item.cifra}>
            <strong>{item.cifra}</strong> <span>{item.texto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
