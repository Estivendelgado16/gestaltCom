-- 1. Tabla de reproducción de YouTube (programación de canal)
CREATE TABLE IF NOT EXISTS public.youtube_playlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part TEXT NOT NULL CHECK (part IN ('I', 'II', 'III')),
    order_num INTEGER NOT NULL,
    tema TEXT NOT NULL,
    invitado TEXT,
    youtube_link TEXT,
    note TEXT, -- ej: "En proceso de edición", "(inglés)", etc.
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar RLS (lectura pública para la web)
ALTER TABLE public.youtube_playlist ENABLE ROW LEVEL SECURITY;

-- 3. Política: lecturas públicas (anon y authenticated pueden ver la programación)
CREATE POLICY "Programación de YouTube es visible para todos"
ON public.youtube_playlist FOR SELECT TO public
USING (true);

-- 4. Semilla inicial (primeros 10 registros como ejemplo;
-- los datos completos vienen del documento WordPress "Canal de YouTube.docx").
-- Se insertan los primeros registros de la Parte I, II y III.
WITH seed_data AS (
  SELECT *
  FROM json_to_recordset(
    '[
      {"part":"I","order_num":1,"tema":"Introducción general a la Terapia Gestalt","invitado":"Carmen Vázquez Bandín (España: CTP)","youtube_link":"https://youtu.be/_LYLH4WHp3c","note":null},
      {"part":"I","order_num":2,"tema":"Desarrollo histórico e influencias de la Terapia Gestalt","invitado":"José Miguel Echarte (Argentina: Contacto Gestalt BA)","youtube_link":"https://youtu.be/5_k80UEKrWQ","note":null},
      {"part":"I","order_num":3,"tema":"Puntos de encuentro y diferencias entre las Gestalts de NY, California y Cleveland","invitado":"José Miguel Echarte (Argentina: Contacto Gestalt BA)","youtube_link":"https://youtu.be/FgrpOhPiQlw","note":null},
      {"part":"I","order_num":4,"tema":"La fenomenología en Terapia Gestalt","invitado":"Francisco Díaz Calderón (México: APHIN)","youtube_link":"https://youtu.be/7AooMd3tHGM","note":null},
      {"part":"I","order_num":5,"tema":"Dinámica Figura/Fondo en Terapia Gestalt","invitado":"Paco Giner Pérez (España: Movimiento Psicólogos)","youtube_link":"https://youtu.be/Qs2M5g40GvI","note":null},
      {"part":"II","order_num":1,"tema":"Convertirse en persona a través del diálogo: La Teoría de Campo revisitada","invitado":"Friedemann Schulz (Estados Unidos)","youtube_link":"https://youtu.be/RnW7Xs8_ByI","note":null},
      {"part":"II","order_num":2,"tema":"El Self \'relacional\': una perspectiva clínica fenomenológica en Terapia Gestalt","invitado":"Dan Bloom (Estados Unidos)","youtube_link":"https://youtu.be/-8uz-3a4Ffk","note":null},
      {"part":"II","order_num":3,"tema":"Fundamentos Estéticos de la Terapia Gestalt","invitado":"Michael Vincent Miller (Estados Unidos)","youtube_link":"https://youtu.be/21XH1XbY_r4","note":null},
      {"part":"II","order_num":4,"tema":"La construcción de los cuerpos y sus sufrimientos: Aspectos culturales, relacionales y biológicos","invitado":"Michela Gecele (Italia: IPsiG)","youtube_link":"https://youtu.be/aKJGLI6heJc","note":null},
      {"part":"III","order_num":1,"tema":"Una mirada a los sueños desde la Terapia Gestalt","invitado":"José Miguel Echarte (Argentina: Contacto Gestalt BA)","youtube_link":null,"note":"En proceso de edición"}
    ]'::json
  ) AS x(
    part text,
    order_num integer,
    tema text,
    invitado text,
    youtube_link text,
    note text
  )
)
INSERT INTO public.youtube_playlist (part, order_num, tema, invitado, youtube_link, note)
SELECT part, order_num, tema, invitado, youtube_link, note
FROM seed_data
ON CONFLICT DO NOTHING;