export type Json =
  | string
  | number
  | boolean
  | null
  | {[key: string]: Json | undefined}
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievable_tasks: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_personal: boolean
          points: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_personal?: boolean
          points?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_personal?: boolean
          points?: number
          title?: string
        }
        Relationships: []
      }
      blackouts: {
        Row: {
          created_at: string
          id: number
          profileId: number
        }
        Insert: {
          created_at?: string
          id?: number
          profileId: number
        }
        Update: {
          created_at?: string
          id?: number
          profileId?: number
        }
        Relationships: [
          {
            foreignKeyName: 'blackouts_profileId_fkey'
            columns: ['profileId']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      events: {
        Row: {
          content: string
          created_at: string
          icon: string | null
          id: number
        }
        Insert: {
          content: string
          created_at?: string
          icon?: string | null
          id?: number
        }
        Update: {
          content?: string
          created_at?: string
          icon?: string | null
          id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          createdAt: string | null
          firstName: string
          id: number
          isHidden: boolean
          lastName: string
          teamId: number | null
          userId: string | null
        }
        Insert: {
          createdAt?: string | null
          firstName?: string
          id?: number
          isHidden?: boolean
          lastName?: string
          teamId?: number | null
          userId?: string | null
        }
        Update: {
          createdAt?: string | null
          firstName?: string
          id?: number
          isHidden?: boolean
          lastName?: string
          teamId?: number | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_teamId_fkey'
            columns: ['teamId']
            referencedRelation: 'teams'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profiles_userId_fkey'
            columns: ['userId']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      settings: {
        Row: {
          id: number
          name: string
          value: string
        }
        Insert: {
          id?: number
          name: string
          value: string
        }
        Update: {
          id?: number
          name?: string
          value?: string
        }
        Relationships: []
      }
      team_points: {
        Row: {
          createdAt: string | null
          id: number
          reason: string
          score: number | null
          teamId: number | null
        }
        Insert: {
          createdAt?: string | null
          id?: number
          reason: string
          score?: number | null
          teamId?: number | null
        }
        Update: {
          createdAt?: string | null
          id?: number
          reason?: string
          score?: number | null
          teamId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'team_points_teamId_fkey'
            columns: ['teamId']
            referencedRelation: 'teams'
            referencedColumns: ['id']
          }
        ]
      }
      teams: {
        Row: {
          color: string | null
          createdAt: string | null
          id: number
          name: string
        }
        Insert: {
          color?: string | null
          createdAt?: string | null
          id?: number
          name: string
        }
        Update: {
          color?: string | null
          createdAt?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_points: {
        Row: {
          createdAt: string | null
          id: number
          profileId: number
          reason: string
          score: number | null
        }
        Insert: {
          createdAt?: string | null
          id?: number
          profileId: number
          reason: string
          score?: number | null
        }
        Update: {
          createdAt?: string | null
          id?: number
          profileId?: number
          reason?: string
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'user_points_profileId_fkey'
            columns: ['profileId']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
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
