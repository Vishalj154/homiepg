import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const genderLabel = {
  unisex: 'Co-living',
  male: 'Male Only',
  female: 'Female Only',
}

const foodLabel = {
  veg: '🍽️ Veg',
  non_veg: '🍖 Non-Veg',
  both: '🍽️ Veg & Non-Veg',
  not_included: null, // don't show badge if not included
}

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
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gender_type: 'unisex',
    image_url: '',
    food_type: '',
    water_supply_timing: '',
    wifi_available: false,
    power_backup: false,
    parking_available: false,
    laundry_available: false,
    cleaning_staff: false,
    description: '',
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
      setForm({
        name: '', address: '', city: '', state: '', pincode: '',
        gender_type: 'unisex', image_url: '',
        food_type: '', water_supply_timing: '',
        wifi_available: false, power_backup: false,
        parking_available: false, laundry_available: false,
        cleaning_staff: false,
        description: '',
      })
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
            <div className="flex gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
              <input
                placeholder="Filter by city..."
                value={filterCity}
                onChange={e => setFilterCity(e.target.value)}
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm w-48 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              />
              <select
                value={filterGender}
                onChange={e => setFilterGender(e.target.value)}
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              >
                <option value="all">All Types</option>
                <option value="unisex">Co-living</option>
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
            <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 space-y-4 max-w-2xl">
              <h2 className="font-semibold text-gray-700 dark:text-gray-100">New Building</h2>

              <input
                placeholder="Building Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              />
              <input
                placeholder="Image URL (paste from Unsplash)"
                value={form.image_url}
                onChange={e => setForm({ ...form, image_url: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              />
              <input
                placeholder="Address"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  placeholder="City"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
                <input
                  placeholder="State"
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
                <input
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={e => setForm({ ...form, pincode: e.target.value })}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
              </div>

              {/* Gender type */}
              <select
                value={form.gender_type}
                onChange={e => setForm({ ...form, gender_type: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              >
                <option value="unisex">Co-living</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
              </select>

              {/* Food type */}
              <select
                value={form.food_type}
                onChange={e => setForm({ ...form, food_type: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              >
                <option value="">Food — Select type</option>
                <option value="veg">🍽️ Veg Only</option>
                <option value="non_veg">🍖 Non-Veg</option>
                <option value="both">🍽️ Veg &amp; Non-Veg</option>
                <option value="not_included">❌ Not Included</option>
              </select>

              {/* Water supply */}
              <input
                placeholder="Water Supply Timing (e.g. 24x7 or 6–9 AM &amp; 6–9 PM)"
                value={form.water_supply_timing}
                onChange={e => setForm({ ...form, water_supply_timing: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              />

              {/* Amenity toggles */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'wifi_available', label: '📶 WiFi Available' },
                  { key: 'power_backup', label: '🔌 Power Backup' },
                  { key: 'parking_available', label: '🚗 Parking Available' },
                  { key: 'laundry_available', label: '🧺 Laundry Available' },
                  { key: 'cleaning_staff', label: '🧹 Cleaning Staff Available' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-all dark:border-gray-700 dark:hover:bg-gray-700">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.checked })}
                      className="w-4 h-4 accent-homie-blue"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
                  </label>
                ))}
              </div>

              {/* Description */}
              <textarea
                placeholder="Short description of the property (optional)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm resize-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              />

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
                <div key={b.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <img
                    src={b.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'}
                    alt={b.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{b.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {b.city}, {b.state} — {genderLabel[b.gender_type] || b.gender_type}
                    </p>

                    {/* Amenity badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {b.food_type && foodLabel[b.food_type] && (
                        <span className="text-xs bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-200 px-2 py-0.5 rounded-full">{foodLabel[b.food_type]}</span>
                      )}
                      {b.water_supply_timing && (
                        <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-200 px-2 py-0.5 rounded-full">💧 {b.water_supply_timing}</span>
                      )}
                      {b.wifi_available && (
                        <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-200 px-2 py-0.5 rounded-full">📶 WiFi</span>
                      )}
                      {b.power_backup && (
                        <span className="text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200 px-2 py-0.5 rounded-full">🔌 Power Backup</span>
                      )}
                      {b.parking_available && (
                        <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-200 px-2 py-0.5 rounded-full">🚗 Parking</span>
                      )}
                      {b.laundry_available && (
                        <span className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-200 px-2 py-0.5 rounded-full">🧺 Laundry</span>
                      )}
                      {b.cleaning_staff && (
                        <span className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-200 px-2 py-0.5 rounded-full">🧹 Cleaning Staff</span>
                      )}
                    </div>

                    {b.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{b.description}</p>
                    )}

                    <div className="flex items-center justify-between">
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