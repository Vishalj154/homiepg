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

export default function BookingPage() {
  return (
    <ModuleShell title="Tenant Module" subtitle="Booking" navItems={navItems} accent="from-violet-500 to-cyan-600">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <SectionCard title="Booking summary" subtitle="Selected bed confirmation">
          <div className="space-y-3">
            {[
              ['Selected bed', 'A1'],
              ['Property', 'Skyline Nest PG'],
              ['Rent', '₹14,500'],
              ['Deposit', '₹5,000'],
              ['Booking amount', '₹19,500'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Terms" subtitle="Please read before reserving">
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>• Deposit is refundable subject to policy.</p>
            <p>• Advance rent is collected on booking confirmation.</p>
            <p>• Bed reservation is pending owner confirmation.</p>
          </div>
          <button className="mt-4 w-full rounded-full bg-cyan-600 px-4 py-3 font-semibold text-white">Reserve bed</button>
        </SectionCard>
      </div>
    </ModuleShell>
  )
}
