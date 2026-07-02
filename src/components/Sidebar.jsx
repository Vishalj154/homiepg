import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
      ? 'bg-homie-blue text-white'
      : 'text-gray-600 hover:bg-gray-100'
    }`

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen px-4 py-6 flex flex-col">
      <div className="flex items-center gap-2 px-2 mb-8">
        <img
          src={logo}
          alt="HomiePG"
          className="h-14 w-auto object-contain"
        />
      </div>

      <nav className="flex flex-col gap-1">
        <NavLink to="/dashboard" className={linkClass}>
          🏠 Dashboard
        </NavLink>
        <NavLink to="/buildings" className={linkClass}>
          🏢 Buildings
        </NavLink>
        <NavLink to="/tenants" className={linkClass}>
          👥 Tenants
        </NavLink>
        <NavLink to="/expenses" className={linkClass}>
          💰 Expenses
        </NavLink>
      </nav>
    </aside>
  )
}