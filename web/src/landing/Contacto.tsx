import { useState, type FormEvent } from "react";
import { CONTACTO } from "../contenido/textos";
import { enviarContacto, type DatosContacto } from "./enviarContacto";
import { useRevelar } from "./useRevelar";

// Los campos de textos.ts no traen clave; se asocian por posición con las columnas de
// la tabla `contactos` (CONTEXT.md, sección 5). Si cambia el orden en textos.ts, cambia aquí.
const CLAVES = ["nombre", "empresa", "distrito", "puntos_atencion", "correo"] as const;
type Clave = (typeof CLAVES)[number];
const OBLIGATORIOS: Clave[] = ["nombre", "empresa", "correo"];
const AUTOCOMPLETAR: Record<Clave, string> = {
  nombre: "name",
  empresa: "organization",
  distrito: "address-level2",
  puntos_atencion: "off",
  correo: "email",
};

// Mensajes de estado del formulario (interfaz, no contenido comercial).
const MENSAJES = {
  enviando: "Enviando…",
  exito: "Recibimos tu solicitud. Te escribiremos para coordinar la demostración.",
  revisar: "Revisa los campos marcados.",
  limite: "Recibimos varias solicitudes desde tu conexión. Inténtalo de nuevo en unos minutos.",
  red: "No pudimos enviar tu solicitud. Inténtalo de nuevo en unos segundos.",
};

function tipoDeInput(tipo: string): string {
  if (tipo === "numero") return "number";
  if (tipo === "correo") return "email";
  return "text";
}

type Estado = "inicial" | "enviando" | "exito" | "error";

export default function Contacto() {
  const ref = useRevelar<HTMLElement>();
  const [estado, setEstado] = useState<Estado>("inicial");
  const [mensaje, setMensaje] = useState("");

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const formulario = evento.currentTarget;

    if (!formulario.checkValidity()) {
      formulario.classList.add("lp-validado");
      setEstado("error");
      setMensaje(MENSAJES.revisar);
      return;
    }

    const valores = new FormData(formulario);
    const texto = (clave: Clave) => String(valores.get(clave) ?? "").trim();
    const puntos = Number.parseInt(texto("puntos_atencion"), 10);

    const datos: DatosContacto = {
      nombre: texto("nombre"),
      empresa: texto("empresa"),
      correo: texto("correo"),
      ...(texto("distrito") ? { distrito: texto("distrito") } : {}),
      ...(Number.isInteger(puntos) && puntos > 0 ? { puntos_atencion: puntos } : {}),
    };

    setEstado("enviando");
    setMensaje("");
    const resultado = await enviarContacto(datos);

    if (resultado.ok) {
      formulario.reset();
      formulario.classList.remove("lp-validado");
      setEstado("exito");
      setMensaje(MENSAJES.exito);
    } else {
      setEstado("error");
      setMensaje(resultado.estado === 429 ? MENSAJES.limite : resultado.estado === 400 ? MENSAJES.revisar : MENSAJES.red);
    }
  }

  return (
    <section id="contacto" className="lp-seccion lp-contacto lp-revelar" ref={ref}>
      <div className="lp-contenedor lp-contacto-grid">
        <div className="lp-contacto-texto">
          <h2 className="lp-h2">{CONTACTO.titular}</h2>
          <p className="lp-bajada">{CONTACTO.bajada}</p>
        </div>

        <div className="lp-formulario-caja">
          <form className="lp-formulario" onSubmit={enviar} noValidate>
            {CONTACTO.campos.map((campo, i) => {
              const clave = CLAVES[i];
              if (!clave) return null;
              const obligatorio = OBLIGATORIOS.includes(clave);
              return (
                <label key={campo.etiqueta} className={clave === "correo" ? "lp-campo lp-campo-ancho" : "lp-campo"}>
                  <span>
                    {campo.etiqueta}
                    {obligatorio && <abbr title="obligatorio" aria-hidden="true"> *</abbr>}
                  </span>
                  <input
                    name={clave}
                    type={tipoDeInput(campo.tipo)}
                    required={obligatorio}
                    autoComplete={AUTOCOMPLETAR[clave]}
                    {...(campo.tipo === "numero" ? { min: 1, step: 1, inputMode: "numeric" as const } : {})}
                  />
                </label>
              );
            })}

            <button type="submit" className="lp-boton lp-boton-principal lp-campo-ancho" disabled={estado === "enviando"}>
              {estado === "enviando" ? MENSAJES.enviando : CONTACTO.boton}
            </button>

            <p className={`lp-mensaje lp-mensaje-${estado}`} role="status" aria-live="polite">
              {mensaje}
            </p>
          </form>
          <p className="lp-aviso">{CONTACTO.aviso}</p>
        </div>
      </div>
    </section>
  );
}
