import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'

export default function TenantSidebar({ mobileOpen, setMobileOpen }) {
  const { pathname } = useLocation()
  const { signOut } = useAuth()

  const links = [
    { name: 'Home', path: '/tenant', icon: '🏠' },
    { name: 'Search PG', path: '/tenant/search', icon: '🔍' },
    { name: 'Bookings', path: '/tenant/bookings', icon: '📅' },
    { name: 'Saved PGs', path: '/tenant/saved', icon: '❤️' },
    { name: 'Payments', path: '/tenant/payments', icon: '💳' },
    { name: 'Notifications', path: '/tenant/notifications', icon: '🔔' },
    { name: 'Profile', path: '/tenant/profile', icon: '👤' },
    { name: 'Settings', path: '/tenant/settings', icon: '⚙️' },
    { name: 'Support', path: '/tenant/support', icon: '🎧' },
    { name: 'About', path: '/tenant/about', icon: 'ℹ️' },
  ]

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-slate-950 text-slate-300">
      <div className="flex h-16 items-center px-6 border-b border-white/5">
        <span className="text-xl font-bold tracking-wider text-white">
          HOMIE<span className="text-cyan-500">PG</span>
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map(link => {
          const isActive = pathname === link.path || (link.path !== '/tenant' && pathname.startsWith(link.path))
          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-cyan-900/40 text-cyan-400' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.name}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-red-400 transition-all"
        >
          <span className="text-lg">🚪</span>
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden w-64 border-r border-white/10 lg:block bg-slate-950">
        <SidebarContent />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 max-w-[80%] bg-slate-950 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
