export type PropertyCategory = 'luxury-villa' | 'residential' | 'apartment' | 'office-space'
export type PossessionStatus = 'New Launch' | 'Under Construction' | 'Ready to Move'

export interface LocationHighlight {
  place: string
  distance: string
}

export interface PropertyUnitPlan {
  id: string
  property_id: string
  bhk_type: string
  carpet_area_min: number | null
  carpet_area_max: number | null
  price_min: number | null
  price_max: number | null
  floor_plan_url: string | null
  sort_order: number
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  sort_order: number
}

export interface Property {
  id: string
  name: string
  slug: string
  developer: string
  description: string | null
  location: string
  area: string
  city: string
  latitude: number | null
  longitude: number | null

  price_min: number | null
  price_max: number | null
  price_label: string | null

  land_parcel: string | null
  towers: string | null
  floors: string | null
  configuration: string[]
  carpet_area_min: number | null
  carpet_area_max: number | null
  rera_number: string | null
  possession_status: string | null
  target_possession: string | null
  rera_possession: string | null
  litigation: boolean

  beds: number | null
  baths: number | null
  area_sqft: number | null
  category: PropertyCategory

  pros: string[]
  cons: string[]
  amenities_internal: string[]
  amenities_external: string[]
  location_highlights: LocationHighlight[]
  video_urls: string[]
  banks_approved: string[]

  cover_image_url: string | null
  brochure_drive_url: string | null   // Google Drive shareable link
  map_embed_url: string | null        // Google Maps embed src URL

  is_featured: boolean
  is_active: boolean

  created_at: string
  updated_at: string

  property_images?: PropertyImage[]
  property_unit_plans?: PropertyUnitPlan[]
}
