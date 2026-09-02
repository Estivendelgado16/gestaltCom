export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      manual_payments: {
        Row: {
          id: string;
          user_id: string;
          receipt_url: string | null;
          reference_number: string | null;
          status: "PENDING" | "APPROVED" | "REJECTED";
          notes: string | null;
          created_at: string;
          formacion_id?: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          receipt_url?: string | null;
          reference_number?: string | null;
          status?: "PENDING" | "APPROVED" | "REJECTED";
          notes?: string | null;
          created_at?: string;
          formacion_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          receipt_url?: string | null;
          reference_number?: string | null;
          status?: "PENDING" | "APPROVED" | "REJECTED";
          notes?: string | null;
          created_at?: string;
          formacion_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "manual_payments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "manual_payments_formacion_id_fkey";
            columns: ["formacion_id"];
            isOneToOne: false;
            referencedRelation: "formaciones";
            referencedColumns: ["id"];
          },
        ];
      };
      user_access: {
        Row: {
          user_id: string;
          has_paid_access: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          has_paid_access?: boolean;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          has_paid_access?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_access_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      formaciones: {
        Row: {
          id: string;
          titulo: string;
          descripcion: string;
          tipo: "DIPLOMADO" | "CURSO" | "TALLER" | "OTRO";
          fecha_inicio: string | null;
          fecha_fin: string | null;
          horarios: string | null;
          modalidad: "Presencial" | "Virtual" | "Híbrido";
          duracion: string | null;
          flyer_url: string | null;
          galeria_fotos: string[];
          precio: number | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          descripcion: string;
          tipo?: "DIPLOMADO" | "CURSO" | "TALLER" | "OTRO";
          fecha_inicio?: string | null;
          fecha_fin?: string | null;
          horarios?: string | null;
          modalidad?: "Presencial" | "Virtual" | "Híbrido";
          duracion?: string | null;
          flyer_url?: string | null;
          galeria_fotos?: string[];
          precio?: number | null;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          descripcion?: string;
          tipo?: "DIPLOMADO" | "CURSO" | "TALLER" | "OTRO";
          fecha_inicio?: string | null;
          fecha_fin?: string | null;
          horarios?: string | null;
          modalidad?: "Presencial" | "Virtual" | "Híbrido";
          duracion?: string | null;
          flyer_url?: string | null;
          galeria_fotos?: string[];
          precio?: number | null;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      user_enrollments: {
        Row: {
          id: string;
          user_id: string;
          formacion_id: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          formacion_id: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          formacion_id?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_enrollments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_enrollments_formacion_id_fkey";
            columns: ["formacion_id"];
            isOneToOne: false;
            referencedRelation: "formaciones";
            referencedColumns: ["id"];
          },
        ];
      };
      modules: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          order_index: number;
          formacion_id?: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          order_index?: number;
          formacion_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          formacion_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string | null;
          title: string;
          description: string | null;
          video_url: string;
          pdf_url: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id?: string | null;
          title: string;
          description?: string | null;
          video_url: string;
          pdf_url?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string | null;
          title?: string;
          description?: string | null;
          video_url?: string;
          pdf_url?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "modules";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      approve_user_payment: {
        Args: { target_user_id: string; payment_id: string };
        Returns: void;
      };
    };
  };
}
