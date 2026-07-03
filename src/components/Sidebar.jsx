import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

const NAV_ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/buildings', icon: '🏢', label: 'Buildings' },
  { to: '/tenants', icon: '👥', label: 'Tenants' },
  { to: '/expenses', icon: '💰', label: 'Expenses' },
  { to: '/profile', icon: '👤', label: 'Profile' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-homie-blue text-white'
        : 'text-gray-600 hover:bg-gray-100'
    } ${collapsed ? 'justify-center' : ''}`

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-white border-r border-gray-100 min-h-screen flex flex-col transition-all duration-200 shrink-0`}
    >
      {/* Logo + toggle */}
      <div className={`flex items-center px-3 py-5 mb-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <img
            src={logo}
            alt="HomiePG"
            className="h-12 w-auto object-contain"
          />
        )}
        {collapsed && (
          <span className="text-xl">🏡</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all text-sm font-bold ${collapsed ? 'mt-0' : ''}`}
        >
          {collapsed ? '››' : '‹‹'}
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={linkClass}
            title={collapsed ? label : undefined}
          >
            <span className="text-lg shrink-0">{icon}</span>
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}