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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
