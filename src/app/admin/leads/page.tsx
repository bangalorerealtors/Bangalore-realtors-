import { createClient } from '@/lib/supabase/server'

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-500 text-sm mt-1">{leads?.length ?? 0} enquiries received</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Name', 'Phone', 'Property', 'Date'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads?.length === 0 && (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">No leads yet</td></tr>
            )}
            {leads?.map(lead => (
              <tr key={lead.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">{lead.full_name}</td>
                <td className="px-6 py-4 text-gray-600">
                  <a href={`tel:${lead.phone}`} className="hover:text-primary">{lead.phone}</a>
                </td>
                <td className="px-6 py-4 text-gray-600">{lead.property_name ?? '—'}</td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
