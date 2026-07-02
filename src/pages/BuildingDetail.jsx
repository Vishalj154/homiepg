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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <TopBar title={building?.name || 'Building'} />

        <div className="px-8 py-6">
          <button onClick={() => navigate('/buildings')} className="text-homie-blue text-sm mb-4">
            ← Back to Buildings
          </button>

          <div className="bg-white rounded-xl shadow-sm p-5 mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">{building?.name}</h2>
              <p className="text-sm text-gray-500">{building?.address}, {building?.city}</p>
            </div>
            <button
              onClick={() => setShowFloorForm(!showFloorForm)}
              className="bg-homie-blue text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {showFloorForm ? 'Cancel' : '+ Add Floor'}
            </button>
          </div>

          {showFloorForm && (
            <form onSubmit={handleAddFloor} className="bg-white rounded-xl shadow-sm p-5 mb-6 flex gap-3 items-end max-w-md">
              <div className="flex-1">
                <label htmlFor="floor-number" className="text-sm text-gray-600 mb-1 block">Floor Number</label>
                <input
                  id="floor-number"
                  type="number"
                  value={floorNumber}
                  onChange={e => setFloorNumber(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="floor-name" className="text-sm text-gray-600 mb-1 block">Floor Name (optional)</label>
                <input
                  id="floor-name"
                  value={floorName}
                  onChange={e => setFloorName(e.target.value)}
                  placeholder="e.g. Ground Floor"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
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



