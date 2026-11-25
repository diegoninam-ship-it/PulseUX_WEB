# CONTEXT.md — PulseUX_WEB

> Documento de contexto y trazabilidad del proyecto web de PulseUX.
> Vive en la raíz del repositorio. Cualquier agente de IA o persona que entre a trabajar
> aquí debe leerlo completo antes de escribir una línea de código.

**Repositorio:** `https://github.com/diegoninam-ship-it/PulseUX_WEB.git`
**Última actualización:** 25 de noviembre de 2026
**Mantiene este archivo:** Diego Nina Malqui

---

## 1. Qué es esto y por qué existe

PulseUX es un dispositivo IoT de tres botones que mide la satisfacción del cliente en el
punto donde ocurre la atención. El cliente pulsa verde, amarillo o rojo al salir del
local; un LED confirma el registro en menos de medio segundo y el dato viaja por WiFi a
una API que lo persiste.

Este repositorio **no** contiene el firmware del dispositivo. Contiene una **página web
comercial** con dos funciones:

1. Presentar la propuesta de valor de PulseUX a un comprador organizacional (B2B).
2. Alojar un **simulador** del dispositivo conectado a un dashboard real con base de
   datos, para que un visitante pueda experimentar la interacción desde el navegador sin
   tener el equipo físico en las manos.

Es, a la vez, el entregable E2 del Capítulo 6 del Plan de Marketing de PulseUX (curso
*Marketing y Comercialización de Nuevos Productos*, Tecsup) y el prototipo que se presenta
en sustentación.

### Lo que el simulador NO es

El simulador representa un dispositivo físico. No lo reemplaza y no lo contradice. El
diferenciador central del producto —que el cliente no necesita teléfono, aplicación ni
registro previo— se sostiene precisamente porque el hardware existe. La sección que aloja
el simulador declara esto de forma explícita y **ese texto no se elimina ni se suaviza**:

> Esta es una simulación del dispositivo. PulseUX es un equipo físico que se instala en tu
> establecimiento; esta demostración existe para que puedas experimentar la interacción
> desde el navegador, sin tenerlo en las manos.

---

## 2. Invariantes del proyecto

Reglas que no se negocian. Si una tarea parece exigir romper una de estas, la tarea está
mal entendida: deténte y pregunta.

| # | Invariante | Por qué |
|---|---|---|
| I1 | La tabla `registros` almacena **únicamente** opción, identificador de dispositivo y marca de tiempo. Nunca nombre, correo, documento, IP, cookie ni huella de navegador. | Es el diferenciador legal del producto: al no tratar datos personales, el sistema queda fuera del ámbito de la Ley 29733. Agregar un solo campo identificador destruye el argumento comercial completo del Capítulo 4. |
| I2 | Los datos de contacto comercial viven en una tabla **separada** (`contactos`) y nunca se cruzan con `registros`. | El comprador es una organización y sí entrega datos de contacto; el cliente final que pulsa el botón no. Son dos sujetos distintos y la arquitectura debe mostrarlo. |
| I3 | El motor de base de datos es **PostgreSQL**. | Decisión tomada el 25/11/2026. El informe académico aún declara MySQL en la ficha técnica y en la sección 1.7; esa corrección está pendiente y se aplica al informe, no al código. |
| I4 | Las cifras de investigación que aparecen en la web van **atribuidas** («en nuestro estudio con cien personas en Lima»), nunca como hechos generales del mercado peruano. | La muestra es no probabilística. Generalizar sería una afirmación que la base no sostiene. |
| I5 | El texto de aclaración del simulador (sección 2 de este documento) permanece visible. | Coherencia con el Capítulo 4. |

---

## 3. Stack y decisiones técnicas

| Capa | Elección | Nota |
|---|---|---|
| Frontend | Vite + React 19 + TypeScript | Una sola aplicación: la landing y el simulador comparten build y URL. Sin iframes. |
| Estilos | CSS plano con variables (tokens) | Sin framework. Menos superficie de conflicto entre dos personas trabajando en paralelo. |
| API | Node.js + Express + TypeScript | |
| Base de datos | PostgreSQL | Cliente `pg`. Sin ORM: el esquema tiene dos tablas. |
| Despliegue frontend | Vercel | |
| Despliegue API + BD | Render | Plan gratuito. Ver el riesgo R1 en la sección 8. |

### Por qué una sola aplicación y no dos

