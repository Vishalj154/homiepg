import { useState } from 'react'
import { supabase } from '../lib/supabase'
import BedModal from './BedModal'

export default function FloorCard({ floor, buildingId, onUpdate }) {
  const [showRoomForm, setShowRoomForm] = useState(false)
  const [roomNumber, setRoomNumber] = useState('')
  const [capacity, setCapacity] = useState(2)
  const [rent, setRent] = useState('')
  const [selectedBed, setSelectedBed] = useState(null)

  async function handleAddRoom(e) {
    e.preventDefault()
    const { data: room, error } = await supabase.from('rooms').insert({
      floor_id: floor.id,
      building_id: buildingId,
      room_number: roomNumber,
      capacity: parseInt(capacity),
      rent: parseFloat(rent) || 0
    }).select().single()

    if (!error && room) {
      const bedsToInsert = Array.from({ length: capacity }, (_, i) => ({
        room_id: room.id,
        building_id: buildingId,
        bed_number: `${roomNumber}-${i + 1}`,
        status: 'vacant',
        rent: parseFloat(rent) || 0
      }))
      await supabase.from('beds').insert(bedsToInsert)

      setRoomNumber('')
      setCapacity(2)
      setRent('')
      setShowRoomForm(false)
      onUpdate()
    } else {
      alert(error?.message)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700">
          {floor.floor_name || `Floor ${floor.floor_number}`}
        </h3>
        <button
          onClick={() => setShowRoomForm(!showRoomForm)}
          className="text-sm text-homie-blue font-medium"
        >
          {showRoomForm ? 'Cancel' : '+ Add Room'}
        </button>
      </div>

      {showRoomForm && (
        <form onSubmit={handleAddRoom} className="flex gap-3 items-end mb-4 flex-wrap">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-300 block mb-1">Room No.</label>
            <input
              value={roomNumber}
              onChange={e => setRoomNumber(e.target.value)}
              required
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm w-24 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-300 block mb-1">Beds</label>
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm w-20 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-300 block mb-1">Rent/bed</label>
            <input
              type="number"
              value={rent}
              onChange={e => setRent(e.target.value)}
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm w-24 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            />
          </div>
          <button type="submit" className="bg-homie-green text-white px-4 py-1.5 rounded-lg text-sm font-medium">
            Add
          </button>
        </form>
      )}

      {floor.rooms?.length === 0 ? (
        <p className="text-sm text-gray-400">No rooms yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {floor.rooms?.map(room => (
            <div key={room.id} className="border border-gray-100 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Room {room.room_number}</p>
              <div className="flex flex-wrap gap-1.5">
                {room.beds?.map(bed => (
                  <button
                    key={bed.id}
                    onClick={() => setSelectedBed({ ...bed, roomId: room.id })}
                    className={`text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-all ${
                      bed.status === 'occupied'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    🛏️ {bed.bed_number}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBed && (
        <BedModal
          bed={selectedBed}
          buildingId={buildingId}
          roomId={selectedBed.roomId}
          onClose={() => setSelectedBed(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  )
}