-- ============================================================
-- YouTube (youtube_playlist)
-- Consolidado de:
--   20260905000000_create_youtube_playlist.sql
--   20261007000003_youtube_admin_policy.sql
--   20261007000004_youtube_part_free_text.sql
-- ============================================================

-- Tabla que alimenta la vista pública /ContYoutube.
-- `part` admite cualquier valor (I, II, III, IV, ...): se eliminó el
-- CHECK original para que el admin pueda escribir la parte libremente.
CREATE TABLE IF NOT EXISTS public.youtube_playlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part TEXT NOT NULL,
    order_num INT NOT NULL,
    tema TEXT NOT NULL,
    invitado TEXT,
    youtube_link TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (part, order_num)
);

-- La playlist es pública (los videos son de acceso libre en YouTube)
ALTER TABLE public.youtube_playlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Playlist youtube publica" ON public.youtube_playlist;
CREATE POLICY "Playlist youtube publica"
ON public.youtube_playlist FOR SELECT TO public
USING (true);

-- Permisos de admin para /admin/youtube
DROP POLICY IF EXISTS "Admin gestiona youtube_playlist" ON public.youtube_playlist;
CREATE POLICY "Admin gestiona youtube_playlist"
ON public.youtube_playlist FOR ALL TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
WITH CHECK (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

-- ------------------------------------------------------------
-- DATOS: Parte I (1-27)
-- ------------------------------------------------------------
INSERT INTO public.youtube_playlist (part, order_num, tema, invitado, youtube_link, note) VALUES
('I', 1, 'Introducción general a la Terapia Gestalt', 'Carmen Vázquez Bandín (España: CTP)', 'https://youtu.be/_LYLH4WHp3c', NULL),
('I', 2, 'Desarrollo histórico e influencias de la Terapia Gestalt', 'José Miguel Echarte (Argentina: Contacto Gestalt BA)', 'https://youtu.be/5_k80UEKrWQ', NULL),
('I', 3, 'Puntos de encuentro y diferencias entre las Gestalts de NY, California y Cleveland', 'José Miguel Echarte (Argentina: Contacto Gestalt BA)', 'https://youtu.be/FgrpOhPiQlw', NULL),
('I', 4, 'La fenomenología en Terapia Gestalt', 'Francisco Díaz Calderón (México: APHIN)', 'https://youtu.be/7AooMd3tHGM', NULL),
('I', 5, 'Dinámica Figura/Fondo en Terapia Gestalt', 'Paco Giner Pérez (España: Movimiento Psicólogos)', 'https://youtu.be/Qs2M5g40GvI', NULL),
('I', 6, 'La Teoría del Self en Terapia Gestalt', 'Ximo Tárrega Soler (España: Centre Gestalt Valencia)', 'https://youtu.be/znZIw30oLgs', NULL),
('I', 7, 'Teoría de Campo en Terapia Gestalt', 'David Picó Vila (España: Terapiados)', 'https://youtu.be/2ZjRmgS2VJg', NULL),
('I', 8, 'Relación Terapeuta/Paciente desde la perspectiva de campo', 'Jean-Marie Delacroix (Francia)', 'https://youtu.be/gjS5pz4tykQ', NULL),
('I', 9, 'Modalidades de conciencia: el awareness y el consciousness', 'Claudia Fenzel (Argentina: Movimiento Gestalt)', 'https://youtu.be/4NzNZ49bsvI', NULL),
('I', 10, 'Pasaje de lo fisiológico a lo psicológico en la clínica gestáltica', 'Ángel Gerardo (México: Universidad Nexum)', 'https://youtu.be/gS04L3dWTvk', NULL),
('I', 11, 'Campo gestáltico y otredades', 'Marcos José Müller (Brasil)', 'https://youtu.be/sxuY3t1fZ_c', NULL),
('I', 12, 'Vulnerabilidades de las funciones del self y la expansión del campo clínico', 'Rosane Lorena Granzotto (Brasil: Instituto Granzotto de Psicología Clínica Gestalt)', 'https://youtu.be/XcezLLcHbVs', NULL),
('I', 13, 'La experiencia en Terapia Gestalt', 'Guy-Pierre Tur (Francia-México)', 'https://youtu.be/DKMM8SwrXF4', NULL),
('I', 14, 'El contacto, contactar y el proceso de contacto', 'Jean-Marie Robine (Francia: IFGT)', 'https://youtu.be/B-Zb5zYBkpA', NULL),
('I', 15, 'Contacto perturbado; modalidades/interrupciones del contacto', 'Iñaki García Maza (España: Erain Centro psikoterapia humanista gunea)', 'https://youtu.be/jco6M_UXU2U', NULL),
('I', 16, 'Relación/diferencia entre Técnicas y Experimentos en la Terapia Gestalt', 'Manuel Ramos Gascón (España: ITG Valencia)', 'https://youtu.be/_C1GmwjBcwQ', NULL),
('I', 17, 'El experimento y el ''decalage'' como fenómeno en la frontera-contacto', 'José Miguel Echarte (Argentina: Contacto Gestalt BA)', 'https://youtu.be/H1x_Znp-Xfg', NULL),
('I', 18, 'El cuerpo y la palabra en Terapia Gestalt', 'Jeffrey Varela (España: Terapiados)', 'https://youtu.be/OgaFPprboqU', NULL),
('I', 19, 'Procesos corporales y vivencias sexuales en el setting terapéutico gestáltico', 'María Mione (Italia: Istituto di Gestalt HCC)', 'https://youtu.be/wOpBTYoJcDE', NULL),
('I', 20, 'La filosofía de Merleau-Ponty y su relevancia en el campo de la terapia', 'Guennadi Búrquez Urías (México: Radio Gestalt)', 'https://youtu.be/MSJ7hvOz5yw', NULL),
('I', 21, 'Self emergente del campo', 'Peter Philippson (Reino Unido: Manchester Gestalt Centre)', 'https://youtu.be/YCwTbjTQld0', NULL),
('I', 22, 'Introducción a la psicopatología Gestalt desde una perspectiva de campo: clínica y comprensión', 'Marcus Cézar Belmino (Brasil: Comunidad de aprendizaje Gestalt)', 'https://youtu.be/wwvJFULO7LM', NULL),
('I', 23, 'La psicopatología y la teoría de campo', 'Gianni Francesetti (Italia: IPsiG)', 'https://youtu.be/A4nDMjKtVn0', NULL),
('I', 24, 'Psicopatología de la situación: el enfoque fenomenológico, estético y de campo de la terapia gestalt a la práctica clínica', 'Margherita Spagnuolo Lobb (Italia: Istituto di Gestalt HCC)', 'https://youtu.be/9rDQZNJG7SA', NULL),
('I', 25, 'Discusión Gestáltica I', 'Julio Polanco Ocampo (México), José Miguel Echarte (Argentina), Ricardo García (Chile), David Picó Vila (España)', 'https://youtu.be/iGC0uDgFwcU', NULL),
('I', 26, 'Discusión Gestáltica II', 'Lupe Llorens e Iñaki García (España), Mónica Margain y Carlos Esteve (México)', 'https://youtu.be/Gpqvv_K4wU4', NULL),
('I', 27, 'Discusión Gestáltica III', 'Guy-Pierre Tur (Francia-México), Marcos José Müller (Brasil), Claudia Fenzel (Argentina), Rafael Cortina (México-EEUU)', 'https://youtu.be/YwKEEdDUxaM', NULL)
ON CONFLICT (part, order_num) DO UPDATE SET tema = EXCLUDED.tema, invitado = EXCLUDED.invitado, youtube_link = EXCLUDED.youtube_link, note = EXCLUDED.note;

-- ------------------------------------------------------------
-- DATOS: Parte II (28-60)
-- ------------------------------------------------------------
INSERT INTO public.youtube_playlist (part, order_num, tema, invitado, youtube_link, note) VALUES
('II', 28, 'Convertirse en persona a través del diálogo: La Teoría de Campo revisitada', 'Friedemann Schulz (Estados Unidos)', 'https://youtu.be/RnW7Xs8_ByI', NULL),
('II', 29, 'El Self relacional: una perspectiva clínica fenomenológica en Terapia Gestalt', 'Dan Bloom (Estados Unidos)', 'https://youtu.be/-8uz-3a4Ffk', NULL),
('II', 30, 'Fundamentos Estéticos de la Terapia Gestalt', 'Michael Vincent Miller (Estados Unidos)', 'https://youtu.be/21XH1XbY_r4', NULL),
('II', 31, 'La construcción de los cuerpos y sus sufrimientos: Aspectos culturales, relacionales y biológicos', 'Michela Gecele (Italia: IPsiG)', 'https://youtu.be/aKJGLI6heJc', NULL),
('II', 32, 'La Estética del Contacto: Un enfoque somático del desarrollo', 'Ruella Frank (Estados Unidos: Centro de Estudios Somáticos)', 'https://youtu.be/VQEf65-iics', NULL),
('II', 33, 'La Resonancia y su aplicación clínica para la Terapia Gestalt', 'Sergio Guido La Rosa (Argentina-Italia: Universidad Nexum de México)', 'https://youtu.be/FCIjgYpkHpo', NULL),
('II', 34, 'Trabajo basado en la teoría de campo en la práctica clínica', 'Jan Roubal (República Checa: Gestalt Studia)', 'https://youtu.be/OB750_VLGsc', NULL),
('II', 35, 'El campo de la supervisión en la Terapia Gestalt: procesos paralelos, roles invertidos y fuerzas de campo', 'Nancy Amendt-Lyon (Austria)', 'https://youtu.be/h2aX0LW2pG4', NULL),
('II', 36, 'La despatologización de la vida: Escucha Gestáltica a las vulnerabilidades y sus efectos narrativos y discursivos', 'Marcos José Müller (Brasil)', 'https://youtu.be/GA6cPDrJEmo', NULL),
('II', 37, 'La psicopatología y una visión gestáltica específica del desarrollo', 'Pierre-Yves Goriaux (Francia: IFGT)', 'https://youtu.be/HEVsIfTIU78', NULL),
('II', 38, 'Modalidades de la experiencia: Neurótica, Border y Psicótica desde la Terapia Gestalt', 'Mónica Margain Castro (México)', 'https://youtu.be/Bz-w1vk9Rr0', NULL),
('II', 39, 'Formación de la Neurosis según la Terapia Gestalt', 'Julio Polanco Ocampo (México: Casa Gestalt Mérida)', 'https://youtu.be/pmDfOMvRezM', NULL),
('II', 40, 'Experiencias de Ansiedad según la Terapia Gestalt', 'Carlos Esteve Gutiérrez (México: Centro de Psicoterapia Gestaltung)', 'https://youtu.be/svnjhlnA5E8', NULL),
('II', 41, 'Trastornos de Pánico: Perspectivas clínicas y neurocientíficas', 'Gianni Francesetti (Italia: IPsiG)', 'https://youtu.be/Fgcv3wxIDi0', NULL),
('II', 42, 'Cuando los demás me miran: experiencias de Ansiedad Social desde una perspectiva gestáltica', 'David Picó Vila (España: Terapiados)', 'https://youtu.be/aGpEFufMTKU', NULL),
('II', 43, 'Trauma y Estrés Postraumático desde la Psicoterapia Gestalt', 'Viviana Valdés Teja (México)', 'https://youtu.be/1mfHuV2bmiA', NULL),
('II', 44, 'Terapia Grupal Gestáltica en el Tratamiento del Trauma Continuo', 'Oleksii Vinohradov (Ucrania: Gestalt Practicum)', 'https://youtu.be/UONWCnv7TG4', NULL),
('II', 45, 'Enfoque Gestalt Compasivo/Relacional: Abordaje Integral del Trauma y las Adicciones', 'Rafael Cortina (México-Estados Unidos)', 'https://youtu.be/oSH8IbiKG4Y', NULL),
('II', 46, 'Duelo, Depresión y Melancolía desde la Perspectiva Gestáltica', 'Carmen Vázquez Bandín (España: CTP)', 'https://youtu.be/q8zbgRU71xQ', NULL),
('II', 47, 'Suicidio y Autolesiones desde la Clínica Gestáltica', 'Francisco Javier Díaz Calderón (México: APHIN)', 'https://youtu.be/mY6l9qnxVGE', NULL),
('II', 48, 'Las Experiencias Bipolares desde la Terapia Gestalt', 'Luis F. Durán (México)', 'https://youtu.be/cGTDFxZHj68', NULL),
('II', 49, 'La Personalidad desde la Terapia Gestalt: ¿Qué duele cuando duele la personalidad? entre lo fijo y lo posible', 'Antonio Sellés (España: ITG Castellón)', 'https://youtu.be/9Ch7m9UfBVE', NULL),
('II', 50, 'Trastornos de Personalidad y Aproximación Gestáltica a las Dimensiones Paranoide y Esquizotípica', 'Luis Javier Tobón (Colombia)', 'https://youtu.be/QUW-C9fwMW8', NULL),
('II', 51, 'El Enfoque de Terapia Gestalt para las Adaptaciones Esquizoides', 'Elinor Greenberg (Estados Unidos)', 'https://youtu.be/P4_8XEnV9yY', NULL),
('II', 52, '"La luna está hecha de queso": la obra Gestalt como traducción del lenguaje Borderline', 'Giovanni Salonia (Italia: Instituto de Terapia Gestalt Kairòs)', NULL, 'En proceso de edición'),
('II', 53, 'Consideraciones de la Experiencia Histérica desde la clínica Gestáltica', 'Lupe Llorens (Argentina-España)', NULL, 'En proceso de edición'),
('II', 54, 'Trastorno de Personalidad Narcisista desde la Terapia Gestalt: experiencia de sufrimiento por grandiosidad', 'José Miguel Echarte (Argentina: Contacto Gestalt BA)', NULL, 'En proceso de edición'),
('II', 55, 'Perspectiva de los Comportamientos Violentos según la Terapia Gestalt', 'Iñaki García Maza (España: Erain Centro psikoterapia humanista gunea)', NULL, 'En proceso de edición'),
('II', 56, 'La experiencia Obsesivo-Compulsiva para la Terapia Gestalt', 'Ximo Tárrega Soler (España: Centre Gestalt Valencia)', NULL, 'En proceso de edición'),
('II', 57, 'Sed de otredad: una mirada a la Sexualidad desde la Terapia Gestalt', 'Francisco Fernández Romero (México)', NULL, 'En proceso de edición'),
('II', 58, 'El enfoque Gestáltico en los Desórdenes Psicosomáticos', 'Michele Cannavò (Italia: Istituto di Gestalt HCC)', NULL, 'En proceso de edición'),
('II', 59, 'Fenomenología de las Experiencias Psicóticas', 'María José Perruca Pacios (España: ITG Valencia)', NULL, 'En proceso de edición'),
('II', 60, 'Comprensiones de la Psicosis desde la Perspectiva de Campo', 'Rosane Lorena Granzotto (Brasil: Instituto Granzotto de Psicología Clínica Gestalt)', NULL, 'En proceso de edición')
ON CONFLICT (part, order_num) DO UPDATE SET tema = EXCLUDED.tema, invitado = EXCLUDED.invitado, youtube_link = EXCLUDED.youtube_link, note = EXCLUDED.note;

-- ------------------------------------------------------------
-- DATOS: Parte III (61)
-- ------------------------------------------------------------
INSERT INTO public.youtube_playlist (part, order_num, tema, invitado, youtube_link, note) VALUES
('III', 61, 'Una mirada a los sueños desde la Terapia Gestalt', 'José Miguel Echarte (Argentina: Contacto Gestalt BA)', NULL, 'En proceso de edición')
ON CONFLICT (part, order_num) DO UPDATE SET tema = EXCLUDED.tema, invitado = EXCLUDED.invitado, youtube_link = EXCLUDED.youtube_link, note = EXCLUDED.note;
