import { PRUEBALO } from "../contenido/textos";

export default function Pruebalo() {
  return (
    <section id="pruebalo">
      <h2>{PRUEBALO.titular}</h2>
      {PRUEBALO.aclaracion.map((parrafo) => (
        <p key={parrafo}>{parrafo}</p>
      ))}
      <div>{/* aquí van Simulador y Dashboard */}</div>
    </section>
  );
}
