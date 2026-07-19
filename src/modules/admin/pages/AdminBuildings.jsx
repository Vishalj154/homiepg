import { useEffect, useState } from 'react'
import ModuleShell from '../../shared/components/ModuleShell'
import SectionCard from '../../shared/components/SectionCard'
import { getAdminBuildings } from '../../../services/adminService'

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

export default function AdminBuildings() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminBuildings().then((res) => {
      if (res.data) setData(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <ModuleShell title="Super Admin" subtitle="Buildings Management" navItems={navItems} accent="from-slate-900 to-slate-700">
      <SectionCard title="All Buildings" subtitle="Manage properties">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                <tr>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">City/Area</th>
                  <th className="p-3 font-semibold">Owner</th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {data.map((row) => (
                  <tr key={row.id}>
                    <td className="p-3 font-medium">{row.name}</td>
                    <td className="p-3">{row.city} / {row.area}</td>
                    <td className="p-3">{row.owner?.full_name || 'N/A'}</td>
                    <td className="p-3 capitalize text-emerald-600">{row.status}</td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-slate-500">No buildings found.</td>
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
