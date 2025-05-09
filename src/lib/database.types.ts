export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      player: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      pick: {
        Row: {
          id: string
          player_id: string
          week: number
          selection: string
          is_correct: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          week: number
          selection: string
          is_correct?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          week?: number
          selection?: string
          is_correct?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_picks_for_next_week: {
        Args: {
          player_uuid: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 