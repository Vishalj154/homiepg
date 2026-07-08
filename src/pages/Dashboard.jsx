import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'

const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
const lastSixMonths = Array.from({ length: 6 }, (_, offset) => {
  const date = new Date()
  date.setMonth(date.getMonth() - (5 - offset))
  return date.toISOString().slice(0, 7)
})

const CATEGORY_COLORS = {
  electricity: '#f97316',
  water: '#38bdf8',
  salary: '#22c55e',
  internet: '#8b5cf6',
  repairs: '#f59e0b',
  grocery: '#ec4899',
  cleaning: '#0ea5e9',
  other: '#94a3b8',
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    vacantBeds: 0,
    pendingRent: 0,
  })
  const [occupancyData, setOccupancyData] = useState([])
  const [revenueTrend, setRevenueTrend] = useState([])
  const [expenseByCategory, setExpenseByCategory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    setLoading(true)

    const [buildingsRes, bedsRes, activeTenantRes, rentPaymentsRes, expenseRes] = await Promise.all([
      supabase.from('buildings').select('*', { count: 'exact', head: true }),
      supabase.from('beds').select('status'),
      supabase.from('tenants').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('rent_payments').select('amount, month, tenant_id').eq('status', 'paid'),
      supabase.from('expenses').select('amount, category'),
    ])

    const totalBeds = bedsRes.data?.length || 0
    const occupiedBeds = bedsRes.data?.filter(b => b.status === 'occupied').length || 0
    const vacantBeds = bedsRes.data?.filter(b => b.status === 'vacant').length || 0

    const paidMonths = rentPaymentsRes.data || []
    const monthTotals = paidMonths.reduce((acc, payment) => {
      const month = payment.month?.slice(0, 7) || 'Unknown'
      acc[month] = (acc[month] || 0) + Number(payment.amount || 0)
      return acc
    }, {})

    const revenueTrendData = lastSixMonths.map(month => ({
      month,
      revenue: monthTotals[month] || 0,
    }))

    const expenses = expenseRes.data || []
    const expenseTotals = expenses.reduce((acc, expense) => {
      const category = expense.category || 'other'
      acc[category] = (acc[category] || 0) + Number(expense.amount || 0)
      return acc
    }, {})

    const expenseCategoryData = Object.entries(expenseTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
        fill: CATEGORY_COLORS[category] || CATEGORY_COLORS.other,
      }))

    const paidIds = new Set(paidMonths.filter(p => p.month?.startsWith(currentMonth)).map(p => p.tenant_id))
    const pendingRent = Math.max(0, (activeTenantRes.count || 0) - paidIds.size)

    setStats({
      totalBuildings: buildingsRes.count || 0,
      totalBeds,
      occupiedBeds,
      vacantBeds,
      pendingRent,
    })
    setOccupancyData([
      { name: 'Occupied', value: occupiedBeds, fill: '#22c55e' },
      { name: 'Vacant', value: vacantBeds, fill: '#fb923c' },
    ])
    setRevenueTrend(revenueTrendData)
    setExpenseByCategory(expenseCategoryData)
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
            <>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                <StatCard label="Total Buildings" value={stats.totalBuildings} icon="🏢" color="bg-blue-50 dark:bg-blue-900/30 text-homie-blue" />
                <StatCard label="Total Beds" value={stats.totalBeds} icon="🛏️" color="bg-purple-50 dark:bg-purple-900/30 text-purple-600" />
                <StatCard label="Occupied" value={stats.occupiedBeds} icon="✅" color="bg-green-50 dark:bg-green-900/30 text-homie-green" />
                <StatCard label="Vacant" value={stats.vacantBeds} icon="🔓" color="bg-orange-50 dark:bg-orange-900/30 text-orange-500" />
                <StatCard label="Pending Rent" value={stats.pendingRent} icon="⚠️" color="bg-red-50 dark:bg-red-900/30 text-red-500" />
              </div>

              <div className="mb-10">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <ActionCard icon="🏢" label="Manage Buildings" href="/buildings" />
                  <ActionCard icon="👥" label="Manage Tenants" href="/tenants" />
                  <ActionCard icon="💰" label="Expenses" href="/expenses" />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Occupancy</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Current bed occupancy</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{stats.occupiedBeds} / {stats.totalBeds || 1}</span>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={occupancyData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}>
                        {occupancyData.map(entry => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} formatter={value => [value, 'Beds']} />
                      <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-5">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Revenue Trend</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Paid rent by month</p>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={revenueTrend} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} formatter={value => [`₹${value.toLocaleString()}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-5 mb-10">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Expenses by Category</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Spending breakdown across categories</p>
                </div>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseByCategory} margin={{ top: 10, right: 10, left: -12, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="category" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} formatter={value => [`₹${value.toLocaleString()}`, 'Expense']} />
                      <Bar dataKey="amount">
                        {expenseByCategory.map(entry => (
                          <Cell key={entry.category} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
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