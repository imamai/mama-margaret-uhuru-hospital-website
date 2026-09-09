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
  public: {
    Tables: {
      communityimpactinsights_audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["communityimpactinsights_audit_action"]
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["communityimpactinsights_audit_action"]
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["communityimpactinsights_audit_action"]
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communityimpactinsights_audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "communityimpactinsights_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communityimpactinsights_enquiries: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string
          enquiry_type: string | null
          id: string
          location: string | null
          message: string
          name: string
          organisation: string | null
          phone: string | null
          project_type: string | null
          response_notes: string | null
          service: string | null
          status: Database["public"]["Enums"]["communityimpactinsights_enquiry_status"]
          subject: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email: string
          enquiry_type?: string | null
          id?: string
          location?: string | null
          message: string
          name: string
          organisation?: string | null
          phone?: string | null
          project_type?: string | null
          response_notes?: string | null
          service?: string | null
          status?: Database["public"]["Enums"]["communityimpactinsights_enquiry_status"]
          subject?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string
          enquiry_type?: string | null
          id?: string
          location?: string | null
          message?: string
          name?: string
          organisation?: string | null
          phone?: string | null
          project_type?: string | null
          response_notes?: string | null
          service?: string | null
          status?: Database["public"]["Enums"]["communityimpactinsights_enquiry_status"]
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communityimpactinsights_enquiries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "communityimpactinsights_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communityimpactinsights_impact_metrics: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_visible: boolean
          label: string
          unit: string | null
          updated_at: string
          value: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_visible?: boolean
          label: string
          unit?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_visible?: boolean
          label?: string
          unit?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      communityimpactinsights_impact_stories: {
        Row: {
          challenge: string | null
          community: string | null
          county: string | null
          created_at: string
          featured: boolean
          gallery: Json
          id: string
          image: string | null
          intervention: string | null
          location: string | null
          outcome: string | null
          person_name: string | null
          person_role: string | null
          published: boolean
          published_at: string | null
          quote: string | null
          related_project_id: string | null
          slug: string
          story: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          challenge?: string | null
          community?: string | null
          county?: string | null
          created_at?: string
          featured?: boolean
          gallery?: Json
          id?: string
          image?: string | null
          intervention?: string | null
          location?: string | null
          outcome?: string | null
          person_name?: string | null
          person_role?: string | null
          published?: boolean
          published_at?: string | null
          quote?: string | null
          related_project_id?: string | null
          slug: string
          story?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          challenge?: string | null
          community?: string | null
          county?: string | null
          created_at?: string
          featured?: boolean
          gallery?: Json
          id?: string
          image?: string | null
          intervention?: string | null
          location?: string | null
          outcome?: string | null
          person_name?: string | null
          person_role?: string | null
          published?: boolean
          published_at?: string | null
          quote?: string | null
          related_project_id?: string | null
          slug?: string
          story?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communityimpactinsights_impact_stories_related_project_id_fkey"
            columns: ["related_project_id"]
            isOneToOne: false
            referencedRelation: "communityimpactinsights_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      communityimpactinsights_media: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          folder: string | null
          id: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          folder?: string | null
          id?: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          folder?: string | null
          id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communityimpactinsights_media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "communityimpactinsights_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communityimpactinsights_pages: {
        Row: {
          canonical_url: string | null
          content: string | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["communityimpactinsights_content_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["communityimpactinsights_content_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["communityimpactinsights_content_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communityimpactinsights_pages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "communityimpactinsights_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communityimpactinsights_pages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "communityimpactinsights_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communityimpactinsights_partners: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          is_placeholder: boolean
          logo: string | null
          organisation_name: string
          partner_type: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          is_placeholder?: boolean
          logo?: string | null
          organisation_name: string
          partner_type?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          is_placeholder?: boolean
          logo?: string | null
          organisation_name?: string
          partner_type?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      communityimpactinsights_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured: boolean
          featured_image: string | null
          id: string
          published_at: string | null
          reading_time: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["communityimpactinsights_content_status"]
          tags: Json
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["communityimpactinsights_content_status"]
          tags?: Json
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["communityimpactinsights_content_status"]
          tags?: Json
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communityimpactinsights_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "communityimpactinsights_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communityimpactinsights_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          job_title: string | null
          last_login_at: string | null
          phone: string | null
          role: Database["public"]["Enums"]["communityimpactinsights_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          job_title?: string | null
          last_login_at?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["communityimpactinsights_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          job_title?: string | null
          last_login_at?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["communityimpactinsights_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      communityimpactinsights_projects: {
        Row: {
          beneficiary_count: number | null
          client_name: string | null
          county: string | null
          created_at: string
          end_date: string | null
          featured: boolean
          featured_image: string | null
          full_description: string | null
          gallery: Json
          id: string
          impact_summary: string | null
          location: string | null
          methodology: string | null
          objectives: string | null
          outcomes: string | null
          project_type: string | null
          published: boolean
          sdg_goals: Json
          sector: string | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          start_date: string | null
          status: Database["public"]["Enums"]["communityimpactinsights_content_status"]
          subcounty: string | null
          title: string
          updated_at: string
        }
        Insert: {
          beneficiary_count?: number | null
          client_name?: string | null
          county?: string | null
          created_at?: string
          end_date?: string | null
          featured?: boolean
          featured_image?: string | null
          full_description?: string | null
          gallery?: Json
          id?: string
          impact_summary?: string | null
          location?: string | null
          methodology?: string | null
          objectives?: string | null
          outcomes?: string | null
          project_type?: string | null
          published?: boolean
          sdg_goals?: Json
          sector?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["communityimpactinsights_content_status"]
          subcounty?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          beneficiary_count?: number | null
          client_name?: string | null
          county?: string | null
          created_at?: string
          end_date?: string | null
          featured?: boolean
          featured_image?: string | null
          full_description?: string | null
          gallery?: Json
          id?: string
          impact_summary?: string | null
          location?: string | null
          methodology?: string | null
          objectives?: string | null
          outcomes?: string | null
          project_type?: string | null
          published?: boolean
          sdg_goals?: Json
          sector?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["communityimpactinsights_content_status"]
          subcounty?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      communityimpactinsights_publications: {
        Row: {
          abstract: string | null
          authors: string | null
          citation_text: string | null
          created_at: string
          external_url: string | null
          featured: boolean
          featured_image: string | null
          geography: string | null
          id: string
          keywords: string | null
          pdf_url: string | null
          publication_type: string
          published_at: string | null
          sector: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["communityimpactinsights_content_status"]
          summary: string | null
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          abstract?: string | null
          authors?: string | null
          citation_text?: string | null
          created_at?: string
          external_url?: string | null
          featured?: boolean
          featured_image?: string | null
          geography?: string | null
          id?: string
          keywords?: string | null
          pdf_url?: string | null
          publication_type: string
          published_at?: string | null
          sector?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["communityimpactinsights_content_status"]
          summary?: string | null
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          abstract?: string | null
          authors?: string | null
          citation_text?: string | null
          created_at?: string
          external_url?: string | null
          featured?: boolean
          featured_image?: string | null
          geography?: string | null
          id?: string
          keywords?: string | null
          pdf_url?: string | null
          publication_type?: string
          published_at?: string | null
          sector?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["communityimpactinsights_content_status"]
          summary?: string | null
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      communityimpactinsights_redirects: {
        Row: {
          created_at: string
          destination_path: string
          id: string
          is_active: boolean
          redirect_type: number
          source_path: string
        }
        Insert: {
          created_at?: string
          destination_path: string
          id?: string
          is_active?: boolean
          redirect_type?: number
          source_path: string
        }
        Update: {
          created_at?: string
          destination_path?: string
          id?: string
          is_active?: boolean
          redirect_type?: number
          source_path?: string
        }
        Relationships: []
      }
      communityimpactinsights_services: {
        Row: {
          created_at: string
          deliverables: Json
          display_order: number
          featured: boolean
          featured_image: string | null
          full_description: string | null
          icon: string | null
          id: string
          is_active: boolean
          methodology: string | null
          seo_description: string | null
          seo_title: string | null
          service_group: string | null
          short_description: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deliverables?: Json
          display_order?: number
          featured?: boolean
          featured_image?: string | null
          full_description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          methodology?: string | null
          seo_description?: string | null
          seo_title?: string | null
          service_group?: string | null
          short_description?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deliverables?: Json
          display_order?: number
          featured?: boolean
          featured_image?: string | null
          full_description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          methodology?: string | null
          seo_description?: string | null
          seo_title?: string | null
          service_group?: string | null
          short_description?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      communityimpactinsights_settings: {
        Row: {
          address: string | null
          cookie_policy: string | null
          default_og_image: string | null
          default_seo_description: string | null
          default_seo_title: string | null
          email: string | null
          facebook_url: string | null
          favicon: string | null
          footer_text: string | null
          google_analytics_id: string | null
          hero_cta_primary_label: string | null
          hero_cta_primary_url: string | null
          hero_cta_secondary_label: string | null
          hero_cta_secondary_url: string | null
          hero_cta_tertiary_label: string | null
          hero_cta_tertiary_url: string | null
          hero_description: string | null
          hero_image: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          logo: string | null
          organisation_name: string
          phone: string | null
          postal_address: string | null
          privacy_policy: string | null
          search_console_verification: string | null
          tagline: string | null
          terms: string | null
          updated_at: string
          website: string | null
          x_url: string | null
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          cookie_policy?: string | null
          default_og_image?: string | null
          default_seo_description?: string | null
          default_seo_title?: string | null
          email?: string | null
          facebook_url?: string | null
          favicon?: string | null
          footer_text?: string | null
          google_analytics_id?: string | null
          hero_cta_primary_label?: string | null
          hero_cta_primary_url?: string | null
          hero_cta_secondary_label?: string | null
          hero_cta_secondary_url?: string | null
          hero_cta_tertiary_label?: string | null
          hero_cta_tertiary_url?: string | null
          hero_description?: string | null
          hero_image?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo?: string | null
          organisation_name?: string
          phone?: string | null
          postal_address?: string | null
          privacy_policy?: string | null
          search_console_verification?: string | null
          tagline?: string | null
          terms?: string | null
          updated_at?: string
          website?: string | null
          x_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          cookie_policy?: string | null
          default_og_image?: string | null
          default_seo_description?: string | null
          default_seo_title?: string | null
          email?: string | null
          facebook_url?: string | null
          favicon?: string | null
          footer_text?: string | null
          google_analytics_id?: string | null
          hero_cta_primary_label?: string | null
          hero_cta_primary_url?: string | null
          hero_cta_secondary_label?: string | null
          hero_cta_secondary_url?: string | null
          hero_cta_tertiary_label?: string | null
          hero_cta_tertiary_url?: string | null
          hero_description?: string | null
          hero_image?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo?: string | null
          organisation_name?: string
          phone?: string | null
          postal_address?: string | null
          privacy_policy?: string | null
          search_console_verification?: string | null
          tagline?: string | null
          terms?: string | null
          updated_at?: string
          website?: string | null
          x_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      communityimpactinsights_subscribers: {
        Row: {
          email: string
          id: string
          name: string | null
          organisation: string | null
          source: string | null
          status: Database["public"]["Enums"]["communityimpactinsights_subscriber_status"]
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          name?: string | null
          organisation?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["communityimpactinsights_subscriber_status"]
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
          organisation?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["communityimpactinsights_subscriber_status"]
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      communityimpactinsights_team: {
        Row: {
          biography: string | null
          created_at: string
          display_order: number
          email: string | null
          expertise: Json
          featured: boolean
          full_name: string
          id: string
          is_active: boolean
          linkedin_url: string | null
          photo: string | null
          position: string | null
          qualifications: string | null
          updated_at: string
        }
        Insert: {
          biography?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          expertise?: Json
          featured?: boolean
          full_name: string
          id?: string
          is_active?: boolean
          linkedin_url?: string | null
          photo?: string | null
          position?: string | null
          qualifications?: string | null
          updated_at?: string
        }
        Update: {
          biography?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          expertise?: Json
          featured?: boolean
          full_name?: string
          id?: string
          is_active?: boolean
          linkedin_url?: string | null
          photo?: string | null
          position?: string | null
          qualifications?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      edoscentre_blog_categories: {
        Row: {
          color_hex: string
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          color_hex?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          color_hex?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      edoscentre_blog_post_tags: {
        Row: {
          blog_post_id: string
          tag_id: string
        }
        Insert: {
          blog_post_id: string
          tag_id: string
        }
        Update: {
          blog_post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_blog_post_tags_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentre_blog_post_tags_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_v_blog_posts_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentre_blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_blog_posts: {
        Row: {
          author_avatar: string | null
          author_id: string | null
          author_name: string | null
          category_id: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          og_image_url: string | null
          published_at: string | null
          reading_time_min: number | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          og_image_url?: string | null
          published_at?: string | null
          reading_time_min?: number | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          og_image_url?: string | null
          published_at?: string | null
          reading_time_min?: number | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      edoscentre_case_studies: {
        Row: {
          challenge: string | null
          client_logo_url: string | null
          client_name: string | null
          cover_image_url: string | null
          created_at: string
          duration: string | null
          id: string
          impact: string | null
          industry_id: string | null
          is_featured: boolean
          is_published: boolean
          project_year: string | null
          published_at: string | null
          result_summary: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          solution: string | null
          sort_order: number
          tagline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          challenge?: string | null
          client_logo_url?: string | null
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          impact?: string | null
          industry_id?: string | null
          is_featured?: boolean
          is_published?: boolean
          project_year?: string | null
          published_at?: string | null
          result_summary?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          solution?: string | null
          sort_order?: number
          tagline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          challenge?: string | null
          client_logo_url?: string | null
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          impact?: string | null
          industry_id?: string | null
          is_featured?: boolean
          is_published?: boolean
          project_year?: string | null
          published_at?: string | null
          result_summary?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          solution?: string | null
          sort_order?: number
          tagline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_case_studies_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_industries"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_case_study_kpis: {
        Row: {
          case_study_id: string
          id: string
          metric_label: string
          metric_unit: string | null
          metric_value: string
          sort_order: number
        }
        Insert: {
          case_study_id: string
          id?: string
          metric_label: string
          metric_unit?: string | null
          metric_value: string
          sort_order?: number
        }
        Update: {
          case_study_id?: string
          id?: string
          metric_label?: string
          metric_unit?: string | null
          metric_value?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_case_study_kpis_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_case_study_technologies: {
        Row: {
          case_study_id: string
          technology_id: string
        }
        Insert: {
          case_study_id: string
          technology_id: string
        }
        Update: {
          case_study_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_case_study_technologies_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_case_studies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentre_case_study_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_consultation_bookings: {
        Row: {
          budget_range: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          industry_id: string | null
          meeting_link: string | null
          notes: string | null
          organization: string | null
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          project_summary: string | null
          role_title: string | null
          service_id: string | null
          source_page: string | null
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          industry_id?: string | null
          meeting_link?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          project_summary?: string | null
          role_title?: string | null
          service_id?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          industry_id?: string | null
          meeting_link?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          project_summary?: string | null
          role_title?: string | null
          service_id?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_consultation_bookings_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentre_consultation_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_services"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_contact_inquiries: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          inquiry_type: string
          ip_address: string | null
          message: string
          organization: string | null
          phone: string | null
          source_page: string | null
          status: string
          subject: string | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          inquiry_type?: string
          ip_address?: string | null
          message: string
          organization?: string | null
          phone?: string | null
          source_page?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          inquiry_type?: string
          ip_address?: string | null
          message?: string
          organization?: string | null
          phone?: string | null
          source_page?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      edoscentre_faq_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      edoscentre_faqs: {
        Row: {
          answer: string
          category_id: string | null
          created_at: string
          id: string
          is_active: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_faqs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_faq_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_industries: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          hero_stat: string | null
          icon: string | null
          id: string
          is_active: boolean
          long_description: string | null
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          tagline: string | null
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          hero_stat?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          long_description?: string | null
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          hero_stat?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          long_description?: string | null
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      edoscentre_industry_challenges: {
        Row: {
          challenge: string
          id: string
          industry_id: string
          sort_order: number
        }
        Insert: {
          challenge: string
          id?: string
          industry_id: string
          sort_order?: number
        }
        Update: {
          challenge?: string
          id?: string
          industry_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_industry_challenges_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_industries"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_industry_metrics: {
        Row: {
          id: string
          industry_id: string
          metric_label: string
          metric_value: string
          sort_order: number
        }
        Insert: {
          id?: string
          industry_id: string
          metric_label: string
          metric_value: string
          sort_order?: number
        }
        Update: {
          id?: string
          industry_id?: string
          metric_label?: string
          metric_value?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_industry_metrics_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_industries"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_industry_outcomes: {
        Row: {
          id: string
          industry_id: string
          outcome: string
          sort_order: number
        }
        Insert: {
          id?: string
          industry_id: string
          outcome: string
          sort_order?: number
        }
        Update: {
          id?: string
          industry_id?: string
          outcome?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_industry_outcomes_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_industries"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_industry_solutions: {
        Row: {
          id: string
          industry_id: string
          solution: string
          sort_order: number
        }
        Insert: {
          id?: string
          industry_id: string
          solution: string
          sort_order?: number
        }
        Update: {
          id?: string
          industry_id?: string
          solution?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_industry_solutions_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_industries"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_industry_technologies: {
        Row: {
          industry_id: string
          technology_id: string
        }
        Insert: {
          industry_id: string
          technology_id: string
        }
        Update: {
          industry_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_industry_technologies_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentre_industry_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_media_assets: {
        Row: {
          alt_text: string | null
          bucket: string
          created_at: string
          file_size: number | null
          height: number | null
          id: string
          mime_type: string | null
          public_url: string
          storage_path: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          bucket?: string
          created_at?: string
          file_size?: number | null
          height?: number | null
          id?: string
          mime_type?: string | null
          public_url: string
          storage_path: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          bucket?: string
          created_at?: string
          file_size?: number | null
          height?: number | null
          id?: string
          mime_type?: string | null
          public_url?: string
          storage_path?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      edoscentre_metrics: {
        Row: {
          description: string | null
          id: string
          is_active: boolean
          key: string
          label: string
          sort_order: number
          sub_label: string
          suffix: string | null
          updated_at: string
          value: number
        }
        Insert: {
          description?: string | null
          id?: string
          is_active?: boolean
          key: string
          label: string
          sort_order?: number
          sub_label: string
          suffix?: string | null
          updated_at?: string
          value: number
        }
        Update: {
          description?: string | null
          id?: string
          is_active?: boolean
          key?: string
          label?: string
          sort_order?: number
          sub_label?: string
          suffix?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      edoscentre_navigation_items: {
        Row: {
          created_at: string
          description: string | null
          href: string
          id: string
          is_active: boolean
          label: string
          menu_slot: string
          open_in_new: boolean
          parent_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          href: string
          id?: string
          is_active?: boolean
          label: string
          menu_slot?: string
          open_in_new?: boolean
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          href?: string
          id?: string
          is_active?: boolean
          label?: string
          menu_slot?: string
          open_in_new?: boolean
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_newsletter_subscribers: {
        Row: {
          email: string
          full_name: string | null
          id: string
          source: string | null
          status: string
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          full_name?: string | null
          id?: string
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          full_name?: string | null
          id?: string
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      edoscentre_platform_layer_tools: {
        Row: {
          custom_icon: string | null
          custom_name: string | null
          id: string
          layer_id: string
          sort_order: number
          technology_id: string | null
        }
        Insert: {
          custom_icon?: string | null
          custom_name?: string | null
          id?: string
          layer_id: string
          sort_order?: number
          technology_id?: string | null
        }
        Update: {
          custom_icon?: string | null
          custom_name?: string | null
          id?: string
          layer_id?: string
          sort_order?: number
          technology_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_platform_layer_tools_layer_id_fkey"
            columns: ["layer_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_platform_layers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentre_platform_layer_tools_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_platform_layers: {
        Row: {
          color_hex: string
          created_at: string
          description: string | null
          example: string | null
          icon: string | null
          id: string
          is_active: boolean
          layer_number: number
          name: string
          sort_order: number
          subtitle: string | null
          updated_at: string
        }
        Insert: {
          color_hex?: string
          created_at?: string
          description?: string | null
          example?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          layer_number: number
          name: string
          sort_order?: number
          subtitle?: string | null
          updated_at?: string
        }
        Update: {
          color_hex?: string
          created_at?: string
          description?: string | null
          example?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          layer_number?: number
          name?: string
          sort_order?: number
          subtitle?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      edoscentre_rate_limits: {
        Row: {
          count: number
          key: string
          window_start: string
        }
        Insert: {
          count?: number
          key: string
          window_start?: string
        }
        Update: {
          count?: number
          key?: string
          window_start?: string
        }
        Relationships: []
      }
      edoscentre_resources: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          download_count: number
          external_url: string | null
          file_url: string | null
          id: string
          industry_id: string | null
          is_featured: boolean
          is_gated: boolean
          is_published: boolean
          published_at: string | null
          resource_type: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          download_count?: number
          external_url?: string | null
          file_url?: string | null
          id?: string
          industry_id?: string | null
          is_featured?: boolean
          is_gated?: boolean
          is_published?: boolean
          published_at?: string | null
          resource_type?: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          download_count?: number
          external_url?: string | null
          file_url?: string | null
          id?: string
          industry_id?: string | null
          is_featured?: boolean
          is_gated?: boolean
          is_published?: boolean
          published_at?: string | null
          resource_type?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_resources_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_industries"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_service_capabilities: {
        Row: {
          capability: string
          id: string
          service_id: string
          sort_order: number
        }
        Insert: {
          capability: string
          id?: string
          service_id: string
          sort_order?: number
        }
        Update: {
          capability?: string
          id?: string
          service_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_service_capabilities_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_services"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_service_outcomes: {
        Row: {
          id: string
          outcome: string
          service_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          outcome: string
          service_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          outcome?: string
          service_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_service_outcomes_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_services"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_service_technologies: {
        Row: {
          service_id: string
          technology_id: string
        }
        Insert: {
          service_id: string
          technology_id: string
        }
        Update: {
          service_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_service_technologies_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentre_service_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_services: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          long_description: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          sort_order: number
          tagline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          long_description?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          tagline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          long_description?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          tagline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      edoscentre_site_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      edoscentre_team_members: {
        Row: {
          bio: string | null
          created_at: string
          department: string | null
          full_name: string
          github_url: string | null
          id: string
          is_active: boolean
          is_leadership: boolean
          job_title: string
          linkedin_url: string | null
          photo_url: string | null
          profile_id: string | null
          sort_order: number
          twitter_url: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          department?: string | null
          full_name: string
          github_url?: string | null
          id?: string
          is_active?: boolean
          is_leadership?: boolean
          job_title: string
          linkedin_url?: string | null
          photo_url?: string | null
          profile_id?: string | null
          sort_order?: number
          twitter_url?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          department?: string | null
          full_name?: string
          github_url?: string | null
          id?: string
          is_active?: boolean
          is_leadership?: boolean
          job_title?: string
          linkedin_url?: string | null
          photo_url?: string | null
          profile_id?: string | null
          sort_order?: number
          twitter_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      edoscentre_technologies: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          is_featured: boolean
          logo_url: string | null
          name: string
          slug: string
          sort_order: number
          website_url: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          name: string
          slug: string
          sort_order?: number
          website_url?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_technologies_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_technology_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentre_technology_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      edoscentre_testimonials: {
        Row: {
          case_study_id: string | null
          client_logo: string | null
          client_name: string
          client_org: string | null
          client_photo: string | null
          client_title: string | null
          created_at: string
          id: string
          industry_id: string | null
          is_active: boolean
          is_featured: boolean
          quote: string
          rating: number | null
          sort_order: number
        }
        Insert: {
          case_study_id?: string | null
          client_logo?: string | null
          client_name: string
          client_org?: string | null
          client_photo?: string | null
          client_title?: string | null
          created_at?: string
          id?: string
          industry_id?: string | null
          is_active?: boolean
          is_featured?: boolean
          quote: string
          rating?: number | null
          sort_order?: number
        }
        Update: {
          case_study_id?: string | null
          client_logo?: string | null
          client_name?: string
          client_org?: string | null
          client_photo?: string | null
          client_title?: string | null
          created_at?: string
          id?: string
          industry_id?: string | null
          is_active?: boolean
          is_featured?: boolean
          quote?: string
          rating?: number | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "edoscentre_testimonials_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_case_studies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentre_testimonials_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "edoscentre_industries"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentreadmin_admin_user_websites: {
        Row: {
          admin_user_id: string
          created_at: string
          website_id: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          website_id: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentreadmin_admin_user_websites_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentreadmin_admin_user_websites_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentreadmin_admin_users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          last_login_at: string | null
          must_change_password: boolean
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          last_login_at?: string | null
          must_change_password?: boolean
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          must_change_password?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      edoscentreadmin_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json
          website_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          website_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "edoscentreadmin_audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentreadmin_audit_logs_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentreadmin_client_portal_users: {
        Row: {
          client_id: string
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          last_login_at: string | null
          must_change_password: boolean
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          last_login_at?: string | null
          must_change_password?: boolean
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          must_change_password?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentreadmin_client_portal_users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentreadmin_clients: {
        Row: {
          address: string | null
          company_name: string
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      edoscentreadmin_domains: {
        Row: {
          auto_renew: boolean
          cost: number | null
          created_at: string
          currency: string
          domain_name: string
          expiry_date: string
          id: string
          nameservers: string | null
          notes: string | null
          registered_date: string | null
          registrar: string | null
          status: string
          updated_at: string
          website_id: string
        }
        Insert: {
          auto_renew?: boolean
          cost?: number | null
          created_at?: string
          currency?: string
          domain_name: string
          expiry_date: string
          id?: string
          nameservers?: string | null
          notes?: string | null
          registered_date?: string | null
          registrar?: string | null
          status?: string
          updated_at?: string
          website_id: string
        }
        Update: {
          auto_renew?: boolean
          cost?: number | null
          created_at?: string
          currency?: string
          domain_name?: string
          expiry_date?: string
          id?: string
          nameservers?: string | null
          notes?: string | null
          registered_date?: string | null
          registrar?: string | null
          status?: string
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentreadmin_domains_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentreadmin_hosting_details: {
        Row: {
          auto_renew: boolean
          bandwidth_limit_gb: number | null
          control_panel_url: string | null
          cost: number | null
          created_at: string
          currency: string
          id: string
          notes: string | null
          plan: string | null
          provider: string
          renewal_date: string | null
          server_ip: string | null
          storage_limit_gb: number | null
          updated_at: string
          website_id: string
        }
        Insert: {
          auto_renew?: boolean
          bandwidth_limit_gb?: number | null
          control_panel_url?: string | null
          cost?: number | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          plan?: string | null
          provider: string
          renewal_date?: string | null
          server_ip?: string | null
          storage_limit_gb?: number | null
          updated_at?: string
          website_id: string
        }
        Update: {
          auto_renew?: boolean
          bandwidth_limit_gb?: number | null
          control_panel_url?: string | null
          cost?: number | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          plan?: string | null
          provider?: string
          renewal_date?: string | null
          server_ip?: string | null
          storage_limit_gb?: number | null
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentreadmin_hosting_details_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: true
            referencedRelation: "edoscentreadmin_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentreadmin_invoices: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          currency: string
          discount: number
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          overdue_notice_sent_at: string | null
          reminder_sent_at: string | null
          status: string
          subscription_id: string | null
          tax: number
          total: number
          updated_at: string
          website_id: string | null
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          currency?: string
          discount?: number
          due_date: string
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          overdue_notice_sent_at?: string | null
          reminder_sent_at?: string | null
          status?: string
          subscription_id?: string | null
          tax?: number
          total: number
          updated_at?: string
          website_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          currency?: string
          discount?: number
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          overdue_notice_sent_at?: string | null
          reminder_sent_at?: string | null
          status?: string
          subscription_id?: string | null
          tax?: number
          total?: number
          updated_at?: string
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "edoscentreadmin_invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentreadmin_invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentreadmin_invoices_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentreadmin_mpesa_transactions: {
        Row: {
          amount: number
          checkout_request_id: string | null
          created_at: string
          id: string
          initiated_by: string | null
          invoice_id: string
          merchant_request_id: string | null
          mpesa_receipt_number: string | null
          payment_id: string | null
          phone_number: string
          result_code: string | null
          result_desc: string | null
          status: string
          transaction_date: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          checkout_request_id?: string | null
          created_at?: string
          id?: string
          initiated_by?: string | null
          invoice_id: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          payment_id?: string | null
          phone_number: string
          result_code?: string | null
          result_desc?: string | null
          status?: string
          transaction_date?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          checkout_request_id?: string | null
          created_at?: string
          id?: string
          initiated_by?: string | null
          invoice_id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          payment_id?: string | null
          phone_number?: string
          result_code?: string | null
          result_desc?: string | null
          status?: string
          transaction_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentreadmin_mpesa_transactions_initiated_by_fkey"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentreadmin_mpesa_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentreadmin_mpesa_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentreadmin_notifications: {
        Row: {
          created_at: string
          dedup_key: string
          id: string
          is_read: boolean
          link: string | null
          message: string | null
          recipient_id: string
          severity: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          dedup_key: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string | null
          recipient_id: string
          severity?: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          dedup_key?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string | null
          recipient_id?: string
          severity?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentreadmin_notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentreadmin_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          recorded_by: string | null
          status: string
          transaction_reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          recorded_by?: string | null
          status?: string
          transaction_reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          recorded_by?: string | null
          status?: string
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "edoscentreadmin_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentreadmin_payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentreadmin_ssl_certificates: {
        Row: {
          auto_renew: boolean
          cert_type: string
          cost: number | null
          created_at: string
          currency: string
          domain_id: string | null
          expiry_date: string
          id: string
          issued_date: string | null
          notes: string | null
          provider: string
          status: string
          updated_at: string
          website_id: string
        }
        Insert: {
          auto_renew?: boolean
          cert_type?: string
          cost?: number | null
          created_at?: string
          currency?: string
          domain_id?: string | null
          expiry_date: string
          id?: string
          issued_date?: string | null
          notes?: string | null
          provider: string
          status?: string
          updated_at?: string
          website_id: string
        }
        Update: {
          auto_renew?: boolean
          cert_type?: string
          cost?: number | null
          created_at?: string
          currency?: string
          domain_id?: string | null
          expiry_date?: string
          id?: string
          issued_date?: string | null
          notes?: string | null
          provider?: string
          status?: string
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentreadmin_ssl_certificates_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentreadmin_ssl_certificates_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentreadmin_subscription_plans: {
        Row: {
          annual_price: number | null
          created_at: string
          currency: string
          description: string | null
          features: string | null
          id: string
          is_active: boolean
          monthly_price: number | null
          name: string
          quarterly_price: number | null
          semiannual_price: number | null
          setup_fee: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          annual_price?: number | null
          created_at?: string
          currency?: string
          description?: string | null
          features?: string | null
          id?: string
          is_active?: boolean
          monthly_price?: number | null
          name: string
          quarterly_price?: number | null
          semiannual_price?: number | null
          setup_fee?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          annual_price?: number | null
          created_at?: string
          currency?: string
          description?: string | null
          features?: string | null
          id?: string
          is_active?: boolean
          monthly_price?: number | null
          name?: string
          quarterly_price?: number | null
          semiannual_price?: number | null
          setup_fee?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      edoscentreadmin_subscriptions: {
        Row: {
          amount: number
          auto_renew: boolean
          billing_cycle: string
          client_id: string
          created_at: string
          currency: string
          grace_period_days: number
          id: string
          notes: string | null
          plan_id: string | null
          renewal_date: string | null
          start_date: string
          status: string
          updated_at: string
          website_id: string
        }
        Insert: {
          amount: number
          auto_renew?: boolean
          billing_cycle?: string
          client_id: string
          created_at?: string
          currency?: string
          grace_period_days?: number
          id?: string
          notes?: string | null
          plan_id?: string | null
          renewal_date?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          website_id: string
        }
        Update: {
          amount?: number
          auto_renew?: boolean
          billing_cycle?: string
          client_id?: string
          created_at?: string
          currency?: string
          grace_period_days?: number
          id?: string
          notes?: string | null
          plan_id?: string | null
          renewal_date?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentreadmin_subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentreadmin_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edoscentreadmin_subscriptions_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      edoscentreadmin_websites: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          maintenance_return_at: string | null
          name: string
          notes: string | null
          primary_admin_email: string | null
          slug: string
          status: string
          status_changed_at: string | null
          status_changed_by: string | null
          status_message: string | null
          status_reason: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          maintenance_return_at?: string | null
          name: string
          notes?: string | null
          primary_admin_email?: string | null
          slug: string
          status?: string
          status_changed_at?: string | null
          status_changed_by?: string | null
          status_message?: string | null
          status_reason?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          maintenance_return_at?: string | null
          name?: string
          notes?: string | null
          primary_admin_email?: string | null
          slug?: string
          status?: string
          status_changed_at?: string | null
          status_changed_by?: string | null
          status_message?: string | null
          status_reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "edoscentreadmin_websites_status_changed_by_fkey"
            columns: ["status_changed_by"]
            isOneToOne: false
            referencedRelation: "edoscentreadmin_admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      emiwama_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string | null
          full_name: string
          id: string
          is_default: boolean | null
          phone: string | null
          postal_code: string
          state: string | null
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country: string
          created_at?: string | null
          full_name: string
          id?: string
          is_default?: boolean | null
          phone?: string | null
          postal_code: string
          state?: string | null
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string | null
          full_name?: string
          id?: string
          is_default?: boolean | null
          phone?: string | null
          postal_code?: string
          state?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emiwama_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "emiwama_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emiwama_categories: {
        Row: {
          created_at: string | null
          description: string | null
          gender: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          gender?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          gender?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "emiwama_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "emiwama_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      emiwama_lookbook: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          is_published: boolean | null
          product_ids: string[] | null
          published_at: string | null
          season: string | null
          slug: string
          title: string
          year: number | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_published?: boolean | null
          product_ids?: string[] | null
          published_at?: string | null
          season?: string | null
          slug: string
          title: string
          year?: number | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_published?: boolean | null
          product_ids?: string[] | null
          published_at?: string | null
          season?: string | null
          slug?: string
          title?: string
          year?: number | null
        }
        Relationships: []
      }
      emiwama_newsletter: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          subscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
        }
        Relationships: []
      }
      emiwama_order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_snapshot: Json | null
          quantity: number
          total_price: number
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_snapshot?: Json | null
          quantity: number
          total_price: number
          unit_price: number
          variant_id?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_snapshot?: Json | null
          quantity?: number
          total_price?: number
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emiwama_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "emiwama_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emiwama_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "emiwama_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emiwama_order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "emiwama_product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      emiwama_orders: {
        Row: {
          created_at: string | null
          currency: string | null
          discount: number | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          status: string | null
          subtotal: number
          tax: number | null
          total: number
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          discount?: number | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string | null
          subtotal: number
          tax?: number | null
          total: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          discount?: number | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string | null
          subtotal?: number
          tax?: number | null
          total?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emiwama_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "emiwama_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emiwama_product_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          position: number | null
          product_id: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          position?: number | null
          product_id: string
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          position?: number | null
          product_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "emiwama_product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "emiwama_products"
            referencedColumns: ["id"]
          },
        ]
      }
      emiwama_product_variants: {
        Row: {
          color: string | null
          color_hex: string | null
          created_at: string | null
          id: string
          price_adjustment: number | null
          product_id: string
          size: string | null
          sku: string | null
          stock_quantity: number | null
        }
        Insert: {
          color?: string | null
          color_hex?: string | null
          created_at?: string | null
          id?: string
          price_adjustment?: number | null
          product_id: string
          size?: string | null
          sku?: string | null
          stock_quantity?: number | null
        }
        Update: {
          color?: string | null
          color_hex?: string | null
          created_at?: string | null
          id?: string
          price_adjustment?: number | null
          product_id?: string
          size?: string | null
          sku?: string | null
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "emiwama_product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "emiwama_products"
            referencedColumns: ["id"]
          },
        ]
      }
      emiwama_products: {
        Row: {
          brand: string | null
          care_instructions: string[] | null
          category_id: string | null
          created_at: string | null
          description: string | null
          gender: string
          id: string
          is_bestseller: boolean | null
          is_featured: boolean | null
          is_new: boolean | null
          is_sale: boolean | null
          material: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          original_price: number | null
          price: number
          slug: string
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          care_instructions?: string[] | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          gender: string
          id?: string
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          is_sale?: boolean | null
          material?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          original_price?: number | null
          price: number
          slug: string
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          care_instructions?: string[] | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          gender?: string
          id?: string
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          is_sale?: boolean | null
          material?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          original_price?: number | null
          price?: number
          slug?: string
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emiwama_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "emiwama_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      emiwama_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          newsletter_subscribed: boolean | null
          phone: string | null
          preferred_currency: string | null
          preferred_language: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          newsletter_subscribed?: boolean | null
          phone?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          newsletter_subscribed?: boolean | null
          phone?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      emiwama_reviews: {
        Row: {
          body: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_approved: boolean | null
          is_verified: boolean | null
          product_id: string
          rating: number
          title: string | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_approved?: boolean | null
          is_verified?: boolean | null
          product_id: string
          rating: number
          title?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_approved?: boolean | null
          is_verified?: boolean | null
          product_id?: string
          rating?: number
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emiwama_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "emiwama_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emiwama_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "emiwama_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emiwama_wishlist: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emiwama_wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "emiwama_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emiwama_wishlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "emiwama_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_activities: {
        Row: {
          base_price: number | null
          category: string | null
          created_at: string
          created_by: string | null
          currency: string
          deleted_at: string | null
          description: string | null
          difficulty: string | null
          display_order: number
          duration_minutes: number | null
          id: string
          is_active: boolean
          media_id: string | null
          name: string
          slug: string
          summary: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          base_price?: number | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          description?: string | null
          difficulty?: string | null
          display_order?: number
          duration_minutes?: number | null
          id?: string
          is_active?: boolean
          media_id?: string | null
          name: string
          slug: string
          summary?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          base_price?: number | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          description?: string | null
          difficulty?: string | null
          display_order?: number
          duration_minutes?: number | null
          id?: string
          is_active?: boolean
          media_id?: string | null
          name?: string
          slug?: string
          summary?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_activities_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_agent_commissions: {
        Row: {
          base_amount: number
          booking_id: string | null
          commission_amount: number
          commission_rate: number
          created_at: string
          currency: string
          earned_on: string | null
          id: string
          notes: string | null
          paid_at: string | null
          payment_reference: string | null
          status: string
          travel_agent_id: string
          updated_at: string
        }
        Insert: {
          base_amount?: number
          booking_id?: string | null
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          currency?: string
          earned_on?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_reference?: string | null
          status?: string
          travel_agent_id: string
          updated_at?: string
        }
        Update: {
          base_amount?: number
          booking_id?: string | null
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          currency?: string
          earned_on?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_reference?: string | null
          status?: string
          travel_agent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_agent_commissions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_agent_commissions_travel_agent_id_fkey"
            columns: ["travel_agent_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_travel_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_attractions: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          destination_id: string | null
          display_order: number
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          media_id: string | null
          name: string
          slug: string
          summary: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          destination_id?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          media_id?: string | null
          name: string
          slug: string
          summary?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          destination_id?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          media_id?: string | null
          name?: string
          slug?: string
          summary?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_attractions_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_attractions_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_audit_logs: {
        Row: {
          action: string
          changed_fields: string[] | null
          entity_id: string | null
          entity_type: string
          id: number
          ip_address: unknown
          new_values: Json | null
          occurred_at: string
          old_values: Json | null
          summary: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          action: string
          changed_fields?: string[] | null
          entity_id?: string | null
          entity_type: string
          id?: number
          ip_address?: unknown
          new_values?: Json | null
          occurred_at?: string
          old_values?: Json | null
          summary?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          action?: string
          changed_fields?: string[] | null
          entity_id?: string | null
          entity_type?: string
          id?: number
          ip_address?: unknown
          new_values?: Json | null
          occurred_at?: string
          old_values?: Json | null
          summary?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      jemvoyage_blog_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      jemvoyage_blog_posts: {
        Row: {
          author_id: string | null
          body: string | null
          category_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          excerpt: string | null
          featured_media_id: string | null
          id: string
          is_featured: boolean
          published_at: string | null
          reading_minutes: number | null
          slug: string
          social_media_id: string | null
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          featured_media_id?: string | null
          id?: string
          is_featured?: boolean
          published_at?: string | null
          reading_minutes?: number | null
          slug: string
          social_media_id?: string | null
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          featured_media_id?: string | null
          id?: string
          is_featured?: boolean
          published_at?: string | null
          reading_minutes?: number | null
          slug?: string
          social_media_id?: string | null
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_blog_posts_featured_media_id_fkey"
            columns: ["featured_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_blog_posts_social_media_id_fkey"
            columns: ["social_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_booking_items: {
        Row: {
          booking_id: string
          confirmation_ref: string | null
          created_at: string
          description: string
          detail: string | null
          display_order: number
          driver_id: string | null
          guide_id: string | null
          id: string
          item_type: string
          line_total: number | null
          notes: string | null
          quantity: number
          reference_id: string | null
          service_date: string | null
          status: string
          supplier_id: string | null
          unit_cost: number
          unit_price: number
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          booking_id: string
          confirmation_ref?: string | null
          created_at?: string
          description: string
          detail?: string | null
          display_order?: number
          driver_id?: string | null
          guide_id?: string | null
          id?: string
          item_type: string
          line_total?: number | null
          notes?: string | null
          quantity?: number
          reference_id?: string | null
          service_date?: string | null
          status?: string
          supplier_id?: string | null
          unit_cost?: number
          unit_price?: number
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          booking_id?: string
          confirmation_ref?: string | null
          created_at?: string
          description?: string
          detail?: string | null
          display_order?: number
          driver_id?: string | null
          guide_id?: string | null
          id?: string
          item_type?: string
          line_total?: number | null
          notes?: string | null
          quantity?: number
          reference_id?: string | null
          service_date?: string | null
          status?: string
          supplier_id?: string | null
          unit_cost?: number
          unit_price?: number
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_booking_items_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_booking_items_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_booking_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_booking_items_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_bookings: {
        Row: {
          adults: number
          amount_paid: number
          availability_id: string | null
          balance_due: number | null
          cancellation_reason: string | null
          cancelled_at: string | null
          children: number
          completed_at: string | null
          confirmed_at: string | null
          corporate_account_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string
          deleted_at: string | null
          discount_amount: number
          end_date: string
          id: string
          internal_notes: string | null
          lead_guide_id: string | null
          owner_id: string | null
          payment_status: string
          quote_id: string | null
          reference: string
          service_type: string
          special_requests: string | null
          start_date: string
          status: string
          subtotal: number
          supplier_cost: number
          tax_amount: number
          title: string
          total: number
          tour_id: string | null
          travel_agent_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          adults?: number
          amount_paid?: number
          availability_id?: string | null
          balance_due?: number | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          children?: number
          completed_at?: string | null
          confirmed_at?: string | null
          corporate_account_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id: string
          deleted_at?: string | null
          discount_amount?: number
          end_date: string
          id?: string
          internal_notes?: string | null
          lead_guide_id?: string | null
          owner_id?: string | null
          payment_status?: string
          quote_id?: string | null
          reference?: string
          service_type?: string
          special_requests?: string | null
          start_date: string
          status?: string
          subtotal?: number
          supplier_cost?: number
          tax_amount?: number
          title: string
          total?: number
          tour_id?: string | null
          travel_agent_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          adults?: number
          amount_paid?: number
          availability_id?: string | null
          balance_due?: number | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          children?: number
          completed_at?: string | null
          confirmed_at?: string | null
          corporate_account_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string
          deleted_at?: string | null
          discount_amount?: number
          end_date?: string
          id?: string
          internal_notes?: string | null
          lead_guide_id?: string | null
          owner_id?: string | null
          payment_status?: string
          quote_id?: string | null
          reference?: string
          service_type?: string
          special_requests?: string | null
          start_date?: string
          status?: string
          subtotal?: number
          supplier_cost?: number
          tax_amount?: number
          title?: string
          total?: number
          tour_id?: string | null
          travel_agent_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_bookings_agent_fk"
            columns: ["travel_agent_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_travel_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_bookings_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_tour_availability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_bookings_corporate_fk"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_corporate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_bookings_lead_guide_id_fkey"
            columns: ["lead_guide_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_bookings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_bookings_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_tours"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_cms_pages: {
        Row: {
          body: Json
          created_at: string
          created_by: string | null
          deleted_at: string | null
          display_order: number
          hero_media_id: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          subtitle: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number
          hero_media_id?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          subtitle?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number
          hero_media_id?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_cms_pages_hero_media_id_fkey"
            columns: ["hero_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_communications: {
        Row: {
          body: string | null
          channel: string
          created_at: string
          created_by: string | null
          customer_id: string | null
          delivered_at: string | null
          direction: string
          error_message: string | null
          from_address: string | null
          id: string
          lead_id: string | null
          provider_ref: string | null
          read_at: string | null
          sent_at: string | null
          status: string
          subject: string | null
          to_address: string | null
        }
        Insert: {
          body?: string | null
          channel: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          direction: string
          error_message?: string | null
          from_address?: string | null
          id?: string
          lead_id?: string | null
          provider_ref?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          to_address?: string | null
        }
        Update: {
          body?: string | null
          channel?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          direction?: string
          error_message?: string | null
          from_address?: string | null
          id?: string
          lead_id?: string | null
          provider_ref?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          to_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_communications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_corporate_accounts: {
        Row: {
          account_manager_id: string | null
          billing_address: string | null
          billing_contact: string | null
          billing_email: string | null
          company_name: string
          created_at: string
          created_by: string | null
          credit_limit: number
          credit_terms_days: number
          current_balance: number
          deleted_at: string | null
          discount_rate: number
          id: string
          industry: string | null
          monthly_spend_limit: number | null
          notes: string | null
          phone: string | null
          reference: string
          registration_no: string | null
          requires_approval: boolean
          status: string
          tax_pin: string | null
          trading_name: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          account_manager_id?: string | null
          billing_address?: string | null
          billing_contact?: string | null
          billing_email?: string | null
          company_name: string
          created_at?: string
          created_by?: string | null
          credit_limit?: number
          credit_terms_days?: number
          current_balance?: number
          deleted_at?: string | null
          discount_rate?: number
          id?: string
          industry?: string | null
          monthly_spend_limit?: number | null
          notes?: string | null
          phone?: string | null
          reference?: string
          registration_no?: string | null
          requires_approval?: boolean
          status?: string
          tax_pin?: string | null
          trading_name?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          account_manager_id?: string | null
          billing_address?: string | null
          billing_contact?: string | null
          billing_email?: string | null
          company_name?: string
          created_at?: string
          created_by?: string | null
          credit_limit?: number
          credit_terms_days?: number
          current_balance?: number
          deleted_at?: string | null
          discount_rate?: number
          id?: string
          industry?: string | null
          monthly_spend_limit?: number | null
          notes?: string | null
          phone?: string | null
          reference?: string
          registration_no?: string | null
          requires_approval?: boolean
          status?: string
          tax_pin?: string | null
          trading_name?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_corporate_accounts_account_manager_id_fkey"
            columns: ["account_manager_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_corporate_users: {
        Row: {
          can_approve: boolean
          corporate_account_id: string
          cost_centre: string | null
          created_at: string
          customer_id: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean
          job_title: string | null
          phone: string | null
          spend_limit: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          can_approve?: boolean
          corporate_account_id: string
          cost_centre?: string | null
          created_at?: string
          customer_id?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          job_title?: string | null
          phone?: string | null
          spend_limit?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          can_approve?: boolean
          corporate_account_id?: string
          cost_centre?: string | null
          created_at?: string
          customer_id?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          job_title?: string | null
          phone?: string | null
          spend_limit?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_corporate_users_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_corporate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_corporate_users_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_corporate_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_customer_preferences: {
        Row: {
          accessibility_needs: string | null
          accommodation_level: string | null
          budget_band: string | null
          created_at: string
          customer_id: string
          dietary_requirements: string | null
          interests: string[]
          notes: string | null
          preferred_currency: string
          preferred_language: string
          preferred_vehicle_category_id: string | null
          seat_preference: string | null
          travel_styles: string[]
          typical_group_size: number | null
          updated_at: string
        }
        Insert: {
          accessibility_needs?: string | null
          accommodation_level?: string | null
          budget_band?: string | null
          created_at?: string
          customer_id: string
          dietary_requirements?: string | null
          interests?: string[]
          notes?: string | null
          preferred_currency?: string
          preferred_language?: string
          preferred_vehicle_category_id?: string | null
          seat_preference?: string | null
          travel_styles?: string[]
          typical_group_size?: number | null
          updated_at?: string
        }
        Update: {
          accessibility_needs?: string | null
          accommodation_level?: string | null
          budget_band?: string | null
          created_at?: string
          customer_id?: string
          dietary_requirements?: string | null
          interests?: string[]
          notes?: string | null
          preferred_currency?: string
          preferred_language?: string
          preferred_vehicle_category_id?: string | null
          seat_preference?: string | null
          travel_styles?: string[]
          typical_group_size?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_customer_preference_preferred_vehicle_category_i_fkey"
            columns: ["preferred_vehicle_category_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicle_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_customer_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_customers: {
        Row: {
          address: string | null
          alt_phone: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          created_by: string | null
          customer_type: string
          date_of_birth: string | null
          deleted_at: string | null
          email: string | null
          full_name: string
          id: string
          id_number: string | null
          is_active: boolean
          last_booking_at: string | null
          lifetime_value: number
          marketing_opt_in: boolean
          nationality: string | null
          notes: string | null
          owner_id: string | null
          passport_number: string | null
          phone: string | null
          reference: string
          segment: string | null
          tax_pin: string | null
          total_bookings: number
          updated_at: string
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          alt_phone?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          customer_type?: string
          date_of_birth?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          id_number?: string | null
          is_active?: boolean
          last_booking_at?: string | null
          lifetime_value?: number
          marketing_opt_in?: boolean
          nationality?: string | null
          notes?: string | null
          owner_id?: string | null
          passport_number?: string | null
          phone?: string | null
          reference?: string
          segment?: string | null
          tax_pin?: string | null
          total_bookings?: number
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          alt_phone?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          customer_type?: string
          date_of_birth?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          id_number?: string | null
          is_active?: boolean
          last_booking_at?: string | null
          lifetime_value?: number
          marketing_opt_in?: boolean
          nationality?: string | null
          notes?: string | null
          owner_id?: string | null
          passport_number?: string | null
          phone?: string | null
          reference?: string
          segment?: string | null
          tax_pin?: string | null
          total_bookings?: number
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_customers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_destination_media: {
        Row: {
          created_at: string
          destination_id: string
          display_order: number
          media_id: string
        }
        Insert: {
          created_at?: string
          destination_id: string
          display_order?: number
          media_id: string
        }
        Update: {
          created_at?: string
          destination_id?: string
          display_order?: number
          media_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_destination_media_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_destination_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_destinations: {
        Row: {
          best_months: number[]
          country: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          display_order: number
          hero_media_id: string | null
          id: string
          is_featured: boolean
          latitude: number | null
          longitude: number | null
          map_media_id: string | null
          name: string
          region: string | null
          slug: string
          status: string
          summary: string | null
          thumbnail_media_id: string | null
          travel_time_note: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          best_months?: number[]
          country?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          hero_media_id?: string | null
          id?: string
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
          map_media_id?: string | null
          name: string
          region?: string | null
          slug: string
          status?: string
          summary?: string | null
          thumbnail_media_id?: string | null
          travel_time_note?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          best_months?: number[]
          country?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          hero_media_id?: string | null
          id?: string
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
          map_media_id?: string | null
          name?: string
          region?: string | null
          slug?: string
          status?: string
          summary?: string | null
          thumbnail_media_id?: string | null
          travel_time_note?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_destinations_hero_media_id_fkey"
            columns: ["hero_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_destinations_map_media_id_fkey"
            columns: ["map_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_destinations_thumbnail_media_id_fkey"
            columns: ["thumbnail_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_driver_assignments: {
        Row: {
          assignment_type: string
          created_at: string
          created_by: string | null
          driver_id: string
          dropoff_location: string | null
          id: string
          instructions: string | null
          period: unknown
          pickup_location: string | null
          reference_id: string | null
          status: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          assignment_type: string
          created_at?: string
          created_by?: string | null
          driver_id: string
          dropoff_location?: string | null
          id?: string
          instructions?: string | null
          period: unknown
          pickup_location?: string | null
          reference_id?: string | null
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          assignment_type?: string
          created_at?: string
          created_by?: string | null
          driver_id?: string
          dropoff_location?: string | null
          id?: string
          instructions?: string | null
          period?: unknown
          pickup_location?: string | null
          reference_id?: string | null
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_driver_assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_driver_assignments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_drivers: {
        Row: {
          alt_phone: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string | null
          employee_ref: string | null
          full_name: string
          home_base: string | null
          id: string
          is_available: boolean
          languages: string[]
          licence_class: string | null
          licence_expires_on: string | null
          licence_number: string
          national_id: string | null
          notes: string | null
          phone: string
          photo_media_id: string | null
          psv_badge_number: string | null
          psv_expires_on: string | null
          rating_average: number | null
          rating_count: number
          status: string
          updated_at: string
          updated_by: string | null
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          alt_phone?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          employee_ref?: string | null
          full_name: string
          home_base?: string | null
          id?: string
          is_available?: boolean
          languages?: string[]
          licence_class?: string | null
          licence_expires_on?: string | null
          licence_number: string
          national_id?: string | null
          notes?: string | null
          phone: string
          photo_media_id?: string | null
          psv_badge_number?: string | null
          psv_expires_on?: string | null
          rating_average?: number | null
          rating_count?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          alt_phone?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          employee_ref?: string | null
          full_name?: string
          home_base?: string | null
          id?: string
          is_available?: boolean
          languages?: string[]
          licence_class?: string | null
          licence_expires_on?: string | null
          licence_number?: string
          national_id?: string | null
          notes?: string | null
          phone?: string
          photo_media_id?: string | null
          psv_badge_number?: string | null
          psv_expires_on?: string | null
          rating_average?: number | null
          rating_count?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_drivers_photo_media_id_fkey"
            columns: ["photo_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_drivers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_expenses: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          booking_id: string | null
          category: string
          created_at: string
          created_by: string | null
          currency: string
          description: string
          driver_id: string | null
          expense_date: string
          id: string
          notes: string | null
          payment_method: string | null
          receipt_media_id: string | null
          reference: string
          rental_id: string | null
          status: string
          supplier_id: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          booking_id?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          currency?: string
          description: string
          driver_id?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          receipt_media_id?: string | null
          reference?: string
          rental_id?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          booking_id?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string
          driver_id?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          receipt_media_id?: string | null
          reference?: string
          rental_id?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_expenses_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_expenses_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_expenses_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_expenses_receipt_media_id_fkey"
            columns: ["receipt_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_expenses_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_expenses_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_expenses_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          question: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      jemvoyage_fuel_records: {
        Row: {
          cost: number
          created_at: string
          created_by: string | null
          currency: string
          driver_id: string | null
          filled_at: string
          id: string
          litres: number
          mileage_km: number | null
          receipt_ref: string | null
          station: string | null
          vehicle_id: string
        }
        Insert: {
          cost: number
          created_at?: string
          created_by?: string | null
          currency?: string
          driver_id?: string | null
          filled_at?: string
          id?: string
          litres: number
          mileage_km?: number | null
          receipt_ref?: string | null
          station?: string | null
          vehicle_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          driver_id?: string | null
          filled_at?: string
          id?: string
          litres?: number
          mileage_km?: number | null
          receipt_ref?: string | null
          station?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_fuel_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_guides: {
        Row: {
          bio: string | null
          certification: string | null
          certification_expires_on: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string | null
          full_name: string
          id: string
          is_available: boolean
          languages: string[]
          phone: string | null
          photo_media_id: string | null
          rating_average: number | null
          rating_count: number
          specialisations: string[]
          status: string
          updated_at: string
          updated_by: string | null
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          certification?: string | null
          certification_expires_on?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_available?: boolean
          languages?: string[]
          phone?: string | null
          photo_media_id?: string | null
          rating_average?: number | null
          rating_count?: number
          specialisations?: string[]
          status?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          certification?: string | null
          certification_expires_on?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_available?: boolean
          languages?: string[]
          phone?: string | null
          photo_media_id?: string | null
          rating_average?: number | null
          rating_count?: number
          specialisations?: string[]
          status?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_guides_photo_media_id_fkey"
            columns: ["photo_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_guides_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_hero_slides: {
        Row: {
          created_at: string
          created_by: string | null
          cta_label: string | null
          cta_url: string | null
          desktop_media_id: string | null
          display_order: number
          ends_at: string | null
          eyebrow: string | null
          headline: string
          id: string
          is_active: boolean
          mobile_media_id: string | null
          overlay_opacity: number
          overlay_style: string
          placement: string
          secondary_cta_label: string | null
          secondary_cta_url: string | null
          starts_at: string | null
          subheadline: string | null
          updated_at: string
          updated_by: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          desktop_media_id?: string | null
          display_order?: number
          ends_at?: string | null
          eyebrow?: string | null
          headline: string
          id?: string
          is_active?: boolean
          mobile_media_id?: string | null
          overlay_opacity?: number
          overlay_style?: string
          placement?: string
          secondary_cta_label?: string | null
          secondary_cta_url?: string | null
          starts_at?: string | null
          subheadline?: string | null
          updated_at?: string
          updated_by?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          desktop_media_id?: string | null
          display_order?: number
          ends_at?: string | null
          eyebrow?: string | null
          headline?: string
          id?: string
          is_active?: boolean
          mobile_media_id?: string | null
          overlay_opacity?: number
          overlay_style?: string
          placement?: string
          secondary_cta_label?: string | null
          secondary_cta_url?: string | null
          starts_at?: string | null
          subheadline?: string | null
          updated_at?: string
          updated_by?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_hero_slides_desktop_media_id_fkey"
            columns: ["desktop_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_hero_slides_mobile_media_id_fkey"
            columns: ["mobile_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_homepage_sections: {
        Row: {
          body: string | null
          created_at: string
          cta_label: string | null
          cta_url: string | null
          display_order: number
          eyebrow: string | null
          heading: string
          id: string
          is_active: boolean
          item_limit: number
          layout: string
          media_id: string | null
          section_key: string
          subheading: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          display_order?: number
          eyebrow?: string | null
          heading: string
          id?: string
          is_active?: boolean
          item_limit?: number
          layout?: string
          media_id?: string | null
          section_key: string
          subheading?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          display_order?: number
          eyebrow?: string | null
          heading?: string
          id?: string
          is_active?: boolean
          item_limit?: number
          layout?: string
          media_id?: string | null
          section_key?: string
          subheading?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_homepage_sections_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_insurance: {
        Row: {
          cover_type: string | null
          created_at: string
          currency: string
          document_media_id: string | null
          excess_amount: number | null
          expires_on: string
          id: string
          notes: string | null
          policy_number: string
          premium: number | null
          provider: string
          starts_on: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          cover_type?: string | null
          created_at?: string
          currency?: string
          document_media_id?: string | null
          excess_amount?: number | null
          expires_on: string
          id?: string
          notes?: string | null
          policy_number: string
          premium?: number | null
          provider: string
          starts_on: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          cover_type?: string | null
          created_at?: string
          currency?: string
          document_media_id?: string | null
          excess_amount?: number | null
          expires_on?: string
          id?: string
          notes?: string | null
          policy_number?: string
          premium?: number | null
          provider?: string
          starts_on?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_insurance_document_media_id_fkey"
            columns: ["document_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_insurance_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_invoice_items: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          invoice_id: string
          is_taxable: boolean
          line_total: number | null
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          id?: string
          invoice_id: string
          is_taxable?: boolean
          line_total?: number | null
          quantity?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          invoice_id?: string
          is_taxable?: boolean
          line_total?: number | null
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_invoices: {
        Row: {
          amount_paid: number
          balance_due: number | null
          booking_id: string | null
          corporate_account_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string | null
          deleted_at: string | null
          discount_amount: number
          due_date: string | null
          id: string
          invoice_number: string
          invoice_type: string
          issue_date: string
          notes: string | null
          paid_at: string | null
          pdf_media_id: string | null
          rental_id: string | null
          sent_at: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          terms: string | null
          total: number
          travel_agent_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount_paid?: number
          balance_due?: number | null
          booking_id?: string | null
          corporate_account_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          deleted_at?: string | null
          discount_amount?: number
          due_date?: string | null
          id?: string
          invoice_number?: string
          invoice_type?: string
          issue_date?: string
          notes?: string | null
          paid_at?: string | null
          pdf_media_id?: string | null
          rental_id?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          terms?: string | null
          total?: number
          travel_agent_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount_paid?: number
          balance_due?: number | null
          booking_id?: string | null
          corporate_account_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          deleted_at?: string | null
          discount_amount?: number
          due_date?: string | null
          id?: string
          invoice_number?: string
          invoice_type?: string
          issue_date?: string
          notes?: string | null
          paid_at?: string | null
          pdf_media_id?: string | null
          rental_id?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          terms?: string | null
          total?: number
          travel_agent_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_invoices_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_corporate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_invoices_pdf_media_id_fkey"
            columns: ["pdf_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_invoices_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_invoices_travel_agent_id_fkey"
            columns: ["travel_agent_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_travel_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_lead_sources: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      jemvoyage_leads: {
        Row: {
          adults: number
          budget_max: number | null
          budget_min: number | null
          children: number
          converted_at: string | null
          country: string | null
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string | null
          deleted_at: string | null
          destination_id: string | null
          email: string | null
          full_name: string
          id: string
          lost_reason: string | null
          message: string | null
          next_action_at: string | null
          owner_id: string | null
          phone: string | null
          priority: string
          reference: string
          service_interest: string | null
          source_id: string | null
          stage: string
          tour_id: string | null
          travel_end_date: string | null
          travel_start_date: string | null
          updated_at: string
          updated_by: string | null
          vehicle_id: string | null
        }
        Insert: {
          adults?: number
          budget_max?: number | null
          budget_min?: number | null
          children?: number
          converted_at?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          deleted_at?: string | null
          destination_id?: string | null
          email?: string | null
          full_name: string
          id?: string
          lost_reason?: string | null
          message?: string | null
          next_action_at?: string | null
          owner_id?: string | null
          phone?: string | null
          priority?: string
          reference?: string
          service_interest?: string | null
          source_id?: string | null
          stage?: string
          tour_id?: string | null
          travel_end_date?: string | null
          travel_start_date?: string | null
          updated_at?: string
          updated_by?: string | null
          vehicle_id?: string | null
        }
        Update: {
          adults?: number
          budget_max?: number | null
          budget_min?: number | null
          children?: number
          converted_at?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          deleted_at?: string | null
          destination_id?: string | null
          email?: string | null
          full_name?: string
          id?: string
          lost_reason?: string | null
          message?: string | null
          next_action_at?: string | null
          owner_id?: string | null
          phone?: string | null
          priority?: string
          reference?: string
          service_interest?: string | null
          source_id?: string | null
          stage?: string
          tour_id?: string | null
          travel_end_date?: string | null
          travel_start_date?: string | null
          updated_at?: string
          updated_by?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_leads_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_leads_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_leads_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_leads_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_lead_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_leads_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_leads_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_maintenance: {
        Row: {
          completed_date: string | null
          cost: number | null
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          id: string
          invoice_ref: string | null
          maintenance_type: string
          mileage_km: number | null
          next_due_date: string | null
          next_due_km: number | null
          provider: string | null
          scheduled_date: string | null
          status: string
          title: string
          updated_at: string
          updated_by: string | null
          vehicle_id: string
        }
        Insert: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          id?: string
          invoice_ref?: string | null
          maintenance_type?: string
          mileage_km?: number | null
          next_due_date?: string | null
          next_due_km?: number | null
          provider?: string | null
          scheduled_date?: string | null
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
          vehicle_id: string
        }
        Update: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          id?: string
          invoice_ref?: string | null
          maintenance_type?: string
          mileage_km?: number | null
          next_due_date?: string | null
          next_due_km?: number | null
          provider?: string | null
          scheduled_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_maintenance_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_media: {
        Row: {
          alt_text: string | null
          blur_data_url: string | null
          caption: string | null
          category: string
          created_at: string
          credit: string | null
          deleted_at: string | null
          description: string | null
          external_url: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          focal_x: number
          focal_y: number
          height: number | null
          id: string
          is_active: boolean
          is_placeholder: boolean
          license: string | null
          mime_type: string | null
          source_url: string | null
          storage_bucket: string
          tags: string[]
          title: string | null
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          blur_data_url?: string | null
          caption?: string | null
          category?: string
          created_at?: string
          credit?: string | null
          deleted_at?: string | null
          description?: string | null
          external_url?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          focal_x?: number
          focal_y?: number
          height?: number | null
          id?: string
          is_active?: boolean
          is_placeholder?: boolean
          license?: string | null
          mime_type?: string | null
          source_url?: string | null
          storage_bucket?: string
          tags?: string[]
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          blur_data_url?: string | null
          caption?: string | null
          category?: string
          created_at?: string
          credit?: string | null
          deleted_at?: string | null
          description?: string | null
          external_url?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          focal_x?: number
          focal_y?: number
          height?: number | null
          id?: string
          is_active?: boolean
          is_placeholder?: boolean
          license?: string | null
          mime_type?: string | null
          source_url?: string | null
          storage_bucket?: string
          tags?: string[]
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      jemvoyage_menu_items: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          is_active: boolean
          label: string
          menu_id: string
          opens_new_tab: boolean
          parent_id: string | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          label: string
          menu_id: string
          opens_new_tab?: boolean
          parent_id?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          label?: string
          menu_id?: string
          opens_new_tab?: boolean
          parent_id?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_menus: {
        Row: {
          created_at: string
          id: string
          key: string
          label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          label: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      jemvoyage_newsletter_subscribers: {
        Row: {
          confirmed_at: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_confirmed: boolean
          segments: string[]
          source: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_confirmed?: boolean
          segments?: string[]
          source?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_confirmed?: boolean
          segments?: string[]
          source?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      jemvoyage_notification_templates: {
        Row: {
          body: string
          channel: string
          created_at: string
          id: string
          is_active: boolean
          key: string
          name: string
          subject: string | null
          updated_at: string
          updated_by: string | null
          variables: string[]
        }
        Insert: {
          body: string
          channel: string
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          name: string
          subject?: string | null
          updated_at?: string
          updated_by?: string | null
          variables?: string[]
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          subject?: string | null
          updated_at?: string
          updated_by?: string | null
          variables?: string[]
        }
        Relationships: []
      }
      jemvoyage_notifications: {
        Row: {
          action_url: string | null
          body: string | null
          channel: string
          created_at: string
          customer_id: string | null
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          id: string
          priority: string
          read_at: string | null
          scheduled_for: string | null
          sent_at: string | null
          status: string
          template_id: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          channel?: string
          created_at?: string
          customer_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          id?: string
          priority?: string
          read_at?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          template_id?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          body?: string | null
          channel?: string
          created_at?: string
          customer_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          id?: string
          priority?: string
          read_at?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          template_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_notifications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_notifications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_notification_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_offers: {
        Row: {
          applies_to: string
          body: string | null
          created_at: string
          created_by: string | null
          discount_type: string | null
          discount_value: number | null
          display_order: number
          ends_at: string | null
          id: string
          is_active: boolean
          media_id: string | null
          promo_code: string | null
          slug: string
          starts_at: string | null
          summary: string | null
          terms: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          applies_to?: string
          body?: string | null
          created_at?: string
          created_by?: string | null
          discount_type?: string | null
          discount_value?: number | null
          display_order?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          media_id?: string | null
          promo_code?: string | null
          slug: string
          starts_at?: string | null
          summary?: string | null
          terms?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          applies_to?: string
          body?: string | null
          created_at?: string
          created_by?: string | null
          discount_type?: string | null
          discount_value?: number | null
          display_order?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          media_id?: string | null
          promo_code?: string | null
          slug?: string
          starts_at?: string | null
          summary?: string | null
          terms?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_offers_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_payment_events: {
        Row: {
          error_message: string | null
          event_type: string
          external_id: string | null
          id: string
          payload: Json
          payment_id: string | null
          processed: boolean
          processed_at: string | null
          provider: string
          received_at: string
          signature_ok: boolean | null
        }
        Insert: {
          error_message?: string | null
          event_type: string
          external_id?: string | null
          id?: string
          payload: Json
          payment_id?: string | null
          processed?: boolean
          processed_at?: string | null
          provider: string
          received_at?: string
          signature_ok?: boolean | null
        }
        Update: {
          error_message?: string | null
          event_type?: string
          external_id?: string | null
          id?: string
          payload?: Json
          payment_id?: string | null
          processed?: boolean
          processed_at?: string | null
          provider?: string
          received_at?: string
          signature_ok?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_payment_events_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_payments: {
        Row: {
          amount: number
          bank_reference: string | null
          booking_id: string | null
          checkout_request_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string | null
          failure_reason: string | null
          id: string
          invoice_id: string | null
          merchant_request_id: string | null
          method: string
          mpesa_receipt: string | null
          notes: string | null
          paid_at: string | null
          payer_name: string | null
          payer_phone: string | null
          payment_type: string
          provider: string | null
          provider_reference: string | null
          reference: string
          rental_id: string | null
          status: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          bank_reference?: string | null
          booking_id?: string | null
          checkout_request_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          failure_reason?: string | null
          id?: string
          invoice_id?: string | null
          merchant_request_id?: string | null
          method: string
          mpesa_receipt?: string | null
          notes?: string | null
          paid_at?: string | null
          payer_name?: string | null
          payer_phone?: string | null
          payment_type?: string
          provider?: string | null
          provider_reference?: string | null
          reference?: string
          rental_id?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          bank_reference?: string | null
          booking_id?: string | null
          checkout_request_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          failure_reason?: string | null
          id?: string
          invoice_id?: string | null
          merchant_request_id?: string | null
          method?: string
          mpesa_receipt?: string | null
          notes?: string | null
          paid_at?: string | null
          payer_name?: string | null
          payer_phone?: string | null
          payment_type?: string
          provider?: string | null
          provider_reference?: string | null
          reference?: string
          rental_id?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_payments_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_payments_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_permissions: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          key: string
          label: string
          resource: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          key: string
          label: string
          resource: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          label?: string
          resource?: string
        }
        Relationships: []
      }
      jemvoyage_quote_items: {
        Row: {
          created_at: string
          description: string
          detail: string | null
          display_order: number
          id: string
          is_optional: boolean
          item_type: string
          line_cost: number | null
          line_total: number | null
          quantity: number
          quote_id: string
          reference_id: string | null
          service_date: string | null
          supplier_id: string | null
          unit: string | null
          unit_cost: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          detail?: string | null
          display_order?: number
          id?: string
          is_optional?: boolean
          item_type: string
          line_cost?: number | null
          line_total?: number | null
          quantity?: number
          quote_id: string
          reference_id?: string | null
          service_date?: string | null
          supplier_id?: string | null
          unit?: string | null
          unit_cost?: number
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          detail?: string | null
          display_order?: number
          id?: string
          is_optional?: boolean
          item_type?: string
          line_cost?: number | null
          line_total?: number | null
          quantity?: number
          quote_id?: string
          reference_id?: string | null
          service_date?: string | null
          supplier_id?: string | null
          unit?: string | null
          unit_cost?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_quote_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_quote_versions: {
        Row: {
          change_note: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          id: string
          quote_id: string
          snapshot: Json
          total: number | null
          version: number
        }
        Insert: {
          change_note?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          id?: string
          quote_id: string
          snapshot: Json
          total?: number | null
          version: number
        }
        Update: {
          change_note?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          id?: string
          quote_id?: string
          snapshot?: Json
          total?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_quote_versions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_quotes: {
        Row: {
          adults: number
          approved_at: string | null
          approved_by: string | null
          cancellation_terms: string | null
          children: number
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string | null
          customer_notes: string | null
          deleted_at: string | null
          discount_amount: number
          exclusions: string[]
          id: string
          inclusions: string[]
          internal_notes: string | null
          lead_id: string | null
          markup_amount: number
          owner_id: string | null
          payment_terms: string | null
          pdf_media_id: string | null
          reference: string
          responded_at: string | null
          sent_at: string | null
          service_type: string
          status: string
          subtotal: number
          summary: string | null
          supplier_cost: number
          tax_amount: number
          title: string
          total: number
          tour_id: string | null
          travel_end_date: string | null
          travel_start_date: string | null
          updated_at: string
          updated_by: string | null
          valid_until: string | null
          version: number
        }
        Insert: {
          adults?: number
          approved_at?: string | null
          approved_by?: string | null
          cancellation_terms?: string | null
          children?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          customer_notes?: string | null
          deleted_at?: string | null
          discount_amount?: number
          exclusions?: string[]
          id?: string
          inclusions?: string[]
          internal_notes?: string | null
          lead_id?: string | null
          markup_amount?: number
          owner_id?: string | null
          payment_terms?: string | null
          pdf_media_id?: string | null
          reference?: string
          responded_at?: string | null
          sent_at?: string | null
          service_type?: string
          status?: string
          subtotal?: number
          summary?: string | null
          supplier_cost?: number
          tax_amount?: number
          title: string
          total?: number
          tour_id?: string | null
          travel_end_date?: string | null
          travel_start_date?: string | null
          updated_at?: string
          updated_by?: string | null
          valid_until?: string | null
          version?: number
        }
        Update: {
          adults?: number
          approved_at?: string | null
          approved_by?: string | null
          cancellation_terms?: string | null
          children?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          customer_notes?: string | null
          deleted_at?: string | null
          discount_amount?: number
          exclusions?: string[]
          id?: string
          inclusions?: string[]
          internal_notes?: string | null
          lead_id?: string | null
          markup_amount?: number
          owner_id?: string | null
          payment_terms?: string | null
          pdf_media_id?: string | null
          reference?: string
          responded_at?: string | null
          sent_at?: string | null
          service_type?: string
          status?: string
          subtotal?: number
          summary?: string | null
          supplier_cost?: number
          tax_amount?: number
          title?: string
          total?: number
          tour_id?: string | null
          travel_end_date?: string | null
          travel_start_date?: string | null
          updated_at?: string
          updated_by?: string | null
          valid_until?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_quotes_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_quotes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_quotes_pdf_media_id_fkey"
            columns: ["pdf_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_quotes_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_tours"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_refunds: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          booking_id: string | null
          created_at: string
          currency: string
          customer_id: string | null
          id: string
          invoice_id: string | null
          method: string | null
          notes: string | null
          payment_id: string | null
          processed_at: string | null
          provider_reference: string | null
          reason: string
          reference: string
          refund_type: string
          rental_id: string | null
          requested_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          booking_id?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          method?: string | null
          notes?: string | null
          payment_id?: string | null
          processed_at?: string | null
          provider_reference?: string | null
          reason: string
          reference?: string
          refund_type?: string
          rental_id?: string | null
          requested_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          booking_id?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          method?: string | null
          notes?: string | null
          payment_id?: string | null
          processed_at?: string | null
          provider_reference?: string | null
          reason?: string
          reference?: string
          refund_type?: string
          rental_id?: string | null
          requested_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_refunds_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_refunds_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_refunds_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_refunds_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_refunds_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_refunds_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_rental_agreements: {
        Row: {
          agreement_number: string
          created_at: string
          created_by: string | null
          document_media_id: string | null
          id: string
          rental_id: string
          signature_ip: unknown
          signed_at: string | null
          signed_by_name: string | null
          snapshot: Json | null
          status: string
          terms: string | null
          updated_at: string
          version: number
        }
        Insert: {
          agreement_number?: string
          created_at?: string
          created_by?: string | null
          document_media_id?: string | null
          id?: string
          rental_id: string
          signature_ip?: unknown
          signed_at?: string | null
          signed_by_name?: string | null
          snapshot?: Json | null
          status?: string
          terms?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          agreement_number?: string
          created_at?: string
          created_by?: string | null
          document_media_id?: string | null
          id?: string
          rental_id?: string
          signature_ip?: unknown
          signed_at?: string | null
          signed_by_name?: string | null
          snapshot?: Json | null
          status?: string
          terms?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_rental_agreements_document_media_id_fkey"
            columns: ["document_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_rental_agreements_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_rental_charges: {
        Row: {
          amount: number | null
          charge_type: string
          charged_at: string | null
          created_at: string
          created_by: string | null
          currency: string
          description: string
          id: string
          is_taxable: boolean
          notes: string | null
          quantity: number
          rental_id: string
          status: string
          unit_amount: number
          updated_at: string
        }
        Insert: {
          amount?: number | null
          charge_type: string
          charged_at?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description: string
          id?: string
          is_taxable?: boolean
          notes?: string | null
          quantity?: number
          rental_id: string
          status?: string
          unit_amount?: number
          updated_at?: string
        }
        Update: {
          amount?: number | null
          charge_type?: string
          charged_at?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string
          id?: string
          is_taxable?: boolean
          notes?: string | null
          quantity?: number
          rental_id?: string
          status?: string
          unit_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_rental_charges_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_rental_damage_media: {
        Row: {
          caption: string | null
          damage_report_id: string
          display_order: number
          media_id: string
        }
        Insert: {
          caption?: string | null
          damage_report_id: string
          display_order?: number
          media_id: string
        }
        Update: {
          caption?: string | null
          damage_report_id?: string
          display_order?: number
          media_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_rental_damage_media_damage_report_id_fkey"
            columns: ["damage_report_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rental_damage_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_rental_damage_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_rental_damage_reports: {
        Row: {
          actual_cost: number | null
          area: string
          charged_to_customer: boolean
          created_at: string
          created_by: string | null
          currency: string
          description: string
          estimated_cost: number | null
          id: string
          insurance_claim_ref: string | null
          is_pre_existing: boolean
          post_inspection_id: string | null
          pre_inspection_id: string | null
          rental_id: string
          reported_at: string
          resolution_notes: string | null
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          area: string
          charged_to_customer?: boolean
          created_at?: string
          created_by?: string | null
          currency?: string
          description: string
          estimated_cost?: number | null
          id?: string
          insurance_claim_ref?: string | null
          is_pre_existing?: boolean
          post_inspection_id?: string | null
          pre_inspection_id?: string | null
          rental_id: string
          reported_at?: string
          resolution_notes?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          area?: string
          charged_to_customer?: boolean
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string
          estimated_cost?: number | null
          id?: string
          insurance_claim_ref?: string | null
          is_pre_existing?: boolean
          post_inspection_id?: string | null
          pre_inspection_id?: string | null
          rental_id?: string
          reported_at?: string
          resolution_notes?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_rental_damage_reports_post_inspection_id_fkey"
            columns: ["post_inspection_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rental_inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_rental_damage_reports_pre_inspection_id_fkey"
            columns: ["pre_inspection_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rental_inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_rental_damage_reports_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_rental_deposits: {
        Row: {
          amount_received: number
          amount_required: number
          created_at: string
          created_by: string | null
          currency: string
          damage_deduction: number
          fuel_deduction: number
          id: string
          late_return_deduction: number
          method: string | null
          notes: string | null
          other_deduction: number
          other_deduction_note: string | null
          received_at: string | null
          refund_amount: number | null
          refund_reference: string | null
          refund_status: string
          refunded_at: string | null
          rental_id: string
          total_deductions: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount_received?: number
          amount_required?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          damage_deduction?: number
          fuel_deduction?: number
          id?: string
          late_return_deduction?: number
          method?: string | null
          notes?: string | null
          other_deduction?: number
          other_deduction_note?: string | null
          received_at?: string | null
          refund_amount?: number | null
          refund_reference?: string | null
          refund_status?: string
          refunded_at?: string | null
          rental_id: string
          total_deductions?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount_received?: number
          amount_required?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          damage_deduction?: number
          fuel_deduction?: number
          id?: string
          late_return_deduction?: number
          method?: string | null
          notes?: string | null
          other_deduction?: number
          other_deduction_note?: string | null
          received_at?: string | null
          refund_amount?: number | null
          refund_reference?: string | null
          refund_status?: string
          refunded_at?: string | null
          rental_id?: string
          total_deductions?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_rental_deposits_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: true
            referencedRelation: "jemvoyage_rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_rental_extensions: {
        Row: {
          additional_amount: number
          additional_days: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          currency: string
          daily_rate: number
          decline_reason: string | null
          id: string
          new_ends_at: string
          notes: string | null
          paid_at: string | null
          previous_ends_at: string
          rental_id: string
          requested_at: string
          status: string
          updated_at: string
        }
        Insert: {
          additional_amount?: number
          additional_days: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          daily_rate?: number
          decline_reason?: string | null
          id?: string
          new_ends_at: string
          notes?: string | null
          paid_at?: string | null
          previous_ends_at: string
          rental_id: string
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          additional_amount?: number
          additional_days?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          daily_rate?: number
          decline_reason?: string | null
          id?: string
          new_ends_at?: string
          notes?: string | null
          paid_at?: string | null
          previous_ends_at?: string
          rental_id?: string
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_rental_extensions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_rental_extensions_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_rental_inspection_media: {
        Row: {
          angle: string | null
          caption: string | null
          created_at: string
          display_order: number
          inspection_id: string
          media_id: string
        }
        Insert: {
          angle?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number
          inspection_id: string
          media_id: string
        }
        Update: {
          angle?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number
          inspection_id?: string
          media_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_rental_inspection_media_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rental_inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_rental_inspection_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_rental_inspections: {
        Row: {
          created_at: string
          created_by: string | null
          customer_signature_name: string | null
          customer_signed_at: string | null
          documents_present: boolean | null
          existing_damage: string | null
          exterior_notes: string | null
          first_aid_present: boolean | null
          fuel_level: string | null
          id: string
          inspected_at: string
          inspection_type: string
          inspector_id: string | null
          interior_notes: string | null
          jack_present: boolean | null
          mileage_km: number | null
          rental_id: string
          spare_tyre_present: boolean | null
          tools_present: boolean | null
          triangle_present: boolean | null
          tyres_condition: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_signature_name?: string | null
          customer_signed_at?: string | null
          documents_present?: boolean | null
          existing_damage?: string | null
          exterior_notes?: string | null
          first_aid_present?: boolean | null
          fuel_level?: string | null
          id?: string
          inspected_at?: string
          inspection_type: string
          inspector_id?: string | null
          interior_notes?: string | null
          jack_present?: boolean | null
          mileage_km?: number | null
          rental_id: string
          spare_tyre_present?: boolean | null
          tools_present?: boolean | null
          triangle_present?: boolean | null
          tyres_condition?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_signature_name?: string | null
          customer_signed_at?: string | null
          documents_present?: boolean | null
          existing_damage?: string | null
          exterior_notes?: string | null
          first_aid_present?: boolean | null
          fuel_level?: string | null
          id?: string
          inspected_at?: string
          inspection_type?: string
          inspector_id?: string | null
          interior_notes?: string | null
          jack_present?: boolean | null
          mileage_km?: number | null
          rental_id?: string
          spare_tyre_present?: boolean | null
          tools_present?: boolean | null
          triangle_present?: boolean | null
          tyres_condition?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_rental_inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_rental_inspections_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_rentals: {
        Row: {
          amount_paid: number
          availability_id: string | null
          balance_due: number | null
          booking_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string
          daily_rate: number
          deleted_at: string | null
          discount_amount: number
          drive_type: string
          driver_id: string | null
          dropoff_location: string
          end_fuel_level: string | null
          end_mileage_km: number | null
          ends_at: string
          excess_mileage_rate: number | null
          extras_total: number
          id: string
          mileage_allowance_km: number | null
          notes: string | null
          pickup_location: string
          rate_id: string | null
          reference: string
          rental_days: number
          returned_at: string | null
          start_fuel_level: string | null
          start_mileage_km: number | null
          starts_at: string
          status: string
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
          updated_by: string | null
          vehicle_id: string
        }
        Insert: {
          amount_paid?: number
          availability_id?: string | null
          balance_due?: number | null
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id: string
          daily_rate?: number
          deleted_at?: string | null
          discount_amount?: number
          drive_type?: string
          driver_id?: string | null
          dropoff_location: string
          end_fuel_level?: string | null
          end_mileage_km?: number | null
          ends_at: string
          excess_mileage_rate?: number | null
          extras_total?: number
          id?: string
          mileage_allowance_km?: number | null
          notes?: string | null
          pickup_location: string
          rate_id?: string | null
          reference?: string
          rental_days?: number
          returned_at?: string | null
          start_fuel_level?: string | null
          start_mileage_km?: number | null
          starts_at: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          updated_by?: string | null
          vehicle_id: string
        }
        Update: {
          amount_paid?: number
          availability_id?: string | null
          balance_due?: number | null
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string
          daily_rate?: number
          deleted_at?: string | null
          discount_amount?: number
          drive_type?: string
          driver_id?: string | null
          dropoff_location?: string
          end_fuel_level?: string | null
          end_mileage_km?: number | null
          ends_at?: string
          excess_mileage_rate?: number | null
          extras_total?: number
          id?: string
          mileage_allowance_km?: number | null
          notes?: string | null
          pickup_location?: string
          rate_id?: string | null
          reference?: string
          rental_days?: number
          returned_at?: string | null
          start_fuel_level?: string | null
          start_mileage_km?: number | null
          starts_at?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          updated_by?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_rentals_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicle_availability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_rentals_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_rentals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_rentals_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_rentals_rate_id_fkey"
            columns: ["rate_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicle_rates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_rentals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_reviews: {
        Row: {
          author_country: string | null
          author_name: string
          body: string
          booking_id: string | null
          created_at: string
          customer_id: string | null
          deleted_at: string | null
          destination_id: string | null
          driver_id: string | null
          guide_id: string | null
          id: string
          is_featured: boolean
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          rating_accommodation: number | null
          rating_communication: number | null
          rating_driver: number | null
          rating_guide: number | null
          rating_overall: number
          rating_tour: number | null
          rating_vehicle: number | null
          rental_id: string | null
          response_at: string | null
          response_body: string | null
          status: string
          title: string | null
          tour_id: string | null
          travelled_on: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          author_country?: string | null
          author_name: string
          body: string
          booking_id?: string | null
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          destination_id?: string | null
          driver_id?: string | null
          guide_id?: string | null
          id?: string
          is_featured?: boolean
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          rating_accommodation?: number | null
          rating_communication?: number | null
          rating_driver?: number | null
          rating_guide?: number | null
          rating_overall: number
          rating_tour?: number | null
          rating_vehicle?: number | null
          rental_id?: string | null
          response_at?: string | null
          response_body?: string | null
          status?: string
          title?: string | null
          tour_id?: string | null
          travelled_on?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          author_country?: string | null
          author_name?: string
          body?: string
          booking_id?: string | null
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          destination_id?: string | null
          driver_id?: string | null
          guide_id?: string | null
          id?: string
          is_featured?: boolean
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          rating_accommodation?: number | null
          rating_communication?: number | null
          rating_driver?: number | null
          rating_guide?: number | null
          rating_overall?: number
          rating_tour?: number | null
          rating_vehicle?: number | null
          rental_id?: string | null
          response_at?: string | null
          response_body?: string | null
          status?: string
          title?: string | null
          tour_id?: string | null
          travelled_on?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_reviews_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_reviews_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_reviews_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_reviews_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_reviews_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_reviews_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_reviews_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_roles: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_staff: boolean
          is_system: boolean
          label: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_staff?: boolean
          is_system?: boolean
          label: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_staff?: boolean
          is_system?: boolean
          label?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      jemvoyage_sales_activities: {
        Row: {
          activity_type: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          customer_id: string | null
          due_at: string | null
          id: string
          lead_id: string | null
          notes: string | null
          outcome: string | null
          owner_id: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          activity_type: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          outcome?: string | null
          owner_id?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          activity_type?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          outcome?: string | null
          owner_id?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_sales_activities_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_sales_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_sales_activities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_seo_metadata: {
        Row: {
          canonical_url: string | null
          created_at: string
          created_by: string | null
          entity_id: string | null
          entity_type: string
          id: string
          keywords: string[]
          meta_description: string | null
          og_description: string | null
          og_media_id: string | null
          og_title: string | null
          path: string | null
          robots: string
          schema_json: Json | null
          schema_type: string | null
          seo_title: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          keywords?: string[]
          meta_description?: string | null
          og_description?: string | null
          og_media_id?: string | null
          og_title?: string | null
          path?: string | null
          robots?: string
          schema_json?: Json | null
          schema_type?: string | null
          seo_title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          keywords?: string[]
          meta_description?: string | null
          og_description?: string | null
          og_media_id?: string | null
          og_title?: string | null
          path?: string | null
          robots?: string
          schema_json?: Json | null
          schema_type?: string | null
          seo_title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_seo_metadata_og_media_id_fkey"
            columns: ["og_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_settings: {
        Row: {
          description: string | null
          group_name: string
          is_public: boolean
          key: string
          label: string | null
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          group_name?: string
          is_public?: boolean
          key: string
          label?: string | null
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          description?: string | null
          group_name?: string
          is_public?: boolean
          key?: string
          label?: string | null
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      jemvoyage_supplier_contracts: {
        Row: {
          cancellation_terms: string | null
          commission_rate: number | null
          created_at: string
          created_by: string | null
          document_media_id: string | null
          ends_on: string | null
          id: string
          notes: string | null
          payment_terms: string | null
          reference: string | null
          starts_on: string
          status: string
          supplier_id: string
          title: string
          updated_at: string
        }
        Insert: {
          cancellation_terms?: string | null
          commission_rate?: number | null
          created_at?: string
          created_by?: string | null
          document_media_id?: string | null
          ends_on?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          reference?: string | null
          starts_on: string
          status?: string
          supplier_id: string
          title: string
          updated_at?: string
        }
        Update: {
          cancellation_terms?: string | null
          commission_rate?: number | null
          created_at?: string
          created_by?: string | null
          document_media_id?: string | null
          ends_on?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          reference?: string | null
          starts_on?: string
          status?: string
          supplier_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_supplier_contracts_document_media_id_fkey"
            columns: ["document_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_supplier_contracts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_supplier_rates: {
        Row: {
          created_at: string
          currency: string
          id: string
          is_active: boolean
          meal_plan: string | null
          min_nights: number | null
          name: string
          net_rate: number
          notes: string | null
          occupancy: string | null
          published_rate: number | null
          rate_type: string
          season: string | null
          supplier_id: string
          updated_at: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          meal_plan?: string | null
          min_nights?: number | null
          name: string
          net_rate: number
          notes?: string | null
          occupancy?: string | null
          published_rate?: number | null
          rate_type?: string
          season?: string | null
          supplier_id: string
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          meal_plan?: string | null
          min_nights?: number | null
          name?: string
          net_rate?: number
          notes?: string | null
          occupancy?: string | null
          published_rate?: number | null
          rate_type?: string
          season?: string | null
          supplier_id?: string
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_supplier_rates_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_suppliers: {
        Row: {
          address: string | null
          city: string | null
          commission_rate: number | null
          contact_name: string | null
          country: string
          created_at: string
          created_by: string | null
          currency: string
          deleted_at: string | null
          destination_id: string | null
          email: string | null
          id: string
          is_active: boolean
          is_preferred: boolean
          media_id: string | null
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          rating: number | null
          slug: string
          supplier_type: string
          tax_pin: string | null
          updated_at: string
          updated_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          commission_rate?: number | null
          contact_name?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          destination_id?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_preferred?: boolean
          media_id?: string | null
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          rating?: number | null
          slug: string
          supplier_type: string
          tax_pin?: string | null
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          commission_rate?: number | null
          contact_name?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          destination_id?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_preferred?: boolean
          media_id?: string | null
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          rating?: number | null
          slug?: string
          supplier_type?: string
          tax_pin?: string | null
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_suppliers_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_suppliers_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_tour_activities: {
        Row: {
          activity_id: string
          tour_id: string
        }
        Insert: {
          activity_id: string
          tour_id: string
        }
        Update: {
          activity_id?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_tour_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_tour_activities_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_tours"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_tour_availability: {
        Row: {
          capacity: number
          created_at: string
          currency: string | null
          end_date: string
          id: string
          notes: string | null
          price_override: number | null
          seats_booked: number
          start_date: string
          status: string
          tour_id: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          currency?: string | null
          end_date: string
          id?: string
          notes?: string | null
          price_override?: number | null
          seats_booked?: number
          start_date: string
          status?: string
          tour_id: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          currency?: string | null
          end_date?: string
          id?: string
          notes?: string | null
          price_override?: number | null
          seats_booked?: number
          start_date?: string
          status?: string
          tour_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_tour_availability_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_tours"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_tour_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          media_id: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          media_id?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          media_id?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_tour_categories_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_tour_destinations: {
        Row: {
          destination_id: string
          display_order: number
          tour_id: string
        }
        Insert: {
          destination_id: string
          display_order?: number
          tour_id: string
        }
        Update: {
          destination_id?: string
          display_order?: number
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_tour_destinations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_tour_destinations_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_tours"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_tour_itineraries: {
        Row: {
          accommodation: string | null
          created_at: string
          day_number: number
          description: string | null
          destination_id: string | null
          distance_km: number | null
          driving_time_minutes: number | null
          id: string
          meals: string | null
          media_id: string | null
          overnight_location: string | null
          title: string
          tour_id: string
          updated_at: string
        }
        Insert: {
          accommodation?: string | null
          created_at?: string
          day_number: number
          description?: string | null
          destination_id?: string | null
          distance_km?: number | null
          driving_time_minutes?: number | null
          id?: string
          meals?: string | null
          media_id?: string | null
          overnight_location?: string | null
          title: string
          tour_id: string
          updated_at?: string
        }
        Update: {
          accommodation?: string | null
          created_at?: string
          day_number?: number
          description?: string | null
          destination_id?: string | null
          distance_km?: number | null
          driving_time_minutes?: number | null
          id?: string
          meals?: string | null
          media_id?: string | null
          overnight_location?: string | null
          title?: string
          tour_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_tour_itineraries_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_tour_itineraries_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_tour_itineraries_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_tours"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_tour_media: {
        Row: {
          created_at: string
          display_order: number
          media_id: string
          tour_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          media_id: string
          tour_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          media_id?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_tour_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_tour_media_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_tours"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_tours: {
        Row: {
          accommodation_summary: string | null
          best_months: number[]
          category_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          deleted_at: string | null
          description: string | null
          difficulty: string | null
          display_order: number
          duration_days: number
          duration_nights: number
          exclusions: string[]
          id: string
          inclusions: string[]
          is_featured: boolean
          is_private: boolean
          map_media_id: string | null
          max_travellers: number | null
          meals_summary: string | null
          min_travellers: number
          price_basis: string
          price_from: number | null
          primary_destination_id: string | null
          primary_media_id: string | null
          published_at: string | null
          slug: string
          social_media_id: string | null
          status: string
          subtitle: string | null
          summary: string | null
          thumbnail_media_id: string | null
          title: string
          transport_summary: string | null
          updated_at: string
          updated_by: string | null
          video_url: string | null
        }
        Insert: {
          accommodation_summary?: string | null
          best_months?: number[]
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          description?: string | null
          difficulty?: string | null
          display_order?: number
          duration_days?: number
          duration_nights?: number
          exclusions?: string[]
          id?: string
          inclusions?: string[]
          is_featured?: boolean
          is_private?: boolean
          map_media_id?: string | null
          max_travellers?: number | null
          meals_summary?: string | null
          min_travellers?: number
          price_basis?: string
          price_from?: number | null
          primary_destination_id?: string | null
          primary_media_id?: string | null
          published_at?: string | null
          slug: string
          social_media_id?: string | null
          status?: string
          subtitle?: string | null
          summary?: string | null
          thumbnail_media_id?: string | null
          title: string
          transport_summary?: string | null
          updated_at?: string
          updated_by?: string | null
          video_url?: string | null
        }
        Update: {
          accommodation_summary?: string | null
          best_months?: number[]
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          description?: string | null
          difficulty?: string | null
          display_order?: number
          duration_days?: number
          duration_nights?: number
          exclusions?: string[]
          id?: string
          inclusions?: string[]
          is_featured?: boolean
          is_private?: boolean
          map_media_id?: string | null
          max_travellers?: number | null
          meals_summary?: string | null
          min_travellers?: number
          price_basis?: string
          price_from?: number | null
          primary_destination_id?: string | null
          primary_media_id?: string | null
          published_at?: string | null
          slug?: string
          social_media_id?: string | null
          status?: string
          subtitle?: string | null
          summary?: string | null
          thumbnail_media_id?: string | null
          title?: string
          transport_summary?: string | null
          updated_at?: string
          updated_by?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_tours_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_tour_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_tours_map_media_id_fkey"
            columns: ["map_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_tours_primary_destination_id_fkey"
            columns: ["primary_destination_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_tours_primary_media_id_fkey"
            columns: ["primary_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_tours_social_media_id_fkey"
            columns: ["social_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_tours_thumbnail_media_id_fkey"
            columns: ["thumbnail_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_transfers: {
        Row: {
          airport_code: string | null
          arrived_at: string | null
          booking_id: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string | null
          driver_assigned_at: string | null
          driver_id: string | null
          dropoff_location: string
          en_route_at: string | null
          flight_number: string | null
          flight_scheduled_at: string | null
          id: string
          instructions: string | null
          luggage_count: number | null
          meet_and_greet: boolean
          name_board_text: string | null
          passengers: number
          picked_up_at: string | null
          pickup_location: string
          price: number | null
          reference: string
          scheduled_at: string
          status: string
          terminal: string | null
          transfer_type: string
          updated_at: string
          updated_by: string | null
          vehicle_id: string | null
        }
        Insert: {
          airport_code?: string | null
          arrived_at?: string | null
          booking_id?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          driver_assigned_at?: string | null
          driver_id?: string | null
          dropoff_location: string
          en_route_at?: string | null
          flight_number?: string | null
          flight_scheduled_at?: string | null
          id?: string
          instructions?: string | null
          luggage_count?: number | null
          meet_and_greet?: boolean
          name_board_text?: string | null
          passengers?: number
          picked_up_at?: string | null
          pickup_location: string
          price?: number | null
          reference?: string
          scheduled_at: string
          status?: string
          terminal?: string | null
          transfer_type?: string
          updated_at?: string
          updated_by?: string | null
          vehicle_id?: string | null
        }
        Update: {
          airport_code?: string | null
          arrived_at?: string | null
          booking_id?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          driver_assigned_at?: string | null
          driver_id?: string | null
          dropoff_location?: string
          en_route_at?: string | null
          flight_number?: string | null
          flight_scheduled_at?: string | null
          id?: string
          instructions?: string | null
          luggage_count?: number | null
          meet_and_greet?: boolean
          name_board_text?: string | null
          passengers?: number
          picked_up_at?: string | null
          pickup_location?: string
          price?: number | null
          reference?: string
          scheduled_at?: string
          status?: string
          terminal?: string | null
          transfer_type?: string
          updated_at?: string
          updated_by?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_transfers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_transfers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_transfers_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_transfers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_travel_agents: {
        Row: {
          address: string | null
          agency_name: string
          approved_at: string | null
          approved_by: string | null
          city: string | null
          commission_rate: number
          contact_name: string | null
          country: string | null
          created_at: string
          created_by: string | null
          credit_limit: number
          credit_terms_days: number
          current_balance: number
          deleted_at: string | null
          email: string
          iata_number: string | null
          id: string
          net_rates_enabled: boolean
          notes: string | null
          phone: string | null
          reference: string
          status: string
          tax_pin: string | null
          updated_at: string
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          agency_name: string
          approved_at?: string | null
          approved_by?: string | null
          city?: string | null
          commission_rate?: number
          contact_name?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          credit_limit?: number
          credit_terms_days?: number
          current_balance?: number
          deleted_at?: string | null
          email: string
          iata_number?: string | null
          id?: string
          net_rates_enabled?: boolean
          notes?: string | null
          phone?: string | null
          reference?: string
          status?: string
          tax_pin?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          agency_name?: string
          approved_at?: string | null
          approved_by?: string | null
          city?: string | null
          commission_rate?: number
          contact_name?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          credit_limit?: number
          credit_terms_days?: number
          current_balance?: number
          deleted_at?: string | null
          email?: string
          iata_number?: string | null
          id?: string
          net_rates_enabled?: boolean
          notes?: string | null
          phone?: string | null
          reference?: string
          status?: string
          tax_pin?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_travel_agents_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_travel_agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_travellers: {
        Row: {
          booking_id: string
          created_at: string
          date_of_birth: string | null
          dietary_requirements: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          id: string
          is_lead: boolean
          medical_notes: string | null
          nationality: string | null
          passport_expires_on: string | null
          passport_number: string | null
          phone: string | null
          traveller_type: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          date_of_birth?: string | null
          dietary_requirements?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          id?: string
          is_lead?: boolean
          medical_notes?: string | null
          nationality?: string | null
          passport_expires_on?: string | null
          passport_number?: string | null
          phone?: string | null
          traveller_type?: string
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          date_of_birth?: string | null
          dietary_requirements?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          id?: string
          is_lead?: boolean
          medical_notes?: string | null
          nationality?: string | null
          passport_expires_on?: string | null
          passport_number?: string | null
          phone?: string | null
          traveller_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_travellers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_users"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_users: {
        Row: {
          avatar_media_id: string | null
          bio: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          job_title: string | null
          last_seen_at: string | null
          locale: string
          phone: string | null
          timezone: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          avatar_media_id?: string | null
          bio?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name: string
          id: string
          is_active?: boolean
          job_title?: string | null
          last_seen_at?: string | null
          locale?: string
          phone?: string | null
          timezone?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          avatar_media_id?: string | null
          bio?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          job_title?: string | null
          last_seen_at?: string | null
          locale?: string
          phone?: string | null
          timezone?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_users_avatar_media_fk"
            columns: ["avatar_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_vehicle_availability: {
        Row: {
          created_at: string
          created_by: string | null
          hold_type: string
          id: string
          notes: string | null
          period: unknown
          reference_id: string | null
          status: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          hold_type: string
          id?: string
          notes?: string | null
          period: unknown
          reference_id?: string | null
          status?: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          hold_type?: string
          id?: string
          notes?: string | null
          period?: unknown
          reference_id?: string | null
          status?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_vehicle_availability_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_vehicle_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          is_four_wheel: boolean
          media_id: string | null
          name: string
          slug: string
          typical_seats: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          is_four_wheel?: boolean
          media_id?: string | null
          name: string
          slug: string
          typical_seats?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          is_four_wheel?: boolean
          media_id?: string | null
          name?: string
          slug?: string
          typical_seats?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_vehicle_categories_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_vehicle_documents: {
        Row: {
          created_at: string
          document_type: string
          expires_on: string | null
          id: string
          issued_on: string | null
          media_id: string | null
          notes: string | null
          reference: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          document_type: string
          expires_on?: string | null
          id?: string
          issued_on?: string | null
          media_id?: string | null
          notes?: string | null
          reference?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          expires_on?: string | null
          id?: string
          issued_on?: string | null
          media_id?: string | null
          notes?: string | null
          reference?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_vehicle_documents_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_vehicle_documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_vehicle_feature_map: {
        Row: {
          feature_id: string
          vehicle_id: string
        }
        Insert: {
          feature_id: string
          vehicle_id: string
        }
        Update: {
          feature_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_vehicle_feature_map_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicle_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_vehicle_feature_map_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_vehicle_features: {
        Row: {
          created_at: string
          display_order: number
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      jemvoyage_vehicle_images: {
        Row: {
          angle: string | null
          created_at: string
          display_order: number
          id: string
          media_id: string
          vehicle_id: string
        }
        Insert: {
          angle?: string | null
          created_at?: string
          display_order?: number
          id?: string
          media_id: string
          vehicle_id: string
        }
        Update: {
          angle?: string | null
          created_at?: string
          display_order?: number
          id?: string
          media_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_vehicle_images_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_vehicle_rates: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          daily_mileage_km: number | null
          daily_rate: number | null
          drive_type: string
          driver_daily_fee: number | null
          excess_mileage_rate: number | null
          id: string
          is_active: boolean
          monthly_rate: number | null
          security_deposit: number | null
          updated_at: string
          updated_by: string | null
          valid_from: string | null
          valid_to: string | null
          vehicle_id: string | null
          weekly_rate: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          daily_mileage_km?: number | null
          daily_rate?: number | null
          drive_type?: string
          driver_daily_fee?: number | null
          excess_mileage_rate?: number | null
          id?: string
          is_active?: boolean
          monthly_rate?: number | null
          security_deposit?: number | null
          updated_at?: string
          updated_by?: string | null
          valid_from?: string | null
          valid_to?: string | null
          vehicle_id?: string | null
          weekly_rate?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          daily_mileage_km?: number | null
          daily_rate?: number | null
          drive_type?: string
          driver_daily_fee?: number | null
          excess_mileage_rate?: number | null
          id?: string
          is_active?: boolean
          monthly_rate?: number | null
          security_deposit?: number | null
          updated_at?: string
          updated_by?: string | null
          valid_from?: string | null
          valid_to?: string | null
          vehicle_id?: string | null
          weekly_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_vehicle_rates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicle_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_vehicle_rates_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      jemvoyage_vehicles: {
        Row: {
          category_id: string | null
          colour: string | null
          created_at: string
          created_by: string | null
          current_mileage_km: number
          deleted_at: string | null
          description: string | null
          display_order: number
          fuel_type: string
          has_gps: boolean
          home_location: string | null
          id: string
          is_four_wheel: boolean
          is_published: boolean
          luggage_capacity: number | null
          make: string
          model: string
          primary_media_id: string | null
          purchase_date: string | null
          purchase_value: number | null
          registration: string
          rental_terms: string | null
          seats: number
          slug: string
          status: string
          supports_chauffeur: boolean
          supports_self_drive: boolean
          transmission: string
          updated_at: string
          updated_by: string | null
          vin: string | null
          year: number | null
        }
        Insert: {
          category_id?: string | null
          colour?: string | null
          created_at?: string
          created_by?: string | null
          current_mileage_km?: number
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          fuel_type?: string
          has_gps?: boolean
          home_location?: string | null
          id?: string
          is_four_wheel?: boolean
          is_published?: boolean
          luggage_capacity?: number | null
          make: string
          model: string
          primary_media_id?: string | null
          purchase_date?: string | null
          purchase_value?: number | null
          registration: string
          rental_terms?: string | null
          seats?: number
          slug: string
          status?: string
          supports_chauffeur?: boolean
          supports_self_drive?: boolean
          transmission?: string
          updated_at?: string
          updated_by?: string | null
          vin?: string | null
          year?: number | null
        }
        Update: {
          category_id?: string | null
          colour?: string | null
          created_at?: string
          created_by?: string | null
          current_mileage_km?: number
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          fuel_type?: string
          has_gps?: boolean
          home_location?: string | null
          id?: string
          is_four_wheel?: boolean
          is_published?: boolean
          luggage_capacity?: number | null
          make?: string
          model?: string
          primary_media_id?: string | null
          purchase_date?: string | null
          purchase_value?: number | null
          registration?: string
          rental_terms?: string | null
          seats?: number
          slug?: string
          status?: string
          supports_chauffeur?: boolean
          supports_self_drive?: boolean
          transmission?: string
          updated_at?: string
          updated_by?: string | null
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jemvoyage_vehicles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_vehicle_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jemvoyage_vehicles_primary_media_id_fkey"
            columns: ["primary_media_id"]
            isOneToOne: false
            referencedRelation: "jemvoyage_media"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          after: Json | null
          before: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Relationships: []
      }
      kida_contact_submissions: {
        Row: {
          created_at: string
          email: string
          full_name: string
          handled_by: string | null
          id: string
          message: string
          phone: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          handled_by?: string | null
          id?: string
          message: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          handled_by?: string | null
          id?: string
          message?: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      kida_event_registrations: {
        Row: {
          checked_in_at: string | null
          created_at: string
          event_id: string
          guests_count: number
          id: string
          notes: string | null
          qr_code: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          checked_in_at?: string | null
          created_at?: string
          event_id: string
          guests_count?: number
          id?: string
          notes?: string | null
          qr_code?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          checked_in_at?: string | null
          created_at?: string
          event_id?: string
          guests_count?: number
          id?: string
          notes?: string | null
          qr_code?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kida_event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "kida_events"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_events: {
        Row: {
          address: string | null
          capacity: number | null
          category: string
          content: Json
          country: string | null
          county: string | null
          cover_media_id: string | null
          created_at: string
          currency: string
          deleted_at: string | null
          description: string | null
          end_at: string | null
          id: string
          is_virtual: boolean
          location_name: string | null
          organizer_id: string | null
          registration_deadline: string | null
          requires_registration: boolean
          slug: string
          start_at: string
          status: string
          ticket_price: number
          timezone: string
          title: string
          updated_at: string
          virtual_link: string | null
        }
        Insert: {
          address?: string | null
          capacity?: number | null
          category?: string
          content?: Json
          country?: string | null
          county?: string | null
          cover_media_id?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          description?: string | null
          end_at?: string | null
          id?: string
          is_virtual?: boolean
          location_name?: string | null
          organizer_id?: string | null
          registration_deadline?: string | null
          requires_registration?: boolean
          slug: string
          start_at: string
          status?: string
          ticket_price?: number
          timezone?: string
          title: string
          updated_at?: string
          virtual_link?: string | null
        }
        Update: {
          address?: string | null
          capacity?: number | null
          category?: string
          content?: Json
          country?: string | null
          county?: string | null
          cover_media_id?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          description?: string | null
          end_at?: string | null
          id?: string
          is_virtual?: boolean
          location_name?: string | null
          organizer_id?: string | null
          registration_deadline?: string | null
          requires_registration?: boolean
          slug?: string
          start_at?: string
          status?: string
          ticket_price?: number
          timezone?: string
          title?: string
          updated_at?: string
          virtual_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kida_events_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "kida_media"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          deleted_at: string | null
          id: string
          question: string
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          question: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          question?: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      kida_featured_alumni: {
        Row: {
          bio: string | null
          created_at: string
          deleted_at: string | null
          full_name: string
          id: string
          linkedin_url: string | null
          photo_media_id: string | null
          role_title: string
          sort_order: number
          status: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          full_name: string
          id?: string
          linkedin_url?: string | null
          photo_media_id?: string | null
          role_title: string
          sort_order?: number
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          full_name?: string
          id?: string
          linkedin_url?: string | null
          photo_media_id?: string | null
          role_title?: string
          sort_order?: number
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kida_featured_alumni_photo_media_id_fkey"
            columns: ["photo_media_id"]
            isOneToOne: false
            referencedRelation: "kida_media"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_gallery_albums: {
        Row: {
          cover_media_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          event_id: string | null
          id: string
          slug: string
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_media_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          event_id?: string | null
          id?: string
          slug: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_media_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          event_id?: string | null
          id?: string
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kida_gallery_albums_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "kida_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kida_gallery_albums_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "kida_events"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_gallery_items: {
        Row: {
          album_id: string
          caption: string | null
          created_at: string
          id: string
          media_id: string
          sort_order: number
        }
        Insert: {
          album_id: string
          caption?: string | null
          created_at?: string
          id?: string
          media_id: string
          sort_order?: number
        }
        Update: {
          album_id?: string
          caption?: string | null
          created_at?: string
          id?: string
          media_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "kida_gallery_items_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "kida_gallery_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kida_gallery_items_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "kida_media"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_leadership: {
        Row: {
          bio: string | null
          category: string
          county: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          full_name: string
          id: string
          linkedin_url: string | null
          photo_media_id: string | null
          sort_order: number
          status: string
          term_end: string | null
          term_start: string | null
          title: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          category?: string
          county?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          linkedin_url?: string | null
          photo_media_id?: string | null
          sort_order?: number
          status?: string
          term_end?: string | null
          term_start?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          category?: string
          county?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          linkedin_url?: string | null
          photo_media_id?: string | null
          sort_order?: number
          status?: string
          term_end?: string | null
          term_start?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kida_leadership_photo_media_id_fkey"
            columns: ["photo_media_id"]
            isOneToOne: false
            referencedRelation: "kida_media"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_media: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          deleted_at: string | null
          folder: string
          height: number | null
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          type: string
          updated_at: string
          uploaded_by: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          deleted_at?: string | null
          folder?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          type?: string
          updated_at?: string
          uploaded_by?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          deleted_at?: string | null
          folder?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          type?: string
          updated_at?: string
          uploaded_by?: string | null
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      kida_menu_items: {
        Row: {
          created_at: string
          id: string
          label: string
          menu_id: string
          open_in_new_tab: boolean
          page_id: string | null
          parent_id: string | null
          sort_order: number
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          menu_id: string
          open_in_new_tab?: boolean
          page_id?: string | null
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          menu_id?: string
          open_in_new_tab?: boolean
          page_id?: string | null
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kida_menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "kida_menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kida_menu_items_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "kida_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kida_menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "kida_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_menus: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      kida_news: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: Json
          cover_media_id: string | null
          created_at: string
          deleted_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          tags: string[]
          title: string
          type: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content?: Json
          cover_media_id?: string | null
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[]
          title: string
          type?: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: Json
          cover_media_id?: string | null
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          type?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "kida_news_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "kida_news_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kida_news_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "kida_media"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_news_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      kida_newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          source: string | null
          status: string
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      kida_pages: {
        Row: {
          author_id: string | null
          content: Json
          created_at: string
          deleted_at: string | null
          excerpt: string | null
          id: string
          parent_id: string | null
          published_at: string | null
          slug: string
          sort_order: number
          status: string
          template: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content?: Json
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          parent_id?: string | null
          published_at?: string | null
          slug: string
          sort_order?: number
          status?: string
          template?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: Json
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          parent_id?: string | null
          published_at?: string | null
          slug?: string
          sort_order?: number
          status?: string
          template?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kida_pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "kida_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_partners: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          logo_media_id: string | null
          name: string
          sort_order: number
          status: string
          tier: string | null
          type: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          logo_media_id?: string | null
          name: string
          sort_order?: number
          status?: string
          tier?: string | null
          type?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          logo_media_id?: string | null
          name?: string
          sort_order?: number
          status?: string
          tier?: string | null
          type?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kida_partners_logo_media_id_fkey"
            columns: ["logo_media_id"]
            isOneToOne: false
            referencedRelation: "kida_media"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_permissions: {
        Row: {
          category: string
          created_at: string
          id: string
          label: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          label: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          label?: string
          name?: string
        }
        Relationships: []
      }
      kida_profiles: {
        Row: {
          admission_number: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string
          county: string | null
          cover_photo_url: string | null
          created_at: string
          cv_url: string | null
          date_of_birth: string | null
          deleted_at: string | null
          employer: string | null
          full_name: string
          gender: string | null
          github_url: string | null
          graduation_year: number | null
          id: string
          industry: string | null
          interests: string[]
          is_mentor_available: boolean
          is_volunteer_available: boolean
          last_active_at: string | null
          linkedin_url: string | null
          membership_status: string
          phone: string | null
          preferred_name: string | null
          profession: string | null
          skills: string[]
          updated_at: string
          verified_at: string | null
          verified_by: string | null
          visibility: string
          website_url: string | null
        }
        Insert: {
          admission_number?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string
          county?: string | null
          cover_photo_url?: string | null
          created_at?: string
          cv_url?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          employer?: string | null
          full_name: string
          gender?: string | null
          github_url?: string | null
          graduation_year?: number | null
          id: string
          industry?: string | null
          interests?: string[]
          is_mentor_available?: boolean
          is_volunteer_available?: boolean
          last_active_at?: string | null
          linkedin_url?: string | null
          membership_status?: string
          phone?: string | null
          preferred_name?: string | null
          profession?: string | null
          skills?: string[]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          visibility?: string
          website_url?: string | null
        }
        Update: {
          admission_number?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string
          county?: string | null
          cover_photo_url?: string | null
          created_at?: string
          cv_url?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          employer?: string | null
          full_name?: string
          gender?: string | null
          github_url?: string | null
          graduation_year?: number | null
          id?: string
          industry?: string | null
          interests?: string[]
          is_mentor_available?: boolean
          is_volunteer_available?: boolean
          last_active_at?: string | null
          linkedin_url?: string | null
          membership_status?: string
          phone?: string | null
          preferred_name?: string | null
          profession?: string | null
          skills?: string[]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          visibility?: string
          website_url?: string | null
        }
        Relationships: []
      }
      kida_role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kida_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "kida_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kida_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "kida_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_roles: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_system: boolean
          label: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean
          label: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean
          label?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      kida_seo: {
        Row: {
          canonical_url: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          meta_description: string | null
          meta_title: string | null
          no_index: boolean
          og_image_url: string | null
          structured_data: Json | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          no_index?: boolean
          og_image_url?: string | null
          structured_data?: Json | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          no_index?: boolean
          og_image_url?: string | null
          structured_data?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      kida_settings: {
        Row: {
          group: string
          key: string
          label: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          group?: string
          key: string
          label: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          group?: string
          key?: string
          label?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      kida_testimonials: {
        Row: {
          author_name: string
          author_photo_media_id: string | null
          author_title: string | null
          created_at: string
          deleted_at: string | null
          id: string
          is_featured: boolean
          quote: string
          rating: number | null
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          author_name: string
          author_photo_media_id?: string | null
          author_title?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_featured?: boolean
          quote: string
          rating?: number | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_photo_media_id?: string | null
          author_title?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_featured?: boolean
          quote?: string
          rating?: number | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kida_testimonials_author_photo_media_id_fkey"
            columns: ["author_photo_media_id"]
            isOneToOne: false
            referencedRelation: "kida_media"
            referencedColumns: ["id"]
          },
        ]
      }
      kida_timeline_milestones: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string
          id: string
          sort_order: number
          status: string
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description: string
          id?: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string
          id?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      kida_user_roles: {
        Row: {
          assigned_by: string | null
          created_at: string
          deleted_at: string | null
          id: string
          role_id: string
          scope: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          role_id: string
          scope?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          role_id?: string
          scope?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kida_user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "kida_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_announcements: {
        Row: {
          announcement_type: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          ends_at: string | null
          id: string
          link_url: string | null
          message: string
          starts_at: string | null
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          announcement_type?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          ends_at?: string | null
          id?: string
          link_url?: string | null
          message: string
          starts_at?: string | null
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          announcement_type?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          ends_at?: string | null
          id?: string
          link_url?: string | null
          message?: string
          starts_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      margaret_appointments: {
        Row: {
          created_at: string
          date_of_birth: string | null
          deleted_at: string | null
          department_id: string | null
          doctor_id: string | null
          gender: string | null
          id: string
          insurance_provider: string | null
          is_insured: boolean
          notes: string | null
          patient_email: string | null
          patient_name: string
          patient_phone: string
          preferred_date: string
          preferred_time: string | null
          reason: string | null
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          deleted_at?: string | null
          department_id?: string | null
          doctor_id?: string | null
          gender?: string | null
          id?: string
          insurance_provider?: string | null
          is_insured?: boolean
          notes?: string | null
          patient_email?: string | null
          patient_name: string
          patient_phone: string
          preferred_date: string
          preferred_time?: string | null
          reason?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          deleted_at?: string | null
          department_id?: string | null
          doctor_id?: string | null
          gender?: string | null
          id?: string
          insurance_provider?: string | null
          is_insured?: boolean
          notes?: string | null
          patient_email?: string | null
          patient_name?: string
          patient_phone?: string
          preferred_date?: string
          preferred_time?: string | null
          reason?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_appointments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "margaret_appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "margaret_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      margaret_awards: {
        Row: {
          awarded_year: number | null
          awarding_body: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          department_id: string | null
          description: string | null
          doctor_id: string | null
          id: string
          image_url: string | null
          sort_order: number
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          awarded_year?: number | null
          awarding_body?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          doctor_id?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          awarded_year?: number | null
          awarding_body?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          doctor_id?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_awards_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "margaret_awards_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "margaret_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_bid_documents: {
        Row: {
          bid_id: string
          created_at: string
          file_url: string
          id: string
          title: string
        }
        Insert: {
          bid_id: string
          created_at?: string
          file_url: string
          id?: string
          title: string
        }
        Update: {
          bid_id?: string
          created_at?: string
          file_url?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_bid_documents_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "margaret_bids"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_bids: {
        Row: {
          bid_amount: number | null
          financial_score: number | null
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
          supplier_id: string
          technical_score: number | null
          tender_id: string
        }
        Insert: {
          bid_amount?: number | null
          financial_score?: number | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          supplier_id: string
          technical_score?: number | null
          tender_id: string
        }
        Update: {
          bid_amount?: number | null
          financial_score?: number | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          supplier_id?: string
          technical_score?: number | null
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_bids_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "margaret_suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "margaret_bids_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "margaret_tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_clinical_trials: {
        Row: {
          condition_studied: string | null
          contact_email: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          department_id: string | null
          description: string | null
          eligibility_criteria: string | null
          ends_at: string | null
          ethics_approval_number: string | null
          id: string
          principal_investigator: string | null
          slug: string
          starts_at: string | null
          status: string
          title: string
          trial_phase: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          condition_studied?: string | null
          contact_email?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          ends_at?: string | null
          ethics_approval_number?: string | null
          id?: string
          principal_investigator?: string | null
          slug: string
          starts_at?: string | null
          status?: string
          title: string
          trial_phase?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          condition_studied?: string | null
          contact_email?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          ends_at?: string | null
          ethics_approval_number?: string | null
          id?: string
          principal_investigator?: string | null
          slug?: string
          starts_at?: string | null
          status?: string
          title?: string
          trial_phase?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_clinical_trials_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_clinics: {
        Row: {
          banner_image_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          department_id: string | null
          description: string | null
          id: string
          name: string
          operating_hours: Json
          seo_description: string | null
          seo_title: string | null
          services: string[]
          slug: string
          sort_order: number
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          banner_image_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          name: string
          operating_hours?: Json
          seo_description?: string | null
          seo_title?: string | null
          services?: string[]
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          banner_image_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          name?: string
          operating_hours?: Json
          seo_description?: string | null
          seo_title?: string | null
          services?: string[]
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_clinics_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_contacts: {
        Row: {
          alternate_phone: string | null
          contact_type: string
          created_at: string
          department_id: string | null
          email: string | null
          id: string
          location: string | null
          name: string
          phone: string | null
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          alternate_phone?: string | null
          contact_type?: string
          created_at?: string
          department_id?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name: string
          phone?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          alternate_phone?: string | null
          contact_type?: string
          created_at?: string
          department_id?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_contacts_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_department_doctors: {
        Row: {
          created_at: string
          department_id: string
          doctor_id: string
          id: string
        }
        Insert: {
          created_at?: string
          department_id: string
          doctor_id: string
          id?: string
        }
        Update: {
          created_at?: string
          department_id?: string
          doctor_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_department_doctors_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "margaret_department_doctors_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "margaret_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_departments: {
        Row: {
          banner_image_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          email: string | null
          id: string
          location: string | null
          name: string
          operating_hours: Json
          phone: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          banner_image_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name: string
          operating_hours?: Json
          phone?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          banner_image_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          operating_hours?: Json
          phone?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      margaret_doctor_availability: {
        Row: {
          created_at: string
          day_of_week: number
          doctor_id: string
          end_time: string
          id: string
          location: string | null
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          doctor_id: string
          end_time: string
          id?: string
          location?: string | null
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          doctor_id?: string
          end_time?: string
          id?: string
          location?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_doctor_availability_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "margaret_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_doctor_publications: {
        Row: {
          created_at: string
          doctor_id: string
          id: string
          publication_url: string | null
          published_year: number | null
          title: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          id?: string
          publication_url?: string | null
          published_year?: number | null
          title: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          id?: string
          publication_url?: string | null
          published_year?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_doctor_publications_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "margaret_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_doctors: {
        Row: {
          biography: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          department_id: string | null
          email: string | null
          full_name: string
          id: string
          languages: string[]
          linkedin_url: string | null
          phone: string | null
          photo_url: string | null
          qualifications: string[]
          slug: string
          sort_order: number
          specialization: string
          status: string
          title: string | null
          twitter_url: string | null
          updated_at: string
          updated_by: string | null
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          biography?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          email?: string | null
          full_name: string
          id?: string
          languages?: string[]
          linkedin_url?: string | null
          phone?: string | null
          photo_url?: string | null
          qualifications?: string[]
          slug: string
          sort_order?: number
          specialization: string
          status?: string
          title?: string | null
          twitter_url?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          biography?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          email?: string | null
          full_name?: string
          id?: string
          languages?: string[]
          linkedin_url?: string | null
          phone?: string | null
          photo_url?: string | null
          qualifications?: string[]
          slug?: string
          sort_order?: number
          specialization?: string
          status?: string
          title?: string | null
          twitter_url?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_doctors_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_downloads: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          download_count: number
          file_size_kb: number | null
          file_type: string | null
          file_url: string
          id: string
          module: string
          reference_id: string | null
          sort_order: number
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          download_count?: number
          file_size_kb?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          module?: string
          reference_id?: string | null
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          download_count?: number
          file_size_kb?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          module?: string
          reference_id?: string | null
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      margaret_email_templates: {
        Row: {
          body_html: string
          created_at: string
          id: string
          key: string
          status: string
          subject: string
          updated_at: string
          updated_by: string | null
          variables: string[]
        }
        Insert: {
          body_html: string
          created_at?: string
          id?: string
          key: string
          status?: string
          subject: string
          updated_at?: string
          updated_by?: string | null
          variables?: string[]
        }
        Update: {
          body_html?: string
          created_at?: string
          id?: string
          key?: string
          status?: string
          subject?: string
          updated_at?: string
          updated_by?: string | null
          variables?: string[]
        }
        Relationships: []
      }
      margaret_event_registrations: {
        Row: {
          created_at: string
          email: string
          event_id: string
          full_name: string
          id: string
          organization: string | null
          phone: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          event_id: string
          full_name: string
          id?: string
          organization?: string | null
          phone?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string
          full_name?: string
          id?: string
          organization?: string | null
          phone?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "margaret_events"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_events: {
        Row: {
          capacity: number | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          ends_at: string | null
          event_type: string
          featured_image_url: string | null
          id: string
          is_virtual: boolean
          location: string | null
          registration_deadline: string | null
          registration_required: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          starts_at: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
          virtual_link: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: string
          featured_image_url?: string | null
          id?: string
          is_virtual?: boolean
          location?: string | null
          registration_deadline?: string | null
          registration_required?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          starts_at: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
          virtual_link?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: string
          featured_image_url?: string | null
          id?: string
          is_virtual?: boolean
          location?: string | null
          registration_deadline?: string | null
          registration_required?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
          virtual_link?: string | null
        }
        Relationships: []
      }
      margaret_facilities: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          department_id: string | null
          description: string | null
          equipment: string[]
          facility_type: string
          id: string
          image_url: string | null
          name: string
          slug: string
          sort_order: number
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          equipment?: string[]
          facility_type?: string
          id?: string
          image_url?: string | null
          name: string
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          equipment?: string[]
          facility_type?: string
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_facilities_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_footer_sections: {
        Row: {
          content: Json
          created_at: string
          id: string
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      margaret_form_submissions: {
        Row: {
          created_at: string
          data: Json
          deleted_at: string | null
          form_type_id: string
          id: string
          ip_address: unknown
          status: string
          submitted_by_email: string | null
          submitted_by_name: string | null
          submitted_by_phone: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          data?: Json
          deleted_at?: string | null
          form_type_id: string
          id?: string
          ip_address?: unknown
          status?: string
          submitted_by_email?: string | null
          submitted_by_name?: string | null
          submitted_by_phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          data?: Json
          deleted_at?: string | null
          form_type_id?: string
          id?: string
          ip_address?: unknown
          status?: string
          submitted_by_email?: string | null
          submitted_by_name?: string | null
          submitted_by_phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_form_submissions_form_type_id_fkey"
            columns: ["form_type_id"]
            isOneToOne: false
            referencedRelation: "margaret_form_types"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_form_types: {
        Row: {
          created_at: string
          id: string
          name: string
          notify_email: string | null
          schema: Json
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notify_email?: string | null
          schema?: Json
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notify_email?: string | null
          schema?: Json
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      margaret_gallery: {
        Row: {
          caption: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          file_url: string
          id: string
          media_type: string
          module: string
          reference_id: string | null
          sort_order: number
          status: string
          thumbnail_url: string | null
          title: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          file_url: string
          id?: string
          media_type?: string
          module?: string
          reference_id?: string | null
          sort_order?: number
          status?: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          file_url?: string
          id?: string
          media_type?: string
          module?: string
          reference_id?: string | null
          sort_order?: number
          status?: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      margaret_hero_slides: {
        Row: {
          created_at: string
          created_by: string | null
          cta_label: string | null
          cta_url: string | null
          deleted_at: string | null
          ends_at: string | null
          focal_point: string
          id: string
          image_url: string
          sort_order: number
          starts_at: string | null
          status: string
          subtitle: string | null
          title: string
          updated_at: string
          updated_by: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          deleted_at?: string | null
          ends_at?: string | null
          focal_point?: string
          id?: string
          image_url: string
          sort_order?: number
          starts_at?: string | null
          status?: string
          subtitle?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          deleted_at?: string | null
          ends_at?: string | null
          focal_point?: string
          id?: string
          image_url?: string
          sort_order?: number
          starts_at?: string | null
          status?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      margaret_homepage_sections: {
        Row: {
          config: Json
          created_at: string
          id: string
          is_visible: boolean
          section_key: string
          sort_order: number
          title: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          section_key: string
          sort_order?: number
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          section_key?: string
          sort_order?: number
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      margaret_insurance_partners: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          sort_order: number
          status: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          sort_order?: number
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          sort_order?: number
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      margaret_job_application_documents: {
        Row: {
          application_id: string
          created_at: string
          document_type: string
          file_name: string | null
          file_url: string
          id: string
        }
        Insert: {
          application_id: string
          created_at?: string
          document_type: string
          file_name?: string | null
          file_url: string
          id?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          document_type?: string
          file_name?: string | null
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_job_application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "margaret_job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string
          deleted_at: string | null
          email: string
          full_name: string
          id: string
          interview_date: string | null
          interview_notes: string | null
          job_id: string
          phone: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          full_name: string
          id?: string
          interview_date?: string | null
          interview_notes?: string | null
          job_id: string
          phone: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          full_name?: string
          id?: string
          interview_date?: string | null
          interview_notes?: string | null
          job_id?: string
          phone?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "margaret_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_jobs: {
        Row: {
          application_deadline: string
          attachments: string[]
          contract_type: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          department_id: string | null
          description: string | null
          experience_required: string | null
          id: string
          location: string
          positions_available: number
          qualifications: string | null
          responsibilities: string | null
          salary_range: string | null
          slug: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          application_deadline: string
          attachments?: string[]
          contract_type: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          experience_required?: string | null
          id?: string
          location: string
          positions_available?: number
          qualifications?: string | null
          responsibilities?: string | null
          salary_range?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          application_deadline?: string
          attachments?: string[]
          contract_type?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          experience_required?: string | null
          id?: string
          location?: string
          positions_available?: number
          qualifications?: string | null
          responsibilities?: string | null
          salary_range?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_jobs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_library_items: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          file_url: string
          id: string
          item_type: string
          published_year: number | null
          slug: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          file_url: string
          id?: string
          item_type?: string
          published_year?: number | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          file_url?: string
          id?: string
          item_type?: string
          published_year?: number | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      margaret_menu_items: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          label: string
          menu_id: string
          open_in_new_tab: boolean
          page_id: string | null
          parent_id: string | null
          sort_order: number
          status: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          label: string
          menu_id: string
          open_in_new_tab?: boolean
          page_id?: string | null
          parent_id?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          label?: string
          menu_id?: string
          open_in_new_tab?: boolean
          page_id?: string | null
          parent_id?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "margaret_menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "margaret_menu_items_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "margaret_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "margaret_menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "margaret_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_menus: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      margaret_news: {
        Row: {
          author_id: string | null
          author_name: string | null
          category_id: string | null
          content: Json
          created_at: string
          created_by: string | null
          deleted_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_breaking: boolean
          is_featured: boolean
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
          updated_by: string | null
          view_count: number
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          content?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_breaking?: boolean
          is_featured?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
          updated_by?: string | null
          view_count?: number
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          content?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_breaking?: boolean
          is_featured?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          updated_by?: string | null
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "margaret_news_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "margaret_news_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_news_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      margaret_news_comments: {
        Row: {
          author_email: string
          author_name: string
          comment: string
          created_at: string
          id: string
          news_id: string
          status: string
        }
        Insert: {
          author_email: string
          author_name: string
          comment: string
          created_at?: string
          id?: string
          news_id: string
          status?: string
        }
        Update: {
          author_email?: string
          author_name?: string
          comment?: string
          created_at?: string
          id?: string
          news_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_news_comments_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "margaret_news"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link_url: string | null
          message: string
          notification_type: string
          read_at: string | null
          recipient_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link_url?: string | null
          message: string
          notification_type?: string
          read_at?: string | null
          recipient_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link_url?: string | null
          message?: string
          notification_type?: string
          read_at?: string | null
          recipient_id?: string | null
          title?: string
        }
        Relationships: []
      }
      margaret_pages: {
        Row: {
          content: Json
          created_at: string
          created_by: string | null
          deleted_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          parent_id: string | null
          published_at: string | null
          seo_description: string | null
          seo_og_image_url: string | null
          seo_title: string | null
          slug: string
          status: string
          template: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          parent_id?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_og_image_url?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          template?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          parent_id?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_og_image_url?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          template?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "margaret_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_partners: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          partner_type: string
          sort_order: number
          status: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          partner_type?: string
          sort_order?: number
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          partner_type?: string
          sort_order?: number
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      margaret_permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          module: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          module: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          module?: string
          updated_at?: string
        }
        Relationships: []
      }
      margaret_press_releases: {
        Row: {
          content: Json
          created_at: string
          created_by: string | null
          deleted_at: string | null
          file_url: string | null
          id: string
          media_contact_email: string | null
          media_contact_name: string | null
          media_contact_phone: string | null
          published_at: string | null
          slug: string
          status: string
          summary: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          file_url?: string | null
          id?: string
          media_contact_email?: string | null
          media_contact_name?: string | null
          media_contact_phone?: string | null
          published_at?: string | null
          slug: string
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          file_url?: string | null
          id?: string
          media_contact_email?: string | null
          media_contact_name?: string | null
          media_contact_phone?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      margaret_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          department_id: string | null
          full_name: string
          id: string
          is_active: boolean
          job_title: string | null
          last_login_at: string | null
          phone: string | null
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          full_name: string
          id: string
          is_active?: boolean
          job_title?: string | null
          last_login_at?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          job_title?: string | null
          last_login_at?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_margaret_profiles_department"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_research: {
        Row: {
          abstract: string | null
          authors: string[]
          created_at: string
          created_by: string | null
          deleted_at: string | null
          department_id: string | null
          doctor_id: string | null
          file_url: string | null
          id: string
          publication_url: string | null
          published_year: number | null
          slug: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          abstract?: string | null
          authors?: string[]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          doctor_id?: string | null
          file_url?: string | null
          id?: string
          publication_url?: string | null
          published_year?: number | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          abstract?: string | null
          authors?: string[]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          doctor_id?: string | null
          file_url?: string | null
          id?: string
          publication_url?: string | null
          published_year?: number | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_research_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "margaret_research_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "margaret_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "margaret_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "margaret_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "margaret_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_roles: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_system: boolean
          name: string
          slug: string
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean
          name: string
          slug: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean
          name?: string
          slug?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      margaret_service_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      margaret_services: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          department_id: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price_info: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price_info?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price_info?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "margaret_service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "margaret_services_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_settings: {
        Row: {
          created_at: string
          id: string
          setting_group: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          setting_group?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          setting_group?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      margaret_sms_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          key: string
          status: string
          updated_at: string
          updated_by: string | null
          variables: string[]
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          key: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          variables?: string[]
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          key?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          variables?: string[]
        }
        Relationships: []
      }
      margaret_stats: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          label: string
          sort_order: number
          status: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          label: string
          sort_order?: number
          status?: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          label?: string
          sort_order?: number
          status?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      margaret_supplier_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      margaret_supplier_documents: {
        Row: {
          created_at: string
          document_type: string
          file_url: string
          id: string
          supplier_id: string
          title: string
        }
        Insert: {
          created_at?: string
          document_type: string
          file_url: string
          id?: string
          supplier_id: string
          title: string
        }
        Update: {
          created_at?: string
          document_type?: string
          file_url?: string
          id?: string
          supplier_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_supplier_documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "margaret_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_suppliers: {
        Row: {
          address: string | null
          category_id: string | null
          company_name: string
          contact_person: string
          created_at: string
          deleted_at: string | null
          documents: string[]
          email: string
          id: string
          kra_pin: string | null
          phone: string
          registration_number: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          category_id?: string | null
          company_name: string
          contact_person: string
          created_at?: string
          deleted_at?: string | null
          documents?: string[]
          email: string
          id?: string
          kra_pin?: string | null
          phone: string
          registration_number?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          category_id?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string
          deleted_at?: string | null
          documents?: string[]
          email?: string
          id?: string
          kra_pin?: string | null
          phone?: string
          registration_number?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_suppliers_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "margaret_supplier_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_tender_addenda: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          file_url: string | null
          id: string
          tender_id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          tender_id: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          tender_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_tender_addenda_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "margaret_tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_tender_awards: {
        Row: {
          award_amount: number | null
          award_notice_url: string | null
          awarded_at: string | null
          awarded_supplier_id: string | null
          awarded_supplier_name: string | null
          created_at: string
          created_by: string | null
          id: string
          tender_id: string
        }
        Insert: {
          award_amount?: number | null
          award_notice_url?: string | null
          awarded_at?: string | null
          awarded_supplier_id?: string | null
          awarded_supplier_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          tender_id: string
        }
        Update: {
          award_amount?: number | null
          award_notice_url?: string | null
          awarded_at?: string | null
          awarded_supplier_id?: string | null
          awarded_supplier_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_tender_awards_awarded_supplier_id_fkey"
            columns: ["awarded_supplier_id"]
            isOneToOne: false
            referencedRelation: "margaret_suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "margaret_tender_awards_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "margaret_tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_tender_clarifications: {
        Row: {
          answer: string | null
          answered_at: string | null
          answered_by: string | null
          asked_by_email: string | null
          asked_by_name: string | null
          created_at: string
          id: string
          question: string
          status: string
          tender_id: string
        }
        Insert: {
          answer?: string | null
          answered_at?: string | null
          answered_by?: string | null
          asked_by_email?: string | null
          asked_by_name?: string | null
          created_at?: string
          id?: string
          question: string
          status?: string
          tender_id: string
        }
        Update: {
          answer?: string | null
          answered_at?: string | null
          answered_by?: string | null
          asked_by_email?: string | null
          asked_by_name?: string | null
          created_at?: string
          id?: string
          question?: string
          status?: string
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_tender_clarifications_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "margaret_tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_tender_documents: {
        Row: {
          created_at: string
          created_by: string | null
          document_type: string
          file_url: string
          id: string
          tender_id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_type?: string
          file_url: string
          id?: string
          tender_id: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_type?: string
          file_url?: string
          id?: string
          tender_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "margaret_tender_documents_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "margaret_tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_tenders: {
        Row: {
          category_id: string | null
          closing_date: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          eligibility: string | null
          evaluation_stage: string
          id: string
          opening_date: string | null
          slug: string
          status: string
          tender_number: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category_id?: string | null
          closing_date: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          eligibility?: string | null
          evaluation_stage?: string
          id?: string
          opening_date?: string | null
          slug: string
          status?: string
          tender_number: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category_id?: string | null
          closing_date?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          eligibility?: string | null
          evaluation_stage?: string
          id?: string
          opening_date?: string | null
          slug?: string
          status?: string
          tender_number?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_tenders_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "margaret_supplier_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_testimonials: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          department_id: string | null
          id: string
          patient_name: string
          photo_url: string | null
          quote: string
          rating: number | null
          sort_order: number
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          id?: string
          patient_name: string
          photo_url?: string | null
          quote: string
          rating?: number | null
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          id?: string
          patient_name?: string
          photo_url?: string | null
          quote?: string
          rating?: number | null
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "margaret_testimonials_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "margaret_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      margaret_user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_margaret_user_roles_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "margaret_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "margaret_user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "margaret_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      mejasan_activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mejasan_blog_posts: {
        Row: {
          author_id: string | null
          author_name: string
          category: string
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          published_at: string | null
          read_time: number
          seo_desc: string | null
          seo_title: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id?: string | null
          author_name?: string
          category?: string
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          published_at?: string | null
          read_time?: number
          seo_desc?: string | null
          seo_title?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string | null
          author_name?: string
          category?: string
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          published_at?: string | null
          read_time?: number
          seo_desc?: string | null
          seo_title?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      mejasan_bookings: {
        Row: {
          budget: string | null
          client_email: string
          client_name: string
          client_phone: string | null
          client_user_id: string | null
          created_at: string
          deposit_amount: number | null
          deposit_paid: boolean
          duration: string | null
          event_date: string
          event_location: string | null
          event_type: string | null
          id: string
          metadata: Json | null
          notes: string | null
          reference: string
          service: string
          status: string
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          budget?: string | null
          client_email: string
          client_name: string
          client_phone?: string | null
          client_user_id?: string | null
          created_at?: string
          deposit_amount?: number | null
          deposit_paid?: boolean
          duration?: string | null
          event_date: string
          event_location?: string | null
          event_type?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          reference: string
          service: string
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          budget?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          client_user_id?: string | null
          created_at?: string
          deposit_amount?: number | null
          deposit_paid?: boolean
          duration?: string | null
          event_date?: string
          event_location?: string | null
          event_type?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          reference?: string
          service?: string
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      mejasan_client_profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          full_name: string | null
          id: string
          notes: string | null
          phone: string | null
          preferred_contact: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          preferred_contact?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          preferred_contact?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mejasan_contact_submissions: {
        Row: {
          assigned_to: string | null
          budget: string | null
          company: string | null
          created_at: string
          email: string
          event_date: string | null
          id: string
          message: string | null
          metadata: Json | null
          name: string
          phone: string | null
          service: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string
          email: string
          event_date?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          name: string
          phone?: string | null
          service?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string
          event_date?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          name?: string
          phone?: string | null
          service?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      mejasan_contracts: {
        Row: {
          booking_id: string | null
          client_user_id: string
          content: string | null
          created_at: string
          expires_at: string | null
          id: string
          pdf_url: string | null
          project_id: string | null
          signature_data: string | null
          signed_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          client_user_id: string
          content?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          pdf_url?: string | null
          project_id?: string | null
          signature_data?: string | null
          signed_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          client_user_id?: string
          content?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          pdf_url?: string | null
          project_id?: string | null
          signature_data?: string | null
          signed_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mejasan_contracts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "mejasan_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mejasan_contracts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mejasan_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mejasan_event_document_files: {
        Row: {
          created_at: string
          event_document_id: string
          id: string
          name: string
          sort_order: number
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string
          event_document_id: string
          id?: string
          name: string
          sort_order?: number
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string
          event_document_id?: string
          id?: string
          name?: string
          sort_order?: number
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "mejasan_event_document_files_event_document_id_fkey"
            columns: ["event_document_id"]
            isOneToOne: false
            referencedRelation: "mejasan_event_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      mejasan_event_documents: {
        Row: {
          access_token: string
          booking_id: string | null
          created_at: string
          description: string | null
          event_name: string
          file_name: string | null
          file_type: string | null
          file_url: string
          id: string
          is_active: boolean
          updated_at: string
          view_count: number
        }
        Insert: {
          access_token?: string
          booking_id?: string | null
          created_at?: string
          description?: string | null
          event_name: string
          file_name?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          is_active?: boolean
          updated_at?: string
          view_count?: number
        }
        Update: {
          access_token?: string
          booking_id?: string | null
          created_at?: string
          description?: string | null
          event_name?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "mejasan_event_documents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "mejasan_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      mejasan_galleries: {
        Row: {
          client_user_id: string
          cover_image: string | null
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          is_shared: boolean
          password_hash: string | null
          project_id: string | null
          share_token: string | null
          title: string
          updated_at: string
        }
        Insert: {
          client_user_id: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_shared?: boolean
          password_hash?: string | null
          project_id?: string | null
          share_token?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          client_user_id?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_shared?: boolean
          password_hash?: string | null
          project_id?: string | null
          share_token?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mejasan_galleries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mejasan_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mejasan_gallery_images: {
        Row: {
          caption: string | null
          created_at: string
          gallery_id: string
          height: number | null
          id: string
          size_bytes: number | null
          sort_order: number
          thumbnail: string | null
          url: string
          width: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          gallery_id: string
          height?: number | null
          id?: string
          size_bytes?: number | null
          sort_order?: number
          thumbnail?: string | null
          url: string
          width?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          gallery_id?: string
          height?: number | null
          id?: string
          size_bytes?: number | null
          sort_order?: number
          thumbnail?: string | null
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mejasan_gallery_images_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "mejasan_galleries"
            referencedColumns: ["id"]
          },
        ]
      }
      mejasan_invoices: {
        Row: {
          amount_paid: number
          booking_id: string | null
          client_email: string
          client_name: string
          client_user_id: string
          created_at: string
          currency: string
          due_date: string | null
          id: string
          invoice_number: string
          line_items: Json
          notes: string | null
          paid_at: string | null
          pdf_url: string | null
          project_id: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          booking_id?: string | null
          client_email: string
          client_name: string
          client_user_id: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          line_items?: Json
          notes?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          project_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          booking_id?: string | null
          client_email?: string
          client_name?: string
          client_user_id?: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          line_items?: Json
          notes?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          project_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mejasan_invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "mejasan_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mejasan_invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mejasan_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mejasan_messages: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          id: string
          is_admin: boolean
          project_id: string | null
          read_at: string | null
          sender_id: string
          sender_name: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          id?: string
          is_admin?: boolean
          project_id?: string | null
          read_at?: string | null
          sender_id: string
          sender_name: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          id?: string
          is_admin?: boolean
          project_id?: string | null
          read_at?: string | null
          sender_id?: string
          sender_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "mejasan_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mejasan_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mejasan_notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      mejasan_page_content: {
        Row: {
          content: Json
          id: string
          page_slug: string
          updated_at: string
        }
        Insert: {
          content?: Json
          id?: string
          page_slug: string
          updated_at?: string
        }
        Update: {
          content?: Json
          id?: string
          page_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      mejasan_portfolio: {
        Row: {
          category: string
          client_name: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          images: Json | null
          is_featured: boolean
          is_published: boolean
          metadata: Json | null
          published_at: string | null
          slug: string
          sort_order: number
          tags: string[] | null
          title: string
          updated_at: string
          video_url: string | null
          view_count: number
        }
        Insert: {
          category: string
          client_name?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          is_featured?: boolean
          is_published?: boolean
          metadata?: Json | null
          published_at?: string | null
          slug: string
          sort_order?: number
          tags?: string[] | null
          title: string
          updated_at?: string
          video_url?: string | null
          view_count?: number
        }
        Update: {
          category?: string
          client_name?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          is_featured?: boolean
          is_published?: boolean
          metadata?: Json | null
          published_at?: string | null
          slug?: string
          sort_order?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string | null
          view_count?: number
        }
        Relationships: []
      }
      mejasan_project_files: {
        Row: {
          created_at: string
          id: string
          name: string
          project_id: string
          size_bytes: number | null
          type: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          project_id: string
          size_bytes?: number | null
          type?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          project_id?: string
          size_bytes?: number | null
          type?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "mejasan_project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mejasan_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mejasan_projects: {
        Row: {
          booking_id: string | null
          client_user_id: string | null
          cover_image: string | null
          created_at: string
          delivery_date: string | null
          description: string | null
          id: string
          metadata: Json | null
          service: string
          stage: number
          stage_label: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          client_user_id?: string | null
          cover_image?: string | null
          created_at?: string
          delivery_date?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          service: string
          stage?: number
          stage_label?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          client_user_id?: string | null
          cover_image?: string | null
          created_at?: string
          delivery_date?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          service?: string
          stage?: number
          stage_label?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mejasan_projects_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "mejasan_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      mejasan_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      mejasan_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: string | null
          value_json: Json | null
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
          value_json?: Json | null
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
          value_json?: Json | null
        }
        Relationships: []
      }
      mejasan_testimonials: {
        Row: {
          client_avatar: string | null
          client_name: string
          client_role: string | null
          content: string
          created_at: string
          id: string
          is_featured: boolean
          is_published: boolean
          project_id: string | null
          rating: number
          service: string | null
          sort_order: number
        }
        Insert: {
          client_avatar?: string | null
          client_name: string
          client_role?: string | null
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          project_id?: string | null
          rating?: number
          service?: string | null
          sort_order?: number
        }
        Update: {
          client_avatar?: string | null
          client_name?: string
          client_role?: string | null
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          project_id?: string | null
          rating?: number
          service?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "mejasan_testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mejasan_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mejasan_wedding_intake: {
        Row: {
          bride_name: string
          client_email: string
          client_phone: string | null
          contract: Json
          contract_pdf_url: string | null
          correction_of: string | null
          created_at: string
          groom_name: string
          id: string
          is_correction: boolean
          questionnaire: Json
          questionnaire_pdf_url: string | null
          signature_client_url: string | null
          signature_company_url: string | null
          signature_company_witness_url: string | null
          signature_witness_url: string | null
          status: string
          updated_at: string
          wedding_date: string
        }
        Insert: {
          bride_name: string
          client_email: string
          client_phone?: string | null
          contract?: Json
          contract_pdf_url?: string | null
          correction_of?: string | null
          created_at?: string
          groom_name: string
          id?: string
          is_correction?: boolean
          questionnaire?: Json
          questionnaire_pdf_url?: string | null
          signature_client_url?: string | null
          signature_company_url?: string | null
          signature_company_witness_url?: string | null
          signature_witness_url?: string | null
          status?: string
          updated_at?: string
          wedding_date: string
        }
        Update: {
          bride_name?: string
          client_email?: string
          client_phone?: string | null
          contract?: Json
          contract_pdf_url?: string | null
          correction_of?: string | null
          created_at?: string
          groom_name?: string
          id?: string
          is_correction?: boolean
          questionnaire?: Json
          questionnaire_pdf_url?: string | null
          signature_client_url?: string | null
          signature_company_url?: string | null
          signature_company_witness_url?: string | null
          signature_witness_url?: string | null
          status?: string
          updated_at?: string
          wedding_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "mejasan_wedding_intake_correction_of_fkey"
            columns: ["correction_of"]
            isOneToOne: false
            referencedRelation: "mejasan_wedding_intake"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      edoscentre_v_blog_posts_published: {
        Row: {
          author_avatar: string | null
          author_name: string | null
          category_color: string | null
          category_name: string | null
          category_slug: string | null
          content: string | null
          cover_image_url: string | null
          excerpt: string | null
          id: string | null
          is_featured: boolean | null
          og_image_url: string | null
          published_at: string | null
          reading_time_min: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          title: string | null
          view_count: number | null
        }
        Relationships: []
      }
      kida_mv_alumni_stats: {
        Row: {
          counties_represented: number | null
          graduation_years_represented: number | null
          id: number | null
          refreshed_at: string | null
          verified_alumni_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      communityimpactinsights_current_role: {
        Args: never
        Returns: Database["public"]["Enums"]["communityimpactinsights_role"]
      }
      communityimpactinsights_has_role: {
        Args: {
          roles: Database["public"]["Enums"]["communityimpactinsights_role"][]
        }
        Returns: boolean
      }
      communityimpactinsights_is_staff: { Args: never; Returns: boolean }
      communityimpactinsights_subscribe: {
        Args: {
          p_email: string
          p_name?: string
          p_organisation?: string
          p_source?: string
        }
        Returns: undefined
      }
      communityimpactinsights_unsubscribe: {
        Args: { p_email: string }
        Returns: undefined
      }
      create_emiwama_order: {
        Args: {
          p_currency: string
          p_discount: number
          p_items: Json
          p_notes: string
          p_payment_method: string
          p_shipping_address: Json
          p_shipping_cost: number
          p_subtotal: number
          p_tax: number
          p_total: number
        }
        Returns: Json
      }
      edoscentre_check_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number }
        Returns: boolean
      }
      edoscentreadmin_current_client_id: { Args: never; Returns: string }
      edoscentreadmin_is_admin: {
        Args: { p_website_slug?: string }
        Returns: boolean
      }
      edoscentreadmin_is_super_admin: { Args: never; Returns: boolean }
      edoscentreadmin_next_invoice_number: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_emiwama_admin: { Args: never; Returns: boolean }
      jemvoyage_attach_touch: { Args: { p_table: unknown }; Returns: undefined }
      jemvoyage_can_view_rental: {
        Args: { p_rental_id: string }
        Returns: boolean
      }
      jemvoyage_has_permission: { Args: { p_key: string }; Returns: boolean }
      jemvoyage_has_role: { Args: { p_role: string }; Returns: boolean }
      jemvoyage_is_staff: { Args: never; Returns: boolean }
      jemvoyage_is_super_admin: { Args: never; Returns: boolean }
      jemvoyage_my_agent_id: { Args: never; Returns: string }
      jemvoyage_my_corporate_accounts: { Args: never; Returns: string[] }
      jemvoyage_my_permissions: { Args: never; Returns: string[] }
      jemvoyage_next_reference: { Args: { p_kind: string }; Returns: string }
      jemvoyage_owns_customer: {
        Args: { p_customer_id: string }
        Returns: boolean
      }
      jemvoyage_resolve_media: {
        Args: { p_category?: string; p_media_id: string }
        Returns: {
          alt_text: string | null
          blur_data_url: string | null
          caption: string | null
          category: string
          created_at: string
          credit: string | null
          deleted_at: string | null
          description: string | null
          external_url: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          focal_x: number
          focal_y: number
          height: number | null
          id: string
          is_active: boolean
          is_placeholder: boolean
          license: string | null
          mime_type: string | null
          source_url: string | null
          storage_bucket: string
          tags: string[]
          title: string | null
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        SetofOptions: {
          from: "*"
          to: "jemvoyage_media"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      jemvoyage_slugify: { Args: { p_input: string }; Returns: string }
      jemvoyage_vehicle_is_available: {
        Args: { p_from: string; p_to: string; p_vehicle_id: string }
        Returns: boolean
      }
      kida_has_role: { Args: { role_name: string }; Returns: boolean }
      kida_is_admin: { Args: never; Returns: boolean }
      kida_is_staff: { Args: never; Returns: boolean }
      kida_refresh_alumni_stats: { Args: never; Returns: undefined }
      kida_verify_membership: {
        Args: { p_admission_number: string }
        Returns: {
          full_name: string
          graduation_year: number
          membership_status: string
        }[]
      }
      margaret_bootstrap_content_table: {
        Args: { p_permission_prefix: string; p_table: unknown }
        Returns: undefined
      }
      margaret_bootstrap_lookup_table: {
        Args: { p_permission_prefix: string; p_table: unknown }
        Returns: undefined
      }
      margaret_get_my_permissions: {
        Args: never
        Returns: {
          permission_key: string
        }[]
      }
      margaret_get_my_roles: {
        Args: never
        Returns: {
          role_name: string
          role_slug: string
        }[]
      }
      margaret_has_permission: {
        Args: { permission_key: string }
        Returns: boolean
      }
      margaret_is_super_admin: { Args: never; Returns: boolean }
      mejasan_is_admin: { Args: { uid: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      communityimpactinsights_audit_action:
        | "login"
        | "logout"
        | "create"
        | "update"
        | "delete"
        | "publish"
        | "unpublish"
        | "upload"
        | "settings_change"
      communityimpactinsights_content_status:
        | "draft"
        | "review"
        | "published"
        | "archived"
        | "scheduled"
      communityimpactinsights_enquiry_status:
        | "new"
        | "contacted"
        | "in_progress"
        | "converted"
        | "closed"
        | "spam"
      communityimpactinsights_role:
        | "super_admin"
        | "admin"
        | "editor"
        | "author"
        | "analyst"
      communityimpactinsights_subscriber_status:
        | "subscribed"
        | "unsubscribed"
        | "pending"
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
  public: {
    Enums: {
      communityimpactinsights_audit_action: [
        "login",
        "logout",
        "create",
        "update",
        "delete",
        "publish",
        "unpublish",
        "upload",
        "settings_change",
      ],
      communityimpactinsights_content_status: [
        "draft",
        "review",
        "published",
        "archived",
        "scheduled",
      ],
      communityimpactinsights_enquiry_status: [
        "new",
        "contacted",
        "in_progress",
        "converted",
        "closed",
        "spam",
      ],
      communityimpactinsights_role: [
        "super_admin",
        "admin",
        "editor",
        "author",
        "analyst",
      ],
      communityimpactinsights_subscriber_status: [
        "subscribed",
        "unsubscribed",
        "pending",
      ],
    },
  },
} as const
