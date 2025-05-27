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
      api_cache: {
        Row: {
          created_at: string | null
          endpoint: string
          expires_at: string
          id: string
          response: Json
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          expires_at: string
          id?: string
          response: Json
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          expires_at?: string
          id?: string
          response?: Json
        }
        Relationships: []
      }
      api_configs: {
        Row: {
          base_url: string
          cache_duration_seconds: number | null
          headers: Json | null
          id: string
          name: string
          rate_limit_per_minute: number | null
        }
        Insert: {
          base_url: string
          cache_duration_seconds?: number | null
          headers?: Json | null
          id?: string
          name: string
          rate_limit_per_minute?: number | null
        }
        Update: {
          base_url?: string
          cache_duration_seconds?: number | null
          headers?: Json | null
          id?: string
          name?: string
          rate_limit_per_minute?: number | null
        }
        Relationships: []
      }
      aye: {
        Row: {
          c_ask: number | null
          c_bid: number | null
          c_delta: number | null
          c_gamma: number | null
          c_iv: number | null
          c_last: number | null
          c_rho: number | null
          c_size_ask: number | null
          c_size_bid: number | null
          c_theta: number | null
          c_vega: number | null
          c_volume: number | null
          dte: number | null
          expire_date: string
          p_ask: number | null
          p_bid: number | null
          p_delta: number | null
          p_gamma: number | null
          p_iv: number | null
          p_last: number | null
          p_rho: number | null
          p_size_ask: number | null
          p_size_bid: number | null
          p_theta: number | null
          p_vega: number | null
          p_volume: number | null
          quote_date: string
          strike: number
          underlying_last: number | null
        }
        Insert: {
          c_ask?: number | null
          c_bid?: number | null
          c_delta?: number | null
          c_gamma?: number | null
          c_iv?: number | null
          c_last?: number | null
          c_rho?: number | null
          c_size_ask?: number | null
          c_size_bid?: number | null
          c_theta?: number | null
          c_vega?: number | null
          c_volume?: number | null
          dte?: number | null
          expire_date: string
          p_ask?: number | null
          p_bid?: number | null
          p_delta?: number | null
          p_gamma?: number | null
          p_iv?: number | null
          p_last?: number | null
          p_rho?: number | null
          p_size_ask?: number | null
          p_size_bid?: number | null
          p_theta?: number | null
          p_vega?: number | null
          p_volume?: number | null
          quote_date: string
          strike: number
          underlying_last?: number | null
        }
        Update: {
          c_ask?: number | null
          c_bid?: number | null
          c_delta?: number | null
          c_gamma?: number | null
          c_iv?: number | null
          c_last?: number | null
          c_rho?: number | null
          c_size_ask?: number | null
          c_size_bid?: number | null
          c_theta?: number | null
          c_vega?: number | null
          c_volume?: number | null
          dte?: number | null
          expire_date?: string
          p_ask?: number | null
          p_bid?: number | null
          p_delta?: number | null
          p_gamma?: number | null
          p_iv?: number | null
          p_last?: number | null
          p_rho?: number | null
          p_size_ask?: number | null
          p_size_bid?: number | null
          p_theta?: number | null
          p_vega?: number | null
          p_volume?: number | null
          quote_date?: string
          strike?: number
          underlying_last?: number | null
        }
        Relationships: []
      }
      cached_responses: {
        Row: {
          config_id: string | null
          created_at: string | null
          endpoint: string
          expires_at: string
          id: string
          method: Database["public"]["Enums"]["http_method"] | null
          params: Json | null
          response: Json
        }
        Insert: {
          config_id?: string | null
          created_at?: string | null
          endpoint: string
          expires_at: string
          id?: string
          method?: Database["public"]["Enums"]["http_method"] | null
          params?: Json | null
          response: Json
        }
        Update: {
          config_id?: string | null
          created_at?: string | null
          endpoint?: string
          expires_at?: string
          id?: string
          method?: Database["public"]["Enums"]["http_method"] | null
          params?: Json | null
          response?: Json
        }
        Relationships: [
          {
            foreignKeyName: "cached_responses_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "api_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      gme: {
        Row: {
          act_symbol: string | null
          ask: number | null
          bid: number | null
          call_put: string | null
          date: string | null
          delta: number | null
          expiration: string | null
          gamma: number | null
          rho: number | null
          strike: number | null
          theta: number | null
          vega: number | null
          vol: number | null
        }
        Insert: {
          act_symbol?: string | null
          ask?: number | null
          bid?: number | null
          call_put?: string | null
          date?: string | null
          delta?: number | null
          expiration?: string | null
          gamma?: number | null
          rho?: number | null
          strike?: number | null
          theta?: number | null
          vega?: number | null
          vol?: number | null
        }
        Update: {
          act_symbol?: string | null
          ask?: number | null
          bid?: number | null
          call_put?: string | null
          date?: string | null
          delta?: number | null
          expiration?: string | null
          gamma?: number | null
          rho?: number | null
          strike?: number | null
          theta?: number | null
          vega?: number | null
          vol?: number | null
        }
        Relationships: []
      }
      gme_stock: {
        Row: {
          act_symbol: string | null
          close: number | null
          date: string | null
          high: number | null
          low: number | null
          open: number | null
          volume: number | null
        }
        Insert: {
          act_symbol?: string | null
          close?: number | null
          date?: string | null
          high?: number | null
          low?: number | null
          open?: number | null
          volume?: number | null
        }
        Update: {
          act_symbol?: string | null
          close?: number | null
          date?: string | null
          high?: number | null
          low?: number | null
          open?: number | null
          volume?: number | null
        }
        Relationships: []
      }
      techtier: {
        Row: {
          id: number
          name: string
          url: string
        }
        Insert: {
          id?: number
          name: string
          url: string
        }
        Update: {
          id?: number
          name?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fetch_cached_api_data: {
        Args: {
          p_config_name: string
          p_endpoint: string
          p_method?: Database["public"]["Enums"]["http_method"]
          p_params?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      http_method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
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
