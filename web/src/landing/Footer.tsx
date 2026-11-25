import { FOOTER } from "../contenido/textos";

export default function Footer() {
  return (
    <footer>
      {FOOTER.lineas.map((linea) => (
        <p key={linea}>{linea}</p>
      ))}
    </footer>
  );
}
