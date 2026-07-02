import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function Buildings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // filters
  const [filterCity, setFilterCity] = useState('')
  const [filterGender, setFilterGender] = useState('all')

  const [form, setForm] = useState({
    name: '', address: '', city: '', state: '', pincode: '', gender_type: 'unisex', image_url: ''
  })

  useEffect(() => {
    fetchBuildings()
  }, [])

  async function fetchBuildings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setBuildings(data)
    setLoading(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    const { error } = await supabase.from('buildings').insert({
      ...form,
      owner_id: user.id
    })

    if (!error) {
      setForm({ name: '', address: '', city: '', state: '', pincode: '', gender_type: 'unisex', image_url: '' })
      setShowForm(false)
      fetchBuildings()
    } else {
      alert(error.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this building?')) return
    await supabase.from('buildings').delete().eq('id', id)
    fetchBuildings()
  }

  const filteredBuildings = buildings.filter(b => {
    const cityMatch = filterCity === '' || b.city?.toLowerCase().includes(filterCity.toLowerCase())
    const genderMatch = filterGender === 'all' || b.gender_type === filterGender
    return cityMatch && genderMatch
  })

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <TopBar title="Buildings" />

        <div className="px-8 py-6">

          {/* Filter + Add bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex gap-3">
              <input
                placeholder="Filter by city..."
                value={filterCity}
                onChange={e => setFilterCity(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-48"
              />
              <select
                value={filterGender}
                onChange={e => setFilterGender(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="unisex">Unisex</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
              </select>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-homie-blue text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {showForm ? 'Cancel' : '+ Add Building'}
            </button>
          </div>

          {/* Add Building Form */}
          {showForm && (
            <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4 max-w-2xl">
              <h2 className="font-semibold text-gray-700">New Building</h2>

              <input
                placeholder="Building Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
              />
              <input
                placeholder="Image URL (paste from Unsplash)"
                value={form.image_url}
                onChange={e => setForm({ ...form, image_url: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
              />
              <input
                placeholder="Address"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  placeholder="City"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
                />
                <input
                  placeholder="State"
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
                />
                <input
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={e => setForm({ ...form, pincode: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
                />
              </div>
              <select
                value={form.gender_type}
                onChange={e => setForm({ ...form, gender_type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
              >
                <option value="unisex">Unisex</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
              </select>

              <button
                type="submit"
                className="w-full bg-homie-green text-white py-2.5 rounded-lg font-medium"
              >
                Save Building
              </button>
            </form>
          )}

          {/* Building Cards */}
          {loading ? (
            <p className="text-gray-400">Loading buildings...</p>
          ) : filteredBuildings.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No buildings match your filter.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredBuildings.map(b => (
                <div key={b.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <img
                    src={b.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'}
                    alt={b.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">{b.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{b.city}, {b.state} — {b.gender_type}</p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => navigate(`/buildings/${b.id}`)}
                        className="text-sm text-homie-blue font-medium"
                      >
                        View →
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-sm text-red-500 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}