La landing necesita incrustar el simulador en su cuarta sección. Un iframe hacia un
despliegue separado habría significado dos URLs, dos despliegues y una costura visible.
Una sola aplicación React con propiedad de carpetas por persona resuelve el reparto del
trabajo sin fragmentar el producto.

---

## 4. Estructura del repositorio y propiedad de archivos

Trabajamos de forma **asíncrona sobre el mismo repositorio**. El reparto no es por ramas
sino por carpetas: cada persona escribe solo dentro de la suya, de modo que dos commits
simultáneos no pueden tocar el mismo archivo.

```
PulseUX_WEB/
├─ CONTEXT.md                      ← este archivo. Lo mantiene Diego.
├─ README.md                       ← cómo levantar el proyecto en local.
│
├─ api/                            ◆ DIEGO — exclusivo
│  ├─ src/
│  │  ├─ index.ts                  servidor Express
│  │  ├─ db.ts                     pool de PostgreSQL
│  │  └─ rutas/
│  │     ├─ registros.ts
│  │     ├─ metricas.ts
│  │     └─ contactos.ts
│  ├─ sql/
│  │  ├─ 001_esquema.sql
│  │  └─ 002_datos_demo.sql
│  ├─ .env.example
│  └─ package.json
│
└─ web/
   ├─ src/
   │  ├─ main.tsx                  ◆ DIEGO
   │  ├─ App.tsx                   ◆ DIEGO — ensambla las secciones en orden
   │  │
   │  ├─ estilos/
   │  │  └─ tokens.css             ◆ DIEGO — paleta, tipografía, espaciado
   │  │
   │  ├─ contenido/
   │  │  └─ textos.ts              ◆ DIEGO crea · AMBOS leen · nadie reescribe
   │  │
   │  ├─ landing/                  ◆ GABRIEL — exclusivo
   │  │  ├─ Portada.tsx
   │  │  ├─ Problema.tsx
   │  │  ├─ ComoFunciona.tsx
   │  │  ├─ PorQue.tsx
   │  │  ├─ Contacto.tsx
   │  │  ├─ Footer.tsx
   │  │  └─ landing.css
   │  │
   │  └─ demo/                     ◆ DIEGO — exclusivo
   │     ├─ Pruebalo.tsx           la sección completa (aclaración + simulador + panel)
   │     ├─ Simulador.tsx          los tres botones y el LED
   │     ├─ Dashboard.tsx          métricas en vivo
   │     ├─ api.ts                 cliente HTTP
   │     └─ demo.css
   │
   ├─ public/
   │  └─ img/                      ◆ GABRIEL — imágenes generadas con IA (E1)
   ├─ .env.example
   └─ package.json
```

### Secuencia de arranque

Diego empieza primero. Esto es deliberado: antes de que Gabriel toque nada, el andamiaje
ya debe existir.

1. **Diego, primer push.** Estructura de carpetas, `tokens.css`, `textos.ts` con todos los
   textos ya cargados, y `App.tsx` ensamblando las siete secciones en orden. Los
   componentes de `landing/` se crean como archivos que ya renderizan su texto correcto,
   sin diseño.
2. **Diego avisa a Gabriel** que el repositorio está listo.
3. **Gabriel** clona y trabaja únicamente dentro de `web/src/landing/`, `landing.css` y
   `public/img/`. Nunca necesita editar `App.tsx`, `tokens.css` ni `textos.ts`.
4. **Diego** continúa en paralelo con `api/` y `web/src/demo/`.

Con este orden, Gabriel recibe un proyecto que ya compila y ya muestra los textos
correctos; su trabajo es diseño e imágenes, no cableado.

### Reglas de Git

- Ambos empujan a `main`. No hacen falta ramas porque las carpetas no se solapan.
- `git pull --rebase` **antes** de cada push. Siempre.
- `.env`, `node_modules/` y `dist/` van en `.gitignore` desde el primer commit.
- Mensajes de commit en español, en imperativo: `agrega sección portada`,
  `corrige cálculo del índice neto`.
- Si aparece un conflicto en un archivo que no es tuyo, no lo resuelvas: avisa.

---

## 5. Modelo de datos

