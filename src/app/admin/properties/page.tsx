'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import type { Property } from '@/types/property'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    setProperties(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('properties').update({ is_featured: !current }).eq('id', id)
    setProperties(prev => prev.map(p => p.id === id ? { ...p, is_featured: !current } : p))
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('properties').update({ is_active: !current }).eq('id', id)
    setProperties(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p))
  }

  const deleteProperty = async (id: string) => {
    if (!confirm('Delete this property? This cannot be undone.')) return
    setDeleting(id)
    await supabase.from('properties').delete().eq('id', id)
    setProperties(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return '—'
    if (min && max) return `₹${min}L – ₹${max}L`
    return `₹${min || max}L`
  }

  const filtered = properties.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.area.toLowerCase().includes(search.toLowerCase()) ||
    p.developer.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 text-sm mt-1">{properties.length} total listings</p>
        </div>
        <Link href="/admin/properties/new" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition">
          <Icon icon="ph:plus" /> Add Property
        </Link>
      </div>

      <div className="relative mb-6">
        <Icon icon="ph:magnifying-glass" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
          placeholder="Search by name, area, or developer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Icon icon="ph:circle-notch" className="animate-spin text-3xl" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Icon icon="ph:buildings" className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No properties found</p>
          <Link href="/admin/properties/new" className="text-primary text-sm mt-2 inline-block hover:underline">Add your first property →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Property</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Price</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Category</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Featured</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Active</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(property => (
                <tr key={property.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {property.cover_image_url ? (
                        <Image src={property.cover_image_url} alt={property.name} width={48} height={48} className="w-12 h-12 rounded-xl object-cover" unoptimized />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Icon icon="ph:buildings" className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{property.name}</p>
                        <p className="text-xs text-gray-500">{property.area} · {property.developer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-900">{formatPrice(property.price_min, property.price_max)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">{property.category?.replace('-', ' ')}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => toggleFeatured(property.id, property.is_featured)} className={`text-xl transition ${property.is_featured ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`}>
                      <Icon icon={property.is_featured ? 'ph:star-fill' : 'ph:star'} />
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => toggleActive(property.id, property.is_active)} className={`w-10 h-5 rounded-full transition-colors ${property.is_active ? 'bg-primary' : 'bg-gray-200'} relative`}>
                      <span className={`block w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-all ${property.is_active ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/properties/${property.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition" title="View">
                        <Icon icon="ph:eye" />
                      </Link>
                      <Link href={`/admin/properties/${property.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                        <Icon icon="ph:pencil" />
                      </Link>
                      <button onClick={() => deleteProperty(property.id)} disabled={deleting === property.id} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50" title="Delete">
                        {deleting === property.id ? <Icon icon="ph:circle-notch" className="animate-spin" /> : <Icon icon="ph:trash" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
