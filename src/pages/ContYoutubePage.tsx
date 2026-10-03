import { useEffect, useState, type ReactNode } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { siteFileService, YOUTUBE_LISTA_KEY, type SiteFile } from "@/services/siteFile.service";

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

function VideoSection({
  title,
  items,
  icon,
}: {
  title: string;
  items: YoutubeVideo[];
  icon?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, INITIAL_COUNT);

  return (
    <section
      className="container-clinic pb-28"
      style={{ paddingInline: "0.5cm", maxWidth: "1400px" }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gold">{title}</h2>
        {icon}
      </div>
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

function ListaEntrevistas() {
  const [file, setFile] = useState<SiteFile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    siteFileService
      .get(YOUTUBE_LISTA_KEY)
      .then((data) => {
        if (!cancelled) setFile(data);
      })
      .catch(() => {
        if (!cancelled) setFile(null);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded || !file) return null;

  return (
    <a
      href={file.public_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Lista de entrevistas"
      className="shrink-0 inline-flex items-center justify-center rounded-full p-2 transition-transform hover:-translate-y-0.5"
      style={{ backgroundColor: "var(--gold)" }}
    >
      <img src="/img/libro-abierto.png" alt="" className="w-8 h-8 object-contain" />
    </a>
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
      {/* Banner del canal — ancho completo */}
      <section className="pb-16">
        <a
          href="https://www.youtube.com/@danymora.gestalt"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src="/img/banner-youtube.png"
            alt="Ps. Dany Rafael Mora Bracho — Comunidad Gestáltica, canal de difusión de Terapia Gestalt de Campo"
            className="w-full object-cover"
          />
        </a>
      </section>

      {loaded && (
        <>
          <VideoSection
            title="Parte I: Temáticas generales y aspectos introductorios de la Terapia Gestalt de campo."
            items={partI}
            icon={<ListaEntrevistas />}
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
