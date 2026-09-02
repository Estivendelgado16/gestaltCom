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

export interface UserEnrollment {
  id: string;
  user_id: string;
  formacion_id: string;
  is_active: boolean;
  created_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  pdf_url: string | null;
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
