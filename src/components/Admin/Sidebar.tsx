'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: 'ph:squares-four' },
  { label: 'Properties', href: '/admin/properties', icon: 'ph:buildings' },
  { label: 'Add Property', href: '/admin/properties/new', icon: 'ph:plus-square' },
  { label: 'Bulk Upload', href: '/admin/properties/bulk', icon: 'ph:upload-simple' },
  { label: 'Leads', href: '/admin/leads', icon: 'ph:users' },
  { label: 'View Site', href: '/', icon: 'ph:arrow-square-out', external: true },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Don't show sidebar on login page
  if (pathname === '/admin/login') return null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Icon icon="ph:buildings-fill" className="text-primary text-xl" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">Bangalore Realtors</p>
            <p className="text-xs text-white/40">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map(item => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon icon={item.icon} className="text-lg flex-shrink-0" />
              {item.label}
              {item.external && <Icon icon="ph:arrow-square-out" className="text-xs ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition w-full"
        >
          <Icon icon="ph:sign-out" className="text-lg" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
