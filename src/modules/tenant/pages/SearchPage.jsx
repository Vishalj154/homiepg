import ModuleShell from '../../shared/components/ModuleShell'
import SectionCard from '../../shared/components/SectionCard'
import { featuredPgs } from '../data/mockData'

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

export default function SearchPage() {
  return (
    <ModuleShell title="Tenant Module" subtitle="Search PG" navItems={navItems} accent="from-violet-500 to-cyan-600">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Filters" subtitle="Refine your stay preferences">
          <div className="space-y-3">
            {['City', 'Area', 'Rent Range', 'Gender', 'Food', 'AC', 'Parking', 'WiFi', 'Laundry', 'Gym', 'Security', 'Occupancy'].map((filter) => (
              <div key={filter} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                <p className="text-sm font-medium">{filter}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Matching PGs" subtitle="Discover the best fit for your routine">
          <div className="grid gap-4 md:grid-cols-2">
            {featuredPgs.map((pg) => (
              <div key={pg.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <img src={pg.image} alt={pg.name} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{pg.name}</h4>
                      <p className="text-sm text-slate-500">{pg.area}, {pg.city}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">★ {pg.rating}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pg.amenities.map((item) => <span key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item}</span>)}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-semibold text-cyan-600">{pg.rent}</p>
                    <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-cyan-600">Save</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </ModuleShell>
  )
}
