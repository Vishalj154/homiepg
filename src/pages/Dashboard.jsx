import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    vacantBeds: 0,
    pendingRent: 0,
  })
  const [recentTenants, setRecentTenants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    // Buildings count
    const { count: buildingCount } = await supabase
      .from('buildings')
      .select('*', { count: 'exact', head: true })

    // Beds
    const { data: beds } = await supabase
      .from('beds')
      .select('status')

    const totalBeds = beds?.length || 0
    const occupiedBeds = beds?.filter(b => b.status === 'occupied').length || 0
    const vacantBeds = beds?.filter(b => b.status === 'vacant').length || 0

    // Active tenants count
    const { count: activeTenantCount } = await supabase
      .from('tenants')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Paid this month
    const { data: paidThisMonth } = await supabase
      .from('rent_payments')
      .select('tenant_id')
      .like('month', `${currentMonth}%`)
      .eq('status', 'paid')

    const paidIds = new Set((paidThisMonth || []).map(p => p.tenant_id))
    const pendingRent = Math.max(0, (activeTenantCount || 0) - paidIds.size)

    // Recent tenants (last 5)
    const { data: recent } = await supabase
      .from('tenants')
      .select('id, full_name, status, monthly_rent, buildings(name)')
      .order('created_at', { ascending: false })
      .limit(5)

    setStats({
      totalBuildings: buildingCount || 0,
      totalBeds,
      occupiedBeds,
      vacantBeds,
      pendingRent,
    })
    setRecentTenants(recent || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <TopBar title="Dashboard" />

        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-500 text-sm mb-8">Welcome back! Here's your PG overview.</p>

          {loading ? (
            <p className="text-gray-400">Loading stats...</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
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
              <StatCard
                label="Pending Rent"
                value={stats.pendingRent}
                icon="⚠️"
                color="bg-red-50 text-red-500"
              />
            </div>
          )}

          <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            <ActionCard icon="🏢" label="Manage Buildings" href="/buildings" />
            <ActionCard icon="👥" label="Manage Tenants" href="/tenants" />
            <ActionCard icon="💰" label="Expenses" href="/expenses" />
          </div>

          {/* Recent Tenants */}
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Tenants</h2>
          {recentTenants.length === 0 ? (
            <p className="text-gray-400 text-sm">No tenants yet. Assign someone to a bed first!</p>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Building</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Monthly Rent</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentTenants.map(t => (
                    <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50 transition-all">
                      <td className="px-5 py-3 font-medium text-gray-800">{t.full_name}</td>
                      <td className="px-5 py-3 text-gray-500">{t.buildings?.name || '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          t.status === 'active'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">₹{t.monthly_rent}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => navigate(`/tenants/${t.id}`)}
                          className="text-homie-blue font-medium text-xs hover:underline"
                        >
                          View Full Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
    <a
      href={href}
      className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-gray-700">{label}</span>
    </a>
  )
}