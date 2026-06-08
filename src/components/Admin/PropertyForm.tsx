'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Icon } from '@iconify/react'
import type { Property, PropertyUnitPlan } from '@/types/property'
import Image from 'next/image'

type Props = {
  property?: Property & { property_unit_plans?: PropertyUnitPlan[] }
  isEdit?: boolean
}

const PROPERTY_TYPES = ['APARTMENT', 'VILLA', 'PLOT', 'OFFICE SPACE']
const POSSESSION_STATUSES = ['New Launch', 'Under Construction', 'Ready to Move']

export default function PropertyForm({ property, isEdit = false }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: property?.name ?? '',
    slug: property?.slug ?? '',
    developer: property?.developer ?? '',
    category: property?.category ?? 'apartment',
    location: property?.location ?? '',
    area: property?.area ?? '',
    city: property?.city ?? 'Bangalore',
    land_parcel: property?.land_parcel ?? '',
    towers: property?.towers ?? '',
    floors: property?.floors ?? '',
    configuration: property?.configuration?.join(', ') ?? '',
    sba_raw: property?.carpet_area_min
      ? `${property.carpet_area_min}${property.carpet_area_max ? ` - ${property.carpet_area_max}` : ''} sqft`
      : '',
    possession_status: property?.possession_status ?? 'New Launch',
    target_possession: property?.target_possession ?? '',
    price_label: property?.price_label ?? '',
    rera_number: property?.rera_number ?? '',
    brochure_drive_url: property?.brochure_drive_url ?? '',
    map_embed_url: property?.map_embed_url ?? '',
    description: property?.description ?? '',
    pros: property?.pros?.join('\n') ?? '',
    cons: property?.cons?.join('\n') ?? '',
    amenities_internal: property?.amenities_internal?.join('\n') ?? '',
    amenities_external: property?.amenities_external?.join('\n') ?? '',
    location_highlights: property?.location_highlights
      ?.map((h: { place: string; distance: string }) => `${h.place}|${h.distance}`).join('\n') ?? '',
    video_urls: property?.video_urls?.join('\n') ?? '',
    banks_approved: property?.banks_approved?.join(', ') ?? '',
    cover_image_url: property?.cover_image_url ?? '',
    is_featured: property?.is_featured ?? false,
    is_active: property?.is_active ?? true,
  })

  const [images, setImages] = useState<{ url: string; sort_order: number }[]>(
    property?.property_images?.map((img: { url: string; sort_order: number }) => ({ url: img.url, sort_order: img.sort_order })) ?? []
  )

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadingImages(true)
    const uploaded: { url: string; sort_order: number }[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('property-images').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('property-images').getPublicUrl(path)
        uploaded.push({ url: data.publicUrl, sort_order: images.length + uploaded.length })
      }
    }
    const newImages = [...images, ...uploaded]
    setImages(newImages)
    if (!form.cover_image_url && uploaded.length) set('cover_image_url', uploaded[0].url)
    setUploadingImages(false)
  }

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx)
    setImages(updated)
    if (form.cover_image_url === images[idx]?.url) set('cover_image_url', updated[0]?.url ?? '')
  }

  const parseLines = (str: string) => str.split('\n').map(s => s.trim()).filter(Boolean)
  const parseHighlights = (str: string) => parseLines(str).map(line => {
    const [place, distance] = line.split('|')
    return { place: place?.trim() ?? line, distance: distance?.trim() ?? '' }
  })
  const parseSBA = (sba: string) => {
    const nums = sba.replace(/[^0-9\-\s]/g, ' ').trim().split(/[\s\-to]+/).map(Number).filter(n => n > 0)
    return { min: nums[0] ?? null, max: nums[1] ?? null }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const sba = parseSBA(form.sba_raw)
    const payload = {
      name: form.name,
      slug: form.slug || autoSlug(form.name),
      developer: form.developer,
      category: (form.category.toLowerCase().replace(' ', '-')) as Property['category'],
      location: form.location,
      area: form.area || form.location,
      city: form.city,
      land_parcel: form.land_parcel || null,
      towers: form.towers || null,
      floors: form.floors || null,
      configuration: parseLines(form.configuration.replace(/,/g, '\n')),
      carpet_area_min: sba.min,
      carpet_area_max: sba.max,
      possession_status: form.possession_status,
      target_possession: form.target_possession || null,
      price_label: form.price_label || null,
      price_min: null, price_max: null,
      rera_number: form.rera_number || null,
      brochure_drive_url: form.brochure_drive_url || null,
      map_embed_url: form.map_embed_url || null,
      description: form.description || null,
      pros: parseLines(form.pros),
      cons: parseLines(form.cons),
      amenities_internal: parseLines(form.amenities_internal),
      amenities_external: parseLines(form.amenities_external),
      location_highlights: parseHighlights(form.location_highlights),
      video_urls: parseLines(form.video_urls),
      banks_approved: parseLines(form.banks_approved.replace(/,/g, '\n')),
      cover_image_url: form.cover_image_url || images[0]?.url || null,
      is_featured: form.is_featured,
      is_active: form.is_active,
      beds: null, baths: null, area_sqft: null,
      rera_possession: null, litigation: false,
    }
    let propertyId = property?.id
    if (isEdit && property?.id) {
      const { error } = await supabase.from('properties').update(payload).eq('id', property.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { data, error } = await supabase.from('properties').insert(payload).select('id').single()
      if (error) { setError(error.message); setSaving(false); return }
      propertyId = data.id
    }
    if (propertyId) {
      if (isEdit) await supabase.from('property_images').delete().eq('property_id', propertyId)
      if (images.length) {
        await supabase.from('property_images').insert(
          images.map((img, i) => ({ property_id: propertyId, url: img.url, sort_order: i }))
        )
      }
    }
    router.push('/admin/properties')
    router.refresh()
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
  const lbl = "text-sm font-medium text-gray-700 block mb-1.5"
  const box = "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6"
  const ta = `${inp} resize-none`

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Property' : 'Add New Property'}</h1>
          <p className="text-xs text-gray-400 mt-1">Fields match your Google Form / CSV columns</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60 flex items-center gap-2">
            {saving && <Icon icon="ph:circle-notch" className="animate-spin" />}
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create Property'}
          </button>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
          <Icon icon="ph:warning-circle" /> {error}
        </div>
      )}

      <div className={box}>
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Icon icon="ph:info" className="text-primary" /> Basic Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Project Name * <span className="text-gray-400 font-normal text-xs">(PROJECT NAME)</span></label>
            <input required className={inp} value={form.name} onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', autoSlug(e.target.value)) }} placeholder="Northen Lights" />
          </div>
          <div>
            <label className={lbl}>Builder Name * <span className="text-gray-400 font-normal text-xs">(BUILDER NAME)</span></label>
            <input required className={inp} value={form.developer} onChange={e => set('developer', e.target.value)} placeholder="Purva" />
          </div>
          <div>
            <label className={lbl}>Property Type <span className="text-gray-400 font-normal text-xs">(PROPERTY TYPE)</span></label>
            <select className={inp} value={form.category} onChange={e => set('category', e.target.value)}>
              {PROPERTY_TYPES.map(t => <option key={t} value={t.toLowerCase().replace(' ', '-')}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>URL Slug *</label>
            <input required className={inp} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="northen-lights" />
          </div>
          <div className="col-span-2 flex gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-medium text-gray-700">⭐ Featured on Homepage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-medium text-gray-700">Active (Published)</span>
            </label>
          </div>
        </div>
      </div>

      <div className={box}>
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Icon icon="ph:map-pin" className="text-primary" /> Location</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={lbl}>Location * <span className="text-gray-400 font-normal text-xs">(LOCATION)</span></label>
            <input required className={inp} value={form.location} onChange={e => set('location', e.target.value)} placeholder="KIADB Aerospace Park" />
          </div>
          <div>
            <label className={lbl}>Locality / Area</label>
            <input className={inp} value={form.area} onChange={e => set('area', e.target.value)} placeholder="Devanahalli" />
          </div>
          <div>
            <label className={lbl}>City</label>
            <input className={inp} value={form.city} onChange={e => set('city', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={lbl}>Google Maps Embed URL</label>
            <input className={inp} value={form.map_embed_url} onChange={e => set('map_embed_url', e.target.value)} placeholder="Paste the src= URL from Google Maps → Share → Embed a map" />
          </div>
          <div className="col-span-2">
            <label className={lbl}>Location Highlights <span className="text-gray-400 font-normal text-xs">(Place | Distance)</span></label>
            <textarea className={ta} rows={3} value={form.location_highlights} onChange={e => set('location_highlights', e.target.value)} placeholder={"BIAL Airport | 6 km\nNexus Forum Mall | 8 km"} />
          </div>
        </div>
      </div>

      <div className={box}>
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Icon icon="ph:buildings" className="text-primary" /> Project Details <span className="text-xs text-gray-400 font-normal ml-1">(matches CSV columns)</span></h2>
        <div className="grid grid-cols-3 gap-4">
          <div><label className={lbl}>Land Parcel <span className="text-gray-400 font-normal text-xs">(LAND PARCEL)</span></label><input className={inp} value={form.land_parcel} onChange={e => set('land_parcel', e.target.value)} placeholder="25 Acres" /></div>
          <div><label className={lbl}>Towers <span className="text-gray-400 font-normal text-xs">(TOWERS)</span></label><input className={inp} value={form.towers} onChange={e => set('towers', e.target.value)} placeholder="8" /></div>
          <div><label className={lbl}>Floors <span className="text-gray-400 font-normal text-xs">(FLOORS)</span></label><input className={inp} value={form.floors} onChange={e => set('floors', e.target.value)} placeholder="2B+G+30/31" /></div>
          <div><label className={lbl}>Config <span className="text-gray-400 font-normal text-xs">(CONFIG)</span></label><input className={inp} value={form.configuration} onChange={e => set('configuration', e.target.value)} placeholder="2BHK, 3BHK, 4BHK" /></div>
          <div><label className={lbl}>SBA <span className="text-gray-400 font-normal text-xs">(SBA)</span></label><input className={inp} value={form.sba_raw} onChange={e => set('sba_raw', e.target.value)} placeholder="1200 - 4500 Sqft" /></div>
          <div><label className={lbl}>Possession <span className="text-gray-400 font-normal text-xs">(POSSESSION)</span></label><input className={inp} value={form.target_possession} onChange={e => set('target_possession', e.target.value)} placeholder="2031" /></div>
          <div><label className={lbl}>Price <span className="text-gray-400 font-normal text-xs">(PRICE — as entered)</span></label><input className={inp} value={form.price_label} onChange={e => set('price_label', e.target.value)} placeholder="1.4Cr onwards" /></div>
          <div><label className={lbl}>RERA Number <span className="text-gray-400 font-normal text-xs">(RERA NUMBER)</span></label><input className={inp} value={form.rera_number} onChange={e => set('rera_number', e.target.value)} placeholder="PRM/KA/RERA/..." /></div>
          <div>
            <label className={lbl}>Possession Status</label>
            <select className={inp} value={form.possession_status} onChange={e => set('possession_status', e.target.value)}>
              {POSSESSION_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className={box}>
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Icon icon="ph:image" className="text-primary" /> Media</h2>
        <div className="mb-5">
          <label className={lbl}>Property Images <span className="text-gray-400 font-normal text-xs">(IMAGES)</span></label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-primary/50 transition" onClick={() => imageInputRef.current?.click()}>
            <Icon icon="ph:upload-simple" className="text-3xl text-gray-400 mx-auto mb-1" />
            <p className="text-sm text-gray-500">Click to upload images</p>
          </div>
          <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          {uploadingImages && <p className="text-sm text-primary mt-2 flex items-center gap-1"><Icon icon="ph:circle-notch" className="animate-spin" /> Uploading...</p>}
          {images.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden group border-2" style={{ borderColor: form.cover_image_url === img.url ? '#07be8a' : 'transparent' }}>
                  <Image src={img.url} alt="" width={120} height={90} className="w-full h-20 object-cover" unoptimized />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                    <button type="button" onClick={() => set('cover_image_url', img.url)} className="text-white text-xs bg-primary px-2 py-0.5 rounded">Cover</button>
                    <button type="button" onClick={() => removeImage(idx)} className="text-white text-xs bg-red-500 px-2 py-0.5 rounded">Remove</button>
                  </div>
                  {form.cover_image_url === img.url && <div className="absolute top-1 left-1 bg-primary text-white text-xs px-1 py-0.5 rounded">Cover</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mb-5">
          <label className={lbl}>Brochure — Google Drive Link <span className="text-gray-400 font-normal text-xs">(BROCHURE)</span></label>
          <input className={inp} value={form.brochure_drive_url} onChange={e => set('brochure_drive_url', e.target.value)} placeholder="https://drive.google.com/open?id=..." />
        </div>
        <div>
          <label className={lbl}>YouTube Video URLs <span className="text-gray-400 font-normal text-xs">(one per line)</span></label>
          <textarea className={ta} rows={2} value={form.video_urls} onChange={e => set('video_urls', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
        </div>
      </div>

      <div className={box}>
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Icon icon="ph:dots-three" className="text-primary" /> Optional Details</h2>
        <div className="flex flex-col gap-4">
          <div><label className={lbl}>About / Description</label><textarea className={ta} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the project..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={lbl}>Pros <span className="text-gray-400 font-normal text-xs">(one per line)</span></label><textarea className={ta} rows={4} value={form.pros} onChange={e => set('pros', e.target.value)} placeholder={"Prime location\nReady to move"} /></div>
            <div><label className={lbl}>Cons <span className="text-gray-400 font-normal text-xs">(one per line)</span></label><textarea className={ta} rows={4} value={form.cons} onChange={e => set('cons', e.target.value)} placeholder={"Traffic on main road\nHigh density"} /></div>
            <div><label className={lbl}>Internal Amenities <span className="text-gray-400 font-normal text-xs">(one per line)</span></label><textarea className={ta} rows={4} value={form.amenities_internal} onChange={e => set('amenities_internal', e.target.value)} placeholder={"Vitrified Tiles\nModular Kitchen"} /></div>
            <div><label className={lbl}>External Amenities <span className="text-gray-400 font-normal text-xs">(one per line)</span></label><textarea className={ta} rows={4} value={form.amenities_external} onChange={e => set('amenities_external', e.target.value)} placeholder={"Swimming Pool\nClubhouse\nGym"} /></div>
          </div>
          <div><label className={lbl}>Approved Banks <span className="text-gray-400 font-normal text-xs">(comma separated)</span></label><input className={inp} value={form.banks_approved} onChange={e => set('banks_approved', e.target.value)} placeholder="HDFC Bank, SBI, ICICI Bank" /></div>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
        <button type="submit" disabled={saving} className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60 flex items-center gap-2">
          {saving && <Icon icon="ph:circle-notch" className="animate-spin" />}
          {saving ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  )
}
