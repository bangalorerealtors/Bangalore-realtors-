import { createClient } from '@/lib/supabase/server'
import FeaturedCarousel from './FeaturedCarousel'

export default async function FeaturedProperty() {
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('*, property_images(url, sort_order)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (!properties || properties.length === 0) return null

  return <FeaturedCarousel properties={properties} />
}
