import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { Metadata } from 'next'
import type { Property, PropertyUnitPlan } from '@/types/property'
import LeadGate from '@/components/Properties/LeadGate'

export const revalidate = 60

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('properties').select('name, area').eq('slug', slug).single()
  if (!data) return { title: 'Property | Bangalore Realtors' }
  return { title: `${data.name} in ${data.area} | Bangalore Realtors` }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*, property_images(id, url, sort_order), property_unit_plans(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!property) notFound()

  const p = property as Property & {
    property_images: { id: string; url: string; sort_order: number }[]
    property_unit_plans: PropertyUnitPlan[]
  }

  const images = [...(p.property_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  const mainImage = p.cover_image_url || images[0]?.url || '/images/properties/property1/property1.jpg'
  const formatPrice = (v: number) => v >= 100 ? `₹${(v / 100).toFixed(1)} Cr` : `₹${v}L`

  return (
    <LeadGate propertySlug={p.slug} propertyName={p.name}>
      <main className="pb-20">
        {/* Hero */}
        <div className="relative w-full h-[60vh] bg-gray-900">
          <Image src={mainImage} alt={p.name} fill className="object-cover opacity-90" unoptimized priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-6 left-6 flex items-center gap-2 text-white/80 text-sm">
            <Link href="/" className="hover:text-white">Home</Link>
            <Icon icon="ph:caret-right" />
            <Link href="/properties" className="hover:text-white">Properties</Link>
            <Icon icon="ph:caret-right" />
            <span className="text-white">{p.name}</span>
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-6 right-6 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Icon icon="ph:images" /> {images.length} Photos
            </div>
          )}
        </div>

        <div className="container max-w-7xl mx-auto px-5 2xl:px-0 mt-8">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* LEFT */}
            <div className="lg:col-span-2 flex flex-col gap-10">

              {/* Title + Price */}
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{p.name}</h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-1.5"><Icon icon="ph:map-pin" className="text-primary" />{p.location}</p>
                    <p className="text-gray-400 text-sm mt-0.5">By {p.developer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      {p.price_min && p.price_max ? `${formatPrice(p.price_min)} – ${formatPrice(p.price_max)}` : 'Price on Request'}
                    </p>
                    {p.price_label && <p className="text-sm text-gray-400">{p.price_label}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {p.configuration?.map(c => <span key={c} className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">{c}</span>)}
                  {p.possession_status && (
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${p.possession_status === 'Ready to Move' ? 'bg-green-100 text-green-700' : p.possession_status === 'New Launch' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{p.possession_status}</span>
                  )}
                  {p.is_featured && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full flex items-center gap-1"><Icon icon="ph:star-fill" className="text-xs" /> Featured</span>}
                </div>
              </div>

              {/* Image strip */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((img, i) => (
                    <div key={img.id} className="relative rounded-xl overflow-hidden aspect-square">
                      <Image src={img.url} alt={`${p.name} ${i + 1}`} fill className="object-cover hover:scale-105 transition" unoptimized />
                    </div>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><Icon icon="ph:buildings" className="text-primary" /> Project Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Land Parcel', value: p.land_parcel, icon: 'ph:map-trifold' },
                    { label: 'Towers', value: p.towers, icon: 'ph:building-office' },
                    { label: 'Floors', value: p.floors, icon: 'ph:stairs' },
                    { label: 'Carpet Area', value: p.carpet_area_min && p.carpet_area_max ? `${p.carpet_area_min}–${p.carpet_area_max} sqft` : null, icon: 'ph:arrows-out' },
                    { label: 'RERA No.', value: p.rera_number, icon: 'ph:certificate' },
                    { label: 'Target Possession', value: p.target_possession, icon: 'ph:calendar-check' },
                    { label: 'RERA Possession', value: p.rera_possession, icon: 'ph:calendar' },
                    { label: 'Litigation', value: p.litigation ? 'Yes' : 'No', icon: 'ph:scales' },
                  ].filter(item => item.value).map(item => (
                    <div key={item.label} className="bg-white dark:bg-white/10 rounded-xl p-4 flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0"><Icon icon={item.icon} className="text-primary text-lg" /></div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-white/50">{item.label}</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* About */}
              {p.description && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Icon icon="ph:info" className="text-primary" /> About {p.name}</h2>
                  <p className="text-gray-600 dark:text-white/70 leading-relaxed whitespace-pre-line">{p.description}</p>
                </div>
              )}

              {/* Pros & Cons */}
              {(p.pros?.length > 0 || p.cons?.length > 0) && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Icon icon="ph:scales" className="text-primary" /> Pros & Cons</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {p.pros?.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5">
                        <h3 className="font-semibold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2"><Icon icon="ph:thumbs-up" /> Pros</h3>
                        <ul className="flex flex-col gap-2">
                          {p.pros.map((pro, i) => <li key={i} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300"><Icon icon="ph:check-circle-fill" className="flex-shrink-0 mt-0.5 text-green-500" />{pro}</li>)}
                        </ul>
                      </div>
                    )}
                    {p.cons?.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-5">
                        <h3 className="font-semibold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2"><Icon icon="ph:thumbs-down" /> Cons</h3>
                        <ul className="flex flex-col gap-2">
                          {p.cons.map((con, i) => <li key={i} className="flex items-start gap-2 text-sm text-red-800 dark:text-red-300"><Icon icon="ph:x-circle-fill" className="flex-shrink-0 mt-0.5 text-red-400" />{con}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {(p.amenities_internal?.length > 0 || p.amenities_external?.length > 0) && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Icon icon="ph:star" className="text-primary" /> Amenities</h2>
                  {p.amenities_internal?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Internal</h3>
                      <div className="flex flex-wrap gap-2">
                        {p.amenities_internal.map((a, i) => <span key={i} className="px-3 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-700 dark:text-white/80">{a}</span>)}
                      </div>
                    </div>
                  )}
                  {p.amenities_external?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">External</h3>
                      <div className="flex flex-wrap gap-2">
                        {p.amenities_external.map((a, i) => <span key={i} className="px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-xl text-sm text-primary font-medium">{a}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Unit Plans */}
              {p.property_unit_plans?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Icon icon="ph:table" className="text-primary" /> Pricing & Unit Plans</h2>
                  <div className="rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-white/5">
                        <tr>{['Type', 'Carpet Area', 'Price Range'].map(h => <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-white/60 text-xs uppercase tracking-wider">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                        {[...(p.property_unit_plans as PropertyUnitPlan[])].sort((a, b) => a.sort_order - b.sort_order).map(plan => (
                          <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                            <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{plan.bhk_type}</td>
                            <td className="px-5 py-4 text-gray-600 dark:text-white/70">
                              {plan.carpet_area_min && plan.carpet_area_max ? `${plan.carpet_area_min} – ${plan.carpet_area_max} sqft` : plan.carpet_area_min ? `${plan.carpet_area_min} sqft` : '—'}
                            </td>
                            <td className="px-5 py-4 text-primary font-semibold">
                              {plan.price_min && plan.price_max ? `${formatPrice(plan.price_min)} – ${formatPrice(plan.price_max)}` : plan.price_min ? `${formatPrice(plan.price_min)} onwards` : 'On Request'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Location Highlights */}
              {p.location_highlights?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Icon icon="ph:map-pin" className="text-primary" /> Location Highlights</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {p.location_highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Icon icon="ph:map-pin-simple-fill" className="text-primary text-sm" /></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{h.place}</p>
                          {h.distance && <p className="text-xs text-primary font-semibold">{h.distance}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Google Map Embed */}
              {p.map_embed_url && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Icon icon="ph:map-trifold" className="text-primary" /> Location on Map</h2>
                  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
                    <iframe
                      src={p.map_embed_url}
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${p.name} location map`}
                    />
                  </div>
                </div>
              )}

              {/* Videos */}
              {p.video_urls?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Icon icon="ph:youtube-logo" className="text-primary" /> Videos</h2>
                  <div className="flex flex-col gap-4">
                    {p.video_urls.map((url, i) => {
                      const videoId = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/)?.[1]
                      if (!videoId) return null
                      return (
                        <div key={i} className="aspect-video rounded-2xl overflow-hidden">
                          <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title={`Video ${i + 1}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Banks */}
              {p.banks_approved?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Icon icon="ph:bank" className="text-primary" /> Approved Banks</h2>
                  <div className="flex flex-wrap gap-2">
                    {p.banks_approved.map((bank, i) => <span key={i} className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-700 dark:text-white/70 bg-white dark:bg-white/5">{bank}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 flex flex-col gap-4">
                <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Interested in this property?</h3>
                  <p className="text-sm text-gray-500 mb-5">Get pricing, brochure & schedule a site visit.</p>
                  <Link href={`/contactus?property=${encodeURIComponent(p.name)}`} className="block w-full py-3 bg-primary text-white text-center rounded-xl font-semibold hover:bg-primary/90 transition mb-3">
                    Enquire Now
                  </Link>
                  <a href="tel:+919999999999" className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white text-center rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition text-sm font-medium">
                    <Icon icon="ph:phone" /> Call Us
                  </a>
                </div>

                {p.brochure_drive_url && (
                  <a href={p.brochure_drive_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3 border-2 border-primary text-primary text-center rounded-xl hover:bg-primary hover:text-white transition font-semibold">
                    <Icon icon="ph:file-pdf" /> Download Brochure
                  </a>
                )}

                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-white/70 uppercase tracking-wider mb-3">Quick Facts</h3>
                  <div className="flex flex-col gap-2.5 text-sm">
                    {p.land_parcel && <div className="flex justify-between"><span className="text-gray-500">Land Area</span><span className="font-medium text-gray-900 dark:text-white">{p.land_parcel}</span></div>}
                    {p.towers && <div className="flex justify-between"><span className="text-gray-500">Towers</span><span className="font-medium text-gray-900 dark:text-white">{p.towers}</span></div>}
                    {p.target_possession && <div className="flex justify-between"><span className="text-gray-500">Possession</span><span className="font-medium text-gray-900 dark:text-white">{p.target_possession}</span></div>}
                    {p.rera_number && <div className="flex justify-between gap-2"><span className="text-gray-500 flex-shrink-0">RERA</span><span className="font-medium text-gray-900 dark:text-white text-right text-xs">{p.rera_number}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-500">Litigation</span><span className={`font-medium ${p.litigation ? 'text-red-500' : 'text-green-600'}`}>{p.litigation ? 'Yes' : 'None'}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LeadGate>
  )
}
