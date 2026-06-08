import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Icon } from '@iconify/react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('id, is_featured, is_active, category, created_at')

  const { data: leads } = await supabase
    .from('leads')
    .select('id, created_at')

  const total = properties?.length ?? 0
  const featured = properties?.filter(p => p.is_featured).length ?? 0
  const active = properties?.filter(p => p.is_active).length ?? 0
  const totalLeads = leads?.length ?? 0

  // Leads in last 7 days
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const newLeads = leads?.filter(l => l.created_at > weekAgo).length ?? 0

  const stats = [
    { label: 'Total Properties', value: total, icon: 'ph:buildings', color: 'bg-blue-50 text-blue-600' },
    { label: 'Featured', value: featured, icon: 'ph:star', color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Active Listings', value: active, icon: 'ph:check-circle', color: 'bg-green-50 text-green-600' },
    { label: 'Total Leads', value: totalLeads, icon: 'ph:users', color: 'bg-purple-50 text-purple-600' },
  ]

  const byCategory = properties?.reduce((acc: Record<string, number>, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {}) ?? {}

  const quickActions = [
    { label: 'Add New Property', href: '/admin/properties/new', icon: 'ph:plus-square', desc: 'List a property with full details' },
    { label: 'Manage Properties', href: '/admin/properties', icon: 'ph:list-bullets', desc: 'Edit, feature, or remove listings' },
    { label: 'View Leads', href: '/admin/leads', icon: 'ph:users', desc: `${newLeads} new leads this week` },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back — manage your property listings and leads.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <Icon icon={s.icon} className="text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* By Category */}
      {Object.keys(byCategory).length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Properties by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(byCategory).map(([cat, count]) => (
              <div key={cat} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-500 capitalize mt-0.5">{cat.replace('-', ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map(action => (
            <Link key={action.href} href={action.href} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-primary/40 hover:shadow-md transition group">
              <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary transition">
                <Icon icon={action.icon} className="text-xl text-primary group-hover:text-white transition" />
              </div>
              <p className="font-semibold text-gray-900">{action.label}</p>
              <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
