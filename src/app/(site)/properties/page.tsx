import { createClient } from '@/lib/supabase/server'
import HeroSub from '@/components/shared/HeroSub'
import PublicPropertyCard from '@/components/Properties/PropertyCard'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Properties | Bangalore Realtors' }
export const revalidate = 60

const CATEGORIES = ['all', 'apartment', 'luxury-villa', 'residential', 'office-space']

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; area?: string }>
}) {
  const { category, area } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('properties')
    .select('*, property_images(url, sort_order)')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (category && category !== 'all') query = query.eq('category', category)
  if (area) query = query.ilike('area', `%${area}%`)

  const { data: properties } = await query

  return (
    <>
      <HeroSub
        title="Find your perfect property in Bangalore."
        description="Browse premium residential and commercial properties across Bangalore's top localities."
        badge="Properties"
      />
      <section className="pt-0!">
        <div className="container max-w-8xl mx-auto px-5 2xl:px-0">
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <a
                key={cat}
                href={cat === 'all' ? '/properties' : `/properties?category=${cat}`}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition ${
                  (cat === 'all' && !category) || category === cat
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Properties' : cat.replace('-', ' ')}
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-6">{properties?.length ?? 0} properties found</p>
          {properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {properties.map(property => (
                <PublicPropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">No properties found</p>
              <p className="text-sm mt-1">Try a different filter or check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
