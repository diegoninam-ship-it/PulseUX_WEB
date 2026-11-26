import { FOOTER } from "../contenido/textos";
import { IconoPulso } from "./Iconos";

export default function Footer() {
  return (
    <footer className="lp-pie">
      <div className="lp-contenedor lp-pie-interior">
        <span className="lp-logo lp-logo-pie">
          <span className="lp-logo-icono"><IconoPulso /></span>
          PulseUX
        </span>
        <div className="lp-pie-lineas">
          {FOOTER.lineas.map((linea) => (
            <p key={linea}>{linea}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}
