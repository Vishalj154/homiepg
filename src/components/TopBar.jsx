import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'

export default function TopBar({ title }) {
  const { profile, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  // Search
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const debounceRef = useRef(null)
  const searchRef = useRef(null)

  // Bell
  const [bellOpen, setBellOpen] = useState(false)
  const bellRef = useRef(null)

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
        setSearchExpanded(false)
        setQuery('')
        setResults([])
      }
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleQueryChange(e) {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    if (!val.trim()) {
      setResults([])
      setSearchOpen(false)
      return
    }
    debounceRef.current = setTimeout(() => runSearch(val.trim()), 300)
  }

  async function runSearch(q) {
    const [{ data: buildings }, { data: tenants }] = await Promise.all([
      supabase
        .from('buildings')
        .select('id, name, city')
        .ilike('name', `%${q}%`)
        .limit(3),
      supabase
        .from('tenants')
        .select('id, full_name, status')
        .ilike('full_name', `%${q}%`)
        .limit(3),
    ])

    const buildingResults = (buildings || []).map(b => ({
      id: b.id,
      label: b.name,
      sub: b.city || 'Building',
      icon: '🏢',
      href: `/buildings/${b.id}`,
    }))
    const tenantResults = (tenants || []).map(t => ({
      id: t.id,
      label: t.full_name,
      sub: t.status === 'active' ? 'Active Tenant' : 'Tenant',
      icon: '👤',
      href: `/tenants/${t.id}`,
    }))

    const combined = [...buildingResults, ...tenantResults].slice(0, 5)
    setResults(combined)
    setSearchOpen(combined.length > 0)
  }

  function handleResultClick(href) {
    navigate(href)
    setSearchOpen(false)
    setSearchExpanded(false)
    setQuery('')
    setResults([])
  }

  async function handleSignOut() {
    navigate('/')
    await signOut()
  }

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 px-6 py-3 flex items-center justify-between gap-4">
      {/* Page title */}
      <h1 className="text-lg font-bold text-gray-800 dark:text-white shrink-0">{title}</h1>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Search — desktop */}
        <div className="relative hidden md:block" ref={searchRef}>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 w-56 focus-within:ring-2 focus-within:ring-homie-blue/40 transition-all">
            <span className="text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search buildings, tenants..."
              value={query}
              onChange={handleQueryChange}
              className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 w-full focus:outline-none"
            />
          </div>

          {searchOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
              {results.map(r => (
                <button
                  key={r.href}
                  onClick={() => handleResultClick(r.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-left"
                >
                  <span className="text-lg">{r.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{r.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{r.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search — mobile icon */}
        <div className="relative md:hidden" ref={searchExpanded ? searchRef : null}>
          {!searchExpanded ? (
            <button
              onClick={() => setSearchExpanded(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            >
              🔍
            </button>
          ) : (
            <div ref={searchRef} className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleQueryChange}
                className="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 rounded-xl px-3 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-homie-blue/40"
              />
              {searchOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                  {results.map(r => (
                    <button
                      key={r.href}
                      onClick={() => handleResultClick(r.href)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-left"
                    >
                      <span className="text-lg">{r.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{r.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{r.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen(o => !o)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all text-lg"
            title="Notifications"
          >
            🔔
          </button>
          {bellOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Notifications</p>
              </div>
              <div className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                🔔 No new notifications.
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light toggle */}
        <button
          onClick={toggle}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all text-lg"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* User greeting */}
        <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
          👋 {profile?.full_name || 'Owner'}
        </span>
      </div>
    </div>
  )
}