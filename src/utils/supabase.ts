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
      team_achievements: {
        Row: {
          createdAt: string | null
          description: string | null
          id: number
          score: number | null
          teamId: number | null
          title: string
        }
        Insert: {
          createdAt?: string | null
          description?: string | null
          id?: number
          score?: number | null
          teamId?: number | null
          title: string
        }
        Update: {
          createdAt?: string | null
          description?: string | null
          id?: number
          score?: number | null
          teamId?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: 'team_achievements_teamId_fkey'
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
      user_achievements: {
        Row: {
          createdAt: string | null
          description: string | null
          id: number
          profileId: number
          score: number | null
          title: string
        }
        Insert: {
          createdAt?: string | null
          description?: string | null
          id?: number
          profileId: number
          score?: number | null
          title: string
        }
        Update: {
          createdAt?: string | null
          description?: string | null
          id?: number
          profileId?: number
          score?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_achievements_profileId_fkey'
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
