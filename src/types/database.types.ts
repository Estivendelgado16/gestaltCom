export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      actividades: {
        Row: {
          category: string;
          created_at: string | null;
          cta_link: string | null;
          cta_text: string;
          description: string;
          featured_notice: string | null;
          id: string;
          image_alt: string | null;
          image_url: string | null;
          is_featured: boolean | null;
          is_published: boolean | null;
          sort_order: number | null;
          status_badges: string[] | null;
          subtitle: string | null;
          title: string;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          cta_link?: string | null;
          cta_text: string;
          description: string;
          featured_notice?: string | null;
          id?: string;
          image_alt?: string | null;
          image_url?: string | null;
          is_featured?: boolean | null;
          is_published?: boolean | null;
          sort_order?: number | null;
          status_badges?: string[] | null;
          subtitle?: string | null;
          title: string;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          cta_link?: string | null;
          cta_text?: string;
          description?: string;
          featured_notice?: string | null;
          id?: string;
          image_alt?: string | null;
          image_url?: string | null;
          is_featured?: boolean | null;
          is_published?: boolean | null;
          sort_order?: number | null;
          status_badges?: string[] | null;
          subtitle?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      flyers: {
        Row: {
          created_at: string;
          expires_at: string;
          formacion_id: string | null;
          id: string;
          public_url: string;
          storage_path: string;
        };
        Insert: {
          created_at?: string;
          expires_at?: string;
          formacion_id?: string | null;
          id?: string;
          public_url: string;
          storage_path: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string;
          formacion_id?: string | null;
          id?: string;
          public_url?: string;
          storage_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flyers_formacion_id_fkey";
            columns: ["formacion_id"];
            isOneToOne: false;
            referencedRelation: "formaciones";
            referencedColumns: ["id"];
          },
        ];
      };
      formaciones: {
        Row: {
          created_at: string | null;
          descripcion: string;
          duracion: string | null;
          fecha_fin: string | null;
          fecha_inicio: string | null;
          flyer_url: string | null;
          galeria_fotos: string[] | null;
          horarios: string | null;
          id: string;
          is_published: boolean | null;
          modalidad: string | null;
          precio: number | null;
          tipo: string | null;
          titulo: string;
        };
        Insert: {
          created_at?: string | null;
          descripcion: string;
          duracion?: string | null;
          fecha_fin?: string | null;
          fecha_inicio?: string | null;
          flyer_url?: string | null;
          galeria_fotos?: string[] | null;
          horarios?: string | null;
          id?: string;
          is_published?: boolean | null;
          modalidad?: string | null;
          precio?: number | null;
          tipo?: string | null;
          titulo: string;
        };
        Update: {
          created_at?: string | null;
          descripcion?: string;
          duracion?: string | null;
          fecha_fin?: string | null;
          fecha_inicio?: string | null;
          flyer_url?: string | null;
          galeria_fotos?: string[] | null;
          horarios?: string | null;
          id?: string;
          is_published?: boolean | null;
          modalidad?: string | null;
          precio?: number | null;
          tipo?: string | null;
          titulo?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_published: boolean | null;
          module_id: string | null;
          pdf_name: string | null;
          pdf_url: string | null;
          secondary_pdf_urls: Json;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_published?: boolean | null;
          module_id?: string | null;
          pdf_name?: string | null;
          pdf_url?: string | null;
          secondary_pdf_urls?: Json;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_published?: boolean | null;
          module_id?: string | null;
          pdf_name?: string | null;
          pdf_url?: string | null;
          secondary_pdf_urls?: Json;
          title?: string;
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
      manual_payments: {
        Row: {
          created_at: string;
          formacion_id: string | null;
          id: string;
          notes: string | null;
          receipt_url: string | null;
          reference_number: string | null;
          status: string | null;
          user_email: string | null;
          user_id: string;
          user_name: string | null;
        };
        Insert: {
          created_at?: string;
          formacion_id?: string | null;
          id?: string;
          notes?: string | null;
          receipt_url?: string | null;
          reference_number?: string | null;
          status?: string | null;
          user_email?: string | null;
          user_id: string;
          user_name?: string | null;
        };
        Update: {
          created_at?: string;
          formacion_id?: string | null;
          id?: string;
          notes?: string | null;
          receipt_url?: string | null;
          reference_number?: string | null;
          status?: string | null;
          user_email?: string | null;
          user_id?: string;
          user_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "manual_payments_formacion_id_fkey";
            columns: ["formacion_id"];
            isOneToOne: false;
            referencedRelation: "formaciones";
            referencedColumns: ["id"];
          },
        ];
      };
      modules: {
        Row: {
          created_at: string;
          description: string | null;
          formacion_id: string | null;
          id: string;
          order_index: number | null;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          formacion_id?: string | null;
          id?: string;
          order_index?: number | null;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          formacion_id?: string | null;
          id?: string;
          order_index?: number | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "modules_formacion_id_fkey";
            columns: ["formacion_id"];
            isOneToOne: false;
            referencedRelation: "formaciones";
            referencedColumns: ["id"];
          },
        ];
      };
      site_files: {
        Row: {
          file_name: string | null;
          key: string;
          public_url: string;
          storage_path: string;
          updated_at: string;
        };
        Insert: {
          file_name?: string | null;
          key: string;
          public_url: string;
          storage_path: string;
          updated_at?: string;
        };
        Update: {
          file_name?: string | null;
          key?: string;
          public_url?: string;
          storage_path?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_access: {
        Row: {
          has_paid_access: boolean | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          has_paid_access?: boolean | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          has_paid_access?: boolean | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_enrollments: {
        Row: {
          created_at: string | null;
          formacion_id: string | null;
          id: string;
          is_active: boolean | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          formacion_id?: string | null;
          id?: string;
          is_active?: boolean | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          formacion_id?: string | null;
          id?: string;
          is_active?: boolean | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_enrollments_formacion_id_fkey";
            columns: ["formacion_id"];
            isOneToOne: false;
            referencedRelation: "formaciones";
            referencedColumns: ["id"];
          },
        ];
      };
      youtube_playlist: {
        Row: {
          created_at: string | null;
          id: string;
          invitado: string | null;
          note: string | null;
          order_num: number;
          part: string;
          tema: string;
          youtube_link: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          invitado?: string | null;
          note?: string | null;
          order_num: number;
          part: string;
          tema: string;
          youtube_link?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          invitado?: string | null;
          note?: string | null;
          order_num?: number;
          part?: string;
          tema?: string;
          youtube_link?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      lesson_previews: {
        Row: {
          created_at: string | null;
          description: string | null;
          has_pdf: boolean | null;
          id: string | null;
          is_published: boolean | null;
          module_id: string | null;
          title: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          has_pdf?: never;
          id?: string | null;
          is_published?: boolean | null;
          module_id?: string | null;
          title?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          has_pdf?: never;
          id?: string | null;
          is_published?: boolean | null;
          module_id?: string | null;
          title?: string | null;
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
    Functions: {
      approve_user_payment: {
        Args: { payment_id: string; target_user_id: string };
        Returns: undefined;
      };
      delete_expired_flyers: { Args: never; Returns: number };
      register_flyer: {
        Args: {
          p_expires_at: string;
          p_public_url: string;
          p_storage_path: string;
        };
        Returns: {
          created_at: string;
          expires_at: string;
          formacion_id: string | null;
          id: string;
          public_url: string;
          storage_path: string;
        };
        SetofOptions: {
          from: "*";
          to: "flyers";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      upsert_site_file: {
        Args: {
          p_file_name: string;
          p_key: string;
          p_public_url: string;
          p_storage_path: string;
        };
        Returns: {
          file_name: string | null;
          key: string;
          public_url: string;
          storage_path: string;
          updated_at: string;
        };
        SetofOptions: {
          from: "*";
          to: "site_files";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
