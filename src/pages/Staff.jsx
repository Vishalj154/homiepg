import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const DESIGNATIONS = [
  { value: 'cleaner', label: 'Cleaner' },
  { value: 'cook', label: 'Cook' },
  { value: 'watchman', label: 'Watchman' },
  { value: 'manager', label: 'Manager' },
  { value: 'other', label: 'Other' },
]

export default function Staff() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([])
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filterBuilding, setFilterBuilding] = useState('all')
  const [filterDesignation, setFilterDesignation] = useState('all')
  const [form, setForm] = useState({
    employee_name: '',
    phone: '',
    building_id: '',
    designation: 'cleaner',
    salary: '',
    joining_date: '',
    verification_status: 'pending',
    verification_document_url: '',
  })

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: b }, { data: e }] = await Promise.all([
      supabase.from('buildings').select('id, name').eq('owner_id', user?.id),
      supabase.from('employees').select('*, buildings(name)').order('created_at', { ascending: false }),
    ])
    setBuildings(b || [])
    setEmployees(e || [])
    setLoading(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    const { error } = await supabase.from('employees').insert({
      owner_id: user.id,
      building_id: form.building_id || null,
      employee_name: form.employee_name,
      phone: form.phone,
      designation: form.designation,
      salary: parseFloat(form.salary) || 0,
      joining_date: form.joining_date || null,
      verification_status: form.verification_status,
      verification_document_url: form.verification_document_url || null,
      status: 'active',
    })

    if (error) {
      alert(error.message)
    } else {
      setForm({ employee_name: '', phone: '', building_id: '', designation: 'cleaner', salary: '', joining_date: '', verification_status: 'pending', verification_document_url: '' })
      setShowForm(false)
      fetchAll()
    }
  }

  async function toggleStatus(employee) {
    await supabase.from('employees').update({ status: employee.status === 'active' ? 'inactive' : 'active' }).eq('id', employee.id)
    fetchAll()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this staff member?')) return
    await supabase.from('employees').delete().eq('id', id)
    fetchAll()
  }

  const filteredEmployees = employees.filter(emp => {
    const buildingMatch = filterBuilding === 'all' || emp.building_id === filterBuilding
    const designationMatch = filterDesignation === 'all' || emp.designation === filterDesignation
    return buildingMatch && designationMatch
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar title="Staff" />

        <div className="px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <select
                value={filterBuilding}
                onChange={e => setFilterBuilding(e.target.value)}
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
              >
                <option value="all">All Buildings</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <select
                value={filterDesignation}
                onChange={e => setFilterDesignation(e.target.value)}
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
              >
                <option value="all">All Designations</option>
                {DESIGNATIONS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-homie-blue text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {showForm ? 'Cancel' : '+ Add Staff'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 space-y-4 max-w-2xl">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">New Staff Member</h2>

              <input
                placeholder="Employee Name"
                value={form.employee_name}
                onChange={e => setForm({ ...form, employee_name: e.target.value })}
                required
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              />

              <input
                placeholder="Phone Number"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={form.building_id}
                  onChange={e => setForm({ ...form, building_id: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                >
                  <option value="">Unassigned Building</option>
                  {buildings.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <select
                  value={form.designation}
                  onChange={e => setForm({ ...form, designation: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                >
                  {DESIGNATIONS.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    placeholder="Salary"
                    value={form.salary}
                    onChange={e => setForm({ ...form, salary: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={form.joining_date}
                    onChange={e => setForm({ ...form, joining_date: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-homie-green text-white py-2.5 rounded-lg font-medium">
                Save Staff
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-gray-400">Loading staff...</p>
          ) : filteredEmployees.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No staff members found.</p>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-left">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Phone</th>
                    <th className="px-5 py-3">Building</th>
                    <th className="px-5 py-3">Designation</th>
                    <th className="px-5 py-3">Salary</th>
                    <th className="px-5 py-3">Verified</th>
                    <th className="px-5 py-3">Docs</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => (
                    <tr key={emp.id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-100">{emp.employee_name}</td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-300">{emp.phone || '—'}</td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-300">{emp.buildings?.name || 'Unassigned'}</td>
                      <td className="px-5 py-3 capitalize text-gray-500 dark:text-gray-300">{emp.designation}</td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-300">₹{emp.salary}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          emp.verification_status === 'verified'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'
                            : emp.verification_status === 'rejected'
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200'
                        }`}>
                          {emp.verification_status || 'pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-300">
                        {emp.verification_document_url ? (
                          <button
                            onClick={() => window.open(emp.verification_document_url, '_blank')}
                            className="text-sm text-homie-blue font-medium"
                          >
                            View Docs
                          </button>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${emp.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleStatus(emp)}
                          className="text-sm text-homie-blue font-medium"
                        >
                          {emp.status === 'active' ? 'Set Inactive' : 'Set Active'}
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="text-sm text-red-500 font-medium"
                        >
                          Delete
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
