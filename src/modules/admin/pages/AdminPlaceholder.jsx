import ModuleShell from '../../shared/components/ModuleShell'

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

export default function AdminPlaceholder({ title, subtitle, description }) {
  return (
    <ModuleShell title="Super Admin" subtitle={title} navItems={navItems} accent="from-slate-900 to-slate-700">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">{subtitle}</h2>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </ModuleShell>
  )
}
