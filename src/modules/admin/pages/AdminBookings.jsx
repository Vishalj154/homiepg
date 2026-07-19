import { useEffect, useState } from 'react'
import ModuleShell from '../../shared/components/ModuleShell'
import SectionCard from '../../shared/components/SectionCard'
import { getAdminBookings } from '../../../services/adminService'
import { supabase } from '../../../lib/supabase'

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

export default function AdminBookings() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = () => {
    getAdminBookings().then((res) => {
      if (res.data) setData(res.data)
      setLoading(false)
    })
  }

  const updateStatus = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    fetchBookings()
  }

  return (
    <ModuleShell title="Super Admin" subtitle="Bookings Management" navItems={navItems} accent="from-slate-900 to-slate-700">
      <SectionCard title="All Bookings" subtitle="Manage reservations">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                <tr>
                  <th className="p-3 font-semibold">ID</th>
                  <th className="p-3 font-semibold">Tenant</th>
                  <th className="p-3 font-semibold">Building</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {data.map((row) => (
                  <tr key={row.id}>
                    <td className="p-3 text-xs">{row.id.split('-')[0]}</td>
                    <td className="p-3">{row.tenant?.full_name || 'N/A'}</td>
                    <td className="p-3">{row.building?.name || 'N/A'}</td>
                    <td className="p-3">₹{Number(row.rent_amount) + Number(row.deposit_amount)}</td>
                    <td className="p-3 capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : row.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      {row.status === 'pending' && (
                        <button onClick={() => updateStatus(row.id, 'confirmed')} className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full hover:bg-emerald-600">Confirm</button>
                      )}
                      {row.status !== 'cancelled' && (
                        <button onClick={() => updateStatus(row.id, 'cancelled')} className="text-xs bg-rose-500 text-white px-3 py-1 rounded-full hover:bg-rose-600">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-3 text-center text-slate-500">No bookings found.</td>
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
