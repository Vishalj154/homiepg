import ModuleShell from '../../shared/components/ModuleShell'

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

export default function PlaceholderPage({ title, subtitle, description }) {
  return (
    <ModuleShell title="Tenant Module" subtitle={title} navItems={navItems} accent="from-violet-500 to-cyan-600">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">{subtitle}</h2>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{description}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {['Responsive layout', 'Reusable components', 'Dummy data ready'].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-800/60">{item}</div>
          ))}
        </div>
      </div>
    </ModuleShell>
  )
}
