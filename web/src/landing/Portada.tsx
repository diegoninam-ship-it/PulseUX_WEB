import { PORTADA } from "../contenido/textos";

export default function Portada() {
  return (
    <section id="portada">
      <p>{PORTADA.eslogan}</p>
      <h1>{PORTADA.titular}</h1>
      <p>{PORTADA.bajada}</p>
      <button type="button">{PORTADA.botonPrincipal}</button>
      <button type="button">{PORTADA.botonSecundario}</button>
    </section>
  );
}
