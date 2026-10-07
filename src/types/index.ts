export type FormacionTipo = "DIPLOMADO" | "CURSO" | "TALLER" | "OTRO";

export interface Formacion {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: FormacionTipo;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  horarios: string | null;
  modalidad: string;
  duracion: string | null;
  flyer_url: string | null;
  galeria_fotos: string[];
  precio: number | null;
  is_published: boolean;
  created_at: string;
}

export interface LessonFile {
  name: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  pdf_url: string | null;
  secondary_pdf_urls: LessonFile[];
  is_published: boolean;
  module_id: string | null;
  created_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  formacion_id?: string;
}

/**
 * Vista previa de lección (todas, sin URLs sensibles) para mostrar la
 * estructura al usuario pagado antes de que el admin publique el contenido.
 */
export interface Actividad {
  id: string;
  title: string;
  category: string;
  subtitle: string | null;
  description: string;
  featured_notice: string | null;
  status_badges: string[];
  cta_text: string;
  cta_link: string | null;
  image_url: string | null;
  image_alt: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface LessonPreview {
  id: string;
  module_id: string | null;
  title: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
  has_video: boolean;
  has_pdf: boolean;
}

export interface PaymentRow {
  id: string;
  user_id: string;
  receipt_url: string | null;
  reference_number: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  user_email?: string;
  formacion_id?: string;
}

export interface ExistingPayment {
  id: string;
  status: string;
  reference_number: string | null;
  created_at: string;
}
