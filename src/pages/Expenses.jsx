import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function Expenses() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [filterBuilding, setFilterBuilding] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const [form, setForm] = useState({
    building_id: '', category: 'electricity', amount: '', expense_date: '', remarks: ''
  })
  const [file, setFile] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    const { data: b } = await supabase.from('buildings').select('id, name')
    setBuildings(b || [])

    const { data: e } = await supabase
      .from('expenses')
      .select('*, buildings(name)')
      .order('expense_date', { ascending: false })
    setExpenses(e || [])

    setLoading(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    setUploading(true)

    let billUrl = null
    if (file) {
      const filePath = `${user.id}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('expense-bills')
        .upload(filePath, file)
      if (uploadError) {
        alert(uploadError.message)
        setUploading(false)
        return
      }
      billUrl = filePath
    }

    const { error } = await supabase.from('expenses').insert({
      owner_id: user.id,
      building_id: form.building_id,
      category: form.category,
      amount: parseFloat(form.amount),
      expense_date: form.expense_date,
      remarks: form.remarks,
      bill_url: billUrl
    })

    if (!error) {
      setForm({ building_id: '', category: 'electricity', amount: '', expense_date: '', remarks: '' })
      setFile(null)
      setShowForm(false)
      fetchAll()
    } else {
      alert(error.message)
    }
    setUploading(false)
  }

  async function viewBill(filePath) {
    const { data, error } = await supabase.storage
      .from('expense-bills')
      .createSignedUrl(filePath, 60)
    if (error) return alert(error.message)
    window.open(data.signedUrl, '_blank')
  }

  async function handleDelete(id, billUrl) {
    if (!confirm('Delete this expense?')) return
    if (billUrl) await supabase.storage.from('expense-bills').remove([billUrl])
    await supabase.from('expenses').delete().eq('id', id)
    fetchAll()
  }

  const filtered = expenses.filter(e => {
    const buildingMatch = filterBuilding === 'all' || e.building_id === filterBuilding
    const categoryMatch = filterCategory === 'all' || e.category === filterCategory
    return buildingMatch && categoryMatch
  })

  const totalAmount = filtered.reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar title="Expenses" />

        <div className="px-8 py-6">

          {/* Filters + Add */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
              <select
                value={filterBuilding}
                onChange={e => setFilterBuilding(e.target.value)}
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              >
                <option value="all">All Buildings</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              >
                <option value="all">All Categories</option>
                <option value="electricity">Electricity</option>
                <option value="water">Water</option>
                <option value="salary">Salary</option>
                <option value="internet">Internet</option>
                <option value="repairs">Repairs</option>
                <option value="grocery">Grocery</option>
                <option value="cleaning">Cleaning</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-homie-blue text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {showForm ? 'Cancel' : '+ Add Expense'}
            </button>
          </div>

          {/* Total */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-6 max-w-xs">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total ({filtered.length} entries)</p>
            <p className="text-2xl font-bold text-red-500">₹{totalAmount.toLocaleString()}</p>
          </div>

          {/* Add Form */}
          {showForm && (
            <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 space-y-3 max-w-lg">
              <select
                value={form.building_id}
                onChange={e => setForm({ ...form, building_id: e.target.value })}
                required
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              >
                <option value="">Select Building</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>

              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              >
                <option value="electricity">Electricity</option>
                <option value="water">Water</option>
                <option value="salary">Salary</option>
                <option value="internet">Internet</option>
                <option value="repairs">Repairs</option>
                <option value="grocery">Grocery</option>
                <option value="cleaning">Cleaning</option>
                <option value="other">Other</option>
              </select>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  required
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
                <input
                  type="date"
                  value={form.expense_date}
                  onChange={e => setForm({ ...form, expense_date: e.target.value })}
                  required
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
              </div>

              <input
                placeholder="Remarks (optional)"
                value={form.remarks}
                onChange={e => setForm({ ...form, remarks: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              />

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Bill Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={e => setFile(e.target.files[0])}
                  className="w-full text-sm text-gray-800 dark:text-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-homie-green text-white py-2.5 rounded-lg font-medium disabled:opacity-50"
              >
                {uploading ? 'Saving...' : 'Save Expense'}
              </button>
            </form>
          )}

          {/* List */}
          {loading ? (
            <p className="text-gray-400">Loading expenses...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No expenses recorded yet.</p>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-left">
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Building</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Remarks</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{e.expense_date}</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{e.buildings?.name}</td>
                      <td className="px-5 py-3 capitalize text-gray-600 dark:text-gray-300">{e.category}</td>
                      <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-100">₹{e.amount}</td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{e.remarks || '-'}</td>
                      <td className="px-5 py-3 flex gap-3">
                        {e.bill_url && (
                          <button onClick={() => viewBill(e.bill_url)} className="text-homie-blue font-medium">
                            View Bill
                          </button>
                        )}
                        <button onClick={() => handleDelete(e.id, e.bill_url)} className="text-red-500 font-medium">
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