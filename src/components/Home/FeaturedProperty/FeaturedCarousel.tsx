'use client'
import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import type { Property } from '@/types/property'

type Props = {
  properties: (Property & { property_images?: { url: string; sort_order: number }[] })[]
}

export default function FeaturedCarousel({ properties }: Props) {
  const [api, setApi] = React.useState<CarouselApi | undefined>(undefined)
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [activeIdx, setActiveIdx] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => {
      const idx = api.selectedScrollSnap()
      setCurrent(idx)
      setActiveIdx(idx)
    })
  }, [api])

  const active = properties[activeIdx]
  if (!active) return null


  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Price on Request'
    const fmt = (v: number) => v >= 100 ? `₹${(v / 100).toFixed(1)} Cr` : `₹${v}L`
    return min && max ? `${fmt(min)} – ${fmt(max)}` : `${fmt(min || max!)} onwards`
  }

  return (
    <section>
      <div className="container max-w-8xl mx-auto px-5 2xl:px-0">
        <div className="mb-8 text-center">
          <p className="text-dark/75 dark:text-white/75 text-base font-semibold flex gap-2 justify-center">
            <Icon icon="ph:star-fill" className="text-2xl text-primary" />
            Featured Properties
          </p>
          <h2 className="lg:text-52 text-40 font-medium text-dark dark:text-white mt-1">
            Handpicked for you
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Carousel Images */}
          <div className="relative">
            <Carousel setApi={setApi} opts={{ loop: true }}>
              <CarouselContent>
                {properties.map((prop, index) => {
                  const img =
                    prop.cover_image_url ||
                    [...(prop.property_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.url ||
                    '/images/properties/property1/property1.jpg'
                  return (
                    <CarouselItem key={prop.id}>
                      <Link href={`/properties/${prop.slug}`}>
                        <Image
                          src={img}
                          alt={prop.name}
                          width={680}
                          height={530}
                          className="rounded-2xl w-full h-[480px] object-cover"
                          unoptimized
                          priority={index === 0}
                        />
                      </Link>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
            </Carousel>

            {/* Dot indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-dark/50 rounded-full py-2.5 flex justify-center gap-2.5 px-4">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${current === index ? 'bg-white w-5' : 'bg-white/50'}`}
                />
              ))}
            </div>

            {/* Possession badge */}
            {active.possession_status && (
              <div className="absolute top-4 left-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  active.possession_status === 'Ready to Move' ? 'bg-green-500 text-white' :
                  active.possession_status === 'New Launch' ? 'bg-blue-500 text-white' :
                  'bg-orange-500 text-white'
                }`}>{active.possession_status}</span>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="flex flex-col gap-6 justify-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-white/50 mb-1">{active.developer} · {active.area}, {active.city}</p>
              <h2 className="lg:text-4xl text-3xl font-semibold text-dark dark:text-white leading-tight">
                <Link href={`/properties/${active.slug}`} className="hover:text-primary transition">
                  {active.name}
                </Link>
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Icon icon="ph:map-pin" width={18} height={18} className="text-dark/50 dark:text-white/50 flex-shrink-0" />
                <p className="text-dark/50 dark:text-white/50 text-sm">{active.location}</p>
              </div>
            </div>

            {/* Config tags */}
            {active.configuration?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {active.configuration.map(c => (
                  <span key={c} className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">{c}</span>
                ))}
                {active.carpet_area_min && active.carpet_area_max && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60 text-sm rounded-full">
                    {active.carpet_area_min}–{active.carpet_area_max} sqft
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {active.description && (
              <p className="text-base text-dark/50 dark:text-white/50 line-clamp-3">
                {active.description}
              </p>
            )}

            {/* Key stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {active.beds && (
                <div className="flex items-center gap-3">
                  <div className="bg-dark/5 dark:bg-white/5 p-2.5 rounded-lg">
                    <Icon icon="solar:bed-linear" width={24} height={24} className="text-dark dark:text-white" />
                  </div>
                  <span className="text-sm font-medium text-dark dark:text-white">{active.beds} Bedrooms</span>
                </div>
              )}
              {active.baths && (
                <div className="flex items-center gap-3">
                  <div className="bg-dark/5 dark:bg-white/5 p-2.5 rounded-lg">
                    <Icon icon="solar:bath-linear" width={24} height={24} className="text-dark dark:text-white" />
                  </div>
                  <span className="text-sm font-medium text-dark dark:text-white">{active.baths} Bathrooms</span>
                </div>
              )}
              {active.towers && (
                <div className="flex items-center gap-3">
                  <div className="bg-dark/5 dark:bg-white/5 p-2.5 rounded-lg">
                    <Icon icon="ph:buildings" width={24} height={24} className="text-dark dark:text-white" />
                  </div>
                  <span className="text-sm font-medium text-dark dark:text-white">{active.towers} Towers</span>
                </div>
              )}
              {active.land_parcel && (
                <div className="flex items-center gap-3">
                  <div className="bg-dark/5 dark:bg-white/5 p-2.5 rounded-lg">
                    <Icon icon="ph:map-trifold" width={24} height={24} className="text-dark dark:text-white" />
                  </div>
                  <span className="text-sm font-medium text-dark dark:text-white">{active.land_parcel}</span>
                </div>
              )}
            </div>

            {/* Price + CTA */}
            <div className="flex items-center gap-6">
              <Link
                href={`/properties/${active.slug}`}
                className="py-3 px-8 bg-primary hover:bg-dark duration-300 rounded-full text-white font-medium"
              >
                View Details
              </Link>
              <div>
                <h4 className="text-2xl font-bold text-dark dark:text-white">
                  {formatPrice(active.price_min, active.price_max)}
                </h4>
                {active.price_label && (
                  <p className="text-sm text-dark/50 dark:text-white/50">{active.price_label}</p>
                )}
              </div>
            </div>

            {/* Navigation */}
            {properties.length > 1 && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => api?.scrollPrev()}
                  className="p-3 rounded-full border border-gray-200 dark:border-white/20 hover:bg-primary hover:border-primary hover:text-white text-gray-500 dark:text-white/50 transition"
                >
                  <Icon icon="ph:caret-left" className="text-lg" />
                </button>
                <span className="text-sm text-gray-400">{activeIdx + 1} / {properties.length}</span>
                <button
                  onClick={() => api?.scrollNext()}
                  className="p-3 rounded-full border border-gray-200 dark:border-white/20 hover:bg-primary hover:border-primary hover:text-white text-gray-500 dark:text-white/50 transition"
                >
                  <Icon icon="ph:caret-right" className="text-lg" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
