'use client'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useState } from 'react'

const LOCATIONS = [
  {
    name: 'Whitefield',
    description: 'Bangalore\'s defining IT hub — premium apartments, gated communities, and world-class metro connectivity. Proximity to global tech campuses makes Whitefield the city\'s most enduring address for the discerning professional.',
    properties: '240+ Properties',
    priceRange: '₹60L – ₹3.5 Cr',
    tags: ['IT Hub', 'Metro Connectivity'],
    gradient: 'from-blue-500/20 to-blue-600/5',
    icon: 'ph:buildings',
    accent: '#3b82f6',
  },
  {
    name: 'Sarjapur Road',
    description: 'Bangalore\'s fastest-growing residential corridor, where new launches from India\'s finest developers meet open landscapes and villa communities. An address that rewards those who arrive early.',
    properties: '185+ Properties',
    priceRange: '₹55L – ₹2.8 Cr',
    tags: ['New Launches', 'Villa Projects'],
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    icon: 'ph:tree',
    accent: '#10b981',
  },
  {
    name: 'Hebbal',
    description: 'North Bangalore\'s premium lakeside precinct — serene settings, airport proximity, and an emerging skyline of luxury towers. Exclusivity without compromise.',
    properties: '120+ Properties',
    priceRange: '₹70L – ₹4 Cr',
    tags: ['Lakeside', 'Airport Proximity'],
    gradient: 'from-sky-500/20 to-sky-600/5',
    icon: 'ph:waves',
    accent: '#0ea5e9',
  },
  {
    name: 'Electronic City',
    description: 'Affordable excellence, anchored by India\'s largest technology park. Elevated expressway access makes this Bangalore\'s most practical address for the first-time buyer.',
    properties: '210+ Properties',
    priceRange: '₹40L – ₹1.8 Cr',
    tags: ['Affordable', 'Elevated Expressway'],
    gradient: 'from-violet-500/20 to-violet-600/5',
    icon: 'ph:cpu',
    accent: '#8b5cf6',
  },
  {
    name: 'Koramangala',
    description: 'Upscale, vibrant, irreplaceable. Bangalore\'s most sought-after urban neighbourhood — a residential address that doubles as a statement.',
    properties: '95+ Properties',
    priceRange: '₹1.2 Cr – ₹6 Cr',
    tags: ['Premium', 'Startup Hub'],
    gradient: 'from-orange-500/20 to-orange-600/5',
    icon: 'ph:star',
    accent: '#f97316',
  },
  {
    name: 'Devanahalli',
    description: 'The aerospace and airport zone of tomorrow — today. High appreciation, growing infrastructure, and proximity to Kempegowda International Airport make Devanahalli Bangalore\'s finest long-term bet.',
    properties: '155+ Properties',
    priceRange: '₹35L – ₹1.5 Cr',
    tags: ['Airport Zone', 'High Appreciation'],
    gradient: 'from-rose-500/20 to-rose-600/5',
    icon: 'ph:airplane',
    accent: '#f43f5e',
  },
  {
    name: 'HSR Layout',
    description: 'Well-planned residential zone popular with professionals',
    properties: '110+ Properties',
    priceRange: '₹80L – ₹3 Cr',
    tags: ['Well-Planned', 'Professionals Hub'],
    gradient: 'from-teal-500/20 to-teal-600/5',
    icon: 'ph:map-trifold',
    accent: '#14b8a6',
  },
  {
    name: 'JP Nagar',
    description: 'Established south Bangalore neighborhood with greenery',
    properties: '88+ Properties',
    priceRange: '₹65L – ₹2.5 Cr',
    tags: ['Established', 'Greenery'],
    gradient: 'from-lime-500/20 to-lime-600/5',
    icon: 'ph:leaf',
    accent: '#84cc16',
  },
]

export default function LocationsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section>
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
        {/* Header */}
        <div className='mb-14 flex flex-col gap-3'>
          <div className='flex gap-2.5 items-center justify-center'>
            <Icon icon='ph:map-pin-fill' width={20} height={20} className='text-primary' />
            <p className='text-base font-semibold text-dark/75 dark:text-white/75'>Top Localities</p>
          </div>
          <h2 className='text-40 lg:text-52 font-medium text-black dark:text-white text-center tracking-tight leading-11 mb-2'>
            Curated Neighbourhoods. Unmatched Returns.
          </h2>
          <p className='text-xm font-normal text-black/50 dark:text-white/50 text-center'>
            We handpick localities that offer the finest combination of connectivity, lifestyle, and long-term capital appreciation — neighbourhoods we know not just from data, but from a decade of living and breathing Bangalore real estate.
          </p>
        </div>

        {/* Locations Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {LOCATIONS.map((loc, i) => (
            <Link
              key={loc.name}
              href={`/properties?area=${encodeURIComponent(loc.name)}`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`group relative bg-gradient-to-br ${loc.gradient} dark:from-white/5 dark:to-white/3 rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:border-primary/40 dark:hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden ${activeIndex === i ? 'scale-[1.02]' : 'scale-100'}`}
            >
              {/* Background decorative circle */}
              <div
                className='absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity'
                style={{ backgroundColor: loc.accent }}
              />

              {/* Icon */}
              <div
                className='w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110'
                style={{ backgroundColor: `${loc.accent}20` }}
              >
                <Icon icon={loc.icon} className='text-2xl' style={{ color: loc.accent }} />
              </div>

              {/* Location Name */}
              <h3 className='font-bold text-dark dark:text-white text-lg mb-1.5 group-hover:text-primary transition-colors'>
                {loc.name}
              </h3>

              {/* Description */}
              <p className='text-sm text-black/55 dark:text-white/55 leading-snug mb-4'>
                {loc.description}
              </p>

              {/* Tags */}
              <div className='flex flex-wrap gap-1.5 mb-4'>
                {loc.tags.map(tag => (
                  <span
                    key={tag}
                    className='text-xs px-2.5 py-1 rounded-full font-medium'
                    style={{ backgroundColor: `${loc.accent}15`, color: loc.accent }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className='flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/10'>
                <div>
                  <p className='text-xs text-black/40 dark:text-white/40'>Starting from</p>
                  <p className='text-sm font-semibold text-dark dark:text-white'>{loc.priceRange}</p>
                </div>
                <div className='flex items-center gap-1 text-primary text-sm font-medium'>
                  <span className='text-xs text-black/40 dark:text-white/40'>{loc.properties}</span>
                  <Icon icon='ph:arrow-right' className='text-primary group-hover:translate-x-0.5 transition-transform' />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className='flex justify-center mt-12'>
          <Link
            href='/properties'
            className='py-4 px-10 bg-primary text-white rounded-full font-semibold hover:bg-dark transition flex items-center gap-2'
          >
            <Icon icon='ph:map-trifold' />
            Explore All Localities
          </Link>
        </div>
      </div>
    </section>
  )
}
