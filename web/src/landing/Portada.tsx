import { PORTADA } from "../contenido/textos";
import { IconoFlecha, IconoPulso } from "./Iconos";
import "./landing.css";

// Ilustración de portada: señales que convergen hacia un pulso central.
// Es la misma idea visual de la figura inbound del E1 (el cliente llega a la marca).
function SenalesConvergentes() {
  const lineas = Array.from({ length: 14 }, (_, i) => {
    const y = 20 + i * 26;
    const lado = i % 2 === 0 ? -1 : 1;
    return { y, lado, retraso: (i % 7) * 0.35 };
  });

  return (
    <svg className="lp-senales" viewBox="0 0 520 400" aria-hidden="true">
      <defs>
        <linearGradient id="lp-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--marca-cian)" />
          <stop offset="1" stopColor="var(--marca-verde)" />
        </linearGradient>
        <radialGradient id="lp-halo">
          <stop offset="0" stopColor="var(--marca-cian)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--marca-cian)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="260" cy="200" r="170" fill="url(#lp-halo)" />
      {lineas.map(({ y, lado, retraso }, i) => {
        const x0 = lado < 0 ? 0 : 520;
        const d = `M${x0} ${y} C ${lado < 0 ? 150 : 370} ${y}, ${lado < 0 ? 190 : 330} 200, 260 200`;
        return (
          <g key={i}>
            <path d={d} className="lp-senal" />
            <circle r="3" className="lp-particula" style={{ animationDelay: `${retraso}s` }}>
              <animateMotion dur="3.2s" begin={`${retraso}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        );
      })}
      <circle cx="260" cy="200" r="46" className="lp-nodo-anillo" />
      <circle cx="260" cy="200" r="34" fill="var(--superficie)" stroke="url(#lp-grad)" strokeWidth="2.5" />
      <path d="M236 200h8l5-12 8 24 6-16 4 4h9" fill="none" stroke="url(#lp-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Portada() {
  return (
    <>
      <header className="lp-barra">
        <div className="lp-contenedor lp-barra-interior">
          <a className="lp-logo" href="#portada" aria-label="PulseUX, ir al inicio">
            <span className="lp-logo-icono"><IconoPulso /></span>
            PulseUX
          </a>
          <a className="lp-boton lp-boton-borde lp-boton-chico" href="#contacto">
            {PORTADA.botonPrincipal}
          </a>
        </div>
      </header>

      <section id="portada" className="lp-portada">
        <div className="lp-contenedor lp-portada-grid">
          <div className="lp-portada-texto">
            <p className="lp-eslogan">{PORTADA.eslogan}</p>
            <h1 className="lp-titular">{PORTADA.titular}</h1>
            <p className="lp-bajada">{PORTADA.bajada}</p>
            <div className="lp-acciones">
              <a className="lp-boton lp-boton-principal" href="#contacto">
                {PORTADA.botonPrincipal}
              </a>
              <a className="lp-boton lp-boton-borde" href="#como-funciona">
                {PORTADA.botonSecundario}
                <IconoFlecha className="lp-boton-icono" />
              </a>
            </div>
          </div>
          <div className="lp-portada-arte">
            <SenalesConvergentes />
          </div>
        </div>
      </section>
    </>
  );
}
