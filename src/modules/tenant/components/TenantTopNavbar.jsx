import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'

export default function TenantTopNavbar({ setMobileOpen }) {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/tenant/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white"
        >
          ☰
        </button>
        
        <form onSubmit={handleSearch} className="hidden sm:flex max-w-md flex-1">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search PGs, locations, landmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-slate-900 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            <span className="absolute left-3 top-2.5 text-slate-500">🔍</span>
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5">
          🌙
        </button>

        <Link to="/tenant/notifications" className="relative p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5">
          🔔
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-500"></span>
        </Link>

        <Link to="/tenant/profile" className="flex items-center gap-3 pl-2">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-medium text-white">{profile?.full_name || 'Tenant'}</span>
            <span className="text-xs text-slate-500">Verified</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
            {(profile?.full_name || user?.email || 'T')[0].toUpperCase()}
          </div>
        </Link>
      </div>
    </header>
  )
}
