import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import type { Property } from '@/types/property'

type Props = { property: Property & { property_images?: { url: string; sort_order: number }[] } }

export default function PublicPropertyCard({ property }: Props) {
  const {
    name, area, price_label, slug, cover_image_url,
    property_images, is_featured, possession_status,
    configuration, developer, land_parcel, towers, floors,
    carpet_area_min, carpet_area_max,
  } = property

  const mainImage =
    cover_image_url ||
    [...(property_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.url ||
    '/images/properties/property1/property1.jpg'

  const priceDisplay = price_label || 'Price on Request'

  const sbaDisplay = carpet_area_min && carpet_area_max
    ? `${carpet_area_min} – ${carpet_area_max} sqft`
    : carpet_area_min ? `${carpet_area_min} sqft` : null

  return (
    <div className="relative rounded-2xl border border-dark/10 dark:border-white/10 group hover:shadow-3xl duration-300 dark:hover:shadow-white/20 bg-white dark:bg-black/20">
      {is_featured && (
        <div className="absolute top-4 left-4 z-10 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <Icon icon="ph:star-fill" className="text-xs" /> Featured
        </div>
      )}
      {possession_status && (
        <div className="absolute top-4 right-4 z-10">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            possession_status === 'Ready to Move' ? 'bg-green-500 text-white' :
            possession_status === 'New Launch' ? 'bg-blue-500 text-white' :
            'bg-orange-500 text-white'
          }`}>{possession_status}</span>
        </div>
      )}

      <div className='overflow-hidden rounded-t-2xl'>
        <Link href={`/properties/${slug}`}>
          <Image
            src={mainImage}
            alt={name}
            width={440}
            height={300}
            className='w-full h-52 object-cover rounded-t-2xl group-hover:brightness-50 group-hover:scale-110 transition duration-300'
            unoptimized
          />
        </Link>
      </div>

      <div className='p-5'>
        <div className='flex justify-between items-start gap-3 mb-3'>
          <div className='flex-1 min-w-0'>
            <Link href={`/properties/${slug}`}>
              <h3 className='text-base font-semibold text-black dark:text-white group-hover:text-primary leading-tight line-clamp-1'>
                {name}
              </h3>
            </Link>
            <p className='text-sm text-black/50 dark:text-white/50 mt-0.5'>{developer}</p>
          </div>
          <span className='flex-shrink-0 text-sm font-semibold text-primary px-3 py-1.5 rounded-full bg-primary/10 whitespace-nowrap'>
            {priceDisplay}
          </span>
        </div>

        <p className='text-xs text-black/40 dark:text-white/40 flex items-center gap-1 mb-3'>
          <Icon icon='ph:map-pin' className='flex-shrink-0' /> {area}
        </p>

        {configuration?.length > 0 && (
          <div className='flex flex-wrap gap-1.5 mb-3'>
            {configuration.map(c => (
              <span key={c} className='text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60 px-2 py-0.5 rounded-md'>{c}</span>
            ))}
          </div>
        )}

        <div className='flex items-center gap-3 border-t border-black/10 dark:border-white/10 pt-3 flex-wrap text-xs text-black/60 dark:text-white/60'>
          {land_parcel && (
            <div className='flex items-center gap-1'><Icon icon='ph:map-trifold' className='text-primary' />{land_parcel}</div>
          )}
          {towers && (
            <div className='flex items-center gap-1'><Icon icon='ph:buildings' className='text-primary' />{towers} Towers</div>
          )}
          {floors && (
            <div className='flex items-center gap-1'><Icon icon='ph:stairs' className='text-primary' />{floors}</div>
          )}
          {sbaDisplay && (
            <div className='flex items-center gap-1'><Icon icon='ph:arrows-out' className='text-primary' />{sbaDisplay}</div>
          )}
        </div>
      </div>
    </div>
  )
}
