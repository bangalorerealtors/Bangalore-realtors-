import AdminSidebar from '@/components/Admin/Sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Bangalore Realtors',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