```sql
-- 001_esquema.sql

CREATE TABLE dispositivos (
  id              TEXT PRIMARY KEY,              -- 'PX-001'
  nombre          TEXT NOT NULL,                 -- 'Caja principal'
  punto_servicio  TEXT,                          -- 'Sede Miraflores'
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla núcleo. Tres columnas de dato y nada más. Ver invariante I1.
CREATE TABLE registros (
  id              BIGSERIAL PRIMARY KEY,
  dispositivo_id  TEXT NOT NULL REFERENCES dispositivos(id),
  opcion          SMALLINT NOT NULL CHECK (opcion IN (1, 2, 3)),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_registros_creado_en   ON registros (creado_en DESC);
CREATE INDEX idx_registros_dispositivo ON registros (dispositivo_id, creado_en DESC);

-- Datos del comprador organizacional. Separada por diseño. Ver invariante I2.
CREATE TABLE contactos (
  id                 BIGSERIAL PRIMARY KEY,
  nombre             TEXT NOT NULL,
  empresa            TEXT NOT NULL,
  distrito           TEXT,
  puntos_atencion    INTEGER,
  correo             TEXT NOT NULL,
  creado_en          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Codificación de `opcion`

| Valor | Botón | Significado |
|---|---|---|
| `1` | Verde | Satisfecho |
| `2` | Amarillo | Neutral |
| `3` | Rojo | Insatisfecho |

Esta correspondencia es fija y está replicada en el firmware del dispositivo. No se
reordena.

---

## 6. Contrato de la API

Esta es la costura entre el simulador y el dashboard. Queda **congelada** al primer push:
si algo aquí tiene que cambiar, se documenta en este archivo antes de cambiar el código.

Base: `${VITE_API_URL}/api`

---

**`POST /registros`** — registra una pulsación

```json
// petición
{ "dispositivo_id": "PX-001", "opcion": 1 }

