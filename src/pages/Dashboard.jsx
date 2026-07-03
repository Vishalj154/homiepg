import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    vacantBeds: 0,
    pendingRent: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    const { count: buildingCount } = await supabase
      .from('buildings')
      .select('*', { count: 'exact', head: true })

    const { data: beds } = await supabase
      .from('beds')
      .select('status')

    const totalBeds = beds?.length || 0
    const occupiedBeds = beds?.filter(b => b.status === 'occupied').length || 0
    const vacantBeds = beds?.filter(b => b.status === 'vacant').length || 0

    const { count: activeTenantCount } = await supabase
      .from('tenants')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    const { data: paidThisMonth } = await supabase
      .from('rent_payments')
      .select('tenant_id')
      .like('month', `${currentMonth}%`)
      .eq('status', 'paid')

    const paidIds = new Set((paidThisMonth || []).map(p => p.tenant_id))
    const pendingRent = Math.max(0, (activeTenantCount || 0) - paidIds.size)

    setStats({ totalBuildings: buildingCount || 0, totalBeds, occupiedBeds, vacantBeds, pendingRent })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <Sidebar />

      <div className="flex-1">
        <TopBar title="Dashboard" />

        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Welcome back! Here's your PG overview.</p>

          {loading ? (
            <p className="text-gray-400">Loading stats...</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
              <StatCard label="Total Buildings" value={stats.totalBuildings} icon="🏢" color="bg-blue-50 dark:bg-blue-900/30 text-homie-blue" />
              <StatCard label="Total Beds" value={stats.totalBeds} icon="🛏️" color="bg-purple-50 dark:bg-purple-900/30 text-purple-600" />
              <StatCard label="Occupied" value={stats.occupiedBeds} icon="✅" color="bg-green-50 dark:bg-green-900/30 text-homie-green" />
              <StatCard label="Vacant" value={stats.vacantBeds} icon="🔓" color="bg-orange-50 dark:bg-orange-900/30 text-orange-500" />
              <StatCard label="Pending Rent" value={stats.pendingRent} icon="⚠️" color="bg-red-50 dark:bg-red-900/30 text-red-500" />
            </div>
          )}

          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ActionCard icon="🏢" label="Manage Buildings" href="/buildings" />
            <ActionCard icon="👥" label="Manage Tenants" href="/tenants" />
            <ActionCard icon="💰" label="Expenses" href="/expenses" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex flex-col gap-2">
      <div className={`text-2xl w-10 h-10 flex items-center justify-center rounded-lg ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  )
}

function ActionCard({ icon, label, href }) {
  return (
    <a
      href={href}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-gray-700 dark:text-gray-200">{label}</span>
    </a>
  )
}