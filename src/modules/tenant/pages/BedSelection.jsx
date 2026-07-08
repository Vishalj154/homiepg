import ModuleShell from '../../shared/components/ModuleShell'
import SectionCard from '../../shared/components/SectionCard'

const navItems = [
  { label: 'Home', to: '/tenant', icon: '🏠' },
  { label: 'Search PG', to: '/tenant/search', icon: '🔎' },
  { label: 'Bookings', to: '/tenant/bookings', icon: '📅' },
  { label: 'Saved PGs', to: '/tenant/saved', icon: '💛' },
  { label: 'Payments', to: '/tenant/payments', icon: '💳' },
  { label: 'Notifications', to: '/tenant/notifications', icon: '🔔' },
  { label: 'Profile', to: '/tenant/profile', icon: '👤' },
  { label: 'Settings', to: '/tenant/settings', icon: '⚙️' },
  { label: 'Support', to: '/tenant/support', icon: '🆘' },
  { label: 'About', to: '/tenant/about', icon: 'ℹ️' },
]

const beds = [
  { id: 'A1', status: 'Available' },
  { id: 'A2', status: 'Occupied' },
  { id: 'A3', status: 'Reserved' },
  { id: 'A4', status: 'Maintenance' },
]

export default function BedSelection() {
  return (
    <ModuleShell title="Tenant Module" subtitle="Bed Selection" navItems={navItems} accent="from-violet-500 to-cyan-600">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Legend" subtitle="Understand bed availability">
          <div className="space-y-3">
            {[
              ['Available', 'bg-emerald-500'],
              ['Occupied', 'bg-rose-500'],
              ['Reserved', 'bg-amber-500'],
              ['Maintenance', 'bg-slate-500'],
            ].map(([label, color]) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                <span className={`h-3 w-3 rounded-full ${color}`} />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Room layout" subtitle="Choose an available bed">
          <div className="grid gap-3 sm:grid-cols-2">
            {beds.map((bed) => {
              const isAvailable = bed.status === 'Available'
              return (
                <button key={bed.id} disabled={!isAvailable} className={`rounded-2xl border p-4 text-left transition ${isAvailable ? 'border-emerald-400 bg-emerald-50 hover:shadow-md dark:bg-emerald-950/20' : 'border-slate-200 bg-slate-50 opacity-70 dark:border-slate-800 dark:bg-slate-800/60'}`}>
                  <p className="text-lg font-semibold">Bed {bed.id}</p>
                  <p className="mt-1 text-sm text-slate-500">{bed.status}</p>
                </button>
              )
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <a href="/tenant/booking" className="rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white">Continue to booking</a>
          </div>
        </SectionCard>
      </div>
    </ModuleShell>
  )
}
