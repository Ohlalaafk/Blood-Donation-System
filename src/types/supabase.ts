export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blood_requests: {
        Row: {
          blood_type: string
          created_at: string | null
          fulfilling_hospital_id: string | null
          id: string
          request_date: string | null
          requesting_hospital_id: string
          status: string
          units_requested: number
        }
        Insert: {
          blood_type: string
          created_at?: string | null
          fulfilling_hospital_id?: string | null
          id?: string
          request_date?: string | null
          requesting_hospital_id: string
          status?: string
          units_requested: number
        }
        Update: {
          blood_type?: string
          created_at?: string | null
          fulfilling_hospital_id?: string | null
          id?: string
          request_date?: string | null
          requesting_hospital_id?: string
          status?: string
          units_requested?: number
        }
        Relationships: [
          {
            foreignKeyName: "blood_requests_fulfilling_hospital_id_fkey"
            columns: ["fulfilling_hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blood_requests_requesting_hospital_id_fkey"
            columns: ["requesting_hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          created_at: string | null
          delivery_status: string
          driver_name: string
          estimated_arrival: string
          id: string
          request_id: string
          vehicle_number: string
        }
        Insert: {
          created_at?: string | null
          delivery_status?: string
          driver_name: string
          estimated_arrival: string
          id?: string
          request_id: string
          vehicle_number: string
        }
        Update: {
          created_at?: string | null
          delivery_status?: string
          driver_name?: string
          estimated_arrival?: string
          id?: string
          request_id?: string
          vehicle_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "blood_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          blood_volume_ml: number
          created_at: string | null
          donation_date: string | null
          donor_id: string
          hospital_id: string
          id: string
        }
        Insert: {
          blood_volume_ml: number
          created_at?: string | null
          donation_date?: string | null
          donor_id: string
          hospital_id: string
          id?: string
        }
        Update: {
          blood_volume_ml?: number
          created_at?: string | null
          donation_date?: string | null
          donor_id?: string
          hospital_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          blood_pressure: string | null
          created_at: string | null
          current_medications: string | null
          disease_history: string | null
          donor_id: string
          eligible_to_donate: boolean | null
          heart_rate: number | null
          height_cm: number | null
          hemoglobin_level: number | null
          id: string
          last_checkup_date: string | null
          weight_kg: number | null
        }
        Insert: {
          blood_pressure?: string | null
          created_at?: string | null
          current_medications?: string | null
          disease_history?: string | null
          donor_id: string
          eligible_to_donate?: boolean | null
          heart_rate?: number | null
          height_cm?: number | null
          hemoglobin_level?: number | null
          id?: string
          last_checkup_date?: string | null
          weight_kg?: number | null
        }
        Update: {
          blood_pressure?: string | null
          created_at?: string | null
          current_medications?: string | null
          disease_history?: string | null
          donor_id?: string
          eligible_to_donate?: boolean | null
          heart_rate?: number | null
          height_cm?: number | null
          hemoglobin_level?: number | null
          id?: string
          last_checkup_date?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string
        }
        Insert: {
          address: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone: string
        }
        Update: {
          address?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          blood_type: string
          created_at: string | null
          hospital_id: string
          id: string
          last_updated: string | null
          units_available: number
        }
        Insert: {
          blood_type: string
          created_at?: string | null
          hospital_id: string
          id?: string
          last_updated?: string | null
          units_available: number
        }
        Update: {
          blood_type?: string
          created_at?: string | null
          hospital_id?: string
          id?: string
          last_updated?: string | null
          units_available?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          blood_type: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string
          hospital_id: string | null
          id: string
          last_donation_date: string | null
          phone: string | null
          role: string
        }
        Insert: {
          address?: string | null
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name: string
          hospital_id?: string | null
          id: string
          last_donation_date?: string | null
          phone?: string | null
          role: string
        }
        Update: {
          address?: string | null
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string
          hospital_id?: string | null
          id?: string
          last_donation_date?: string | null
          phone?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
