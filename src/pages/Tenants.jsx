import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function Tenants() {
  const navigate = useNavigate()
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTenants()
  }, [])

  async function fetchTenants() {
    setLoading(true)
    const { data } = await supabase
      .from('tenants')
      .select('*, buildings(name)')
      .order('created_at', { ascending: false })
    setTenants(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar title="Tenants" />
        <div className="px-8 py-6">
          {loading ? (
            <p className="text-gray-400">Loading tenants...</p>
          ) : tenants.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No tenants yet. Assign someone to a bed first!</p>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm dark:text-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-left">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Building</th>
                    <th className="px-5 py-3">Phone</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Rent</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(t => (
                    <tr key={t.id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-100">{t.full_name}</td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-300">{t.buildings?.name}</td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-300">{t.phone}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          t.status === 'active'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-300">₹{t.monthly_rent}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => navigate(`/tenants/${t.id}`)}
                          className="text-homie-blue font-medium"
                        >
                          View →
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