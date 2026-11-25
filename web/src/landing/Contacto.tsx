import { CONTACTO } from "../contenido/textos";

function tipoDeInput(tipo: string): string {
  if (tipo === "numero") return "number";
  if (tipo === "correo") return "email";
  return "text";
}

export default function Contacto() {
  return (
    <section id="contacto">
      <h2>{CONTACTO.titular}</h2>
      <p>{CONTACTO.bajada}</p>
      <form>
        {CONTACTO.campos.map((campo) => (
          <label key={campo.etiqueta}>
            {campo.etiqueta}
            <input type={tipoDeInput(campo.tipo)} />
          </label>
        ))}
        <button type="submit">{CONTACTO.boton}</button>
      </form>
      <p>{CONTACTO.aviso}</p>
    </section>
  );
}