// 201 Created
{ "id": 1432, "creado_en": "2026-11-27T19:04:11.284Z" }
```

Valida que `opcion` sea 1, 2 o 3 y que el dispositivo exista. Responde `400` en otro caso.

---

**`GET /metricas?dispositivo_id=PX-001&rango=7d`** — agregados para el dashboard

`rango` acepta `24h`, `7d`, `30d`. `dispositivo_id` es opcional; sin él, agrega todos.

```json
{
  "total": 847,
  "distribucion": {
    "satisfecho":   { "conteo": 612, "porcentaje": 72.3 },
    "neutral":      { "conteo": 158, "porcentaje": 18.7 },
    "insatisfecho": { "conteo":  77, "porcentaje":  9.1 }
  },
  "indice_neto": 63.2,
  "serie": [
    { "fecha": "2026-11-21", "satisfecho": 88, "neutral": 21, "insatisfecho": 9 }
  ]
}
```

`indice_neto` = `%satisfecho − %insatisfecho`, en el rango −100 a 100. Es la métrica
titular del dashboard porque resume la señal en un número comparable entre periodos.

---

**`GET /registros/recientes?limite=10`** — últimas pulsaciones, para el panel en vivo

```json
{ "registros": [ { "opcion": 1, "creado_en": "2026-11-27T19:04:11.284Z" } ] }
```

---

**`POST /contactos`** — formulario de la landing

```json
{
  "nombre": "...", "empresa": "...", "distrito": "...",
  "puntos_atencion": 3, "correo": "..."
}
```

Responde `201` con `{ "recibido": true }`. No devuelve el registro creado.

---

**`GET /salud`** — verificación de vida

```json
{ "estado": "ok" }
```

Existe para despertar el servicio antes de una demostración. Ver el riesgo R1.

---

## 7. Lenguaje visual

Los tokens los define Diego en `web/src/estilos/tokens.css` y **nadie más los modifica**.
Gabriel construye sobre ellos. Así la landing y el simulador se ven como un solo producto
aunque los escriban dos personas distintas.

Base tomada del logotipo: degradado cian–verde sobre fondo oscuro.

```css
:root {
  /* superficie */
  --fondo:            #0B1220;
  --superficie:       #111A2B;
  --superficie-alta:  #1A2639;
  --borde:            #243349;

  /* texto */
  --texto:            #E8EEF7;
  --texto-suave:      #97A6BD;

  /* marca */
  --marca-cian:       #22D3EE;
  --marca-verde:      #4ADE80;
  --marca-degradado:  linear-gradient(135deg, #22D3EE, #4ADE80);

  /* botones del dispositivo — colores reales del hardware, no decorativos */
  --btn-verde:        #22C55E;
  --btn-amarillo:     #EAB308;
  --btn-rojo:         #EF4444;

  /* tipografía */
  --fuente: "Inter", system-ui, -apple-system, sans-serif;

  /* espaciado */
  --e-1: 0.5rem;  --e-2: 1rem;   --e-3: 1.5rem;
  --e-4: 2.5rem;  --e-5: 4rem;   --e-6: 6rem;

  --radio: 14px;
}
```

Reglas de uso:

- Los tres colores de botón se usan **solo** en el simulador y en la leyenda del
  dashboard. No como acentos decorativos en la landing: pierden su significado.
- Cada sección respira `var(--e-6)` de separación vertical en escritorio.
- Todo texto sobre `--fondo` usa `--texto` o `--texto-suave`. Nada de grises a mano.
- El degradado de marca se reserva para el titular de portada y el botón principal.

---

## 8. Riesgos y mitigaciones

| # | Riesgo | Mitigación |
|---|---|---|
| **R1** | **El plan gratuito de Render duerme el servicio tras 15 minutos de inactividad y despertarlo toma cerca de un minuto.** El video del E6 se graba el sábado filmando el simulador en funcionamiento: un arranque en frío durante la grabación arruina la toma. | Tres capas. (a) El simulador actualiza su interfaz **de forma optimista**: la pulsación se refleja al instante en pantalla y el `POST` viaja en segundo plano; el LED no espera la respuesta del servidor. (b) Abrir `GET /salud` cinco minutos antes de grabar. (c) Si la API no responde en 3 segundos, el simulador sigue funcionando contra estado local y muestra un aviso discreto de reconexión, sin pantallas de error. |
| **R2** | Un dashboard vacío no demuestra nada. | `002_datos_demo.sql` siembra registros distribuidos en los últimos 30 días. El dashboard muestra una etiqueta **«Datos de demostración»** mientras esos registros estén presentes: es una demo, y decirlo cuesta dos minutos. |
| **R3** | Gabriel queda bloqueado esperando el simulador. | No depende de él. `App.tsx` reserva la cuarta sección desde el primer push y Gabriel nunca la toca. La landing compila y se ve completa aunque `demo/` esté a medio hacer. |
| **R4** | Conflictos de merge por trabajo asíncrono. | Propiedad exclusiva de carpetas (sección 4) y `pull --rebase` antes de cada push. El único archivo compartido es `textos.ts`, de solo lectura para ambos. |
| **R5** | Alguien «mejora» el simulador agregando un campo de correo o un contador por visitante. | Invariante I1, documentada arriba con su razón. Es el argumento comercial más fuerte del plan completo. |
| **R6** | La landing no responde bien en tablet, que es el dispositivo sobre el que se filma el E6. | El simulador se diseña **primero para tablet en vertical** (768 px) y después se adapta a escritorio y teléfono. Es el caso de uso de la grabación y el que más se parece al equipo real sobre un mostrador. |

---

## 9. Variables de entorno

`api/.env`

```
DATABASE_URL=postgresql://usuario:clave@host:5432/pulseux
PORT=3000
ORIGEN_PERMITIDO=https://pulseux.vercel.app
```

`web/.env`

```
VITE_API_URL=https://pulseux-api.onrender.com
VITE_DISPOSITIVO_DEMO=PX-001
```

Ninguno de los dos archivos se versiona. Sí se versionan los `.env.example`
correspondientes, con las claves y sin los valores.

---

## 10. Calendario

| Cuándo | Qué | Quién |
|---|---|---|
| Mié 25, noche | Andamiaje, tokens, textos, `App.tsx`, esquema SQL | Diego |
| Jue 26 | API funcionando en local, simulador escribiendo en PostgreSQL | Diego |
| Vie 27, 22:00 | **E2-A entregado:** simulador + dashboard + base de datos, desplegados | Diego |
| Sáb 28, 16:00 | **E6:** grabación del video filmando la demo sobre una tablet | Harold + Gabriel |
| Sáb 28, 20:00 | **E2-B entregado:** landing publicada con diseño e imágenes | Gabriel |
| Dom 29 | Integración de todos los entregables en el Capítulo 6 | Diego |

Dependencia dura: **E2-A bloquea E6.** El video filma la demo en funcionamiento; si el
viernes a las 22:00 el simulador no escribe en la base de datos, el sábado no hay nada que
grabar.

---

## 11. Pendientes fuera de este repositorio

- Corregir la ficha técnica y la sección 1.7 del informe: declaran MySQL y el motor es
  PostgreSQL.
- Objetivos SMART, estrategia SEO y parrilla de contenidos de una semana (Capítulo 6,
  parte de Diego).
- Identificación de aliados estratégicos con entidades reales de Lima (S14).
- Capítulos de cierre: Conclusiones y Recomendaciones.