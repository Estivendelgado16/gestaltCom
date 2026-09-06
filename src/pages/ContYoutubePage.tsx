import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";

// Inicializar cliente Supabase usando variables de entorno de Vite
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient | null =
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
    ? createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
    : null;

const INITIAL_COUNT = 20;

interface YoutubeVideo {
  id: string;
  part: "I" | "II" | "III";
  order_num: number;
  tema: string;
  invitado: string | null;
  youtube_link: string | null;
  note: string | null;
}

// Extrae el ID de un video de YouTube desde distintos formatos de URL
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
}

function VideoSection({ title, items }: { title: string; items: YoutubeVideo[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, INITIAL_COUNT);

  return (
    <section
      className="container-clinic pb-28"
      style={{ paddingInline: "0.5cm", maxWidth: "1400px" }}
    >
      <h2 className="text-2xl font-bold text-gold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visible.map((v, i) => {
          const link = v.youtube_link ?? undefined;
          const videoId = link ? getYouTubeId(link) : null;
          return (
            <div
              key={v.id}
              className="flex flex-col gap-1.5 p-4 rounded-lg border transition-shadow hover:shadow-md"
              style={{ borderColor: "var(--gold)" }}
            >
              {videoId && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-mx-4 -mt-4 block overflow-hidden rounded-t-lg"
                >
                  <img
                    src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                    alt={v.tema}
                    loading="lazy"
                    className="w-full aspect-video object-cover transition-transform hover:scale-105"
                  />
                </a>
              )}
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--gold)" }}>
                #{i + 1}
              </span>
              <strong className="text-sm leading-snug">{v.tema}</strong>
              {v.invitado && (
                <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
                  {v.invitado}
                </span>
              )}
              {v.note && (
                <span className="text-xs italic" style={{ color: "var(--gold)" }}>
                  {v.note}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {items.length > INITIAL_COUNT && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-6 text-sm uppercase tracking-widest border-b pb-1 transition-colors"
          style={{ color: "var(--ink)", borderColor: "var(--gold)" }}
        >
          {expanded ? "Ver menos" : `Ver más (${items.length - INITIAL_COUNT} restantes)`}
        </button>
      )}
    </section>
  );
}

export function ContYoutubePage() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoaded(true);
      return;
    }

    // Cargar todos los videos de la tabla pública, ordenados por order_num
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from("youtube_playlist")
          .select("*")
          .order("order_num", { ascending: true });
        if (error) throw error;
        setVideos(data || []);
      } catch (e) {
        console.error("Error fetching YouTube playlist:", (e as Error).message);
      } finally {
        setLoaded(true);
      }
    };
    fetchVideos();
  }, []);

  // Organizar videos por parte una vez que ya cargaron
  const partI = loaded ? videos.filter((v) => v.part === "I") : [];
  const partII = loaded ? videos.filter((v) => v.part === "II") : [];
  const partIII = loaded ? videos.filter((v) => v.part === "III") : [];

  return (
    <SiteLayout>
      <section className="container-clinic pt-6 pb-16">
        <div
          className="text-[11px] uppercase tracking-[0.35em]"
          style={{ color: "var(--ink-soft)" }}
        >
          Contenido
        </div>
        <h1 className="mt-8 text-5xl md:text-7xl max-w-4xl leading-[0.98]">
          Contenido en <span style={{ color: "var(--gold)" }}>YouTube</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg" style={{ color: "var(--ink-soft)" }}>
          Entrevistas, divulgación y diálogo en torno a la Terapia Gestalt desde una perspectiva de
          campo.
        </p>
      </section>

      <section className="container-clinic pb-28">
        <a
          href="https://www.youtube.com/@danymora.gestalt"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b pb-1 transition-colors"
          style={{ color: "var(--ink)", borderColor: "var(--gold)" }}
        >
          YouTube · @danymora.gestalt
        </a>
      </section>

      {loaded && (
        <>
          <VideoSection
            title="Parte I: Temáticas generales y aspectos introductorios de la Terapia Gestalt de campo."
            items={partI}
          />
          <VideoSection
            title="Parte II: Situaciones y/o sufrimientos clínicos específicos (intervenciones en 'psicopatología' o temáticas determinadas)."
            items={partII}
          />
          <VideoSection
            title="Parte III: Actualmente en etapa de planificación y desarrollo."
            items={partIII}
          />
        </>
      )}

      {!loaded && <p className="mt-8 text-ink-soft">Cargando programación de YouTube...</p>}
    </SiteLayout>
  );
}
