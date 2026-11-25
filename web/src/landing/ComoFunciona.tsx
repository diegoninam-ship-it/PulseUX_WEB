import { COMO_FUNCIONA } from "../contenido/textos";

export default function ComoFunciona() {
  return (
    <section id="como-funciona">
      <h2>{COMO_FUNCIONA.titular}</h2>
      <ol>
        {COMO_FUNCIONA.pasos.map((paso) => (
          <li key={paso.titulo}>
            <h3>{paso.titulo}</h3>
            <p>{paso.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
