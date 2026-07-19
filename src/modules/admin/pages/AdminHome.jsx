import { useEffect, useState } from 'react'
import ModuleShell from '../../shared/components/ModuleShell'
import SectionCard from '../../shared/components/SectionCard'
import StatCard from '../../shared/components/StatCard'
import { getAdminStats, getAdminOwners, getAdminBookings } from '../../../services/adminService'
import { ticketRows } from '../data/mockData' // Keeping tickets mock for now

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: '📊' },
  { label: 'Owners', to: '/admin/owners', icon: '🏢' },
  { label: 'Tenants', to: '/admin/tenants', icon: '👤' },
  { label: 'Buildings', to: '/admin/buildings', icon: '🏬' },
  { label: 'Rooms', to: '/admin/rooms', icon: '🛏️' },
  { label: 'Beds', to: '/admin/beds', icon: '🛌' },
  { label: 'Bookings', to: '/admin/bookings', icon: '📅' },
  { label: 'Payments', to: '/admin/payments', icon: '💳' },
  { label: 'Subscriptions', to: '/admin/subscriptions', icon: '✨' },
  { label: 'KYC', to: '/admin/kyc', icon: '🪪' },
  { label: 'Support', to: '/admin/support', icon: '🆘' },
  { label: 'Reports', to: '/admin/reports', icon: '📈' },
  { label: 'Notifications', to: '/admin/notifications', icon: '🔔' },
  { label: 'Settings', to: '/admin/settings', icon: '⚙️' },
  { label: 'Profile', to: '/admin/profile', icon: '👩‍💼' },
  { label: 'Login', to: '/admin/login', icon: '🔐' },
]

export default function AdminHome() {
  const [stats, setStats] = useState([])
  const [owners, setOwners] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [statsRes, ownersRes, bookingsRes] = await Promise.all([
        getAdminStats(),
        getAdminOwners(),
        getAdminBookings()
      ])

      if (statsRes.data) {
        const d = statsRes.data
        setStats([
          { title: 'Total Users', value: String(d.total_users), detail: 'Across platform', icon: '👥' },
          { title: 'Active Tenants', value: String(d.active_tenants), detail: 'Currently renting', icon: '👤' },
          { title: 'Properties', value: String(d.total_buildings), detail: 'Listed buildings', icon: '🏢' },
          { title: 'Revenue (Monthly)', value: `₹${d.monthly_revenue || 0}`, detail: 'Total confirmed', icon: '💰' }
        ])
      } else {
        setStats([])
      }

      if (ownersRes.data) setOwners(ownersRes.data.slice(0, 5))
      if (bookingsRes.data) setBookings(bookingsRes.data.slice(0, 5))

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <ModuleShell title="Super Admin" subtitle="Operations dashboard" navItems={navItems} accent="from-slate-900 to-slate-700">
        <div className="p-8 text-slate-600">Loading dashboard...</div>
      </ModuleShell>
    )
  }

  return (
    <ModuleShell title="Super Admin" subtitle="Operations dashboard" navItems={navItems} accent="from-slate-900 to-slate-700">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} detail={stat.detail} icon={stat.icon} accent="text-slate-700 dark:text-slate-100" />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <SectionCard title="Revenue trend" subtitle="Performance overview">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
              Line and bar chart placeholder for platform performance.
            </div>
          </SectionCard>
          <SectionCard title="System status" subtitle="Platform health">
            <div className="space-y-3">
              {['Supabase connection healthy', 'Pending KYC 14', 'Support tickets 8'].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">{item}</div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard title="Recent bookings" subtitle="Latest reservations">
            <div className="space-y-3">
              {bookings.length > 0 ? bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                  <div>
                    <p className="font-semibold text-xs text-slate-500 mb-1">ID: {booking.id.split('-')[0]}</p>
                    <p className="text-sm">{booking.tenant?.full_name || 'Unknown Tenant'} • {booking.building?.name || 'Unknown Building'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{Number(booking.rent_amount) + Number(booking.deposit_amount)}</p>
                    <p className="text-xs capitalize text-slate-500">{booking.status}</p>
                  </div>
                </div>
              )) : (
                <p className="text-slate-500">No recent bookings.</p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Latest owners" subtitle="New and active owners">
            <div className="space-y-3">
              {owners.length > 0 ? owners.map((owner) => (
                <div key={owner.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                  <div>
                    <p className="font-semibold">{owner.full_name}</p>
                    <p className="text-sm text-slate-500">{owner.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold capitalize text-emerald-600">{owner.status || 'Active'}</p>
                  </div>
                </div>
              )) : (
                <p className="text-slate-500">No owners found.</p>
              )}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Support queue" subtitle="Open tickets requiring attention">
          <div className="space-y-3">
            {ticketRows.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                <div>
                  <p className="font-semibold">{ticket.title}</p>
                  <p className="text-sm text-slate-500">{ticket.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{ticket.priority}</p>
                  <p className="text-sm text-slate-500">{ticket.status}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </ModuleShell>
  )
}
