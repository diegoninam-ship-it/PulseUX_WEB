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
