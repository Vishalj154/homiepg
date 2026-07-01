import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.jpeg'

export default function Dashboard() {
  const { profile, signOut } = useAuth()
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    vacantBeds: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    // fetch buildings count
    const { count: buildingCount } = await supabase
      .from('buildings')
      .select('*', { count: 'exact', head: true })

    // fetch all beds
    const { data: beds } = await supabase
      .from('beds')
      .select('status')

    const totalBeds = beds?.length || 0
    const occupiedBeds = beds?.filter(b => b.status === 'occupied').length || 0
    const vacantBeds = beds?.filter(b => b.status === 'vacant').length || 0

    setStats({
      totalBuildings: buildingCount || 0,
      totalBeds,
      occupiedBeds,
      vacantBeds,
    })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="HomiePG" className="h-9" />
          <span className="font-bold text-homie-blue text-lg">HomiePG</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            👋 {profile?.full_name || 'Owner'}
          </span>
          <button
            onClick={signOut}
            className="text-sm bg-red-50 text-red-500 px-4 py-1.5 rounded-lg hover:bg-red-100 transition-all"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">Welcome back! Here's your PG overview.</p>

        {/* Stats Cards */}
        {loading ? (
          <p className="text-gray-400">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard
              label="Total Buildings"
              value={stats.totalBuildings}
              icon="🏢"
              color="bg-blue-50 text-homie-blue"
            />
            <StatCard
              label="Total Beds"
              value={stats.totalBeds}
              icon="🛏️"
              color="bg-purple-50 text-purple-600"
            />
            <StatCard
              label="Occupied"
              value={stats.occupiedBeds}
              icon="✅"
              color="bg-green-50 text-homie-green"
            />
            <StatCard
              label="Vacant"
              value={stats.vacantBeds}
              icon="🔓"
              color="bg-orange-50 text-orange-500"
            />
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ActionCard icon="🏢" label="Manage Buildings" href="/buildings" />
          <ActionCard icon="👥" label="Manage Tenants" href="/tenants" />
          <ActionCard icon="💰" label="Expenses" href="/expenses" />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2">
      <div className={`text-2xl w-10 h-10 flex items-center justify-center rounded-lg ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}

function ActionCard({ icon, label, href }) {
  return (
    
      href={href}
      className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-gray-700">{label}</span>
    </a>
  )
}