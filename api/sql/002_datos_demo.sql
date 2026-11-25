-- 002_datos_demo.sql
-- Datos de demostración: dos dispositivos y ~850 registros en los últimos 30 días,
-- para que el dashboard no se vea vacío durante la grabación del E6.

INSERT INTO dispositivos (id, nombre, punto_servicio) VALUES
  ('PX-001', 'Caja principal', 'Sede Miraflores'),
  ('PX-002', 'Mostrador de atención', 'Sede San Isidro')
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE
  dia_offset     INT;
  dia_fecha      DATE;
  dia_numero     INT;     -- 1 = día más antiguo del periodo, 30 = hoy
  en_caida       BOOLEAN;
  cantidad_dia   INT;
  registro_idx   INT;
  dispositivo    TEXT;
  opcion_elegida SMALLINT;
  hora_elegida   INT;
  minuto_elegido INT;
  segundo_elegido INT;
  marca          TIMESTAMPTZ;
  r              DOUBLE PRECISION;
  -- Curva de horario comercial: más densidad al mediodía y al final de la tarde.
  horas_tipicas  INT[] := ARRAY[9,10,10,11,11,12,12,12,13,13,13,14,14,
                                 15,15,16,16,17,17,17,18,18,18,19,19,20];
BEGIN
  FOR dia_offset IN SELECT generate_series(0, 29) LOOP
    dia_fecha  := CURRENT_DATE - dia_offset;
    dia_numero := 30 - dia_offset;
    -- Caída deliberada entre los días 12 y 15 del periodo: insatisfecho sube a ~25%.
    en_caida   := dia_numero BETWEEN 12 AND 15;
    cantidad_dia := 24 + floor(random() * 9)::int; -- entre 24 y 32 registros ese día

    FOR registro_idx IN SELECT generate_series(1, cantidad_dia) LOOP
      dispositivo := CASE WHEN random() < 0.6 THEN 'PX-001' ELSE 'PX-002' END;

      r := random();
      IF en_caida THEN
        opcion_elegida := CASE
          WHEN r < 0.50 THEN 1  -- satisfecho
          WHEN r < 0.75 THEN 2  -- neutral
          ELSE 3                -- insatisfecho ~25%
        END;
      ELSE
        opcion_elegida := CASE
          WHEN r < 0.72 THEN 1  -- satisfecho ~72%
          WHEN r < 0.91 THEN 2  -- neutral ~19%
          ELSE 3                -- insatisfecho ~9%
        END;
      END IF;

      hora_elegida    := horas_tipicas[1 + floor(random() * array_length(horas_tipicas, 1))::int];
      minuto_elegido  := floor(random() * 60)::int;
      segundo_elegido := floor(random() * 60)::int;

      marca := dia_fecha
               + (hora_elegida   || ' hours')::interval
               + (minuto_elegido || ' minutes')::interval
               + (segundo_elegido || ' seconds')::interval;

      -- El día de hoy no debe sembrar horas futuras: si el seed se corre a media
      -- mañana, la curva de horario comercial no debe adelantarse al reloj real.
      IF marca > now() THEN
        CONTINUE;
      END IF;

      INSERT INTO registros (dispositivo_id, opcion, creado_en)
      VALUES (dispositivo, opcion_elegida, marca);
    END LOOP;
  END LOOP;
END $$;
