import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import FloorCard from '../components/FloorCard'

export default function BuildingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [building, setBuilding] = useState(null)
  const [floors, setFloors] = useState([])
  const [loading, setLoading] = useState(true)

  const [showFloorForm, setShowFloorForm] = useState(false)
  const [floorName, setFloorName] = useState('')
  const [floorNumber, setFloorNumber] = useState('')

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const { data: b, error: buildingError } = await supabase
        .from('buildings')
        .select('*')
        .eq('id', id)
        .single()

      if (buildingError) throw buildingError
      setBuilding(b)

      const { data: f, error: floorsError } = await supabase
        .from('floors')
        .select('*, rooms(*, beds(*))')
        .eq('building_id', id)
        .order('floor_number')

      if (floorsError) throw floorsError
      setFloors(f || [])
    } catch (error) {
      console.error('Error fetching data:', error.message)
      alert('Error fetching data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  async function handleAddFloor(e) {
    e.preventDefault()
    try {
      const { error } = await supabase.from('floors').insert({
        building_id: id,
        floor_number: parseInt(floorNumber),
        floor_name: floorName || `Floor ${floorNumber}`,
      })

      if (error) throw error

      setFloorName('')
      setFloorNumber('')
      setShowFloorForm(false)
      fetchAll()
    } catch (error) {
      console.error('Error adding floor:', error.message)
      alert('Error adding floor: ' + error.message)
    }
  }

  if (loading) return <p className="p-8 text-gray-400">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />

      <div className="flex-1">
        <TopBar title={building?.name || 'Building'} />

        <div className="px-8 py-6">
          <button onClick={() => navigate('/buildings')} className="text-homie-blue text-sm mb-4">
            ← Back to Buildings
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
            {building?.image_url && (
              <img
                src={building.image_url}
                alt={building?.name || 'Building image'}
                className="w-full h-52 object-cover"
              />
            )}
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold text-2xl text-gray-800 dark:text-gray-100">{building?.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {[building?.address, building?.city, building?.state].filter(Boolean).join(', ')}
                  </p>
                </div>
                {building?.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">{building.description}</p>
                )}

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {building?.food_type && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                      🍽️ {building.food_type === 'veg' ? 'Veg' : building.food_type === 'non_veg' ? 'Non-Veg' : building.food_type === 'both' ? 'Both' : 'Not Included'}
                    </div>
                  )}
                  {building?.wifi_available && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                      📶 WiFi
                    </div>
                  )}
                  {building?.power_backup && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                      🔌 Power Backup
                    </div>
                  )}
                  {building?.parking_available && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                      🚗 Parking
                    </div>
                  )}
                  {building?.laundry_available && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                      🧺 Laundry
                    </div>
                  )}
                  {building?.cleaning_staff && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                      🧹 Cleaning Staff
                    </div>
                  )}
                  {building?.water_supply_timing && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                      💧 {building.water_supply_timing}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">{building?.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{building?.address}, {building?.city}</p>
            </div>
            <button
              onClick={() => setShowFloorForm(!showFloorForm)}
              className="bg-homie-blue text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {showFloorForm ? 'Cancel' : '+ Add Floor'}
            </button>
          </div>

          {showFloorForm && (
            <form onSubmit={handleAddFloor} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-6 flex gap-3 items-end max-w-md">
              <div className="flex-1">
                <label htmlFor="floor-number" className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Floor Number</label>
                <input
                  id="floor-number"
                  type="number"
                  value={floorNumber}
                  onChange={e => setFloorNumber(e.target.value)}
                  required
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="floor-name" className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Floor Name (optional)</label>
                <input
                  id="floor-name"
                  value={floorName}
                  onChange={e => setFloorName(e.target.value)}
                  placeholder="e.g. Ground Floor"
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
              </div>
              <button type="submit" className="bg-homie-green text-white px-4 py-2 rounded-lg text-sm font-medium">
                Save
              </button>
            </form>
          )}

          {floors.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No floors yet. Add your first floor!</p>
          ) : (
            <div className="space-y-4">
              {floors.map(floor => (
                <FloorCard key={floor.id} floor={floor} buildingId={id} onUpdate={fetchAll} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}