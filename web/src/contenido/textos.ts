// Textos literales de la landing (Parte 2 de docs/textos-capitulo6.md).
// Diego crea este archivo · ambos lo leen · nadie lo reescribe.

export const PORTADA = {
  eslogan: "Un toque. Un dato. Una decisión.",
  titular: "La opinión de tus clientes, en el momento exacto",
  bajada:
    "PulseUX mide la satisfacción en el punto donde ocurre la experiencia. Sin encuestas, sin aplicaciones y sin pedir datos personales.",
  botonPrincipal: "Solicitar demostración",
  botonSecundario: "Ver cómo funciona",
} as const;

export const PROBLEMA = {
  titular: "Tus clientes no se quejan. Simplemente no vuelven.",
  parrafos: [
    "En nuestro estudio con cien personas en Lima, el 52 % declaró que casi nunca o nunca responde una encuesta de satisfacción. La razón principal no es el desinterés: el 46 % señaló que toma demasiado tiempo.",
    "Y hay algo más incómodo. Cuando la atención falla, el cliente rara vez lo dice. Deja de volver, y el negocio pierde su señal más valiosa sin llegar a enterarse.",
  ],
  cifras: [
    { cifra: "52 %", texto: "casi nunca o nunca responde una encuesta" },
    { cifra: "46 %", texto: "dice que responder toma demasiado tiempo" },
    { cifra: "68 %", texto: "dedicaría 15 segundos o menos a opinar" },
  ],
} as const;

export const COMO_FUNCIONA = {
  titular: "Tres botones. Tres segundos.",
  pasos: [
    {
      titulo: "El cliente pulsa",
      texto:
        "Tres botones de colores a la salida de tu local: verde, amarillo o rojo. Sin instrucciones, sin pantallas, sin registro previo.",
    },
    {
      titulo: "La luz confirma",
      texto:
        "Una señal luminosa le indica que su opinión quedó registrada. Menos de medio segundo.",
    },
    {
      titulo: "Tú ves el dato",
      texto:
        "El registro llega a tu panel en tiempo real, con la hora exacta y el punto de servicio que lo originó.",
    },
  ],
} as const;

// El texto de aclaración es obligatorio: no se omite ni se reformula (invariante I5).
export const PRUEBALO = {
  titular: "Pruébalo ahora",
  aclaracion: [
    "Esta es una simulación del dispositivo. Pulsa un botón y observa cómo el registro aparece en el panel.",
    "PulseUX es un dispositivo físico que se instala en tu establecimiento; esta demostración existe para que puedas experimentar la interacción desde el navegador, sin tenerlo en las manos.",
  ],
} as const;

export const POR_QUE = {
  titular: "Lo que ninguna encuesta digital puede ofrecerte",
  diferenciadores: [
    {
      titulo: "No pide datos personales",
      texto:
        "El sistema registra solo la opción elegida, el dispositivo y la hora. No captura nombres, correos ni documentos de identidad, de modo que queda fuera del ámbito de la Ley 29733 de Protección de Datos Personales. Sin consentimientos que gestionar ni riesgos de cumplimiento.",
    },
    {
      titulo: "No requiere aplicación",
      texto:
        "Funciona con cualquier cliente, tenga o no un smartphone a la mano. Nada que descargar, nada que escanear, ningún enlace que abrir. El dato que recoges representa a toda tu clientela, no solo a la parte digitalmente activa.",
    },
    {
      titulo: "Menos de tres segundos",
      texto:
        "El 68 % de las personas está dispuesto a dedicar quince segundos o menos a dar su opinión al salir de un establecimiento. PulseUX necesita tres.",
    },
  ],
} as const;

export const CONTACTO = {
  titular: "Conversemos",
  bajada:
    "Cuéntanos sobre tu establecimiento y coordinamos una demostración sin costo.",
  campos: [
    { etiqueta: "Nombre y apellido", tipo: "texto" },
    { etiqueta: "Empresa o establecimiento", tipo: "texto" },
    { etiqueta: "Distrito", tipo: "texto" },
    { etiqueta: "Número de puntos de atención", tipo: "numero" },
    { etiqueta: "Correo de contacto", tipo: "correo" },
  ],
  boton: "Enviar",
  aviso:
    "Usaremos tus datos únicamente para contactarte sobre PulseUX. No los compartimos con terceros.",
} as const;

export const FOOTER = {
  lineas: [
    "PulseUX · Un toque. Un dato. Una decisión.",
    "Proyecto desarrollado en Tecsup · Lima, Perú · 2026",
  ],
} as const;
