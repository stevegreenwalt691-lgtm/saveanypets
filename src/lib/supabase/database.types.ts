export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      applications: {
        Row: {
          agreed_to_terms: boolean
          city: string
          created_at: string
          current_pets: string | null
          email: string
          full_name: string
          has_secure_outdoor_space: boolean | null
          has_uvb_setup: boolean | null
          home_type: string
          hours_alone: number | null
          household_size: number | null
          id: string
          landlord_allows_pets: boolean | null
          owns_home: boolean
          pet_id: string
          phone: string
          reason: string
          reptile_experience: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          slot_id: string | null
          staff_notes: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          agreed_to_terms?: boolean
          city: string
          created_at?: string
          current_pets?: string | null
          email: string
          full_name: string
          has_secure_outdoor_space?: boolean | null
          has_uvb_setup?: boolean | null
          home_type: string
          hours_alone?: number | null
          household_size?: number | null
          id?: string
          landlord_allows_pets?: boolean | null
          owns_home: boolean
          pet_id: string
          phone: string
          reason: string
          reptile_experience?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          slot_id?: string | null
          staff_notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          agreed_to_terms?: boolean
          city?: string
          created_at?: string
          current_pets?: string | null
          email?: string
          full_name?: string
          has_secure_outdoor_space?: boolean | null
          has_uvb_setup?: boolean | null
          home_type?: string
          hours_alone?: number | null
          household_size?: number | null
          id?: string
          landlord_allows_pets?: boolean | null
          owns_home?: boolean
          pet_id?: string
          phone?: string
          reason?: string
          reptile_experience?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          slot_id?: string | null
          staff_notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "meet_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      care_guides: {
        Row: {
          body_md: string
          cover_path: string | null
          id: string
          published: boolean
          published_at: string | null
          slug: string
          species: Database["public"]["Enums"]["species"] | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body_md: string
          cover_path?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          species?: Database["public"]["Enums"]["species"] | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body_md?: string
          cover_path?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          species?: Database["public"]["Enums"]["species"] | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      meet_slots: {
        Row: {
          capacity: number
          id: string
          is_open: boolean
          starts_at: string
        }
        Insert: {
          capacity?: number
          id?: string
          is_open?: boolean
          starts_at: string
        }
        Update: {
          capacity?: number
          id?: string
          is_open?: boolean
          starts_at?: string
        }
        Relationships: []
      }
      people_signups: {
        Row: {
          created_at: string
          email: string
          full_name: string
          handled: boolean
          id: string
          message: string | null
          phone: string | null
          species_interest: Database["public"]["Enums"]["species"][]
          type: Database["public"]["Enums"]["signup_type"]
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          handled?: boolean
          id?: string
          message?: string | null
          phone?: string | null
          species_interest?: Database["public"]["Enums"]["species"][]
          type: Database["public"]["Enums"]["signup_type"]
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          handled?: boolean
          id?: string
          message?: string | null
          phone?: string | null
          species_interest?: Database["public"]["Enums"]["species"][]
          type?: Database["public"]["Enums"]["signup_type"]
        }
        Relationships: []
      }
      pet_photos: {
        Row: {
          alt: string | null
          created_at: string
          id: string
          is_primary: boolean
          path: string
          pet_id: string
          sort_order: number
        }
        Insert: {
          alt?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          path: string
          pet_id: string
          sort_order?: number
        }
        Update: {
          alt?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          path?: string
          pet_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "pet_photos_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          adopted_at: string | null
          adoption_fee: number | null
          birth_date: string | null
          breed: string | null
          care_needs: string[]
          created_at: string
          featured: boolean
          good_with_cats: boolean | null
          good_with_dogs: boolean | null
          good_with_kids: boolean | null
          health_notes: string | null
          id: string
          intake_date: string
          length_cm: number | null
          name: string
          personality: string[]
          sex: Database["public"]["Enums"]["pet_sex"]
          size: Database["public"]["Enums"]["pet_size"] | null
          slug: string
          spayed_neutered: boolean
          species: Database["public"]["Enums"]["species"]
          status: Database["public"]["Enums"]["pet_status"]
          story: string | null
          updated_at: string
          vaccinated: boolean
          vet_checked: boolean
          video_url: string | null
          weight_kg: number | null
        }
        Insert: {
          adopted_at?: string | null
          adoption_fee?: number | null
          birth_date?: string | null
          breed?: string | null
          care_needs?: string[]
          created_at?: string
          featured?: boolean
          good_with_cats?: boolean | null
          good_with_dogs?: boolean | null
          good_with_kids?: boolean | null
          health_notes?: string | null
          id?: string
          intake_date?: string
          length_cm?: number | null
          name: string
          personality?: string[]
          sex?: Database["public"]["Enums"]["pet_sex"]
          size?: Database["public"]["Enums"]["pet_size"] | null
          slug: string
          spayed_neutered?: boolean
          species: Database["public"]["Enums"]["species"]
          status?: Database["public"]["Enums"]["pet_status"]
          story?: string | null
          updated_at?: string
          vaccinated?: boolean
          vet_checked?: boolean
          video_url?: string | null
          weight_kg?: number | null
        }
        Update: {
          adopted_at?: string | null
          adoption_fee?: number | null
          birth_date?: string | null
          breed?: string | null
          care_needs?: string[]
          created_at?: string
          featured?: boolean
          good_with_cats?: boolean | null
          good_with_dogs?: boolean | null
          good_with_kids?: boolean | null
          health_notes?: string | null
          id?: string
          intake_date?: string
          length_cm?: number | null
          name?: string
          personality?: string[]
          sex?: Database["public"]["Enums"]["pet_sex"]
          size?: Database["public"]["Enums"]["pet_size"] | null
          slug?: string
          spayed_neutered?: boolean
          species?: Database["public"]["Enums"]["species"]
          status?: Database["public"]["Enums"]["pet_status"]
          story?: string | null
          updated_at?: string
          vaccinated?: boolean
          vet_checked?: boolean
          video_url?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["staff_role"]
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          email: string | null
          fees: Json | null
          id: number
          opening_hours: Json | null
          phone: string | null
          registration_number: string | null
          shelter_name: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          email?: string | null
          fees?: Json | null
          id?: number
          opening_hours?: Json | null
          phone?: string | null
          registration_number?: string | null
          shelter_name?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          email?: string | null
          fees?: Json | null
          id?: number
          opening_hours?: Json | null
          phone?: string | null
          registration_number?: string | null
          shelter_name?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          adopter_first_name: string | null
          body: string
          consent_given: boolean
          created_at: string
          id: string
          pet_id: string | null
          photo_path: string | null
          published: boolean
          published_at: string | null
          title: string
        }
        Insert: {
          adopter_first_name?: string | null
          body: string
          consent_given?: boolean
          created_at?: string
          id?: string
          pet_id?: string | null
          photo_path?: string | null
          published?: boolean
          published_at?: string | null
          title: string
        }
        Update: {
          adopter_first_name?: string | null
          body?: string
          consent_given?: boolean
          created_at?: string
          id?: string
          pet_id?: string | null
          photo_path?: string | null
          published?: boolean
          published_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "success_stories_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      surrenders: {
        Row: {
          created_at: string
          email: string | null
          handled: boolean
          id: string
          owner_name: string
          pet_age: string | null
          pet_name: string | null
          phone: string
          reason: string
          species: Database["public"]["Enums"]["species"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          handled?: boolean
          id?: string
          owner_name: string
          pet_age?: string | null
          pet_name?: string | null
          phone: string
          reason: string
          species: Database["public"]["Enums"]["species"]
        }
        Update: {
          created_at?: string
          email?: string | null
          handled?: boolean
          id?: string
          owner_name?: string
          pet_age?: string | null
          pet_name?: string | null
          phone?: string
          reason?: string
          species?: Database["public"]["Enums"]["species"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      application_status:
        | "new"
        | "in_review"
        | "approved"
        | "declined"
        | "completed"
        | "withdrawn"
      pet_sex: "male" | "female" | "unknown"
      pet_size: "small" | "medium" | "large"
      pet_status: "draft" | "available" | "pending" | "adopted" | "on_hold"
      signup_type: "foster" | "volunteer"
      species: "dog" | "cat" | "bearded_dragon"
      staff_role: "admin" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      application_status: [
        "new",
        "in_review",
        "approved",
        "declined",
        "completed",
        "withdrawn",
      ],
      pet_sex: ["male", "female", "unknown"],
      pet_size: ["small", "medium", "large"],
      pet_status: ["draft", "available", "pending", "adopted", "on_hold"],
      signup_type: ["foster", "volunteer"],
      species: ["dog", "cat", "bearded_dragon"],
      staff_role: ["admin", "staff"],
    },
  },
} as const
