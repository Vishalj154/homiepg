import { useEffect, useState } from 'react'
import ModuleShell from '../../shared/components/ModuleShell'
import SectionCard from '../../shared/components/SectionCard'
import { getAdminTenants } from '../../../services/adminService'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: '📊' },
  { label: 'Owners', to: '/admin/owners', icon: '🏢' },
  { label: 'Tenants', to: '/admin/tenants', icon: '👤' },
  { label: 'Buildings', to: '/admin/buildings', icon: '🏬' },
  { label: 'Rooms', to: '/admin/rooms', icon: '🛏️' },
  { label: 'Beds', to: '/admin/beds', icon: '🛌' },
  { label: 'Bookings', to: '/admin/bookings', icon: '📅' },
  { label: 'Payments', to: '/admin/payments', icon: '💳' },
  { label: 'Settings', to: '/admin/settings', icon: '⚙️' },
]

export default function AdminTenants() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminTenants().then((res) => {
      if (res.data) setData(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <ModuleShell title="Super Admin" subtitle="Tenants Management" navItems={navItems} accent="from-slate-900 to-slate-700">
      <SectionCard title="All Tenants" subtitle="Manage registered tenants">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                <tr>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {data.map((row) => (
                  <tr key={row.id}>
                    <td className="p-3">{row.full_name}</td>
                    <td className="p-3">{row.email}</td>
                    <td className="p-3">{new Date(row.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-3 text-center text-slate-500">No tenants found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </ModuleShell>
  )
}
