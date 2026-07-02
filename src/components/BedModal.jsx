import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function BedModal({ bed, buildingId, roomId, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false)
  const isOccupied = bed.status === 'occupied'

  const [form, setForm] = useState({
    full_name: '', phone: '', email: '',
    joining_date: '', monthly_rent: bed.rent || '', deposit: ''
  })

  async function handleAssign(e) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { data: tenant, error } = await supabase.from('tenants').insert({
      owner_id: user.id,
      building_id: buildingId,
      room_id: roomId,
      bed_id: bed.id,
      full_name: form.full_name,
      phone: form.phone,
      email: form.email,
      joining_date: form.joining_date || null,
      monthly_rent: parseFloat(form.monthly_rent) || 0,
      deposit: parseFloat(form.deposit) || 0,
      status: 'active'
    }).select().single()

    if (!error && tenant) {
      await supabase.from('beds').update({ status: 'occupied' }).eq('id', bed.id)
      onUpdate()
      onClose()
    } else {
      alert(error?.message)
    }
    setLoading(false)
  }

  async function handleVacate() {
    if (!confirm('Mark this bed as vacant? This will move out the current tenant.')) return
    setLoading(true)

    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('bed_id', bed.id)
      .eq('status', 'active')
      .single()

    if (tenant) {
      await supabase.from('tenants').update({
        status: 'moved_out',
        actual_leave_date: new Date().toISOString().split('T')[0]
      }).eq('id', tenant.id)
    }

    await supabase.from('beds').update({ status: 'vacant' }).eq('id', bed.id)
    onUpdate()
    onClose()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">Bed {bed.bed_number}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {isOccupied ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">This bed is currently occupied.</p>
            <button
              onClick={handleVacate}
              disabled={loading}
              className="w-full bg-red-500 text-white py-2.5 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? 'Please wait...' : 'Mark as Vacant (Move Out Tenant)'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleAssign} className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">Assign a tenant to this bed</p>

            <input
              placeholder="Full Name"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
            />
            <div>
              <label className="text-xs text-gray-500 block mb-1">Joining Date</label>
              <input
                type="date"
                value={form.joining_date}
                onChange={e => setForm({ ...form, joining_date: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Monthly Rent</label>
                <input
                  type="number"
                  value={form.monthly_rent}
                  onChange={e => setForm({ ...form, monthly_rent: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Deposit</label>
                <input
                  type="number"
                  value={form.deposit}
                  onChange={e => setForm({ ...form, deposit: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-homie-green text-white py-2.5 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Assign Tenant & Mark Occupied'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}